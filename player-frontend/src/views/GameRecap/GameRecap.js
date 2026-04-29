import NavBar from '@/components/NavBar.vue'
import request from '@/utils/request';
import axios from 'axios'

import char1 from '@/assets/char_1.jpg'
import char2 from '@/assets/char_2.jpg'
import char3 from '@/assets/char_3.jpg'
import char4 from '@/assets/char_4.jpg'

export default {
  name: 'GameRecap',
  components: { NavBar },
  data() {
    return {
      scoreHtml: '',
      reportHtml: '', // 🌟 修复 1：补回缺失的初始变量，消灭 undefined
      storyHtml: '',
      showCursor: true,
      selectedChar: null,
      typingSequence: {
        score: `<span class="huge-red-score">--</span>`,
        report: '',   // 🌟 修复 1：补回初始值
        story: `真相即将揭晓...`
      },
      characters: []
    }
  },
  computed: {
    relationships() {
      if (!this.characters || this.characters.length < 2) return [];

      const lines = [];
      const count = this.characters.length;

      const getPoint = (idx) => {
        const c = this.characters[idx];
        if (!c || c.x === undefined) return null;
        return { x: (c.x + 9) + '%', y: (c.y + 15) + '%' };
      };

      for (let i = 0; i < count; i++) {
        const start = getPoint(i);
        const end = getPoint((i + 1) % count);
        if (start && end) {
          lines.push({ fromX: start.x, fromY: start.y, toX: end.x, toY: end.y });
        }
      }
      return lines;
    }
  },
  methods: {
    /**
     * 1. 调用云端数据库获取人物资料和核心真相
     */
    async fetchCharacterData() {
      try {
        const scriptId = localStorage.getItem('currentScriptId') || '4';
        const res = await request.get(`/api/scripts/${scriptId}/recap`);

        if (res.code === 200 && res.data) {
          this.characters = res.data.characters.map(char => ({
            ...char,
            img: char.img ? (request.defaults.baseURL + char.img) : ''
          }));

          const v = res.data.verdict;
          if (v) {
            this.typingSequence.story = `
              <span class="report-title">核心真相还原</span><br>
              ${v.truth}<br><br>
              <div class="verdict-detail">
                <b>【最终凶手】</b>：<span style="color: #d9534f; font-weight: bold;">${v.killer}</span><br>
                <b>【作案动机】</b>：${v.motive}<br>
                <b>【关键证据】</b>：${v.key_evidence ? v.key_evidence.join('、') : '无'}
              </div>
            `;
          }
        }
      } catch (error) {
        console.error("加载案情复盘核心数据失败:", error);
      }
    },

    /**
     * 2. 获取投票结果，并调用 AI 法官打分
     */
    /**
     * 2. 获取投票结果，并调用 AI 法官打分（去除了法官批注文本）
     */
    async loadRecapData() {
      try {
        const roleId = localStorage.getItem('current_role_name') || '沈慧';
        const playerAnswer = localStorage.getItem('player_verdict_answer') || '该探员未留下详细推理记录。';

        const teammateApiUrl = 'https://shredding-cyclist-lazily.ngrok-free.dev/api/vote';
        let npcVoteHtml = '';

        // === A. 获取 NPC 投票结果 ===
        try {
          const voteRes = await axios.post(teammateApiUrl, {
            player_id: roleId,
            script_id: "4"
          }, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });

          const voteData = voteRes.data.data || voteRes.data;
          const votes = voteData.votes;

          if (votes && Object.keys(votes).length > 0) {
            const voteTally = {};
            for (const [npcName, votedFor] of Object.entries(votes)) {
              if (!voteTally[votedFor]) voteTally[votedFor] = [];
              voteTally[votedFor].push(npcName);
            }

            const sortedCandidates = Object.keys(voteTally).sort((a, b) => voteTally[b].length - voteTally[a].length);
            npcVoteHtml = `<span class="report-title">圆桌公投结果</span><br>`;

            for (const candidate of sortedCandidates) {
              const voters = voteTally[candidate];
              let targetColor = candidate === '弃权' ? '#888' : '#a31d1d';
              npcVoteHtml += `<strong style="color:${targetColor}; font-size:1.15em;">${candidate}</strong>
                              <span style="color:#888; font-family: monospace;">[${voters.length}票]</span>
                              <span style="font-size:0.85em; color:#7a7a7a;">(指控者：${voters.join('，')})</span><br>`;
            }
            npcVoteHtml += `<br>`;
          }
        } catch (voteErr) {
          console.warn("NPC 投票接口连接异常:", voteErr);
          npcVoteHtml = `<span class="report-title">圆桌公投结果</span><br>· 数据流异常：未能获取现场嫌疑人的投票。<br><br>`;
        }

        // === B. 调用 AI 法官仅获取打分，不显示批注 ===
        try {
          const verdictRes = await axios.post('http://127.0.0.1:8000/api/game/verdict', {
            role_id: roleId,
            player_answer: playerAnswer
          });

          if (verdictRes.data && verdictRes.data.performance) {
            const perf = verdictRes.data.performance;
            // 仅仅保留替换左上角分数的逻辑
            this.typingSequence.score = `<span class="huge-red-score">${perf.score}</span>`;

            // 💡 核心修改点：把下面拼接法官批注的那行代码彻底删掉了
            // npcVoteHtml += `<span class="report-title">AI法官最终批注</span><br>...`
          }
        } catch (judgeErr) {
          console.warn("AI 法官接口连接异常:", judgeErr);
          this.typingSequence.score = `<span class="huge-red-score">ERR</span>`;
        }

        // === C. 将纯净版的报告塞入打字机 ===
        this.typingSequence.report = npcVoteHtml;

        // 启动打字机动画
        this.initTypewriter();

      } catch (error) {
        console.error("加载彻底失败:", error);
        this.typingSequence.report = `系统崩溃，侦察报告丢失。`;
        this.initTypewriter();
      }
    },

    async initTypewriter() {
      await this.typeText('scoreHtml', this.typingSequence.score, 40);
      await this.typeText('reportHtml', this.typingSequence.report, 15);
      await this.typeText('storyHtml', this.typingSequence.story, 20);
      setTimeout(() => { this.showCursor = false; }, 3000);
    },

    typeText(targetKey, fullText, speed) {
      if (!fullText) return Promise.resolve();
      return new Promise((resolve) => {
        let charIndex = 0;
        const typing = () => {
          if (charIndex < fullText.length) {
            if (fullText.charAt(charIndex) === '<') {
              const endTag = fullText.indexOf('>', charIndex);
              this[targetKey] += fullText.substring(charIndex, endTag + 1);
              charIndex = endTag + 1;
              typing();
            } else {
              this[targetKey] += fullText.charAt(charIndex);
              charIndex++;
              setTimeout(typing, speed + Math.random() * 20);
            }
          } else { resolve(); }
        };
        typing();
      });
    },

    openTruthDetail(char) { this.selectedChar = char; },
    closeTruthDetail() { this.selectedChar = null; },
    goToEnding() {
      this.$router.push('/ending');
    }
  },

  mounted() {
    this.fetchCharacterData().then(() => {
      setTimeout(() => {
        this.loadRecapData();
      }, 1500);
    });
  }
}