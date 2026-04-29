<template>
  <div class="notebook">
    <div class="leather-cover">
      <h3 class="title">CLUES JOURNAL</h3>
      <div class="page-body">
        <div class="clue-list">
          <div v-for="clue in (clues || [])" :key="clue.id" class="sticky-note">
            <div class="tape"></div>
            <p class="clue-text">{{ clue.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clues: { type: Array, required: true, default: () => [] }
  }
}
</script>

<style scoped>
.notebook { height: 100%; padding: 5px; }
.leather-cover {
  background: #5e4b3c; /* 暖褐色皮革 */
  height: 100%;
  border-radius: 5px 20px 20px 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 25px rgba(0,0,0,0.5);
  border-left: 10px solid #42352a;
}

.title {
  color: #f2e9d2; text-align: center; margin-bottom: 15px;
  font-family: serif; letter-spacing: 2px; font-size: 1.2rem;
  border-bottom: 1px solid #7c6d5e; padding-bottom: 10px;
}

.page-body {
  background: #e8d5b5; /* 亮色纸张 */
  flex: 1;
  padding: 15px;
  /* 开启垂直滚动 */
  overflow-y: auto;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
  /* 稍微给右侧留一点 padding，让滚动条不至于贴着文字 */
  padding-right: 10px;
}

/* =======================================
   定制复古风格滚动条
======================================= */
/* 滚动条整体宽度 */
.page-body::-webkit-scrollbar {
  width: 8px;
}
/* 滚动条轨道（凹槽） */
.page-body::-webkit-scrollbar-track {
  background: rgba(94, 75, 60, 0.1); /* 轻微的皮革底色透出 */
  border-radius: 4px;
}
/* 滚动条滑块 */
.page-body::-webkit-scrollbar-thumb {
  background: #8a6c56; /* 采用符合整体复古褐色的滑块 */
  border-radius: 4px;
  box-shadow: inset 0 0 3px rgba(0,0,0,0.3);
}
/* 滑块悬停时的颜色 */
.page-body::-webkit-scrollbar-thumb:hover {
  background: #5e4b3c; /* 鼠标放上去时颜色变深（加深皮革色） */
}

.clue-list { display: flex; flex-direction: column; gap: 20px; }

.sticky-note {
  background-color: #fdf2ab;
  background-image: url("https://www.transparenttextures.com/patterns/handmade-paper.png");
  padding: 15px;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.2);
  transform: rotate(1deg);
  border: 1px solid #e0d5bd;
}

.tape {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  width: 60px; height: 20px; background: rgba(255, 255, 255, 0.4);
}

.clue-text {
  color: #3d2b1f;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
}
</style>