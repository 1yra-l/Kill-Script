<template>
  <div class="achievements-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">HONORS & RECORDS // CLASSIFIED CACHE</div>
          <h1 class="terminal-title">荣誉档案库 / MEDALS</h1>
        </div>
        <div class="action-buttons">
          <button class="nav-btn" @click="goToLobby">返回用户中心</button>
        </div>
      </div>
    </header>

    <div class="terminal-body">
      <div class="panel-header">
        <span class="header-label">解密进度 / DECRYPTION PROGRESS</span>
        <div class="progress-bar-container">
          <span class="progress-text">DATA UNLOCKED: {{ stats.unlocked }} / {{ stats.total }}</span>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: (stats.unlocked / stats.total) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="scroll-container medals-scroll-area">
        <div class="medals-grid">

          <div
            v-for="medal in medals"
            :key="medal.id"
            :class="['medal-card', { 'locked': !medal.unlocked }]"
          >
            <!-- 翻转区域，独立撑高 -->
            <div class="medal-flipper">
              <div class="flipper">

                <div class="card-face card-front front">
                  <img :src="medal.frontImg" class="medal-img" alt="Medal Front" />
                  <div class="lock-overlay" v-if="!medal.unlocked">
                    <span class="lock-icon">🔒</span>
                    <span class="lock-text">ENCRYPTED</span>
                  </div>
                </div>

                <div class="card-face card-back back">
                  <img :src="medal.backImg" class="medal-img" alt="Medal Back" />
                  <div class="back-data-overlay">
                    <div class="back-title">[{{ medal.id }}] {{ medal.name }}</div>
                    <div class="back-desc">{{ medal.description }}</div>
                    <div class="back-comment">{{ medal.comment }}</div>
                  </div>
                </div>

              </div>
            </div>

            <!-- 名称在翻转区下方 -->
            <div class="medal-name-label">{{ medal.name }}</div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script src="./achievements.js"></script>
<style scoped src="./achievements.css"></style>