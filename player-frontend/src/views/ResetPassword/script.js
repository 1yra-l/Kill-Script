export default {
  name: 'ResetPassword',
  data() {
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    handleReset() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm;

      // 1. 非空校验
      if (!oldPassword || !newPassword || !confirmPassword) {
        alert('【系统】所有凭据字段必须填写完整。');
        return;
      }

      // 2. 两次输入一致性校验
      if (newPassword !== confirmPassword) {
        alert('【警告】两次输入的新密钥不匹配，请重新核对。');
        return;
      }

      // 3. 模拟逻辑：此处应调用后端 API
      if (oldPassword === '123456') { // 演示用的逻辑
        console.log('正在更新数据库中的加密密钥...');
        alert('【系统】密钥已重置。新身份凭据已生效，请妥善保管。');
        this.$router.push('/user-center'); // 重置成功后跳回个人中心
      } else {
        alert('【错误】原始密钥验证失败，请重试。');
      }
    }
  }
};