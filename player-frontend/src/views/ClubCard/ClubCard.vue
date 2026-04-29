<template>
  <div class="terminal-page">
    <!-- 顶部状态条 -->
    <header class="top-bar">
      <div class="system-status">
        <span class="status-dot online-pulse"></span>
        <span class="status-text">DETECTIVE SYSTEM · ONLINE</span>
      </div>
      <div class="time-display">{{ currentTime }}</div>
    </header>

    <!-- 主体 -->
    <main class="main-content">
      <!-- 左侧：完整侦探面板 -->
      <section class="left-section">
        <!-- 会员卡 -->
        <div class="card-box">
          <img src="@/assets/member-card.png" alt="侦探会员证" class="member-card" />
        </div>

        <!-- 会员等级信息 -->
        <div class="level-box">
          <div class="level-title">侦探等级</div>
          <div class="level-name">SHERLOCK · 金牌侦探</div>
          <div class="progress-bar">
            <div class="progress" style="width: 75%"></div>
          </div>
          <div class="exp-text">750/1000 EXP</div>
        </div>

        <!-- 身份信息 -->
        <div class="profile-box">
          <div class="profile-item">
            <span>ID</span>
            <span>DT-8848</span>
          </div>
          <div class="profile-item">
            <span>注册时间</span>
            <span>2025-01-01</span>
          </div>
          <div class="profile-item">
            <span>完成案件</span>
            <span>68 起</span>
          </div>
        </div>
      </section>

      <!-- 右侧：信息面板 -->
      <section class="info-panel">
        <div class="panel-block info-block">
          <h3 class="block-title">会员档案</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="label">累计节省</span>
              <span class="value highlight">¥{{ cumulativeSavings }}</span>
            </div>
            <div class="info-row">
              <span class="label">有效积分</span>
              <span class="value highlight">{{ validPoints }}</span>
            </div>
            <div class="info-row">
              <span class="label">到期时间</span>
              <span class="value">{{ expirationDate }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="cyber-btn secondary-btn" @click="goBack">返回中心</button>
            <button class="cyber-btn primary-btn" @click="renewMember">续约</button>
          </div>
        </div>

        <div class="panel-block benefits-block">
          <h3 class="block-title">侦探特权</h3>
          <div class="benefit-grid">
            <div class="benefit-item">
              <div class="benefit-icon">⚖️</div>
              <span>更多好本</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🎟️</div>
              <span>优先选位</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🔄</div>
              <button class="text-btn exchange-btn" @click="goToExchange">积分兑换</button>
            </div>
          </div>
        </div>

        <div class="panel-block tasks-block">
          <h3 class="block-title">每日任务</h3>
          <div class="task-list">
            <div class="task-item" v-for="(task, index) in taskList" :key="index">
              <div class="task-info">
                <div class="task-main">
                  <span class="task-name">{{ task.name }}</span>
                  <span class="task-progress">{{ task.progress }}</span>
                </div>
                <span class="task-reward">+{{ task.reward }}积分</span>
              </div>
              <button class="task-btn" @click="doTask(task)">{{ task.btnText }}</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script src="./member.js"></script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #080808;
}

.terminal-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #080808 0%, #0f171a 100%);
  color: #00ffd5;
  font-family: 'Consolas', 'Courier New', monospace;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 顶部 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #1a2a2a;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ffd5;
  box-shadow: 0 0 8px #00ffd5;
}

.online-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,100%{opacity:1}50%{opacity:0.4}
}

.status-text {
  font-size:14px;
  color:#888;
}

.time-display {
  font-size:14px;
  color:#00ffd5;
  text-shadow:0 0 5px #00ffd5;
}

/* 主体布局 */
.main-content {
  flex:1;
  display:flex;
  gap:30px;
  width:100%;
}

