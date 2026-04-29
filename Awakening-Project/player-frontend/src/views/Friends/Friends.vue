<template>
  <div class="friends-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">DECRYPTED / ENCRYPTED CONNECTION</div>
          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="输入受托人代号进行检索..." />
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="nav-btn lobby-btn" @click="goToLobby">返回大厅</button>
          <button class="nav-btn user-btn" @click="goToUserCenter">用户中心</button>
        </div>
      </div>
    </header>

    <div class="terminal-body">
      <aside class="sidebar">
        <div class="stats-panel">
          <div class="stat-item">
            <span class="label">当前链路</span>
            <span class="value online-pulse">{{ onlineCount }} 在线</span>
          </div>
          <div class="stat-item">
            <span class="label">待处理请求</span>
            <span class="value req-count" v-if="pendingRequests.length > 0">{{ pendingRequests.length }}</span>
          </div>
        </div>
        
        <nav class="nav-menu">
          <div 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-item', { active: currentTab === tab.id }]"
            @click="currentTab = tab.id"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span class="nav-text">{{ tab.name }}</span>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <section class="request-section" v-if="pendingRequests.length > 0">
          <h3 class="section-title">待处理请求 / PENDING</h3>
          <div class="request-list">
            <div v-for="req in pendingRequests" :key="req.id" class="request-card">
              <div class="req-info">
                <span class="req-name">{{ req.name }}</span>
                <span class="req-msg">{{ req.message }}</span>
              </div>
              <div class="req-actions">
                <button @click="acceptFriend(req.id)" class="btn-accept">接受</button>
                <button @click="declineFriend(req.id)" class="btn-decline">拒绝</button>
              </div>
            </div>
          </div>
        </section>

        <section class="friends-section">
          <h3 class="section-title">受托人名录 / CONTACTS</h3>
          <div class="friends-grid">
            <div v-for="friend in filteredFriends" :key="friend.id" class="friend-card">
              <div :class="['status-indicator', friend.status]"></div>
              <div class="avatar-container">
                <img :src="friend.avatar" class="avatar-img" alt="avatar" />
              </div>
              <div class="friend-detail">
                <div class="detail-header">
                  <span class="name">{{ friend.name }}</span>
                  <span class="id">#{{ friend.id }}</span>
                </div>
                <div class="case-info">
                  <span class="case-label">最近共同调查:</span>
                  <span class="case-name">{{ friend.recentCase || '无' }}</span>
                </div>
              </div>
              <div class="card-action">
                <button class="btn-trace" @click="goToChatRoom(friend.id, friend.name)">发起追踪</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script src="./friends.js"></script>
<style scoped src="./friends.css"></style>