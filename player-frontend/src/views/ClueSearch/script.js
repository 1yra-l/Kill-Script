import NavBar from '@/components/NavBar.vue'
import ClueNotebook from '@/components/ClueNotebook.vue'
import ModelViewer from '@/components/ModelViewer.vue'
import request from '@/utils/request.js'

export default {
  name: 'ClueSearch',
  components: { NavBar, ClueNotebook, ModelViewer },
  data() {
    return {
      actionPoints: 3, // 配合你 gm_api.py 里的 MAX_SEARCH = 3
      searchingLoc: false,
      selectedClue: null,
      myClues: [],
      showNPCDialog: false,

      // // 1. 你的 Python 中枢 API 地址 (负责防作弊和判定)
      // gmApiUrl: 'http://localhost:8888',

      // // 2. 你的云端数据库 API 地址 (负责兜底提供线索)
      // dbApiUrl: 'https://prelaunch-calamity-moonwalk.ngrok-free.dev/api/clues'
    }
  },
  computed: {
    formattedClues() {
      return this.myClues.map((clue, index) => ({
        id: index,
        text: `【${clue.name}】发现于${clue.foundAt || '现场'}。\n\n${clue.description}`
      }));
    }
  },
  methods: {
    async handleSearch(locName) {
      if (this.actionPoints <= 0) {
        this.showNPCDialog = true;
        return;
      }
      this.searchingLoc = true;
      try {
        // 【改动3】：使用 request.get，并复用你刚写的后端接口
        const res = await request.get('/api/clues', {
          params: {
            script_id: this.$route.params.roomId || '4',
            // 注意：你前端原本传了 location_tag，但你刚才写的 Python 接口里没有这个参数。
            // 暂时先用剧本 ID 获取所有线索，如果需要按地点搜证，需要修改 Python 接口。
          }
        });

        // request.js 拦截器已经处理了 data 层级，通常返回的就是后端的 json 结构
        if (res.code === 200 && res.data && res.data.length > 0) {
          this.actionPoints--;
          
          // 前端模拟：从获取到的线索中随机抽一个（或者根据地点名在前端过滤）
          // 因为你现在的后端接口还没写 location_tag 过滤逻辑
          const matchedClues = res.data;
          const randomClue = matchedClues[Math.floor(Math.random() * matchedClues.length)];
          
          // 适配数据库字段到前端展示字段
          this.selectedClue = {
            name: randomClue[3] || randomClue.title || '未知线索', // 根据你数据库实际字段调整索引
            foundAt: locName,
            description: randomClue[7] || randomClue.content || randomClue.description
          };
          this.myClues.push(this.selectedClue);
        } else {
          alert(`在 ${locName} 没有发现有价值的线索...`);
          this.actionPoints--;
        }
      } catch (e) {
        console.error("搜证请求失败:", e);
        alert("搜证失败，请检查网络或登录状态。");
      } finally {
        this.searchingLoc = false;
      }
    },

    // NPC 汇总线索逻辑 (保留你的原始请求)
    async confirmNPCSearch() {
      this.searchingLoc = true;
      try {
        const res = await request.get('/api/clues', {
          params: { script_id: this.$route.params.roomId || '4' }
        });
        
        if (res.code === 200 && res.data) {
          const allData = res.data;
          allData.forEach(item => {
            const cName = Array.isArray(item) ? item[3] : (item.title || item.name);
            const cDesc = Array.isArray(item) ? item[7] : (item.content || item.description);
            const cLoc = Array.isArray(item) ? item[4] : (item.location || '现场');
            
            // 去重
            const exists = this.myClues.find(c => c.name === cName);
            if (!exists) {
              this.myClues.push({ name: cName, foundAt: cLoc, description: cDesc });
            }
          });
        }
        this.showNPCDialog = false;
      } catch (e) {
        console.error("NPC获取线索失败:", e);
      } finally {
        this.searchingLoc = false;
      }
    }
  }
}