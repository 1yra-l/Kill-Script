<template>
  <div class="settlement-container horror-theme">
    <div class="grain-overlay"></div>
    <div class="blood-splatter"></div>
    
    <nav class="top-right-nav">
      <button class="nav-btn horror-btn" @click="goToLobby">返回大厅</button>
      <button class="nav-btn horror-btn" @click="goToUserCenter">用户中心</button>
    </nav>

    <main class="layout-wrapper">
      <header class="archive-header">
        <h1 class="archive-title">案件终结报告：<span class="highlight-name">{{ scriptName }}</span></h1>
        <div class="archive-meta">
          档案编号: #CASE-{{ roomId }} 
          <span class="confidential-tag forbidden">极度机密 / FORBIDDEN</span>
        </div>
        <div class="ink-divider blood-line"></div>
      </header>

      <div class="main-content-row">
        <section class="panel-frame score-panel ghost-border">
          <div class="frame-label shadow-label">PERFORMANCE / 侦破表现</div>
          <div class="inner-paper yellowed-paper burned-edge">
            <div class="score-display">
              <span class="score-value">{{ performance.score }}</span>
              <span class="score-unit">分</span>
            </div>
            <p class="review-text">"{{ performance.review }}"</p>
          </div>
        </section>

        <section class="panel-frame truth-panel ghost-border">
          <div class="frame-label shadow-label">CASE SUMMARY / 真相复盘</div>
          <div class="inner-paper yellowed-paper burned-edge">
            <div class="scroll-content">
              <div class="detail-item">
                <h4 class="ink-subtitle">🔍 关键线索解析</h4>
                <ul class="clue-list">
                  <li v-for="(clue, index) in discoveredClues" :key="index" class="clue-item">
                    <span class="clue-tag death-tag">ENCRYPTED</span> {{ clue.name || clue }}
                  </li>
                </ul>
              </div>
              <div class="detail-item">
                <h4 class="ink-subtitle">💡 核心真相</h4>
                <p class="truth-reveal-text">{{ truthRevealSummary }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="panel-frame relationship-panel ghost-border">
        <div class="frame-label shadow-label">DOSSIER / 剧本人物卷宗</div>
        <div class="inner-paper yellowed-paper burned-edge">
          <p class="instruction">点击下方头像，在档案中直接查看角色生平：</p>
          
          <div class="map-container">
            <div 
              v-for="role in roles" 
              :key="role.name" 
              class="role-node" 
              :class="{ 'active': selectedRole && selectedRole.name === role.name }"
              @click="toggleRoleDetail(role)"
            >
              <div class="avatar-frame horror-avatar">
                <img :src="role.avatar" :alt="role.name" />
              </div>
              <span class="role-label">{{ role.name }}</span>
            </div>
          </div>

          <transition name="horror-expand">
            <div v-if="selectedRole" class="inline-detail-box horror-box">
              <div class="red-stamp death-stamp">CLASSIFIED</div>
              <h3 class="detail-role-name">{{ selectedRole.name }} <small>({{ selectedRole.identity }})</small></h3>
              <div class="dashed-divider"></div>
              <div class="detail-content">
                <p><strong>【背景经历】</strong></p>
                <p class="story-text">{{ selectedRole.story }}</p>
                <p><strong>【核心秘密】</strong></p>
                <p class="secret-text">{{ selectedRole.secret }}</p>
              </div>
              <button class="close-inline-btn" @click="selectedRole = null">收起档案 ▲</button>
            </div>
          </transition>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import settlementLogic from './settlement.js';
export default {
  ...settlementLogic,
  props: { roomId: { type: String, default: '001' } }
}
</script>

<style scoped>
@import "./settlement.css";
</style>