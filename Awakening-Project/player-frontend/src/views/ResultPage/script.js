import request from '@/utils/request'

export default {
  data() {
    return {
      // 状态控制
      loading: true,
      barsDropped: false,
      
      // 数据存储
      scriptId: null,
      accusedId: null,
      isVictory: false,
      
      // 匹配到的角色对象
      accusedCandidate: null, // 你指控的人
      realKiller: null,       // 真正的凶手
      
      // 案件真相文本
      truthData: {
        paragraphs: []
      }
    }
  },
  async mounted() {
    window.scrollTo(0, 0);

    // 1. 初始化基础数据
    this.scriptId = localStorage.getItem('currentScriptId');
    this.accusedId = this.$route.query.accusedId;

    // 2. 校验参数，防止非法进入页面导致 JS 报错
    if (!this.scriptId || !this.accusedId) {
      console.warn("缺少 scriptId 或 accusedId，跳转回大厅");
      this.$router.push('/casefile');
      return;
    }

    // 3. 执行核心逻辑
    await this.initResultData();
  },

  methods: {
    getFullUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const base = request.defaults.baseURL;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${base}${cleanPath}`;
    },


    async initResultData() {
      try {
        this.loading = true;

        // 并发请求：1.判定结果 2.剧本与角色详情
        const [verifyRes, detailsRes] = await Promise.all([
          request.post(`/scripts/${this.scriptId}/verify-killer?accused_id=${this.accusedId}`),
          request.get(`/api/scripts/${this.scriptId}/details`)
        ]);

        // 1. 处理判定结果
        this.isVictory = verifyRes.is_killer || false;
        const killerNameFromBackend = verifyRes.real_killer_name;

        // 2. 处理剧本详情和角色匹配
        const detailData = detailsRes.data || detailsRes; // 兼容不同后端结构
        
        // 提取真相
        if (detailData.true_verdict?.truth) {
          this.truthData.paragraphs = detailData.true_verdict.truth
            .split('。')
            .filter(p => p.trim())
            .map(p => p + '。');
        }

        const charList = detailData.characters || [];
        
        // // 匹配并处理指控对象图片
        // const foundAccused = charList.find(c => String(c.id) === String(this.accusedId));
        // if (foundAccused) {
        //   this.accusedCandidate = {
        //     name: foundAccused.character_name,
        //     image: this.getFullUrl(foundAccused.image_url)
        //   };
        // }

        // 匹配并处理指控对象图片
        const foundAccused = charList.find(c => String(c.id) === String(this.accusedId));
        if (foundAccused) {
          this.accusedCandidate = {
            name: foundAccused.character_name,
            image: this.getFullUrl(foundAccused.image_url)
          };
        }

        // 匹配并处理真凶图片
        if (killerNameFromBackend) {
          const foundKiller = charList.find(c => 
            c.character_name?.trim() === killerNameFromBackend.trim()
          );
          this.realKiller = foundKiller ? {
            name: foundKiller.character_name,
            image: this.getFullUrl(foundKiller.image_url)
          } : { name: killerNameFromBackend, image: '' };
        }

      } catch (error) {
        console.error("加载结果失败:", error);
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.barsDropped = true;
            this.revealTruthText();
          }, 500);
        });
      }
    },

    /**
     * 真相文本逐行浮现动画
     */
    revealTruthText() {
      const pRows = document.querySelectorAll('.truth-p-row');
      if (!pRows.length) return;
      pRows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add('revealed');
        }, index * 1000); // 每一句间隔 1 秒
      });
    },

    backToLobby() {
      this.$router.push('/game-recap');
    }
  }
}