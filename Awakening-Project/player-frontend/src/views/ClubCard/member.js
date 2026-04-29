export default {
  name: "DetectiveMemberCenter",
  data() {
    return {
      currentTime: '',
      cumulativeSavings: "468",
      validPoints: "1560",
      expirationDate: "2026-12-31",
      taskList: [
        { name: "邀请好友", progress: "0/2", reward: "20", btnText: "复制链接" },
        { name: "上线打卡", progress: "-", reward: "10", btnText: "去打卡" },
        { name: "完成剧本", progress: "1/2", reward: "15", btnText: "去打本" }
      ]
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    },
    // 返回中心 → /user
    goBack() {
      this.$router.push('/user');
    },
    // 修改后的 member.js
    renewMember() {
      // 核心修改：使用 $router.push 跳转到充值中心的路径
      this.$router.push('/member-center');
    },
    // 跳转到积分兑换页面 ✅新增
    goToExchange() {
      this.$router.push('/exchange');
    },
    // 任务点击
    doTask(task) {
      console.log(task);
      // 去打本 → 跳转到 /casefile
      if (task.btnText === "去打本") {
        this.$router.push('/casefile');
      } else {
        alert(`开始任务：${task.name}`);
      }
    }
  }
};