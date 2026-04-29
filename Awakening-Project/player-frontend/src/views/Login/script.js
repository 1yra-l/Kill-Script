import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      apiBaseUrl: 'https://prelaunch-calamity-moonwalk.ngrok-free.dev',
      loginType: 'email', // 'email' 或 'phone'
      formData: {
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      const { username, password, confirmPassword } = this.formData;

      // 1. 基本校验
      if (password !== confirmPassword) {
        alert("【警报】两次输入的口令不一致，请核对。");
        return;
      }

      // 2. 根据类型获取联系方式
      const account = this.loginType === 'email' ? this.formData.email : this.formData.phone;

      // 3. 构造后端需要的 payload
      // 根据你的后端接口：nickname 对应 username, contact 对应 account
      const payload = {
        nickname: username,
        contact: account,
        password: password,
        confirm_password: confirmPassword
      };

      try {
        console.log('--- 身份录入中 ---');
        
        // 发送 POST 请求到后端注册接口
        const response = await axios.post(`${this.apiBaseUrl}/api/register`, payload,{
          headers: {
            "ngrok-skip-browser-warning": "69420"
          }
        });


        if (response.status === 201) {
          // 模拟提交成功
          alert(`身份录入成功！受托人 ${response.data.user.nickname}，欢迎来到档案室。您的 ID 为：${response.data.user.user_id}`);
          
          // 成功后跳转到个人中心
          this.$router.push('/user-signin');
        }
      } catch (error) {
        console.error('注册失败:', error);
        // 处理后端返回的错误信息
        const errorMsg = error.response?.data?.detail ;
        alert("【录入失败】" + errorMsg);
      }
    },
     goToLogin() {
      this.$router.push('/user-signin');
    }
  }
}
