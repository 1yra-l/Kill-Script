export default {
  name: 'AuthenticationPage',
  data() {
    return {
      realName: '',
      idNumber: '',
      sysMsg: '',
      msgType: '' // 'error' 或 'success'
    }
  },
  methods: {
    verifyIdentity() {
      // 1. 重置提示
      this.sysMsg = '';
      this.msgType = '';

      // 2. 校验姓名
      if (!this.realName.trim()) {
        this.showMsg('错误：真实姓名不可为空 / NAME_REQUIRED', 'error');
        return;
      }

      // 3. 校验18位身份证格式 (前17位必须是数字，最后一位是数字或大写X)
      const idRegex = /^\d{17}[\dX]$/;
      if (!idRegex.test(this.idNumber)) {
        this.showMsg('错误：身份序列号格式不符，要求18位且尾部合法 / INVALID_FORMAT', 'error');
        return;
      }

      // 4. 解析年龄 (18位身份证更加精确)
      // 提取第7位到第10位 (索引 6, 7, 8, 9) 作为完整的出生年份，例如 "1998" 或 "2005"
      const yearStr = this.idNumber.substring(6, 10);
      const birthYear = parseInt(yearStr, 10);

      // 计算年龄
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      // 5. 年龄拦截逻辑
      if (age < 18) {
        this.showMsg(`访问拒绝：检测到当前年龄推算约为 ${age} 岁，未满18周岁者禁止游玩。 / ACCESS_DENIED`, 'error');
      } else {
        this.showMsg(`验证通过：身份已确认 (登记年龄:${age}岁)。系统放行。 / ACCESS_GRANTED`, 'success');

        // 验证成功后的跳转逻辑（可根据你的路由实际情况修改）
        setTimeout(() => {
          this.$router.push('/user'); // 举例：跳转回好友/终端主页
        }, 2000);
      }
    },
    showMsg(msg, type) {
      this.sysMsg = msg;
      this.msgType = type;
    },
    goToLobby() {
      this.$router.push('/user');
    }
  }
}