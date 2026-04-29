<template>
  <div class="user-center-container recap-layout">
    <NavBar />

    <main class="content-wrapper">
      <header class="archive-header">
        <h1 class="archive-title">
          <span class="file-icon">📻</span>
          案情结案报告 <span class="highlight-name">// CLASSIFIED DOSSIER</span>
        </h1>

        <button class="end-recap-btn" @click="goToEnding">
          结束案件复盘 <span class="btn-arrow">➔</span>
        </button>

        <div class="ink-divider"></div>
      </header>

      <div class="dashboard-layout analytical-scene">

        <section class="left-archive-section">
          <div class="paper-mask-viewport">
            <div class="animated-paper-wrapper">
              <img src="@/assets/recap-paper.jpg" alt="牛皮纸" class="paper-img-full" />

              <div class="paper-content-layout">
                <div class="paper-top-row">
                  <div class="score-zone">
                    <span v-html="scoreHtml"></span>
                  </div>
                  <div class="report-zone">
                    <span v-html="reportHtml"></span>
                  </div>
                </div>

                <div class="truth-zone">
                  <span v-html="storyHtml"></span>
                  <span v-show="showCursor" class="cursor">_</span>
                </div>
              </div>
            </div>
          </div>

          <div class="typewriter-container">
            <img src="@/assets/typewriter.png" alt="打字机" class="typewriter-compact" />
          </div>
        </section>

        <section class="right-analysis-section">
          <div class="modern-analysis-board">
            <div class="board-header">CASE ANALYSIS BOARD</div>

            <svg class="red-lines-container" width="100%" height="100%">
              <line
                v-for="(link, index) in relationships"
                :key="index"
                :x1="link.fromX" :y1="link.fromY"
                :x2="link.toX" :y2="link.toY"
                class="solid-red-line"
              />
            </svg>

            <div
              v-for="char in characters"
              :key="char.id"
              class="polaroid-wrapper clickable-polaroid"
              :class="char.roleType"
              :style="{ top: char.y + '%', left: char.x + '%' }"
              @click="openTruthDetail(char)"
            >
              <img :src="char.img" :alt="char.name" class="char-photo" />
              <div class="polaroid-label">[{{ char.role }}] <br>{{ char.name }}</div>
            </div>

            <transition name="fade">
              <div v-if="selectedChar" class="truth-modal-overlay" @click.self="closeTruthDetail">
                <div class="truth-flip-card">

                  <button class="close-btn" @click="closeTruthDetail">×</button>

                  <div class="secret-header">
                    <h3>{{ selectedChar.name }} <span>[{{ selectedChar.role }}]</span></h3>
                    <div class="secret-divider">SECRET DOSSIER</div>
                  </div>

                  <div class="secret-content scrollbar-custom">
                    <div class="secret-section">
                      <h4 class="section-title">■ 意识上传动机 <span>(Motivation)</span></h4>
                      <p class="section-text">{{ selectedChar.motivation }}</p>
                    </div>

                    <div class="secret-section">
                      <h4 class="section-title">■ 真实时间线 <span>(Timeline)</span></h4>
                      <ul class="timeline-list">
                        <li v-for="(event, idx) in selectedChar.timeline" :key="idx" v-show="event.is_truth" class="timeline-item">
                          <div class="time-badge">{{ event.time }}</div>
                          <div class="event-desc">{{ event.action }}</div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="card-footer">
                    <button class="return-btn" @click="closeTruthDetail">
                      ↶ 返回线索板
                    </button>
                  </div>

                </div>
              </div>
            </transition>

          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script>
import GameRecapLogic from './GameRecap.js'
export default GameRecapLogic
</script>

<style scoped>
@import './GameRecap.css';
</style>