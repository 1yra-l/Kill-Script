import request from '@/utils/request';

export default {
  name: 'AvatarUpload',
  data() {
    return {
      sourceImageUrl: null,
      isGenerating: false,
      aiGeneratedImages: [],
      selectedAiImage: null
    }
  },
  methods: {
    triggerSelect() {
      this.$refs.fileInput.click();
    },

    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => { this.sourceImageUrl = e.target.result; };
      reader.readAsDataURL(file);
      this.generateAiAvatars(file);
    },

    async generateAiAvatars(file) {
      this.isGenerating = true;
      this.aiGeneratedImages = [];
      this.selectedAiImage = null;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('https://sporty-pawing-sanctity.ngrok-free.dev/api/generate-avatar', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        console.log('后端返回数据检测:', result);

        if (result.success && result.data && result.data.length > 0) {
          result.data.forEach((item, index) => {
            // 后端现在直接提供 full_src
            const src = item.full_src || item.image_url;

            if (src) {
              console.log(`图片${index} 路径预览:`, src.substring(0, 50));
              this.aiGeneratedImages.push({
                display_url: src,
                index: index
              });
            }
          });

          if (this.aiGeneratedImages.length > 0) {
            this.selectedAiImage = this.aiGeneratedImages[0];
          }
        } else {
          alert(`生成失败: ${result.error || '未知原因'}`);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert('无法连接到生成服务器，请检查Ngrok状态。');
      } finally {
        this.isGenerating = false;
      }
    },

    selectAiImage(imgData) {
      this.selectedAiImage = imgData;
    },

    confirmAvatar() {
      if (!this.selectedAiImage) return;
      // 暂存到中转站
      localStorage.setItem("temp_selected_avatar", this.selectedAiImage.display_url);
      alert('形象已重构，请在资料页点击最终保存');
      this.$router.go(-1); // 返回上一页
    },

    goBack() { this.$router.go(-1); }
  }
}