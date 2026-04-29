<template>
  <div class="auth-terminal dark-theme">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">ENCRYPTED CONNECTION // IDENTITY VERIFICATION SYSTEM</div>
        </div>
        <div class="action-buttons">
          <button class="nav-btn" @click="goToLobby">用户中心</button>
        </div>
      </div>
    </header>

    <div class="terminal-body auth-body">
      <main class="auth-card">
        <div class="card-header">
          <h2 class="auth-title">特工档案实名注册 / REAL-NAME AUTH</h2>
          <p class="auth-subtitle">《联邦调查安全法》要求所有系统接入者必须进行实名身份登记。未满18周岁者禁止访问机密档案。</p>
        </div>

        <div class="form-container">
          <div class="form-group">
            <label class="form-label">真实姓名 / REAL NAME</label>
            <input
              type="text"
              v-model="realName"
              placeholder="请输入您的真实姓名"
              class="cyber-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">序列识别码 / ID NUMBER</label>
            <input
              type="text"
              v-model="idNumber"
              @input="idNumber = $event.target.value.replace(/[^0-9xX]/g, '').toUpperCase()"
              maxlength="18"
              placeholder="请输入18位身份识别序列号"
              class="cyber-input"
            />
            <span class="input-hint">格式要求: 18位法定序列号，尾号支持 X</span>
          </div>

          <div class="action-area">
            <button class="nav-btn verify-btn" @click="verifyIdentity">
              启动系统验证 / INITIATE
            </button>
          </div>

          <div v-if="sysMsg" :class="['system-message', msgType]">
            <span class="msg-icon">{{ msgType === 'error' ? '[!]' : '[✓]' }}</span>
            <span class="msg-text">{{ sysMsg }}</span>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script src="./authentication.js"></script>
<style scoped src="./authentication.css"></style>