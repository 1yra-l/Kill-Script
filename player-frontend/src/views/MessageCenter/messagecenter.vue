<template>
  <div class="message-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">ENCRYPTED MESSAGE HUB // SECURE INBOX</div>
          <h1 class="terminal-title">消息中心 / NOTIFICATION CENTER</h1>
        </div>

        <div class="action-buttons">
          <button class="nav-btn" @click="goBack">返回</button>
        </div>
      </div>
    </header>

    <div class="terminal-body">

      <aside class="category-panel">
        <div class="panel-header">
          <span class="header-label">收件箱分类 / FOLDERS</span>
        </div>

        <div class="category-list">
          <div
            v-for="cat in categories"
            :key="cat.id"
            :class="['category-item', { 'active': activeCategory === cat.id }]"
            @click="selectCategory(cat.id)"
          >
            <div class="cat-info">
              <span class="cat-icon">{{ cat.icon }}</span>
              <div class="cat-name-group">
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-en">{{ cat.en }}</span>
              </div>
            </div>
            <span class="badge" v-if="getUnreadCount(cat.id) > 0">
              {{ getUnreadCount(cat.id) }}
            </span>
          </div>
        </div>

        <!-- 新增：好友列表区域 -->
        <div v-if="activeCategory === 'friend'" class="friends-section">
          <div class="friends-header">
            <span class="friends-title">在线好友 ({{ getOnlineFriendsCount() }})</span>
            <button class="go-chat-btn" @click="goToChatroom()">进入聊天室</button>
          </div>

          <div class="friends-list">
            <div
              v-for="friend in friends"
              :key="friend.id"
              :class="['friend-item', { 'online': friend.online, 'has-unread': friend.unread > 0 }]"
              @click="goToChatroom(friend.id)"
            >
              <div class="friend-avatar">
                {{ friend.avatar }}
                <span v-if="friend.online" class="online-dot"></span>
              </div>
              <div class="friend-info">
                <div class="friend-name">{{ friend.name }}</div>
                <div class="friend-status">
                  <span v-if="friend.online" class="status-online">在线</span>
                  <span v-else class="status-offline">离线</span>
                </div>
              </div>
              <div v-if="friend.unread > 0" class="friend-unread-badge">
                {{ friend.unread }}
              </div>
              <div class="friend-action">→</div>
            </div>
          </div>
        </div>
      </aside>

      <main class="message-panel">
        <header class="message-panel-header">
          <span class="msg-count-info">
            当前分类共 {{ filteredMessages.length }} 条记录
            <span v-if="activeCategory === 'friend'" class="online-count">
              (在线: {{ getOnlineFriendsCount() }}人)
            </span>
          </span>
          <button class="mark-read-btn" @click="markAllRead">
            [ 标记全部为已读 ]
          </button>
        </header>

        <div class="scroll-container message-list-area" ref="msgListArea">

          <div v-if="filteredMessages.length === 0" class="empty-state">
            <span class="blink-cursor">_</span> NO MESSAGES FOUND...
          </div>

          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            :class="[
              'message-card',
              `type-${msg.type}`,
              { 'unread': !msg.isRead, 'is-expanded': expandedMsgId === msg.id }
            ]"
          >
            <div class="msg-summary" @click="toggleMessage(msg.id)">
              <div class="msg-main-info">
                <span class="msg-title">
                  {{ !msg.isRead ? '🔴 ' : '' }}{{ msg.title }}
                </span>
                <div class="msg-meta">
                  <span class="msg-sender">FROM: {{ msg.sender }}</span>
                  <span class="msg-date">TIME: {{ msg.date }}</span>
                  <!-- 新增：好友消息显示头像和状态 -->
                  <span v-if="msg.type === 'friend'" class="friend-meta">
                    <span class="friend-avatar-small">{{ getFriendInfo(msg.sender).avatar }}</span>
                    <span :class="['friend-status-small', getFriendInfo(msg.sender).online ? 'online' : 'offline']">
                      {{ getFriendInfo(msg.sender).online ? '在线' : '离线' }}
                    </span>
                  </span>
                </div>
              </div>
              <div class="expand-icon">▼</div>
            </div>

            <div class="msg-detail" v-if="expandedMsgId === msg.id">
              <div class="msg-body">{{ msg.content }}</div>
              <div class="msg-actions">
                <!-- 好友消息增加跳转聊天室按钮 -->
                <button v-if="msg.type === 'friend'" class="nav-btn" @click.stop="goToChatroom(msg.friendId)">
                  回复消息
                </button>
                <button v-if="msg.type === 'invite'" class="nav-btn">接受邀请</button>
                <button class="nav-btn danger-btn" @click.stop="deleteMessage(msg.id)">删除记录</button>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script src="./messagecenter.js"></script>
<style scoped src="./messagecenter.css"></style>