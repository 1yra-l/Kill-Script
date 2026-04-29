import request from '@/utils/request';
import NavBar from '@/components/NavBar1.vue';

export default {
  name: 'ScriptDetails',
  components: { NavBar },
  data() {
    return {
      backgroundImage: new URL('./assets/mask.png', import.meta.url).href,
      parchmentImage: new URL('./assets/parchment.png', import.meta.url).href,
      paperImage: new URL('./assets/paper.png', import.meta.url).href,
      
      scriptTitle: '系统正在解密档案...',
      scriptAbstract: '正在建立神经连接获取卷宗详情...',
      
      selectedIndex: 0,
      characters: [], // 初始为空数组
      
      ratingLabels: { overall: '综合评分', script: '脚本质量', difficulty: '推理难度' },
      ratings: { overall: 4.7, script: 4.8, difficulty: 4.5 },
      reviews: [],

      sessionId: null
    }
  },

  // 计算属性：必须定义这个，否则模板里的 selectedCharacter 会报错
  computed: {
    selectedCharacter() {
      // 增加安全防护：如果数组为空或索引无效，返回一个空对象防止读取 .name 报错
      if (!this.characters || this.characters.length === 0) {
        return { name: '加载中...', desc: '正在调取信息...' };
      }
      return this.characters[this.selectedIndex];
    }
  },

  mounted() {
    this.sessionId = this.$route.query.sessionId || localStorage.getItem('currentSessionId');
    this.fetchScriptAndCharacters();
  },

  methods: {
    getFullUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      
      const base = request.defaults.baseURL;

      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${base}${cleanPath}`;
    },


    async fetchScriptAndCharacters() {
      // 【修复】确保参数名与 RoomHall 跳转时一致
      const scriptId = this.$route.query.scriptId || localStorage.getItem('currentScriptId');
      
      if (!scriptId) {
        console.error('[系统] 未获取到剧本业务编号');
        return;
      }

      try {
        const res = await request.get(`/api/scripts/${scriptId}/details`);
        
        // 根据你的拦截器返回情况，可能需要 res.data 或直接 res
        const serverData = res.data || res;

        if (serverData) {
          this.scriptTitle = serverData.script_name;
          this.scriptAbstract = serverData.abstract;
          
          if (serverData.characters && serverData.characters.length > 0) {
            this.characters = serverData.characters.map((char, index) => ({
              name: char.character_name,
              img: char.image_url 
                ? this.getFullUrl(char.image_url) 
                : new URL(`./assets/avatar${(index % 3) + 1}.png`, import.meta.url).href,
              desc: char.introduction || '暂无详细情报。'
            }));
          }
        }
      } catch (error) {
        console.error('[系统] 档案读取失败:', error);
      }
    },

    selectCharacter(index) {
      this.selectedIndex = index;
    },

    confirmSelection() {
      const scriptId = this.$route.query.scriptId || localStorage.getItem('currentScriptId');
      this.$router.push({
        path: '/character-select', 
        query: { 
          scriptId: scriptId,
          sessionId: this.sessionId
        }
      });
    }
  }
}