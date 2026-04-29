<template>
  <div class="terminal-page">
    <!-- 顶部状态条 -->
    <header class="top-bar">
      <div class="system-status">
        <span class="status-dot online-pulse"></span>
        <span class="status-text">DETECTIVE MALL · ONLINE</span>
      </div>
      <div class="time-display">{{ currentTime }}</div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧：积分信息面板 -->
      <section class="left-section">
        <!-- 积分卡片 -->
        <div class="points-card">
          <div class="points-label">当前积分</div>
          <div class="points-number">{{ points }}</div>
          <div class="points-desc">可用于兑换侦探道具与福利</div>
        </div>

        <!-- 兑换说明 -->
        <div class="info-box">
          <div class="box-title">兑换规则</div>
          <div class="rule-list">
            <div class="rule-item">• 积分每日任务自动发放</div>
            <div class="rule-item">• 兑换后24小时内到账</div>
            <div class="rule-item">• 虚拟物品不支持退换</div>
          </div>
        </div>

        <!-- 快速返回 -->
        <div class="back-box">
          <button class="back-btn" @click="goBack">← 返回用户中心</button>
        </div>
      </section>

      <!-- 右侧：兑换商品列表 -->
      <section class="goods-section">
        <div class="panel-header">
          <h2 class="panel-title">侦探装备兑换</h2>
          <div class="tab-list">
            <button
              class="tab-btn"
              :class="{ active: currentTab == item }"
              v-for="item in tabs"
              :key="item"
              @click="currentTab = item"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div class="goods-grid">
          <div class="goods-card" v-for="item in showList" :key="item.id">
            <div class="goods-img">{{ item.icon }}</div>
            <div class="goods-info">
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-desc">{{ item.desc }}</div>
            </div>
            <div class="goods-price">{{ item.points }} 积分</div>
            <button class="exchange-btn" @click="doExchange(item)">
              立即兑换
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script src="./exchange.js"></script>

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

/* 主容器 */
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

/* 左侧面板 */
.left-section {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.points-card {
  background: rgba(10,15,20,0.8);
  border: 1px solid #1a2a2a;
  border-radius: 8px;
  padding: 28px 20px;
  text-align: center;
}
.points-label {
  font-size:14px;
  color:#888;
  margin-bottom:8px;
}
.points-number {
  font-size:36px;
  color:#fff;
  font-weight:bold;
  text-shadow:0 0 12px #00ffd5;
  margin-bottom:10px;
}
.points-desc {
  font-size:12px;
  color:#666;
}

.info-box {
  background: rgba(10,15,20,0.8);
  border: 1px solid #1a2a2a;
  border-radius: 8px;
  padding: 18px;
}
.box-title {
  font-size:14px;
  color:#fff;
  margin-bottom:12px;
}
.rule-list {
  display:flex;
  flex-direction:column;
  gap:8px;
}
.rule-item {
  font-size:13px;
  color:#888;
}

.back-box {
  margin-top:10px;
}
.back-btn {
  width:100%;
  padding:12px;
  background:transparent;
  border:1px solid #00ffd5;
  color:#00ffd5;
  border-radius:6px;
  cursor:pointer;
  font-family:inherit;
  transition:all 0.2s;
}
.back-btn:hover {
  background:rgba(0,255,213,0.1);
  box-shadow:0 0 10px rgba(0,255,213,0.3);
}

/* 右侧商品区 */
.goods-section {
  flex:1;
  display:flex;
  flex-direction:column;
  gap:20px;
  overflow-y:auto;
  padding-right:8px;
}

.panel-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.panel-title {
  font-size:18px;
  color:#00ffd5;
  text-shadow:0 0 6px #00ffd5;
}
.tab-list {
  display:flex;
  gap:12px;
}
.tab-btn {
  padding:6px 14px;
  background:transparent;
  border:1px solid #333;
  color:#888;
  border-radius:4px;
  cursor:pointer;
  font-family:inherit;
}
.tab-btn.active {
  border-color:#00ffd5;
  color:#00ffd5;
  background:rgba(0,255,213,0.08);
}

/* 商品网格 */
.goods-grid {
  display:grid;
  grid-template-columns: repeat(3,1fr);
  gap:20px;
}
.goods-card {
  background:rgba(10,15,20,0.8);
  border:1px solid #1a2a2a;
  border-radius:8px;
  padding:20px;
  display:flex;
  flex-direction:column;
  gap:12px;
  transition:all 0.2s;
}
.goods-card:hover {
  border-color:rgba(0,255,213,0.3);
  transform:translateY(-4px);
  box-shadow:0 0 15px rgba(0,255,213,0.1);
}
.goods-img {
  width:100%;
  height:80px;
  background:rgba(0,255,213,0.05);
  border:1px solid rgba(0,255,213,0.2);
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:32px;
}
.goods-info {
  flex:1;
}
.goods-name {
  font-size:15px;
  color:#fff;
  margin-bottom:6px;
}
.goods-desc {
  font-size:12px;
  color:#888;
  line-height:1.4;
}
.goods-price {
  font-size:14px;
  color:#00ffd5;
  font-weight:bold;
}
.exchange-btn {
  padding:10px;
  background:rgba(0,255,213,0.1);
  border:1px solid #00ffd5;
  color:#00ffd5;
  border-radius:6px;
  cursor:pointer;
  font-family:inherit;
  transition:all 0.2s;
}
.exchange-btn:hover {
  background:rgba(0,255,213,0.15);
  box-shadow:0 0 10px rgba(0,255,213,0.3);
}

/* 滚动条 */
.goods-section::-webkit-scrollbar {width:6px}
.goods-section::-webkit-scrollbar-track {background:#111}
.goods-section::-webkit-scrollbar-thumb {background:#222}
.goods-section::-webkit-scrollbar-thumb:hover {background:#00ffd5}

/* 响应式 */
@media (max-width:1200px) {
  .goods-grid {grid-template-columns: repeat(2,1fr)}
}
@media (max-width:1024px) {
  .main-content {flex-direction:column}
  .left-section {width:100%}
}
</style>