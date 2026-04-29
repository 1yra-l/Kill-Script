<template>
  <div class="book-wrap">
    <div class="book">

      <button class="close-btn" @click="goBack" title="返回上一页">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="page page-left">
        <svg class="ornament-line" viewBox="0 0 300 20">
          <line x1="0" y1="10" x2="110" y2="10" stroke="currentColor" stroke-width="1.2" />
          <path d="M142,10 L150,4 L158,10 L150,16 Z" fill="none" stroke="currentColor" />
          <line x1="190" y1="10" x2="300" y2="10" stroke="currentColor" stroke-width="1.2" />
        </svg>

        <h1 class="left-title">设置界面</h1>
        <p class="left-subtitle">SYSTEM SETTINGS</p>

        <div class="setting-row">
          <div class="toggle-group">
            <button :class="['toggle-btn', { active: settings.autoplay }]" @click="settings.autoplay = true">
              <span>AUTOPLAY</span>
              <span>自动播放</span>
            </button>
            <button :class="['toggle-btn', { active: !settings.autoplay }]" @click="settings.autoplay = false">
              <span>MANUAL</span>
              <span>手动操作</span>
            </button>
          </div>
        </div>

        <div class="setting-row">
          <div class="toggle-group">
            <button :class="['toggle-btn', { active: !settings.isFullscreen }]" @click="settings.isFullscreen = false">
              <span>WINDOW</span>
              <span>窗口模式</span>
            </button>
            <button :class="['toggle-btn', { active: settings.isFullscreen }]" @click="settings.isFullscreen = true">
              <span>FULLSCREEN</span>
              <span>全屏模式</span>
            </button>
          </div>
        </div>

        <div class="return-section">
          <p style="font-size: 0.7rem; color: #8a7050; margin-bottom: 8px; letter-spacing: 1px; font-weight: 600;">BACK TO MAIN TITLE</p>
          <div style="display: flex;">
            <span class="yn-option" @click="settings.returnToTitle = true">
              YES <div :class="['yn-box', { filled: settings.returnToTitle }]"></div>
            </span>
            <span class="yn-option" @click="settings.returnToTitle = false">
              NO <div :class="['yn-box', { filled: !settings.returnToTitle }]"></div>
            </span>
          </div>
        </div>
      </div>

      <div class="spine"></div>

      <div class="page page-right">
        <div class="section-title">VOLUME CONTROL</div>

        <div v-for="audio in audioList" :key="audio.id" class="slider-block">
          <div class="slider-header">
            <div>
              <span class="slider-name">{{ audio.name }}</span>
              <span class="slider-name-en">{{ audio.en }}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span class="slider-value">{{ settings.volumes[audio.id] }}%</span>
              <button :class="['mute-btn', { muted: settings.mutes[audio.id] }]" @click="toggleMute(audio.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path v-if="!settings.mutes[audio.id]" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
          </div>
          <div class="slider-track">
            <input
              type="range" min="0" max="100"
              v-model.number="settings.volumes[audio.id]"
              @input="onSliderInput(audio.id)"
            />
          </div>
        </div>

        <svg class="star-deco" width="70" height="70" viewBox="0 0 100 100">
          <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettings } from './Settings.js';
import { useRouter } from 'vue-router'; // 引入路由

const { audioList, settings, onSliderInput, toggleMute } = useSettings();
const router = useRouter(); // 实例化路由

// 返回上一页的逻辑
const goBack = () => {
  router.back();
};
</script>

<style scoped src="./Settings.css"></style>