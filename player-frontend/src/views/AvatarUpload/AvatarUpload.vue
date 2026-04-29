<template>
  <div id="app">
    <header class="archive-header">
        <h1 class="archive-title">📸 核心特征重构系统</h1>
        <div class="archive-meta">
            <span>正在接入: 豆包 AI 视觉引擎</span>
            <span class="confidential-tag">TOP SECRET</span>
        </div>
        <div class="ink-divider"></div>
    </header>

    <main class="workspace">
        <section class="panel source-panel">
            <h3 class="panel-title">【 第一步：上传参考影像 】</h3>
            <div class="source-avatar-box">
                <img v-if="sourceImageUrl" :src="sourceImageUrl" class="preview-img" />
                <div v-else class="avatar-placeholder">👤</div>
            </div>
            <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" style="display: none" />
            <button class="dark-btn select-btn" @click="triggerSelect">📂 选择影像资料</button>
        </section>

        <div class="connection-zone">
            <span class="ai-status-text" :class="{'pulse-active': isGenerating}">
                {{ isGenerating ? 'AI_CONSTRUCTING...' : 'WAITING_INPUT' }}
            </span>
        </div>

        <section class="panel ai-panel">
            <div class="confidential-stamp">AI ANALYSIS</div>
            <h3 class="panel-title">【 第二步：选择衍生面貌 】</h3>

            <div v-if="isGenerating" class="loading-state">
                <div class="spinner"></div>
                <p>神经网络重绘中...</p>
            </div>

            <div v-else-if="aiGeneratedImages.length > 0" class="ai-grid">
                <div
                    v-for="(img, index) in aiGeneratedImages"
                    :key="index"
                    class="ai-img-wrapper"
                    :class="{ 'selected': selectedAiImage === img }"
                    @click="selectAiImage(img)"
                >
                    <img :src="img.display_url" class="preview-img" />
                    <div class="style-label">重构方案 0{{ index + 1 }}</div>
                    <div v-if="selectedAiImage === img" class="select-stamp">已锁定</div>
                </div>
            </div>

            <div v-else class="loading-state">
                <p>等待影像上传...</p>
            </div>
        </section>
    </main>

    <footer class="action-footer">
        <button class="dark-btn" @click="goBack">🔙 中止操作</button>
        <button class="dark-btn confirm-btn" :disabled="!selectedAiImage" @click="confirmAvatar">
            ㊙️ 确认并将影像归档
        </button>
    </footer>
  </div>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>