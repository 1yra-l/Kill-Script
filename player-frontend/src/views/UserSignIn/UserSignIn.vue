<template>
  <div class="login-container">
    <div class="login-box dark-parchment">
      <div class="confidential-stamp">AUTHORIZED</div>

      <header class="login-header">
        <h2 class="login-title">身份验证系统</h2>
        <p class="login-subtitle">请输入您的凭证以调阅机密卷宗</p>
      </header>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="tab-menu">
          <span
            :class="{ active: loginType === 'email' }"
            @click="loginType = 'email'"
          >邮箱登入</span>
          <span class="v-line">|</span>
          <span
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'"
          >手机号</span>
        </div>

        <div class="form-group">
          <label>{{ loginType === 'email' ? '加密邮箱 (Email)' : '联系电话 (Phone)' }}</label>
          <input
            v-if="loginType === 'email'"
            type="email"
            v-model="formData.email"
            placeholder="example@mail.com"
            class="dark-input"
            required
          />
          <input
            v-else
            type="tel"
            v-model="formData.phone"
            placeholder="130****0000"
            class="dark-input"
            pattern="^1[3-9]\d{9}$"
            required
          />
        </div>

        <div class="form-group">
          <label>安全口令 (Password)</label>
          <input
            type="password"
            v-model="formData.password"
            placeholder="请输入密码"
            class="dark-input"
            required
          />
          <div class="forgot-password-link">
            <span class="text-red link" @click="goToResetPassword">忘记安全口令？</span>
          </div>
        </div>

        <div class="login-actions">
          <button type="submit" class="submit-btn gold-btn">验证登入</button>
        </div>
      </form>

      <footer class="login-footer">
        <p>尚未取得通行证？<span class="text-red link" @click="goToRegister">立即申请录入 >></span></p>
      </footer>
    </div>
  </div>
</template>

<script>
import UserSignInLogic from './UserSignIn.js'
export default UserSignInLogic
</script>

<style scoped>
@import './UserSignIn.css';
</style>