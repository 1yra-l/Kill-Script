<template>
  <div class="ai-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="ai-profile">
            <div class="ai-avatar">🕵️‍♂️</div>
            <div class="ai-info">
              <div class="ai-name">{{ aiName }}</div>
              <div class="ai-status">在线 · 随时为您解读线索</div>
            </div>
          </div>

          <div class="system-tag">NEURAL LINK: ESTABLISHED / SECURE_MODE</div>
          <div class="connection-info">
            <span class="ping">PING: 24ms</span>
            <span class="encryption">ENC: AES-256-GCM</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="nav-btn" @click="goToLobby">个人中心</button>
          <button class="nav-btn abort-btn" @click="clearLogs">清空日志</button>
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
            <span class="label">神经元负载</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: cpuLoad + '%' }"></div>
            </div>
          </div>
        </div>
        
        <nav class="protocol-menu">
          <h4 class="panel-title">快速通讯协议</h4>
          <div 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['nav-item', { active: currentCat === cat.id }]"
            @click="currentCat = cat.id"
          >
            <span class="nav-text">/{{ cat.id.toUpperCase() }}</span>
          </div>
        </nav>
      </aside>

      <main class="chat-container">
        <div class="chat-logs" ref="logContainer">
          <!-- 上方快捷选项 - 始终显示（解决“并未显示出来”问题） -->
          <div class="onboarding">
            <p class="onboarding-title">🔥 上方快捷选项</p>
            <div class="quick-options">
              <button 
                v-for="option in quickOptions" 
                :key="option.id"
                class="quick-btn"
                @click="sendQuickOption(option)"
              >
                {{ option.label }}
              </button>
            </div>

            <p class="onboarding-subtitle">或直接告诉我您想玩什么类型：</p>
            <div class="category-chips">
              <button class="chip-btn" @click="quickRecommend('本格推理')">本格推理</button>
              <button class="chip-btn" @click="quickRecommend('情感沉浸')">情感沉浸</button>
              <button class="chip-btn" @click="quickRecommend('恐怖惊悚')">恐怖惊悚</button>
              <button class="chip-btn" @click="quickRecommend('欢乐撕逼')">欢乐撕逼</button>
            </div>
          </div>

          <!-- 对话记录 -->
          <div v-for="(log, index) in logs" :key="index" class="log-wrapper">
            <!-- 普通文字消息 -->
            <div v-if="!log.type || log.type === 'text'" :class="['log-entry', log.role]">
              <div class="entry-meta">
                <span class="role-tag">{{ log.role === 'user' ? 'AGENT' : aiName }}</span>
                <span class="timestamp">{{ log.time }}</span>
              </div>
              <div class="bubble-wrapper">
                <div class="entry-bubble">
                  <div class="entry-content">
                    {{ log.displayedText }}<span class="cursor" v-if="log.isTyping">_</span>
                  </div>
                </div>
                <span v-if="log.role === 'user'" class="message-status">已发送</span>
              </div>
            </div>

            <!-- 图片消息 -->
            <div v-else-if="log.type === 'image'" :class="['log-entry', log.role]">
              <div class="entry-meta">
                <span class="role-tag">{{ log.role === 'user' ? 'AGENT' : aiName }}</span>
                <span class="timestamp">{{ log.time }}</span>
              </div>
              <div class="bubble-wrapper">
                <div class="entry-bubble image-bubble">
                  <img :src="log.src" class="chat-image" alt="用户发送的图片">
                </div>
                <span v-if="log.role === 'user'" class="message-status">已发送</span>
              </div>
            </div>

            <!-- 结构化卡片消息 -->
            <div v-else-if="log.type === 'card'" class="log-entry ai">
              <div class="entry-meta">
                <span class="role-tag">{{ aiName }}</span>
                <span class="timestamp">{{ log.time }}</span>
              </div>
              <div class="card-container">
                <div v-for="script in log.scripts" :key="script.id" class="script-card">
                  <div class="card-poster">🎭</div>
                  <div class="card-content">
                    <h4 class="card-title">{{ script.title }}</h4>
                    <div class="card-meta">
                      <div class="rating">
                        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.floor(script.rating) }">★</span>
                        <span class="rating-number">{{ script.rating }}</span>
                      </div>
                      <div class="difficulty">难度 <span class="star filled">★</span> {{ script.difficulty }}</div>
                      <div class="player-count">{{ script.playerCount }}</div>
                    </div>
                    <p class="card-desc">{{ script.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 正在输入提示 -->
          <div v-if="hasTypingAI" class="typing-indicator">
            <div class="typing-bubble">
              <span class="ai-name-small">{{ aiName }}</span> 正在翻阅卷宗...
              <span class="cursor">_</span>
            </div>
          </div>
        </div>

        <!-- 加大后的输入框 + 支持图片发送 -->
        <div class="command-input-area enlarged">
          <div class="input-bar">
            <!-- 图片上传按钮 -->
            <button class="image-upload-btn" @click="triggerImageUpload" title="发送图片">
              📎
            </button>
            
            <!-- 多行输入框（更大） -->
            <textarea 
              v-model="userInput" 
              @keyup.enter.exact="handleCommand"
              placeholder="ID_User@Terminal:~$ 输入消息...（支持回车发送）"
              ref="commandInput"
              rows="3"
              class="enlarged-input"
            ></textarea>

            <!-- 发送按钮 -->
            <button class="send-btn" @click="handleCommand">
              发送
            </button>
          </div>

          <!-- 隐藏的文件选择器 -->
          <input 
            type="file" 
            ref="imageInput" 
            accept="image/*" 
            @change="handleImageUpload"
            style="display: none;"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script src="./ServiceCenter.js"></script>
<style scoped src="./ServiceCenter.css"></style>
