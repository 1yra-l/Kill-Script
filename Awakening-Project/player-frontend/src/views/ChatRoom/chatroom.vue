<template>
  <div class="chat-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">ENCRYPTED COMM-LINK // SECURE CHANNEL 104.5 MHz</div>
          <h1 class="terminal-title">实时通讯控制台 / TERMINAL</h1>
        </div>

        <div class="action-buttons">
          <button class="nav-btn" @click="goToFriends">返回受托人名录</button>
        </div>
      </div>
    </header>

    <div class="terminal-body">

      <aside class="sidebar contact-panel">
        <div class="panel-header">
          <span class="header-label">活跃链路 / ACTIVE LINKS</span>
        </div>

        <div class="scroll-container contact-list">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            :class="['contact-card', { 'active': activeContactId === contact.id }]"
            @click="selectContact(contact.id)"
          >
            <div :class="['status-indicator', contact.online ? 'online' : 'offline']"></div>

            <div class="contact-avatar">{{ contact.avatar }}</div>
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
              <div class="contact-status">
                {{ contact.online ? 'SIGNAL STABLE' : 'CONNECTION LOST' }}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="chat-panel">
        <header class="chat-panel-header">
          <div class="target-info" v-if="activeContact">
            <span class="prompt-arrow">>></span>
            <span class="target-label">TARGET:</span>
            <span class="target-name">{{ activeContact.name }}</span>
          </div>
          <span class="encryption-status" v-if="activeContact">AES-256 SECURED</span>
        </header>

        <div class="scroll-container message-area" ref="messageArea">
          <div v-if="!activeContact" class="no-contact-selected">
            <span class="blink-cursor">_</span> WAITING FOR CONNECTION...
          </div>

          <template v-else>
            <div
              v-for="msg in currentMessages"
              :key="msg.id"
              :class="['message-wrapper', msg.isSelf ? 'msg-self' : 'msg-other']"
            >
              <div class="msg-content">
                <div class="msg-header">
                  <span class="msg-time">[{{ msg.time }}]</span>
                  <span class="msg-sender">{{ msg.isSelf ? 'SYS_USER' : activeContact.name }}</span>
                </div>
                <div class="msg-bubble">{{ msg.text }}</div>
              </div>
            </div>
          </template>
        </div>

        <div class="chat-input-area" v-if="activeContact">
          <span class="prompt-arrow">></span>
          <input
            type="text"
            v-model="newMessage"
            class="cyber-input"
            placeholder="输入指令或通讯内容... (按Enter发送)"
            @keyup.enter="sendMessage"
          />
          <button class="nav-btn send-btn" @click="sendMessage">SEND</button>
        </div>
      </main>

    </div>
  </div>
</template>

<script src="./chatroom.js"></script>
<style scoped src="./chatroom.css"></style>