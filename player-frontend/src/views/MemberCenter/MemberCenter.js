import request from '@/utils/request';

export default {
  name: 'MemberCenter',
  data() {
    return {
      selectedPlan: { id: 'plan_2', price: 88, name: '高级受托人' },
      payChannel: 'wechat',
      isProcessing: false,
      terminalLogs: [
        { type: 'info', text: 'SYSTEM: 建立安全连接...' },
        { type: 'info', text: 'SYSTEM: 提取受托人档案数据成功。' },
        { type: 'warning', text: 'WARNING: 检测到当前权限受限，建议提升至 [高级受托人] 级别。' }
      ]
    };
  },
  computed: {
    currentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
  },
  methods: {
    goBack() {
      if (this.$router) {
        this.$router.back();
      } else {
        window.history.back();
      }
    },

    selectPlan(id, price, name) {
      if (this.isProcessing) return;
      this.selectedPlan = { id, price, name };
      this.addLog(`USER: 切换升级协议 -> [${name}] (￥${price})`, 'info');
    },

    addLog(text, type = 'info') {
      this.terminalLogs.push({ text, type });
      this.$nextTick(() => {
        const container = this.$refs.logContainer;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },

    async initiatePayment() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      this.addLog('SYSTEM: 正在生成加密交易签名...', 'info');

      const token = localStorage.getItem('access_token');

      try {
        const response = await request.post('/api/pay', {
          amount: this.selectedPlan.price,
          planName: this.selectedPlan.name
        }, {
          headers: {
            Authorization: `Bearer ${token}` // 后端 Depends(oauth2_scheme) 会解析这个头
          }
        });

        // 检查后端返回结果
        const resData = response.data ? response.data : response;
        if (resData && resData.success) {
          const realPayUrl = resData.qr_code;
          this.addLog('SUCCESS: 网关握手成功，正在重定向至支付安全节点...', 'success');

          // 跳转并传递参数
          this.$router.push({
            path: '/payment-gateway',
            query: {
              planName: this.selectedPlan.name,
              amount: this.selectedPlan.price,
              payUrl: realPayUrl, 
              outTradeNo: resData.out_trade_no
            }
          });
        } else {
          const serverMsg = resData ? resData.msg : '未知网关错误';
          this.addLog('ERROR: 支付宝网关响应异常: ' + serverMsg, 'error');
        }
      } catch (error) {
        console.error("支付请求异常明细:", error);
        // 【核心修复】安全地提取错误信息，防止 Cannot read properties of undefined
        const errorMsg = error.response?.data?.detail || error.response?.data?.msg || error.message || '无法连接到支付服务器';
        this.addLog('ERROR: ' + errorMsg, 'error');
      } finally {
        this.isProcessing = false;
      }
    }
  }
}