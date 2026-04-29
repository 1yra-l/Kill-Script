<template>
  <div class="intro-container">
    <video ref="videoPlayer" class="video-bg" autoplay muted loop playsinline>
      <source src="/bg.mp4" type="video/mp4" />
      您的浏览器不支持视频播放。
    </video>

    <div class="video-overlay"></div>

    <!-- 右上角 个人中心 + 设置 暗黑无白边风格 -->
    <div class="top-controls">
      <div class="icon-item" @click="goProfile">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="icon-item" @click="goSetting">
        <i class="fa-solid fa-gear"></i>
      </div>
    </div>

    <div class="btn-wrapper">
      <button class="metal-btn" @click="enterLobby">
        <span class="text">身份认证</span>
        <span class="shimmer"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// 页面自动加载图标库，无需 index.html、无需任何外部配置
onMounted(() => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(link);
});

const enterLobby = () => {
  router.push('/user-signin');
};
const goProfile = () => {
  // 个人中心路由
   router.push('/user')
};
const goSetting = () => {
  // 设置页面路由
   router.push('/settings')
};
</script>

<style scoped>
.intro-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

/* 右上角图标容器 */
.top-controls {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 20px;
  z-index: 999;
}

/* 图标按钮：**完全去除白色边框、无亮色、纯暗黑半透明** */
.icon-item {
  width: 48px;
  height: 48px;
  background: rgba(8, 8, 8, 0.75);
  /* 彻底删掉所有白色边框、亮色边框 */
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  /* 暗金属灰色，不发白、不刺眼，适配暗黑探案风 */
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* hover悬浮效果：依旧无白边！只有微弱暗灰提亮，不突兀 */
.icon-item:hover {
  background: rgba(22, 22, 22, 0.9);
  color: #c8c8c8;
  transform: scale(1.08);
  /* 全程无任何白色边框 */
  border: none;
}

/* 底部原有金属按钮全部原样保留，风格完全统一 */
.btn-wrapper {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.metal-btn {
  position: relative;
  padding: 16px 50px;
  font-size: 22px;
  font-weight: 900;
  color: #c0c0c0;
  letter-spacing: 4px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s ease;
  background: linear-gradient(180deg,
    #555 0%,
    #222 48%,
    #000 52%,
    #333 100%);
  border: 1px solid #444;
}

.metal-btn:hover {
  color: #fff;
  transform: scale(1.05);
}

.shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}
.metal-btn:hover .shimmer {
  left: 100%;
  transition: 0.8s;
}
</style>