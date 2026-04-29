import request from '@/utils/request'; 

export default {
  name: 'UserSignIn',
  data() {
    return {
      loginType: 'email', // 'email' 或 'phone'
      formData: {
        email: '',
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      const { email, phone, password } = this.formData; 

      // 校验密码是否输入
      if (!password) {
        alert("【警报】请通过安全口令校验。");
        return;
      }
      const account = this.loginType === 'email' ? email : phone;
      
      if (!account) {
        alert(`【警报】请输入${this.loginType === 'email' ? '加密邮箱' : '联系电话'}。`);
        return;
      }

      const payload = {
        contact: account,
        password: this.formData.password
      };
      

      try {
        console.log('--- 身份验证中 ---');
        console.log('账号:', account);
        // 发送 POST 请求到后端的登录接口
        const res = await request.post('/api/login', payload);

        // 验证后端返回的数据中是否包含 Token
        if (res && res.access_token) {
          // 关键：必须存为 'token'，因为拦截器里 getItem 用的就是这个名字
          localStorage.setItem('token', res.access_token);

          if (res.user && res.user.user_id) {
            localStorage.setItem('user_id', res.user.user_id); 
          }

          // 存储昵称用于展示
          if (res.user && res.user.nickname) {
            localStorage.setItem('nickname', res.user.nickname);
          }

          alert(`验证通过！受托人 ${res.user.nickname}，欢迎回到档案室。`);

          // 跳转到主页
          this.$router.push('/casefile');
        } else {
          alert("【验证失败】未能获取到有效的身份凭证。");
        }
      } catch (error) {
        console.error('登录失败:', error);
        // 获取拦截器抛出的错误信息
        const errorMsg = error.response?.data?.detail || "档案链路连接失败";
        alert("【验证失败】" + errorMsg);
      }
    },

    // 跳转到身份录入页面 (Login.vue)
    goToRegister() {
      // 确保与路由配置里的 path 保持一致
      this.$router.push('/login');
    },

    // 【新增】：跳转到重置密码页面 (ResetPassword.vue)
    goToResetPassword() {
      this.$router.push('/reset-password');
    }
  }
}