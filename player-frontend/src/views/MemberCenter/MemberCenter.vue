<template>
  <div class="user-center vip-container">
    <header class="terminal-header">
      <div class="system-header">
        <div class="header-left">
          <div class="system-tag">NEURAL LINK: ESTABLISHED / UPGRADE_PROTOCOL_ACTIVE</div>
        </div>
        <div class="action-buttons">
          <button class="nav-btn abort-btn" @click="goBack">中止升级 [ESC]</button>
        </div>
      </div>
    </header>

    <main class="dashboard-container vip-dashboard">
      <div class="personal-header">
        <div class="title-wrapper">
          <h1 class="personal-title">系统权限升级</h1>
          <span class="path">/SYSTEM/VIP_ACCESS</span>
        </div>
        <div class="user-meta">
          <span class="user-id">当前状态: 基础受托人</span>
          <span class="last-login">网关节点: SECURE_PAY</span>
        </div>
      </div>

      <div class="vip-content">
        <div class="vip-plans-section">
          <h3 class="section-subtitle">> SELECT_ACCESS_LEVEL</h3>
          <div class="plans-grid">
            <div
              class="section-card vip-card"
              :class="{ active: selectedPlan.id === 'plan_1' }"
              @click="selectPlan('plan_1', 30, '初级探员')"
            >
              <div class="plan-badge">MONTHLY</div>
              <h3>初级探员</h3>
              <p class="eng-title">Basic Access</p>
              <div class="price">￥<span class="num">30</span>/月</div>
              <ul class="perks">
                <li>[+] 专属探员动态头像框</li>
                <li>[+] 剧本结算积分 +10%</li>
                <li>[+] 每月 2 次 AI 提示豁免</li>
              </ul>
            </div>

            <div
              class="section-card vip-card pro-card"
              :class="{ active: selectedPlan.id === 'plan_2' }"
              @click="selectPlan('plan_2', 88, '高级受托人')"
            >
              <div class="plan-badge pro-badge">RECOMMENDED</div>
              <h3>高级受托人</h3>
              <p class="eng-title">Pro Access</p>
              <div class="price">￥<span class="num">88</span>/季</div>
              <ul class="perks">
                <li>[+] 包含初级所有特权</li>
                <li>[+] 剧本结算积分 +30%</li>
                <li>[+] 解锁全部【加密机密文件】</li>
                <li>[+] 专属金色悬浮弹幕</li>
              </ul>
            </div>

            <div
              class="section-card vip-card"
              :class="{ active: selectedPlan.id === 'plan_3' }"
              @click="selectPlan('plan_3', 298, '最高管理权限')"
            >
              <div class="plan-badge">ANNUAL</div>
              <h3>最高管理权限</h3>
              <p class="eng-title">Ultimate Access</p>
              <div class="price">￥<span class="num">298</span>/年</div>
              <ul class="perks">
                <li>[+] 无限次 AI 线索分析</li>
                <li>[+] 优先体验内测版剧本</li>
                <li>[+] 实体周边档案解密包</li>
              </ul>
            </div>
          </div>

          <h3 class="section-subtitle mt-20">> ESTABLISH_PAYMENT_CHANNEL</h3>
          <div class="payment-methods">
            <div
              class="pay-method"
              :class="{ active: payChannel === 'wechat' }"
              @click="payChannel = 'wechat'"
            >
              <span class="icon">W</span> 微信支付 (WeChat)
            </div>
            <div
              class="pay-method"
              :class="{ active: payChannel === 'alipay' }"
              @click="payChannel = 'alipay'"
            >
              <span class="icon">A</span> 支付宝 (AliPay)
            </div>
          </div>
        </div>

        <aside class="terminal-sidebar">
          <div class="monitor-panel console-panel">
            <h4 class="panel-title">升级日志监控</h4>
            <div class="terminal-logs scrollbar-custom" ref="logContainer">
              <p v-for="(log, index) in terminalLogs" :key="index" :class="log.type">
                <span class="time">[{{ currentTime }}]</span> {{ log.text }}
              </p>
              <p v-if="isProcessing" class="blinking-cursor">_</p>
            </div>
          </div>

          <div class="checkout-panel">
            <div class="total-row">
              <span>应付金额 (TOTAL):</span>
              <span class="total-price">￥{{ selectedPlan.price.toFixed(2) }}</span>
            </div>
            <button class="nav-btn upgrade-btn" :disabled="isProcessing" @click="initiatePayment">
              {{ isProcessing ? 'PROCESSING...' : 'INITIATE PROTOCOL (确认支付)' }}
            </button>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script src="./MemberCenter.js"></script>
<style scoped src="./MemberCenter.css"></style>