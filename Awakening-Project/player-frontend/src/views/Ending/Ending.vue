<template>
  <div class="ending-page">
    <div class="bg-wrapper">
      <img
        class="bg-image"
        :class="{ clear: bgClear }"
        src="./assets/background.png"
      />
      <div class="overlay"></div>
    </div>

    <div class="title">
      剧本杀 · 九龙大案 · 结算
    </div>

    <div class="content">
      <div class="text-block cold">
        <div class="vertical-text">
          {{ leftTextDisplay }}
        </div>
      </div>

      <div class="text-block warm">
        <div class="vertical-text">
          {{ rightTextDisplay }}
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="honor-text">和平守护者</div>
      <button class="next-btn" @click="handleNext">
        结束案件
      </button>
    </div>
  </div>
</template>

<script>
import EndingLogic from './Ending.js';

export default {
  mixins: [EndingLogic]
};
</script>

<style scoped src="./Ending.css"></style>