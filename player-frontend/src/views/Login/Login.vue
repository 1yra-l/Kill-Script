<template>
  <div class="login-container">
    <div class="login-box dark-parchment">
      <div class="confidential-stamp">CONFIDENTIAL</div>

      <header class="login-header">
        <h2 class="login-title">身份录入系统</h2>
        <p class="login-subtitle">请输入您的受托人凭证以开启卷宗</p>
      </header>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>受托人代号 (Name)</label>
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入您的姓名" 
            class="dark-input"
            required 
          />
        </div>

        <div class="tab-menu">
          <span 
            :class="{ active: loginType === 'email' }" 
            @click="loginType = 'email'"
          >邮箱录入</span>
          <span class="v-line">|</span>
          <span 
            :class="{ active: loginType === 'phone' }" 
            @click="loginType = 'phone'"
          >手机号</span>
        </div>

        <div class="form-group">
          <label>{{ loginType === 'email' ? '加密邮箱' : '联系电话' }}</label>
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
        </div>

        <div class="form-group">
          <label>再次核验口令 (Confirm)</label>
          <input 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="请再次输入密码" 
            class="dark-input"
            required 
          />
        </div>

        <div class="login-actions">
          <button type="submit" class="submit-btn gold-btn">确认录入</button>
        </div>
      </form>

      <footer class="login-footer">
        <p>已有通行证？
        <span class="text-red link" @click="goToLogin">立即前往登录 >></span>
      </p>
      </footer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>