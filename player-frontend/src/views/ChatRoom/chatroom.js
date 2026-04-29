export default {
  name: 'ChatRoom',
  data() {
    return {
      activeContactId: 'c001',
      newMessage: '',
      // 增加了足够的模拟数据，以触发左侧滚动条
      contacts: [
        { id: 'c001', name: '亨利神父', avatar: '⛪', online: true },
        { id: 'c002', name: '巴克利医生', avatar: '🔪', online: true },
        { id: 'c003', name: '情报贩子-X', avatar: '🕵️', online: false },
        { id: 'c004', name: '特勤局-K', avatar: '🕴️', online: true },
        { id: 'c005', name: '清道夫-马克', avatar: '🧹', online: false },
        { id: 'c006', name: '黑客-Zero', avatar: '💻', online: true },
        { id: 'c007', name: '线人-艾琳', avatar: '💃', online: false },
        { id: 'c008', name: '局长-奥利弗', avatar: '🦅', online: true }
      ],
      // 增加了足够的聊天记录，以触发右侧滚动条
      messageHistory: {
        'c001': [
          { id: 1, text: '系统建立连接...', time: '20:00', isSelf: false },
          { id: 2, text: '孤儿院地下的封印有松动的迹象。', time: '21:04', isSelf: false },
          { id: 3, text: '收到，严重程度如何？', time: '21:05', isSelf: true },
          { id: 4, text: '墙壁上出现了类似中世纪的符文，检测到低频能量波动。', time: '21:06', isSelf: false },
          { id: 5, text: '我明天去确认，备好圣水。', time: '21:06', isSelf: true },
          { id: 6, text: '只带圣水可能不够，带上B级物理驱逐装备。', time: '21:08', isSelf: false },
          { id: 7, text: '明白，需要通知清理小队在外面待命吗？', time: '21:10', isSelf: true },
          { id: 8, text: '暂时不用，以免打草惊蛇。', time: '21:12', isSelf: false },
          { id: 9, text: '好，明早6点准时碰头。', time: '21:13', isSelf: true },
          { id: 10, text: '注意安全，今晚别睡太死。', time: '21:15', isSelf: false }
        ],
        'c002': [
          { id: 1, text: '尸检报告出来了，那不是人类的咬痕。', time: '14:22', isSelf: false },
          { id: 2, text: '立刻销毁档案，不要让第三个人知道。', time: '14:25', isSelf: true },
          { id: 3, text: '太迟了，他们已经来敲门了...', time: '14:26', isSelf: false }
        ],
        'c003': [],
        'c004': [], 'c005': [], 'c006': [], 'c007': [], 'c008': []
      }
    }
  },
  computed: {
    activeContact() {
      return this.contacts.find(c => c.id === this.activeContactId);
    },
    currentMessages() {
      return this.messageHistory[this.activeContactId] || [];
    }
  },
  methods: {
    selectContact(id) {
      this.activeContactId = id;
      this.scrollToBottom();
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const textToSend = this.newMessage;
      // 同学提供的 ngrok 公网 API 基础地址
      const API_BASE_URL = "https://patience-vocation-sandfish.ngrok-free.dev/api/v1";

      try {
        // --- 1. 调用安全检查接口（通过 ngrok）---
        const response = await fetch(`${API_BASE_URL}/check_safety`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: textToSend })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        // --- 2. 处理拦截逻辑 ---
        if (!result.safe) {
          alert(`【系统警告】消息已被拦截。\n原因：${result.hint}`);
          return; // 终止发送
        }

        // --- 3. 只有通过检测才执行原本的发送逻辑 ---
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (!this.messageHistory[this.activeContactId]) {
          this.messageHistory[this.activeContactId] = [];
        }

        this.messageHistory[this.activeContactId].push({
          id: Date.now(),
          text: textToSend,
          time: timeStr,
          isSelf: true
        });

        this.newMessage = '';
        this.scrollToBottom();

      } catch (error) {
        console.error("安全检查服务连接失败:", error);
        alert("系统安全链路断开，消息无法发送。");
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageArea;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    goToFriends() {
      this.$router.push('/friends');
    }
  },
  mounted() {
    this.scrollToBottom();
  }
}
