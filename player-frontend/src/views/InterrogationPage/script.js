// views/InterrogationPage/script.js
import NavBar from '@/components/NavBar.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ClueNotebook from '@/components/ClueNotebook.vue'
import { AudioMixer } from '@/utils/audio-mixer.js'
import { MoodManager } from '@/utils/mood-manager.js'

// 引入资源
import normalBgm from '@/assets/bgm/normal.mp3'
import uneasyBgm from '@/assets/bgm/uneasy.mp3'
import suspiciousBgm from '@/assets/bgm/suspicious.mp3'
import intenseBgm from '@/assets/bgm/intense.mp3'
import buttonSfx from '@/assets/sfx/button.mp3'

export default {
  name: 'InterrogationPage',
  components: { NavBar, ChatWindow, ClueNotebook },
  data() {
    return {
      sendTimer: null,
      lastMessage: '',
      messages: [],
      clues: [],
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      ws: null,
      emotionWs: null,
      wsConnected: false,
      mixer: null,
      moodManager: null,
      heartbeatTimer: null,          // 游戏 WS 心跳定时器
      emotionHeartbeatTimer: null,   // 情绪 WS 心跳定时器
      bgmStarted: false,             // 标记是否已启动背景音乐
      MOOD_ASSETS: {
        normal: normalBgm,
        uneasy: uneasyBgm,
        suspicious: suspiciousBgm,
        intense: intenseBgm
      }
    }
  },
  mounted() {
    this.initAudioEngine();
    this.connectWebSocket();
    this.connectEmotionWebSocket();
  },
  beforeDestroy() {
    // 清理所有 WebSocket 和定时器
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.emotionWs) {
      this.emotionWs.close();
      this.emotionWs = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.emotionHeartbeatTimer) {
      clearInterval(this.emotionHeartbeatTimer);
      this.emotionHeartbeatTimer = null;
    }
  },
  methods: {
    initAudioEngine() {
      try {
        this.mixer = new AudioMixer();
        this.moodManager = new MoodManager(this.mixer);
      } catch (e) {
        console.error("音频引擎初始化失败:", e);
      }
    },

    async activateAudio() {
      if (this.mixer && this.mixer.ctx.state === 'suspended') {
        await this.mixer.ctx.resume();
      }
    },

    // --- 录音逻辑：由 ChatWindow 内部按钮触发 ---
    async startRecording() {
      if (!this.wsConnected) return;

      // 首次交互时启动默认背景音乐
      if (!this.bgmStarted) {
        await this.activateAudio();
        this.mixer.playMusic(this.MOOD_ASSETS.normal);
        this.bgmStarted = true;
      }

      await this.activateAudio();
      if (this.mixer) this.mixer.playSFX(buttonSfx);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.audioChunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.sendAudio(audioBlob);
        };
        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (err) {
        console.error("无法访问麦克风:", err);
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        if (this.mixer) this.mixer.playSFX(buttonSfx);
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    },

    // 发送文本消息（通过 WebSocket）
    onSendMessage(text) {
      if (!text.trim()) return;
      const now = Date.now();
      if (this.lastMessage === text && now - this.lastSendTime < 2000) {
        console.warn('重复消息，已忽略');
        return;
      }
      this.lastMessage = text;
      this.lastSendTime = now;
      // 首次文本交互时启动默认背景音乐
      if (!this.bgmStarted) {
        this.activateAudio().then(() => {
          this.mixer.playMusic(this.MOOD_ASSETS.normal);
          this.bgmStarted = true;
        }).catch(e => console.warn(e));
      }

      // 先本地显示用户消息
      this.messages.push({ role: 'user', content: text });
      // 通过 WebSocket 发送文本（JSON格式）
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'text',
          content: text
        }));
      } else {
        console.warn("WebSocket 未连接，无法发送文本");
      }
      this.activateAudio();
    },

    sendAudio(blob) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(reader.result);
        }
      };
      reader.readAsArrayBuffer(blob);
    },

    connectWebSocket() {
      // 关闭旧连接
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }

      const scriptId = localStorage.getItem('current_script_id') || '4';
      const playerId = localStorage.getItem('current_player_id') || 'suspect_1';
      const wsUrl = `ws://localhost:5000/ws/game/chat?player_id=${playerId}&script_id=${scriptId}`;

      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        this.wsConnected = true;
        console.log("游戏 WebSocket 已连接");
        // 启动心跳：每 30 秒发送一次 'ping'
        this.heartbeatTimer = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('ping');
          }
        }, 30000);
      };
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'npc' || data.type === 'chat') {
            this.messages.push({
              role: 'ai',
              content: data.content || data.text,
              name: data.name || '嫌疑人'
            });
          } else if (data.type === 'player') {
            console.log("[ASR] 用户:", data.text);
            // 添加用户语音识别文本
            this.messages.push({
              role: 'user',
              content: data.text,
              name: '调查员'
            });
          } else if (data.type === 'analysis') {
            console.log("[Analysis]", data.analysis);
          }
        } catch (e) {
          console.warn("WebSocket 消息解析失败:", e);
        }
      };
      this.ws.onclose = (event) => {
        this.wsConnected = false;
        console.warn("游戏 WebSocket 断开，3秒后重连...", event.code);
        if (this.heartbeatTimer) {
          clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = null;
        }
        // 自动重连
        setTimeout(() => this.connectWebSocket(), 3000);
      };
      this.ws.onerror = (err) => {
        console.error("游戏 WebSocket 错误:", err);
      };
    },

    connectEmotionWebSocket() {
      // 关闭旧连接
      if (this.emotionWs) {
        this.emotionWs.close();
        this.emotionWs = null;
      }
      if (this.emotionHeartbeatTimer) {
        clearInterval(this.emotionHeartbeatTimer);
        this.emotionHeartbeatTimer = null;
      }

      const wsUrl = `ws://localhost:5000/ws/emotion`;
      this.emotionWs = new WebSocket(wsUrl);
      this.emotionWs.onopen = () => {
        console.log("情绪 WebSocket 已连接");
        // 心跳：每 30 秒发一次 ping
        this.emotionHeartbeatTimer = setInterval(() => {
          if (this.emotionWs && this.emotionWs.readyState === WebSocket.OPEN) {
            this.emotionWs.send('ping');
          }
        }, 30000);
      };
      this.emotionWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.emotion && this.moodManager) {
            this.moodManager.updateMood(data.emotion);
          }
        } catch (e) {
          console.warn("情绪消息解析失败:", e);
        }
      };
      this.emotionWs.onclose = () => {
        console.warn("情绪 WebSocket 断开，3秒后重连...");
        if (this.emotionHeartbeatTimer) {
          clearInterval(this.emotionHeartbeatTimer);
          this.emotionHeartbeatTimer = null;
        }
        setTimeout(() => this.connectEmotionWebSocket(), 3000);
      };
      this.emotionWs.onerror = (err) => {
        console.error("情绪 WebSocket 错误:", err);
      };
    },

    goToScript() {
      this.$router.push('/script-view');
    },

    goToClues() {
      this.$router.push('/clues');
    }
  }
}