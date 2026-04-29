import NavBar from '@/components/NavBar.vue'
import request from '@/utils/request'

export default {
  name: 'VotePage',
  components: {
    NavBar
  },
  data() {
    return {
      scriptId: localStorage.getItem('currentScriptId'),
      selectedId: null,
      candidates: [],
      loading: true
    }
  },
  computed: {
    selectedCandidate() {
      return this.candidates.find(c => c.id === this.selectedId) || null
    }
  },

  async mounted() {
    this.scriptId = this.$route.query.scriptId || localStorage.getItem('currentScriptId');
    if (!this.scriptId) {
      alert("【系统警报】档案已丢失，请重新选择剧本。");
      this.$router.push('/casefile');
      return;
    }
    await this.fetchSuspects();
  },

  methods: {
    async fetchSuspects() {
      this.loading = true;
      try {
        const response = await request.get(`/scripts/${this.scriptId}/suspects`);
        this.candidates = Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('获取嫌疑人列表失败:', error);
        this.candidates = [
          { id: 101, name: "模拟嫌疑人", role: "管家", image_url: "https://via.placeholder.com/150" }
        ];
      } finally {
        this.loading = false;
      }
    },

    getImageSrc(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      const baseURL = ' https://prelaunch-calamity-moonwalk.ngrok-free.dev';
      const cleanPath = url.startsWith('/') ? url : `/${url}`;
      return `${baseURL}${cleanPath}`;
    },

    selectCandidate(id) {
      this.selectedId = (this.selectedId === id) ? null : id;
    },

    goBack() {
      this.$router.go(-1);
    },

    // 🌟 核心修复：在这里加上存盘逻辑
    async submitVote() {
      if (!this.selectedId) return;

      try {
        // 1. 获取玩家选中的嫌疑人名字
        const targetName = this.selectedCandidate?.name || '未知嫌疑人';

        // 2. 弹出一个原生输入框，让玩家填写推理依据 (完美解决你没有做HTML输入框的问题)
        let reasoning = prompt(`你已锁定【${targetName}】为真凶。\n\n作为侦探，请在结案前向法官简述你的推理依据（这会直接影响你的最终评分）：`, "");

        // 如果玩家点了取消或者什么都没填，给个兜底供词
        if (!reasoning) {
          reasoning = "直觉告诉我就是这个人。";
        }

        // 3. 拼接完整的供词，并存入 localStorage！AI 法官终于有卷子可以改了！
        const finalAnswer = `我指控的凶手是：${targetName}。我的推理依据是：${reasoning}`;
        localStorage.setItem('player_verdict_answer', finalAnswer);

        // 4. 跳转到结果页 (保持你原本的跳转逻辑不变)
        this.$router.push({
          name: 'ResultPage',
          query: {
            accusedId: this.selectedId,
            scriptId: this.scriptId
          }
        });
      } catch (error) {
        console.error('指控提交异常:', error);
      }
    }
  }
}