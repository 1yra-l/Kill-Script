import request from '@/utils/request';
import NavBar from '@/components/NavBar1.vue';

const API_BASE = "https://prelaunch-calamity-moonwalk.ngrok-free.dev";

export default {
  name: 'RoomHall',
  components: { NavBar },
  data() {
    return {
      searchQuery: '',
      newRoom: { 
        name: '', 
        script: '' 
      },
      rooms: [],
      isLoading: false
    }
  },

  mounted() {
    this.refreshRooms();
  },

  computed: {
    filteredRooms() {
      const list = this.rooms || [];
      if (!this.searchQuery) return list;
      const query = this.searchQuery.toLowerCase();
      return list.filter(room =>
        (room.name && room.name.toLowerCase().includes(query)) ||
        (room.abstract && room.abstract.toLowerCase().includes(query))
      );
    }
  },

  methods: {
    async refreshRooms() {
      this.isLoading = true;

      try {
        const response = await request.get('/scripts');

        const rawList = Array.isArray(response) ? response : (response.data || []);

        this.rooms = rawList.map((item, index) => {
          return {
            // realScriptId 是数据库里真正的剧本标识符（ID或名称）
            realScriptId: item.script_id || item.script_name || '1', 
            id: String(index + 1).padStart(3, '0'), // 显示用的流水号
            name: item.script_name || '无名卷宗',
            players: item.role_number || 0,
            abstract: item.abstract || '此档案暂无详细摘要。',
            status: '等待中'
          };
        });
      } catch (error) {
        console.error('档案调取失败:', error);
      } finally {
        this.isLoading = false;
      }
    },


    // === 衔接逻辑：进入选角页面 ===
    async joinRoom(room) {
      console.log("准备进入剧本:", room.name, "ID:", room.realScriptId);
      this.isLoading = true;

      try {
      // 1. 调用后端接口，创建一个独立的游戏 Session
        const res = await request.post('/api/game/session/create', { 
          script_id: room.realScriptId 
        });

        const responseData = res.data || res;

        if (responseData && responseData.session_id) {
          const sessionId = responseData.session_id;

          // 2. 存入 localStorage
          localStorage.setItem('currentScriptId', room.realScriptId);
          localStorage.setItem('currentSessionId', sessionId); // 核心：存下 SessionID
          
          // 3. 路由跳转
          this.$router.push({
            name: 'ScriptDetails', // 或 CharacterSelect
            query: { 
              scriptId: room.realScriptId,
              sessionId: sessionId // 放在 URL 里也行，双重保险
            }
          });
        }
      } catch (error) {
        console.error('开局失败:', error);
        // 这里可以加一个 Toast 提示用户
      } finally {
        this.isLoading = false;
      }
    }
  }
}