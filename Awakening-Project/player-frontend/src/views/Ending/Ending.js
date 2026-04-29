export default {
  name: "Ending",

  data() {
    return {
      // 左侧文案：背景与现状
      leftText: "九龙城寨消失了，\n但那段历史提醒我们：\n没有秩序的地方，\n弱者只能靠运气生存。\n今天的香港，法治健全，\n社会安定，这得益于祖国的\n坚强领导和“一国两制”的\n伟大实践。",
      
      // 右侧文案：升华主题
      rightText: "我们回望黑暗，\n不是为了怀旧，\n而是为了珍惜光明——\n珍惜这个由无数先辈\n奋斗而来的、\n属于我们所有人的\n和平时代。",

      leftTextDisplay: "",
      rightTextDisplay: "",
      bgClear: false
    };
  },

  mounted() {
    this.startAnimation();
  },

  methods: {
    async startAnimation() {
      setTimeout(() => {
        this.bgClear = true;
      }, 800);

      // 依次播放打字效果
      await this.typeText(
        this.leftText,
        (val) => (this.leftTextDisplay = val),
        100
      );

      await this.sleep(800);

      await this.typeText(
        this.rightText,
        (val) => (this.rightTextDisplay = val),
        80
      );
    },

    typeText(text, callback, baseSpeed) {
      return new Promise((resolve) => {
        let i = 0;
        const timer = setInterval(() => {
          callback(text.slice(0, i));
          i++;
          if (i > text.length) {
            clearInterval(timer);
            resolve();
          }
        }, baseSpeed);
      });
    },

    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    },

    handleNext() {
      this.$router.push("/casefile");
    }
  }
};