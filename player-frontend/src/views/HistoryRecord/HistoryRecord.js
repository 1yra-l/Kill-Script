export default {
  name: 'HistoryRecord',
  data() {
    return {
      currentIndex: 0,
      itemsPerPage: 3,
      playedScripts: [
        { id: 's001', title: '那个血色的午夜', character: '安娜·维多利亚', date: '2026/04/10', status: '已完成' },
        { id: 's002', title: '孤儿院的地下室', character: '亨利神父', date: '2026/04/13', status: '已完成' },
        { id: 's003', title: '谎言解剖学', character: '巴克利医生', date: '进行中', status: '进行中' },
        { id: 's004', title: '消失的第十三阶梯', character: '清洁工', date: '2026/03/10', status: '已完成' },
        { id: 's005', title: '迷雾列车谋杀案', character: '乘务长', date: '2026/02/15', status: '已完成' },
        { id: 's006', title: '钟楼的低语', character: '敲钟人', date: '2026/01/22', status: '已完成' }
      ]
    }
  },
  computed: {
    visibleScripts() {
      return this.playedScripts.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    },
    canPrev() {
      return this.currentIndex > 0;
    },
    canNext() {
      return this.currentIndex + this.itemsPerPage < this.playedScripts.length;
    }
  },
  methods: {
    prevPage() {
      if (this.canPrev) this.currentIndex--;
    },
    nextPage() {
      if (this.canNext) this.currentIndex++;
    },
    goBack() {
      this.$router.push('/user');
    },
    viewDetail(id) {
      this.$router.push('settlement/1');
    }
  }
}