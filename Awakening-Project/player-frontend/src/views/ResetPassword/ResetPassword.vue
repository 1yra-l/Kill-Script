<template>
  <div class="reset-password-container">
    <NavBar />

    <main class="content-wrapper">
      <header class="archive-header">
        <h1 class="archive-title">
          <span class="file-icon">🔑</span>
          权限重置：安全密钥修改
        </h1>
        <div class="archive-meta">
          <span>操作类型: 凭据更新</span>
          <span class="confidential-tag">优先级: HIGH</span>
        </div>
        <div class="ink-divider"></div>
      </header>

      <section class="form-section dark-parchment">
        <div class="confidential-stamp">RESTRICTED</div>
        
        <div class="info-form">
          <h3 class="section-subtitle">【 验证受托人身份 】</h3>
          
          <div class="form-group">
            <label>当前密钥 (Old Password):</label>
            <input
              type="password"
              v-model="passwordForm.oldPassword"
              class="dark-input"
              placeholder="请输入当前使用的密钥..."
            />
          </div>

          <div class="ink-divider-small"></div>

          <div class="form-group">
            <label>新密钥 (New Password):</label>
            <input
              type="password"
              v-model="passwordForm.newPassword"
              class="dark-input"
              placeholder="建议包含字母与数字组合"
            />
          </div>

          <div class="form-group">
            <label>确认新密钥 (Confirm New Password):</label>
            <input
              type="password"
              v-model="passwordForm.confirmPassword"
              class="dark-input"
              placeholder="请再次输入新密钥"
            />
          </div>
        </div>

        <div class="footer-action">
          <div class="signature-btn dark-btn" @click="handleReset">
            <span class="stamp-icon">✍️</span>
            <span>签发新密钥</span>
          </div>
          <button class="back-link" @click="$router.back()">取消操作，返回档案室</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>