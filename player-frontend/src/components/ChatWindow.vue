<template>
  <div class="chat-wrapper">
    <div class="parchment-container">

      <div class="scroll-box" ref="scrollBox">
        <div class="dialogue-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message-row', msg.role === 'user' ? 'user-row' : 'ai-row']"
          >
            <div class="speaker-tag">
              {{ msg.role === 'ai' ? (msg.name || 'ANNA VICTORIA') : 'INVESTIGATOR' }}
            </div>
            <div class="bubble">
              <p class="text">{{ msg.content }}</p>
            </div>
          </div>

          <div v-if="messages.length === 0" class="empty-placeholder">
            等待讯问记录...
          </div>
        </div>
      </div>

      <div class="input-console">
        <textarea
          v-model="localInput"
          @keydown.enter.exact.prevent="handleSend"
          placeholder="输入讯问内容并签署..."
          class="vintage-input"
        ></textarea>

        <div class="button-group">
          <button
            @mousedown="$emit('start-record')"
            @mouseup="$emit('stop-record')"
            @touchstart.prevent="$emit('start-record')"
            @touchend.prevent="$emit('stop-record')"
            :class="['record-btn', { 'is-recording': isRecording }]"
          >
            {{ isRecording ? '监听中...' : '按住说话' }}
          </button>
          <button @click="handleSend" class="send-btn">签署记录</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  props: {
    messages: { type: Array, default: () => [] },
    isRecording: { type: Boolean, default: false }
  },
  data() {
    return { localInput: '' }
  },
  watch: {
    messages: {
      handler() { this.scrollToBottom(); },
      deep: true
    }
  },
  mounted() { this.scrollToBottom(); },
  methods: {
    handleSend() {
      if (!this.localInput.trim()) return;
      this.$emit('send', this.localInput);
      this.localInput = '';
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.scrollBox;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  }
}
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
}

.parchment-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #e4d5b7;
  background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.05) 100%);
  border: 1px solid #c4b597;
  box-shadow: inset 0 0 80px rgba(139, 69, 19, 0.15), 5px 10px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.scroll-box {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.scroll-box::-webkit-scrollbar { width: 6px; }
.scroll-box::-webkit-scrollbar-thumb { background: #8b4513; border-radius: 3px; }

.dialogue-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 核心布局逻辑 */
.message-row {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

/* AI 消息靠左 */
.ai-row {
  align-self: flex-start;
}

/* 用户（Investigator）消息靠右 */
.user-row {
  align-self: flex-end;
  text-align: right;
}

.speaker-tag {
  font-size: 0.75rem;
  font-weight: bold;
  color: #5e4b3c;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

/* 用户名字颜色可以稍作区分 */
.user-row .speaker-tag {
  color: #3e3228;
}

.ai-row .speaker-tag {
  color: #8e1c1c;
}

.bubble {
  color: #2c1e14;
  line-height: 1.6;
  padding: 5px 0;
  border-bottom: 1px dashed rgba(139, 69, 19, 0.2);
}

/* 用户气泡如果是靠右，可以把边框位置换一下或保持一致 */
.user-row .bubble {
  border-bottom: 1px dashed rgba(62, 50, 40, 0.3);
}

.empty-placeholder {
  text-align: center;
  margin-top: 100px;
  color: #8b6d5c;
  font-style: italic;
  font-family: 'Courier New', Courier, monospace;
}

/* 输入框样式 */
.input-console {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #1a1410;
  border-top: 2px solid #5d2906;
}

.vintage-input {
  flex: 1;
  height: 80px;
  background: #000;
  border: 1px solid #3d2b1f;
  color: #f4e4bc;
  padding: 12px;
  font-family: 'Courier New', Courier, monospace;
  resize: none;
  outline: none;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 110px;
}

.send-btn, .record-btn {
  flex: 1;
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.send-btn { background: #7c2d23; color: white; }
.record-btn { background: #4a3c32; color: #f4e4bc; }

.is-recording {
  background: #a82424 !important;
  box-shadow: 0 0 10px #ff4d4d;
}
</style>