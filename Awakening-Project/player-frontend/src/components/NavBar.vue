<template>
  <nav class="rust-nav">
    <div class="nav-content">
      <div class="logo">🩸 <span class="text">CRIMINAL ARCHIVE</span></div>

      <div class="nav-right" ref="menuContainer">
        <span class="room-tag">ROOM: 0413</span>

        <button class="menu-btn" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
          <span class="btn-icon">☰</span> MENU
        </button>

        <transition name="dropdown">
          <div class="dropdown-menu" v-if="isMenuOpen">
            <router-link to="/casefile" class="menu-item" @click="closeMenu">
              <span class="item-icon">🏠</span> 返回卷宗启动页
            </router-link>

            <router-link to="/user" class="menu-item" @click="closeMenu">
              <span class="item-icon">👤</span> 个人中心
            </router-link>

            <router-link to="/message-center" class="menu-item" @click="closeMenu">
              <span class="item-icon">✉️</span> 消息中心
            </router-link>

            <router-link to="/settings" class="menu-item" @click="closeMenu">
              <span class="item-icon">⚙️</span> 系统设置
            </router-link>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      // 控制下拉菜单的显示与隐藏
      isMenuOpen: false
    }
  },
  methods: {
    // 切换菜单状态
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    // 关闭菜单
    closeMenu() {
      this.isMenuOpen = false;
    },
    // 点击页面其他区域自动关闭菜单
    handleClickOutside(event) {
      // 如果点击的不是菜单容器内部的元素，就关闭菜单
      if (this.$refs.menuContainer && !this.$refs.menuContainer.contains(event.target)) {
        this.isMenuOpen = false;
      }
    }
  },
  mounted() {
    // 组件挂载时，监听全局点击事件
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // 组件销毁前，移除监听，防止内存泄漏
    // 注意：如果你使用的是 Vue 2，请把 beforeUnmount 换成 beforeDestroy
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
/* ============================================================
   导航条基础样式
   ============================================================ */
.rust-nav {
  background: #1a1512;
  border-bottom: 3px solid #5e1c14; /* 血色铁锈底边 */
  padding: 12px 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.8);
  position: relative;
  z-index: 1000; /* 确保导航条在最上层 */
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.logo {
  color: #8e7d6f;
  font-weight: bold;
  letter-spacing: 3px;
}

.logo .text {
  color: #b0a08d;
}

/* ============================================================
   右侧区域与按钮
   ============================================================ */
.nav-right {
  display: flex;
  align-items: center;
  position: relative; /* 关键：为了让下拉菜单相对此区域定位 */
}

.room-tag {
  color: #7c2d23;
  font-family: 'Courier New', monospace;
  margin-right: 25px; /* 改为 right，因为现在它在菜单按钮的左边 */
  font-weight: 900;
  letter-spacing: 1px;
}

.menu-btn {
  background: transparent;
  border: 1px solid #5e1c14;
  color: #b0a08d;
  padding: 6px 15px;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-btn:hover, .menu-btn.is-active {
  background: #2b1512;
  color: #d32f2f;
  border-color: #a31d1d;
  box-shadow: 0 0 10px rgba(163, 29, 29, 0.4);
}

/* ============================================================
   下拉菜单样式
   ============================================================ */
.dropdown-menu {
  position: absolute;
  top: 100%; /* 紧贴在按钮正下方 */
  right: 0;
  margin-top: 15px; /* 与导航条留出一点距离 */
  background: #1a1512;
  border: 1px solid #5e1c14;
  border-radius: 4px;
  width: 180px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0,0,0,0.8);
  overflow: hidden;
}

/* 菜单项样式 */
.menu-item {
  padding: 12px 18px;
  color: #a89a85;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: bold;
  border-bottom: 1px dashed #3a1d18;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-item:last-child {
  border-bottom: none;
}

.item-icon {
  font-size: 1.1rem;
  opacity: 0.7;
}

/* 菜单项悬停效果 */
.menu-item:hover {
  background: #2b1512;
  color: #e8d9c2;
  padding-left: 24px; /* 悬停时文字微微向右移动，增加交互感 */
}

.menu-item:hover .item-icon {
  opacity: 1;
}

/* ============================================================
   下拉过渡动画 (Vue Transition)
   ============================================================ */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-15px); /* 动画：从上方稍微滑入/滑出 */
}
</style>