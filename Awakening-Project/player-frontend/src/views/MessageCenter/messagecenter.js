export default {
  name: 'MessageCenter',
  data() {
    return {
      activeCategory: 'all',
      expandedMsgId: null, // 当前展开阅读的消息ID
      categories: [
        { id: 'all', name: '全部消息', en: 'ALL MESSAGES', icon: '📩' },
        { id: 'system', name: '系统通知', en: 'SYSTEM', icon: '⚙️' },
        { id: 'invite', name: '组队邀请', en: 'INVITES', icon: '🤝' },
        { id: 'alert', name: '安全警告', en: 'ALERTS', icon: '⚠️' },
        { id: 'friend', name: '好友消息', en: 'FRIEND MESSAGES', icon: '👤' } // 新增好友消息分类
      ],
      // 模拟消息数据
      messages: [
        {
          id: 'm1',
          type: 'alert',
          title: '检测到未经授权的档案访问',
          sender: 'SECURITY_PROTOCOL',
          date: '2026-04-20 09:32:00',
          content: '警告：检测到有未知IP尝试访问您的【绝密档案：孤儿院的地下室】。系统已自动启动防御协议拦截该请求，建议您立刻更改访问密钥。',
          isRead: false
        },
        {
          id: 'm2',
          type: 'invite',
          title: '收到新的调查任务邀请',
          sender: '局长-奥利弗',
          date: '2026-04-19 14:15:22',
          content: '有一个新的B级悬案需要你的协助。目标地点：旧城区废弃化工厂。请在收到消息后尽快到大厅集合，我们需要你的【巧舌如簧】技能。',
          isRead: false
        },
        {
          id: 'm3',
          type: 'system',
          title: '联邦调查局终端升级公告',
          sender: 'SYSTEM_ADMIN',
          date: '2026-04-18 02:00:00',
          content: '系统将于今晚凌晨2:00至4:00进行底层固件升级。期间通讯链路可能会出现短暂的中断（不超过15分钟）。请各位受托人提前保存好正在调查的线索。',
          isRead: true
        },
        {
          id: 'm4',
          type: 'system',
          title: '积分结算通知',
          sender: 'SETTLEMENT_SYS',
          date: '2026-04-15 10:00:00',
          content: '您在剧本【那个血色的午夜】中表现优异，成功指认凶手，获得侦破积分 +350，当前总积分：1250。',
          isRead: true
        },
        // 新增好友消息
        {
          id: 'm5',
          type: 'friend',
          title: '夏洛克发来新消息',
          sender: '夏洛克·福尔摩斯',
          date: '2026-04-20 10:15:00',
          content: '关于昨天的案件，我有新的发现。我们需要讨论一下作案时间线的矛盾点。',
          isRead: false,
          friendId: 'sherlock123'  // 新增：好友ID，用于跳转
        },
        {
          id: 'm6',
          type: 'friend',
          title: '华生医生请求协助',
          sender: '约翰·华生',
          date: '2026-04-20 08:30:00',
          content: '我在整理昨天的验尸报告，有几个疑点需要和你确认。',
          isRead: true,
          friendId: 'watson456'
        },
        {
          id: 'm7',
          type: 'friend',
          title: '莫里亚蒂的挑战',
          sender: '詹姆斯·莫里亚蒂',
          date: '2026-04-19 18:45:00',
          content: '看来你已经接近真相了，但还差最后一步。我在聊天室等你。',
          isRead: false,
          friendId: 'moriarty789'
        }
      ],
      // 新增：好友列表数据
      friends: [
        { id: 'sherlock123', name: '夏洛克·福尔摩斯', avatar: '🕵️', online: true, unread: 3 },
        { id: 'watson456', name: '约翰·华生', avatar: '👨‍⚕️', online: true, unread: 1 },
        { id: 'moriarty789', name: '詹姆斯·莫里亚蒂', avatar: '🎩', online: false, unread: 5 },
        { id: 'irene901', name: '艾琳·艾德勒', avatar: '👩', online: true, unread: 0 },
        { id: 'lestrade234', name: '雷斯垂德探长', avatar: '👮', online: false, unread: 2 }
      ]
    }
  },
  computed: {
    filteredMessages() {
      if (this.activeCategory === 'all') {
        return this.messages;
      }
      return this.messages.filter(msg => msg.type === this.activeCategory);
    },
    totalUnread() {
      return this.messages.filter(msg => !msg.isRead).length;
    },
    // 新增：好友消息数量
    friendUnreadCount() {
      return this.messages.filter(msg => msg.type === 'friend' && !msg.isRead).length;
    }
  },
  methods: {
    // 切换分类
    selectCategory(id) {
      this.activeCategory = id;
      this.expandedMsgId = null; // 切换分类时收起所有消息
      this.scrollToTop();
    },
    // 获取每个分类的未读数量
    getUnreadCount(type) {
      if (type === 'all') return this.totalUnread;
      if (type === 'friend') return this.friendUnreadCount; // 新增好友未读计数
      return this.messages.filter(msg => msg.type === type && !msg.isRead).length;
    },
    // 点击展开/收起消息，并标记为已读
    toggleMessage(id) {
      if (this.expandedMsgId === id) {
        this.expandedMsgId = null; // 再次点击则收起
      } else {
        this.expandedMsgId = id;
        const msg = this.messages.find(m => m.id === id);
        if (msg && !msg.isRead) {
          msg.isRead = true; // 展开即视为已读
        }

        // 如果是好友消息，标记为已读
        if (msg && msg.type === 'friend') {
          this.markFriendMessageAsRead(msg.sender);
        }
      }
    },
    // 标记全部已读
    markAllRead() {
      this.messages.forEach(msg => msg.isRead = true);
      // 同时清空好友未读计数
      this.friends.forEach(friend => friend.unread = 0);
    },
    // 删除消息
    deleteMessage(id) {
      this.messages = this.messages.filter(msg => msg.id !== id);
      if (this.expandedMsgId === id) this.expandedMsgId = null;
    },
    scrollToTop() {
      this.$nextTick(() => {
        const container = this.$refs.msgListArea;
        if (container) container.scrollTop = 0;
      });
    },
    goBack() {
      this.$router.back(); // 返回历史记录的上一页
    },

    // ==================== 新增：好友消息相关方法 ====================

    // 跳转到聊天室
    goToChatroom(friendId = null) {
      if (friendId) {
        // 带好友ID跳转
        this.$router.push({
          path: '/chatroom',
          query: { friendId: friendId }
        });
      } else {
        // 直接跳转到聊天室
        this.$router.push('/chatroom');
      }
    },

    // 标记好友消息为已读
    markFriendMessageAsRead(friendName) {
      const friend = this.friends.find(f => f.name === friendName);
      if (friend) {
        friend.unread = 0;
        // 同时标记该好友的所有消息为已读
        this.messages.forEach(msg => {
          if (msg.type === 'friend' && msg.sender === friendName) {
            msg.isRead = true;
          }
        });
      }
    },

    // 获取好友信息
    getFriendInfo(friendName) {
      return this.friends.find(f => f.name === friendName) || { avatar: '👤', online: false, unread: 0 };
    },

    // 获取在线好友数量
    getOnlineFriendsCount() {
      return this.friends.filter(f => f.online).length;
    }
  }
}