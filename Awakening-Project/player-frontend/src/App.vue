<template>
  <div id="app">
    <div class="wood-texture-base"></div>
    <div class="vignette"></div>
    <div class="noise"></div>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition
          :css="false"
          @leave="handleLeave"
          @enter="handleEnter"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <WoodenDoor
      v-if="isDoorActive"
      ref="doorComponent"
      class="global-door-transition"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import WoodenDoor from '@/views/Woodendoor/woodendoor.vue'

export default {
  name: 'App',
  components: { NavBar, WoodenDoor },
  data() {
    return {
      isDoorTransition: false, // 标记当前是否需要播放木门动画
      isDoorActive: false      // 🌟 修复：补上这个缺失的变量，控制木门组件是否挂载
    }
  },
  watch: {
    // 监听路由变化，提前判定是否需要动画
    $route(to, from) {
      this.isDoorTransition = (from.name === 'CharacterSelect' && to.name === 'ScriptView');
    }
  },

  methods: {
    handleLeave(el, done) {
      if (this.isDoorTransition) {
        this.isDoorActive = true; // 1. 先把木门组件挂载到 DOM 上

        // 2. 等待 Vue 渲染好木门，再命令它合拢
        this.$nextTick(() => {
          if (this.$refs.doorComponent) {
            this.$refs.doorComponent.prepareToOpen();
          }
          done(); // 立刻放行路由，销毁旧页面
        });
      } else {
        done();
      }
    },

    handleEnter(el, done) {
      if (this.isDoorTransition) {
        // 等待新页面和木门都准备好
        this.$nextTick(() => {
          if (this.$refs.doorComponent) {
            // 执行开门动画，动画完毕后回调
            this.$refs.doorComponent.startOpening(() => {
              this.isDoorActive = false; // 门打开后，彻底卸载组件释放性能
              done();
            });
          } else {
            done();
          }
        });
      } else {
        done();
      }
    }
  }
}
</script>

<style>
/* 保持您原有的基础样式不变 */
html, body {
  margin: 0; padding: 0;
  background-color: #3d322a;
  color: #dcd1ba;
  overflow-x: hidden;
  font-family: 'Georgia', 'Times New Roman', serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.wood-texture-base {
  position: fixed; inset: 0; z-index: -1;
  background-image: url("https://www.transparenttextures.com/patterns/dark-wood.png");
  background-repeat: repeat;
  background-position: center;
  background-color: #4a3c32;
  filter: contrast(1.1) brightness(1.1);
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* 🌟 木门容器的层级确保在最前方 */
.global-door-transition {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000; /* 必须高于 NavBar 和所有内容 */
  pointer-events: none; /* 防止遮挡点击 */
}

/* 滤镜层保持原样 */
.vignette {
  position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%);
}

.noise {
  position: fixed; inset: 0; pointer-events: none; z-index: 9998;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>