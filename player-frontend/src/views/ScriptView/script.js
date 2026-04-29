import NavBar from '@/components/NavBar.vue'
import request from '@/utils/request';
import axios from 'axios'; // 补充引入axios，因为下面 finishReading 用到了

export default {
  name: 'ScriptView',
  components: { NavBar },
  data() {
    return {
      roleName: localStorage.getItem('current_role_name') || '侦探',
      isMock: false,
      loading: true,
      scriptData: {
        title: '加载中...',
        common: { background: '' },
        private: { secret: '', timeline: [], tasks: [] }
      }
    }
  },

  computed: {
    isReviewMode() {
      return this.$route.query.review === 'true';
    }
  },
  async mounted() {
    await this.fetchCompleteScript();
  },

  methods: {
    // 💡 核心新增：专门处理数据库传来的纯文本，让它能漂亮地换行和分段
    formatText(text) {
      if (!text) return '';
      return text
        .split('\n')
        .filter(paragraph => paragraph.trim() !== '')
        .map(paragraph => `<p style="text-indent: 2em; margin-bottom: 15px;">${paragraph}</p>`)
        .join('');
    },

    async fetchCompleteScript() {
      this.loading = true;
      try {
        const res = await request.get(`/api/scripts/content/${this.roleName}`);

        if (res) {
          this.scriptData = {
            title: res.title || '无标题',
            common: { ...this.scriptData.common, ...res.common },
            private: { ...this.scriptData.private, ...res.private }
          };
        }
      } catch (e) {
        console.error("剧本加载失败:", e);
        this.scriptData.title = "案卷读取失败";
        this.scriptData.common.background = "无法连接到情报局数据库，请检查网络。";
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      this.$router.back();
    },

    async finishReading() {
      try {
        // 1. 端口改成 8888 (你的法官中枢)
        // 2. 字段名改成 player_id (配合后端的 BaseModel)
        const res = await axios.post('http://127.0.0.1:8888/api/ready', {
          player_id: this.roleName
        });

        if (res.data.is_voting_time || res.data.all_ready) {
          this.$router.push('/interrogation-page');
        } else {
          alert(`阅读完毕！当前已有 ${res.data.ready_count} 人准备，请等待队友。`);
          this.$router.push('/interrogation-page');
        }
      } catch (e) {
        console.warn("准备状态同步失败，正在尝试进入审讯页...");
        this.$router.push('/interrogation-page');
      }
    }
  }
}