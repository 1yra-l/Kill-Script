<template>
  <aside class="photo-area-scroll">
    <div
      v-for="char in characters"
      :key="char.id"
      class="evidence-photo"
      :class="{ 'photo-selected': modelValue === char.id }"
      @click="$emit('update:modelValue', char.id)"
    >
      <div class="paper-clip"></div>
      <div class="img-placeholder">{{ char.avatar }}</div>
      <p class="name-tag">{{ char.name }}</p>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CharacterList',
  props: {
    characters: Array,
    modelValue: String // 接收父组件的 selectedId
  }
}
</script>

<style scoped>
.photo-area-scroll {
  max-height: 700px; /* 固定高度，防止无限拉长 */
  overflow-y: auto;  /* 开启垂直滚动 */
  padding-right: 15px;
  padding-top: 10px;

  /* 隐藏滚动条 (Chrome/Safari) */
  &::-webkit-scrollbar {
    width: 0px;
  }
  /* 隐藏滚动条 (Firefox) */
  scrollbar-width: none;
}

/* 保持你原来的卡片样式 */
.evidence-photo {
  background: #fdfdfd; padding: 10px 10px 30px; border: 1px solid #ccc;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.4); cursor: pointer; transition: 0.3s;
  transform: rotate(-2deg); position: relative; margin-bottom: 25px;
}
.photo-selected { transform: scale(1.05) rotate(0deg); border: 2px solid #a31d1d; box-shadow: 0 0 20px rgba(163, 29, 29, 0.4); }
.paper-clip { position: absolute; top: -10px; left: 20px; width: 15px; height: 40px; border: 2px solid #999; border-radius: 10px; }
.img-placeholder { background: #111; height: 160px; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.name-tag { color: #333; text-align: center; margin-top: 10px; font-weight: bold; }
</style>