/* ========== 左侧：饱满布局（核心修改） ========== */
.left-section {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-box {
  width:100%;
  border-radius:12px;
  overflow:hidden;
  border:1px solid #1a2a2a;
  background:#0b1217;
}

.member-card {
  width:100%;
  height:auto;
  display:block;
}

/* 等级条 */
.level-box {
  background:rgba(10,15,20,0.8);
  border:1px solid #1a2a2a;
  border-radius:8px;
  padding:18px;
}

.level-title {
  font-size:14px;
  color:#888;
  margin-bottom:8px;
}

.level-name {
  font-size:16px;
  color:#fff;
  margin-bottom:12px;
  font-weight:bold;
}

.progress-bar {
  width:100%;
  height:6px;
  background:#151515;
  border-radius:3px;
  overflow:hidden;
  margin-bottom:8px;
}

.progress {
  height:100%;
  background:#00ffd5;
  box-shadow:0 0 8px #00ffd5;
  border-radius:3px;
}

.exp-text {
  font-size:12px;
  color:#666;
}

/* 身份信息 */
.profile-box {
  background:rgba(10,15,20,0.8);
  border:1px solid #1a2a2a;
  border-radius:8px;
  padding:18px;
  display:flex;
  flex-direction:column;
  gap:14px;
}

.profile-item {
  display:flex;
  justify-content:space-between;
  font-size:14px;
}

.profile-item span:first-child {
  color:#888;
}
.profile-item span:last-child {
  color:#fff;
}

/* ========== 右侧面板 ========== */
.info-panel {
  flex:1;
  display:flex;
  flex-direction:column;
  gap:20px;
  overflow-y:auto;
  padding-right:8px;
}

.panel-block {
  background:rgba(10,15,20,0.8);
  border:1px solid #1a2a2a;
  border-radius:8px;
  padding:22px;
}

.block-title {
  color:#00ffd5;
  font-size:16px;
  margin-bottom:18px;
  padding-left:10px;
  border-left:3px solid #00ffd5;
}

.info-list {
  display:flex;
  flex-direction:column;
  gap:14px;
  margin-bottom:22px;
}

.info-row {
  display:flex;
  justify-content:space-between;
  font-size:15px;
}

.label {color:#888}
.value {color:#fff}
.highlight {color:#00ffd5!important}

.action-buttons {
  display:flex;
  gap:16px;
}

.cyber-btn {
  padding:10px 24px;
  border-radius:4px;
  font-family:inherit;
  cursor:pointer;
  transition:all 0.2s;
}

.secondary-btn {
  background:transparent;
  border:1px solid #333;
  color:#888;
}

.primary-btn {
  background:rgba(0,255,213,0.1);
  border:1px solid #00ffd5;
  color:#00ffd5;
}

.secondary-btn:hover {
  border-color:#00ffd5;
  color:#00ffd5;
}
.primary-btn:hover {
  background:rgba(0,255,213,0.15);
  box-shadow:0 0 10px rgba(0,255,213,0.3);
}

/* 特权 */
.benefit-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}

.benefit-item {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  padding:16px;
  background:rgba(0,255,213,0.04);
  border:1px solid rgba(0,255,213,0.1);
  border-radius:6px;
}

.benefit-icon {
  font-size:22px;
  color:#00ffd5;
}
.benefit-item span {color:#ccc;font-size:14px}

/* 任务 */
.task-list {
  display:flex;
  flex-direction:column;
  gap:12px;
}

.task-item {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:14px;
  background:rgba(0,0,0,0.2);
  border:1px solid #1a2a2a;
  border-radius:6px;
}

.task-info {
  flex:1;
  display:flex;
  justify-content:space-between;
  margin-right:16px;
}

.task-main {
  display:flex;
  gap:16px;
}

.task-name {color:#fff}
.task-progress {color:#666}
.task-reward {color:#00ff9d}

.task-btn {
  padding:6px 16px;
  background:transparent;
  border:1px solid #00ffd5;
  color:#00ffd5;
  border-radius:4px;
  cursor:pointer;
}
.task-btn:hover {
  background:rgba(0,255,213,0.1);
}

/* 透明文字按钮 —— 无底色、无边框、仅hover发光 */
.text-btn {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 6px 10px;
  color: #00ffd5;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-btn:hover {
  color: #ffffff;
  text-shadow: 0 0 8px #00ffd5;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 滚动条 */
.info-panel::-webkit-scrollbar {width:6px}
.info-panel::-webkit-scrollbar-track {background:#111}
.info-panel::-webkit-scrollbar-thumb {background:#222}
.info-panel::-webkit-scrollbar-thumb:hover {background:#00ffd5}

/* 响应式 */
@media (max-width:1024px) {
  .main-content {flex-direction:column}
  .left-section {width:100%}
}
</style>