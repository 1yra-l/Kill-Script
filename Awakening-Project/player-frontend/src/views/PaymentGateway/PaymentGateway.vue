<template>
  <div class="payment-overlay" v-if="visible">
    <div class="terminal-window payment-window">
      <div class="window-header">
        <span class="status-dot"></span>
        <span class="window-title">SECURE_PAYMENT_GATEWAY_V1.0</span>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="window-content">
        <div class="qr-section">
          <div class="qr-container">
            <div class="scanner-line"></div>
            <qrcode-vue 
              v-if="payUrl"
              :value="payUrl" 
              :size="180" 
              level="H" 
              background="transparent" 
              foreground="#00ffd5" 
            />
            <div v-else class="qr-placeholder">GENERATING_TOKEN...</div>
          </div>
          <div class="pay-timer">
            TOKEN_EXPIRES_IN: <span class="highlight">{{ countdown }}s</span>
          </div>
        </div>

        <div class="details-section">
          <h3 class="order-title">> ORDER_MANIFEST</h3>
          <div class="info-row">
            <span class="label">SUBJECT:</span>
            <span class="value">{{ orderData.planName }}</span>
          </div>
          <div class="info-row">
            <span class="label">AMOUNT:</span>
            <span class="value">￥{{ orderData.amount.toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span class="label">CHANNEL:</span>
            <span class="value">{{ orderData.channel.toUpperCase() }}</span>
          </div>
          
          <div class="status-monitor">
            <div class="monitor-text" :class="statusClass">
              {{ statusText }}
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
          <div class="sandbox-hint">[ SANDBOX_MODE ] 请使用沙盒版支付宝支付</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./PaymentGateway.js"></script>
<style scoped src="./PaymentGateway.css"></style>