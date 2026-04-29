// script.js
import request from '@/utils/request';

export default {
  name: 'UserCenter',
  data() {
    return {
      cpuLoad: 47,           // 神元负载初始值
      currentCat: 'general',
      categories: [
        { id: 'general' },
        { id: 'status' },
        { id: 'security' }
      ],
      userInfo: {
        id: '',
        name: '加载中...',
        role: '数据同步中...', 
        avatar: '📋',
        location: '未知'
      }
    }
  },
  methods: {
    isImageUrl(url) {
      if (!url || typeof url !== 'string') return false;
      return url.startsWith('data:image') || url.startsWith('http');
    },
    
    async fetchUserProfile() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('[UserCenter] 未发现受托人编号，请重新登录');
        this.$router.push('/user-signin');
        return;
      }

      try {
        const res = await request.get(`/users/${userId}/profile`);
        if (res && res.code === 200) {
          const serverData = res.data; 
          this.userInfo = {
            id: serverData.user_id,
            name: serverData.nickname,
            role: serverData.signature || `高级受托人 (积分: ${serverData.points})`,
            avatar: serverData.avatar_url || '👤'
          };
          console.log('[系统] 档案数据同步成功:', this.userInfo);
        }
      } catch (error) {
        console.error('[系统] 档案调取失败:', error);
      }
    },
   
    goBack() {
      this.$router.back(); 
    },

    /** 安全退出 */
    safeExit() {
      if (confirm('确定要安全退出系统吗？\n\nNEURAL LINK 将断开')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        this.$router.push('/user-signin');
      }
    },

    /** 前往用户资料页 */
    goToProfile() {
      this.$router.push('/personal-information');
    },

    // ==========================================
    // 【核心修改】充值中心跳转逻辑
    // 对应路由 index.js 中的 /member-center
    // ==========================================
    goToMemberCenter() {
      console.log('[UserCenter] 正在建立充值中心连接...');
      this.$router.push('/member-center');
    },
    // ==========================================

    /** 卡片点击导航 */
    navigateTo(section) {
      const routeMap = {
        profile: '/personal-information',
        friends: '/friends',
        'message-center': '/message-center',
        achievements: '/achievements',
        'service-center': '/service-center',
        evaluate: '/evaluate',
        settlement: '/history-record',
        exchange:'/exchange',
        'club-card': '/club-card'
      }

      const target = routeMap[section] || section;
      this.$router.push(target);
    },

    manageTrustee(e) {
      e.stopImmediatePropagation();
      this.$router.push('/service-center');
    },

    goToFeedback(e) {
      e.stopImmediatePropagation();
      this.navigateTo('evaluate');
    }
  },

  mounted() {
    this.fetchUserProfile();
    setInterval(() => {
      this.cpuLoad = Math.max(35, Math.min(78, this.cpuLoad + (Math.random() * 8 - 4)))
    }, 2500);
  }
}