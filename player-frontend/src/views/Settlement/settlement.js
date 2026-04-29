export default {
  name: 'SettlementPage',
  data() {
    return {
      scriptName: '孤儿院的地下室',
      performance: {
        score: 88,
        review: "你敏锐地发现了地下室的痕迹，但在凶手动机的推断上稍显迟疑。由于你没能及时阻止补枪行为，真相在最后一刻才得以揭开。"
      },
      discoveredClues: [
        { id: 1, name: "通风口挡板" },
        { id: 2, name: "刻有'R'的手枪" },
        { id: 3, name: "割断的绳索" },
        { id: 4, name: "尼克照片" }
      ],
      truthRevealSummary: "死者尼克实为仿生人替身。林恩与凯文均在现场，致命伤由刻有'R'号的无声手枪造成，该枪支在地下室被发现。真正的尼克依然隐匿在K科技的更深处...",
      selectedRole: null,
      roles: [
        { name: "安娜", identity: "K科技模特", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna", story: "表面是林恩女友，实则是REAL组织派出的潜伏者。她不仅负责监视，还参与了最初的撤离计划。", secret: "她并不属于自己，她的脸只是K科技的财产。她一直在试图寻找自我觉醒的契机。" },
        { name: "林恩", identity: "公司继承人", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lynn", story: "优雅的继承人，实则内心充满了对尼克的复仇怒火。他精心策划了晚宴，目的是夺回公司的控制权。", secret: "他是杀死尼克的真凶之一，并将手枪栽赃给了他人。他甚至不惜利用安娜作为掩护。" },
        { name: "凯文", identity: "护林员", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin", story: "一个被毁掉生活的普通人，在通风管道中寻找机会。他曾经拥有的森林被尼克强行征收。", secret: "他以为自己杀了尼克，却不知道有人补了枪。他丢弃在草丛里的凶器其实并未触发死穴。" }
      ]
    }
  },
  methods: {
    goToLobby() { this.$router.push('/'); },
    goToUserCenter() { this.$router.push('/user'); },
    toggleRoleDetail(role) {
      this.selectedRole = (this.selectedRole?.name === role.name) ? null : role;
    }
  }
}