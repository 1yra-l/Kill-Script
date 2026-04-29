import NavBar from '@/components/NavBar.vue'
import request from '@/utils/request' // 必须使用这个，它带了 JWT 拦截逻辑
import CharacterList from '@/components/CharacterList.vue'

export default {
  name: 'CharacterSelect',
  components: { NavBar, CharacterList },
  props: ['roomId'],
  data() {
    return {
      // 【读取逻辑】：优先从 URL 获取，其次从 localStorage 获取
      scriptId: this.$route.params.roomId || this.roomId || localStorage.getItem('currentScriptId'),
      selectedId: null,
      characters: [],
      loading: true
    }
  },

  computed: {
    selectedChar() {
      if (!this.characters || !Array.isArray(this.characters)) return null;
      return this.characters.find(c => c.id === this.selectedId) || null;
    }
  },

  async mounted() {
    // 如果没拿到 ID，说明用户可能是直接输入 URL 进来的，强制踢回
    if (!this.scriptId) {
      alert("【系统警报】未发现选定的案卷编号，请返回大厅。");
      this.$router.push('/casefile');
      return;
    }
    await this.fetchCharacters();
  },

  methods: {
    async fetchCharacters() {
      this.loading = true;
      try {
        // 【JWT 核心】：使用 request 代替 axios
        // 这里的请求会自动加上 Authorization: Bearer <token>
        const response = await request.get(`/scripts/${this.scriptId}/characters`);

        // 因为 request.js 已经剥离了 .data，所以这里 response 就是后端返回的列表
        const charList = Array.isArray(response) ? response : [];

        if (charList.length > 0) {
          this.characters = charList.map((char) => ({
            id: char.id,
            name: char.character_name,
            avatar: char.gender === '女' ? '👩‍💼' : '👨‍⚖️',
            job: char.profession,
            age: char.age,
            gender: char.gender,
            desc: char.introduction
          }));
          this.selectedId = this.characters[0].id;
        } else {
          throw new Error("该剧本暂无角色档案");
        }
      } catch (error) {
        console.error('获取角色失败:', error);
        // 如果后端报错 401，request.js 会自动拦截并跳回登录页

        // 兜底数据（仅供开发调试）
        this.characters = [
          {
            id: '1',
            name: '安娜',
            avatar: '👩‍💼',
            job: '落魄贵族',
            age: 24,
            gender: '女',
            desc: '由于案件尚未开启，更多背景资料已封存。'
          }
        ];
        this.selectedId = '1';
      } finally {
        this.loading = false;
      }
    },

    confirmSelection() {
      if (!this.selectedChar) return;

      // 【存储逻辑】：为后续的 Interrogation 页面准备数据
      localStorage.setItem('current_player_id', this.selectedId);
      localStorage.setItem('current_role_name', this.selectedChar.name);
      localStorage.setItem('currentScriptId', this.scriptId); // 保持命名统一

      alert(`确认身份：${this.selectedChar.name}。准备进入调查...`);
      this.$router.push('/script-view');
    }
  }
}