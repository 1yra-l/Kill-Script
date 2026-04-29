<template>
  <div class="door-animate" v-show="isActive" :class="{ shake: cameraShake }">
    <div class="dust-group">
      <div class="dust" v-for="n in 30" :key="n" :style="dustStyle()"></div>
    </div>

    <div class="door-glow" :class="{ show: doorOpen }"></div>

    <img src="@/assets/doorleft.jpg" class="door left" :class="{ open: doorOpen }">
    <img src="@/assets/dooright.jpg" class="door right" :class="{ open: doorOpen }">
  </div>
</template>

<script>
export default {
  name: 'WoodenDoor',
  data() {
    return {
      isActive: false,   // 控制组件挂载
      doorOpen: false,   // false 代表门是关着的（初始状态）
      cameraShake: false
    }
  },
  methods: {
    playCreakSound() {
      const audio = new Audio("https://assets.mixkit.co/sfx/mp3/mixkit-horror-wooden-door-creak-1227.mp3")
      audio.volume = 0.7
      audio.play().catch(() => {})
    },
    dustStyle() {
      return {
        left: Math.random() * 100 + "vw", top: Math.random() * 100 + "vh",
        width: Math.random() * 1.5 + 0.5 + "px", height: Math.random() * 1.5 + 0.5 + "px",
        animationDuration: Math.random() * 2 + 2 + "s"
      }
    },
    // 🌟 新增：瞬间关门（不播动画，直接黑屏/门合拢）
    prepareToOpen() {
      this.isActive = true;
      this.doorOpen = false; // 门处于合拢状态
      this.cameraShake = false;
    },
    // 🌟 执行开门动作
    startOpening(callback) {
      this.playCreakSound();

      // 延迟一丁点时间再开门，给玩家一种“刚刚站到门前”的顿挫感
      setTimeout(() => {
        this.doorOpen = true;   // 触发 CSS transition 开启
        this.cameraShake = true;
      }, 300);

      setTimeout(() => { this.cameraShake = false; }, 1800);

      // 动画结束后（2秒左右），隐藏组件并通知 App.vue
      setTimeout(() => {
        this.isActive = false;
        if (callback) callback();
      }, 2500);
    }
  }
}
</script>

<style scoped>
/* 保持你原本的高质量 CSS 完全不变 */
.door-animate {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: #000; z-index: 999999; overflow: hidden;
}

.shake {
  animation: shake 0.5s ease-in-out 2;
}
@keyframes shake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}

.dust-group {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  pointer-events: none;
}
.dust {
  position: absolute;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  animation: float linear infinite;
}
@keyframes float {
  0% { transform: translate(0,0); opacity:0.2; }
  50% { transform: translate(8px,-15px); opacity:0.4; }
  100% { transform: translate(12px,-25px); opacity:0.1; }
}

/* 开门后柔和光晕 */
.door-glow {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    circle at center,
    rgba(255, 235, 180, 0.25) 0%,
    rgba(40, 30, 10, 0.15) 40%,
    transparent 70%
  );
  opacity: 0;
  z-index: 15;
  transition: opacity 2s ease;
  pointer-events: none;
}
.door-glow.show {
  opacity: 1;
}

/* 木门：完整显示 + 完全闭合 */
.door {
  position: absolute; top: 0; height: 100vh; width: 50vw;
  object-fit: cover; transition: transform 2s cubic-bezier(0.1, 0.05, 0.1, 1);
  z-index: 20;
}
.door.left { left: 0; transform: translateX(0); } /* 默认闭合 */
.door.right { right: 0; transform: translateX(0); } /* 默认闭合 */
.door.left.open { transform: translateX(-100%); }
.door.right.open { transform: translateX(100%); }
</style>