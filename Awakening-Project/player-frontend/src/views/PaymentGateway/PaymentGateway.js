import QrcodeVue from 'qrcode.vue';
import request from '@/utils/request';

export default {
  name: 'PaymentGateway',
  components: { QrcodeVue },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      countdown: 300,
      pollTimer: null,
      timer: null,
      statusText: 'WAITING_FOR_USER_SCAN...',
      progress: 0,
      statusClass: 'loading',
      payUrl: this.$route.query.payUrl || '',
      outTradeNo: this.$route.query.outTradeNo || '',
      orderData: {
        planName: this.$route.query.planName || '系统处理中...',
        amount: parseFloat(this.$route.query.amount) || 0,
        channel: 'alipay'
      }
    };
  },

  // 【生命周期】与 methods 平级，不能嵌套！
  mounted() {
    console.log("成员D：组件挂载，验证参数:", this.outTradeNo);
    
    // 1. 启动倒计时
    this.startTimer();
    
    // 2. 启动轮询 (只有参数完整才启动)
    if (this.payUrl && this.outTradeNo) {
      this.startPolling();
    } else {
      this.statusText = 'ERROR: INVALID_TOKEN';
      this.statusClass = 'error';
    }
  },

  // 【关键：停车器】必须在这里，才能在离开页面时杀掉所有后台请求
  beforeUnmount() {
    console.log("成员D：正在执行强制销毁，防止后端阻塞...");
    this.stopPolling();
    this.stopTimer();
  },

  methods: {
    // 倒计时逻辑
    startTimer() {
      this.stopTimer();
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.statusText = 'TOKEN_EXPIRED';
          this.statusClass = 'error';
          this.stopPolling();
          this.stopTimer();
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 轮询逻辑
    startPolling() {
      this.stopPolling();
      console.log("DEBUG: 开始发起支付状态请求...");
      
      this.pollTimer = setInterval(async () => {
        try {
          // 额外的安全检查：如果定时器已置空则不执行请求
          if (!this.pollTimer) return;

          const response = await request.get(`/api/pay/status/${this.outTradeNo}`, {
            timeout: 15000 // 增加耐性，防止沙箱波动导致的 Timeout
          });
          
          const resData = response.data ? response.data : response;

          if (resData && resData.success && resData.status === 'PAID') {
            // 【核心】支付成功，立刻原地停车
            this.stopPolling();
            this.stopTimer();

            this.statusText = 'PAYMENT_SUCCESSFUL';
            this.statusClass = 'success';
            this.progress = 100;

            setTimeout(() => {
              this.handlePaymentSuccess();
            }, 1500);
          }
        } catch (error) {
          console.warn("轮询暂无回应，等待下一次。详情:", error.message);
        }
      }, 3000);
    },

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null; 
        console.log("DEBUG: 轮询已彻底关停");
      }
    },

    handlePaymentSuccess() {
      this.$router.push('/club-card');
    },

    close() {
      this.$router.back();
    }
  }
}