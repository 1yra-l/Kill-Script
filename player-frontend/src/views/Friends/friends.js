export default {
  name: 'FriendsPage',
  data() {
    return {
      currentTab: 'all',
      searchQuery: '',
      tabs: [
        { id: 'all', name: '全部受托人', icon: '📁' },
        { id: 'online', name: '在线成员', icon: '📡' }
      ],
      friends: [
        { 
          id: '800201', 
          name: '审判长-克里斯', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', 
          status: 'online', 
          recentCase: '《谎言解剖学》'
        },
        { 
          id: '800205', 
          name: '潜伏者-墨菲', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Murphy', 
          status: 'busy', 
          recentCase: '《血色午夜》'
        },
        { 
          id: '800312', 
          name: '线人-艾琳', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erin', 
          status: 'offline', 
          recentCase: '《极地营救》'
        }
      ],
      pendingRequests: [
        { id: '90011', name: '调查员-陆恒', message: '申请加入您的调查小组' }
      ]
    }
  },
  computed: {
    onlineCount() {
      return this.friends.filter(f => f.status === 'online' || f.status === 'busy').length;
    },
    filteredFriends() {
      let list = this.friends;
      if (this.currentTab === 'online') {
        list = list.filter(f => f.status === 'online' || f.status === 'busy');
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(f => f.name.toLowerCase().includes(q) || f.id.includes(q));
      }
      return list;
    }
  },
  methods: {
    acceptFriend(id) {
      alert(`已接受代号 ${id} 的入伙申请。`);
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
    },
    declineFriend(id) {
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
    },
    // 跳转到大厅
    goToLobby() {
      this.$router.push('/casefile');
    },
    // 跳转到用户中心
    goToUserCenter() {
      this.$router.push('/user');
    },

    goToChatRoom(friendId, friendName) {
      // 假设你的聊天室路由配置为 /chatroom
      // 携带 targetId 和 name 参数，方便聊天室页面读取
      this.$router.push({
        path: '/chatroom',
        query: {
          targetId: friendId,
          targetName: friendName
        }
      });
    }
  }
};