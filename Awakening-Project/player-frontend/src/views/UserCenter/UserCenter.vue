<template>
  <div class="user-center">
    <header class="terminal-header">
      <div class="system-header">
        
        <div class="header-left clickable-area" @click="goToProfile" title="点击查看/修改个人资料">
          <div class="ai-profile">
            <div class="ai-avatar">
              <img 
                v-if="isImageUrl(userInfo.avatar)" 
                :src="userInfo.avatar" 
                class="avatar-render" 
              />
              <span v-else>{{ userInfo.avatar }}</span>
            </div>
            <div class="ai-info">
              <div class="ai-name">{{ userInfo.name }}</div>
              <div class="ai-status">个性签名：{{ userInfo.role }}</div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="nav-btn" @click="goBack">返回大厅</button>
          <button class="nav-btn abort-btn" @click="safeExit">安全退出</button>
        </div>
      </div>
    </header>

    <div class="terminal-body">
      <aside class="sidebar">
        <div class="monitor-panel">
          <h4 class="panel-title">系统状态</h4>
          <div class="stat-item">
            <span class="label">AI 核心</span>
            <span class="value online-pulse">ACTIVE</span>
          </div>
          <div class="stat-item">
            <span class="label">神元负载</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: cpuLoad + '%' }"></div>
            </div>
          </div>
        </div>
        
        <nav class="protocol-menu">
          <h4 class="panel-title">快速通讯设计</h4>
          <div 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['nav-item', { active: currentCat === cat.id }]"
            @click="currentCat = cat.id"
          >
            <span class="nav-text">/{{ cat.id.toUpperCase() }}</span>
          </div>

          <div
            class="nav-item recharge-btn clickable"
            @click="goToMemberCenter"
          >
            <span class="nav-text">★ 充值中心</span>
          </div>
          </nav>
      </aside>

      <main class="dashboard-container">
        <div class="personal-header">
          <div class="title-wrapper">
            <h1 class="personal-title">个人中心</h1>
            <span class="path"></span>
          </div>
          <div class="user-meta">
            <span class="user-id">用户: {{ userInfo.name }}</span>
            <span class="last-login">最后登陆: [13:MH ELOG]</span>
          </div>
        </div>

        <div class="cards-grid">
          <div class="section-card" @click="navigateTo('profile')">
            <img src="./assets/authentication.png" alt="个人资料" class="card-icon">
            <div class="card-body">
              <h3>个人资料</h3>
              <p class="eng-title">Personal Profile</p>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('friends')">
            <img src="./assets/friends.png" alt="受托人名录" class="card-icon">
            <div class="card-body">
              <h3>受托人名录</h3>
              <p class="eng-title">Friends/Trustees</p>
            </div>
          </div>

          <div class="section-card message-card" @click="navigateTo('message-center')">
            <img src="./assets/message.png" alt="消息中心" class="card-icon">
            <div class="card-body">
              <h3>消息中心</h3>
              <p class="eng-title">Message Center</p>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('achievements')">
            <img src="./assets/achievement.png" alt="游戏成就" class="card-icon">
            <div class="card-body">
              <h3>游戏成就</h3>
              <p class="eng-title">Game Achievements</p>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('service-center')">
            <img src="./assets/AI.png" alt="AI客服中心" class="card-icon">
            <div class="card-body">
              <h3>AI客服中心</h3>
              <p class="eng-title">AI Service Center</p>
              <button class="inner-btn" @click.stop="manageTrustee">进入</button>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('evaluate')">
            <img src="./assets/evaluate.png" alt="评价与反馈" class="card-icon">
            <div class="card-body">
              <h3>评价与反馈</h3>
              <p class="eng-title">Evaluate</p>
              <button class="inner-btn" @click.stop="goToFeedback">进行评价</button>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('settlement')">
            <img src="./assets/settlement.png" alt="结案陈词" class="card-icon">
            <div class="card-body">
              <h3>结案陈词</h3>
              <p class="eng-title">Settlement</p>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('exchange')">
            <img src="./assets/gift.png" alt="积分兑换" class="card-icon">
            <div class="card-body">
              <h3>积分兑换</h3>
             <p class="eng-title">Points Exchange</p>
            </div>
          </div>

          <div class="section-card" @click="navigateTo('club-card')">
            <img src="./assets/crown.png" alt="会员中心" class="card-icon">
            <div class="card-body">
              <h3>会员中心</h3>
             <p class="eng-title">Club Center</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>
<style scoped>
.recharge-btn {
  margin-top: 15px;
  border: 1px dashed rgba(0, 255, 213, 0.3);
  background: rgba(0, 255, 213, 0.05);
}
.recharge-btn:hover {
  background: rgba(0, 255, 213, 0.2);
  border-style: solid;
}
</style>