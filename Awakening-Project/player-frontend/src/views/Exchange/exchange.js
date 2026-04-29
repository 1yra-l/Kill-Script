export default {
  name: "PointsExchange",
  data() {
    return {
      currentTime: "",
      points: 1560,
      currentTab: "全部",
      tabs: ["全部", "剧本解锁", "线索道具", "身份特权"],
      goodsList: [
        {
          id: 1,
          name: "解锁限定剧本",
          desc: "永久解锁1个付费/限定AI剧本",
          points: 600,
          icon: "📜",
          type: "剧本解锁"
        },
        {
          id: 2,
          name: "关键线索卡",
          desc: "游戏中直接获得1条关键真相线索",
          points: 200,
          icon: "🔍",
          type: "线索道具"
        },
        {
          id: 3,
          name: "隐藏剧情解锁",
          desc: "开启剧本未公开的隐藏支线剧情",
          points: 300,
          icon: "📁",
          type: "剧本解锁"
        },
        {
          id: 4,
          name: "排除错误答案",
          desc: "直接排除1个错误嫌疑人，降低难度",
          points: 250,
          icon: "❌",
          type: "线索道具"
        },
        {
          id: 5,
          name: "侦探身份铭牌",
          desc: "游戏内专属金色侦探标识",
          points: 400,
          icon: "⭐",
          type: "身份特权"
        },
        {
          id: 6,
          name: "二次提问机会",
          desc: "可向AI额外追问1次深层线索",
          points: 180,
          icon: "💬",
          type: "线索道具"
        },
        {
          id: 7,
          name: "全剧本速读权限",
          desc: "3分钟快速预览当前剧本完整背景",
          points: 350,
          icon: "⚡",
          type: "身份特权"
        },
        {
          id: 8,
          name: "真凶提示",
          desc: "AI给出真凶范围暗示，不直接剧透",
          points: 450,
          icon: "⚠️",
          type: "线索道具"
        }
      ]
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  computed: {
    showList() {
      if (this.currentTab === "全部") return this.goodsList;
      return this.goodsList.filter(item => item.type === this.currentTab);
    }
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString("zh-CN", { hour12: false });
    },
    // 返回会员中心
    goBack() {
      this.$router.push("/user");
    },
    // 兑换逻辑
    doExchange(item) {
      if (this.points < item.points) {
        alert("积分不足，无法兑换");
        return;
      }
      if (confirm(`确认消耗 ${item.points} 积分兑换「${item.name}」？`)) {
        this.points -= item.points;
        alert("兑换成功！道具已发放至你的背包");
      }
    }
  }
};