export default {
  name: 'ServiceCenter',
  data() {
    return {
      userInput: '',
      cpuLoad: 28,
      currentCat: 'general',
      logs: [],
      aiName: '档案馆长',
      quickOptions: [
        { id: 1, label: '🎭 剧本杀查询', key: 'scriptQuery' },
        { id: 2, label: '🔑 密码修改', key: 'passwordReset' },
        { id: 3, label: '📜 我的受托人档案', key: 'myArchive' }
      ],
      sampleScripts: [
        {
          id: 1,
          title: '歌剧院魅影',
          rating: 4.7,
          difficulty: 4.5,
          playerCount: '3-5人',
          desc: '十九世纪末，巴黎。辉煌的歌剧院深处隐藏着一个关于爱与死亡的秘密。'
        },
        {
          id: 2,
          title: '午夜凶铃',
          rating: 4.9,
          difficulty: 3.8,
          playerCount: '4-6人',
          desc: '那场火灾后的唯一幸存者。她总是随身带着一只坏掉的怀表，针对的是那个血色的午夜。'
        }
      ],
      categories: [
        { id: 'general', name: '常规通讯' },
        { id: 'status', name: '系统状态' },
        { id: 'security', name: '安全中心' }
      ],
      commands: {
        '/HELP': '可用协议: /STATUS (系统节点), /INFO (受托人信息), /KEY (密钥更新), /RECOMMEND (剧本推荐)',
        '/STATUS': '所有核心节点运行正常。当前加密强度：HIGH。',
        '/INFO': '受托人 ID: 800201 | 权限等级: LEVEL 2 | 归属地: 未知',
        '/PASSWORD': '已为您发起密码重置流程，请查收邮箱验证码。',
        '/RECOMMEND': '为您推荐以下高分剧本（点击上方快捷选项可查看更多）'
      }
    }
  },
  computed: {
    hasTypingAI() {
      return this.logs.some(log => log.isTyping && log.role === 'ai')
    }
  },
  mounted() {
    this.simulateSystemLoad();
    this.respondAsAI("等待指令中... 您也可以点击上方快捷选项快速咨询。");
  },
  methods: {
    handleCommand() {
      const input = this.userInput.trim();
      if (!input) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.logs.push({
        role: 'user',
        text: input,
        displayedText: input,
        time,
        isTyping: false,
        type: 'text'
      });

      this.userInput = '';
      this.scrollToBottom();
      this.respondAsAI(input);
    },

    // 发送快捷选项
    sendQuickOption(option) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.logs.push({
        role: 'user',
        text: option.label,
        displayedText: option.label,
        time,
        isTyping: false,
        type: 'text'
      });
      this.scrollToBottom();

      setTimeout(() => {
        if (option.key === 'scriptQuery') this.showScriptRecommendation();
        else if (option.key === 'passwordReset') this.respondAsAI('/PASSWORD');
        else if (option.key === 'myArchive') this.respondAsAI('/INFO');
      }, 600);
    },

    // 选本快捷分类
    quickRecommend(category) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.logs.push({
        role: 'user',
        text: `我想玩「${category}」`,
        displayedText: `我想玩「${category}」`,
        time,
        isTyping: false,
        type: 'text'
      });
      this.scrollToBottom();

      setTimeout(() => {
        this.showScriptRecommendation();
      }, 700);
    },

    // 显示推荐卡片
    showScriptRecommendation() {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.logs.push({
        role: 'ai',
        type: 'card',
        scripts: this.sampleScripts,
        time,
        isTyping: false,
        displayedText: ''
      });
      this.scrollToBottom();
    },

    // 触发图片上传
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },

    // 处理图片上传（模拟发送图片）
   // 修改后的 handleImageUpload 方法
handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- 关键修改点：获取真实的本地预览路径 ---
  // 使用 URL.createObjectURL 为上传的文件创建一个临时访问链接
  const realImageUrl = URL.createObjectURL(file);

  this.logs.push({
    role: 'user',
    type: 'image',
    src: realImageUrl, // 替换原来的 fakeImageUrl
    displayedText: '[图片已发送]',
    time,
    isTyping: false
  });

  this.scrollToBottom();

  // 清空 input，确保同一张图连续上传也能触发 change 事件
  e.target.value = '';

  // AI 回复
  setTimeout(() => {
    this.respondAsAI('已收到您的图片，正在分析...');
  }, 800);
},

    async respondAsAI(input) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newLog = {
        role: 'ai',
        text: '',
        displayedText: '',
        time,
        isTyping: true,
        type: 'text'
      };
      
      this.logs.push(newLog);
      this.scrollToBottom();

      let responseText = "";

      // 2. 检查是否命中本地命令（如 /HELP），如果没有则调用后端 API
      const upperInput = input.toUpperCase();
      if (this.commands[upperInput]) {
        responseText = this.commands[upperInput];
      } else {
        try {
          // ============================================================
          // 【核心接入点】：DeepSeek API 连接配置
          // ============================================================
          const response = await fetch('https://prelaunch-calamity-moonwalk.ngrok-free.dev/api/ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input,
              user_id: '800201' // 可以根据需要传递用户ID
            })
          });

          if (!response.ok) throw new Error('网络响应异常');
          
          const data = await response.json();
          // 注意：后端返回的是完整的 DeepSeek 响应，所以路径是 data.choices[0]...
          responseText = data.choices[0].message.content;

        } catch (error) {
          console.error("API请求失败:", error);
          responseText = "【系统错误】链路通讯中断，无法获取 AI 回复。";
        }
      }

      newLog.text = responseText;
      for (let i = 0; i < responseText.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 28));
        newLog.displayedText += responseText[i];
        this.scrollToBottom();
      }
      newLog.isTyping = false;
      this.scrollToBottom();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.logContainer;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },

    simulateSystemLoad() {
      setInterval(() => {
        this.cpuLoad = Math.floor(Math.random() * 10) + 20;
      }, 3000);
    },
    clearLogs() { this.logs = []; },
    goToLobby() { this.$router.push('/user'); }
  }
};
