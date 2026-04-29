<template>
  <div class="history-record-container">
    <header class="page-header">
      <h1 class="page-title">
        <span class="icon">📜</span> 历史卷宗记录
      </h1>
      <button class="back-btn" @click="goBack">
        <span class="btn-icon">↩</span> 返回个人中心
      </button>
    </header>

    <main class="carousel-section">
      <button
        class="nav-arrow left-arrow"
        :class="{ disabled: !canPrev }"
        @click="prevPage"
      >
        &#10094;
      </button>

      <div class="folders-wrapper">
        <transition-group name="slide" tag="div" class="folders-container">
          <div
            class="folder-card"
            v-for="script in visibleScripts"
            :key="script.id"
          >
            <div class="folder-top-line"></div>

            <div class="folder-content">
              <div class="folder-main-title">档 案 袋</div>

              <div class="inner-info-box">
                <p class="info-row">
                  <span class="label">案&emsp;&emsp;件：</span>
                  <span class="value title-value">{{ script.title }}</span>
                </p>
                <p class="info-row">
                  <span class="label">扮演角色：</span>
                  <span class="value">{{ script.character }}</span>
                </p>
                <p class="info-row">
                  <span class="label">状&emsp;&emsp;态：</span>
                  <span :class="['status-badge', script.status === '已完成' ? 'status-done' : 'status-doing']">
                    {{ script.status }}
                  </span>
                </p>
              </div>

              <div class="date-container">
                <span class="label">日期：</span>
                <span class="value date-text">{{ script.date }}</span>
              </div>
            </div>

            <div class="folder-footer">
              <button class="view-btn" @click="viewDetail(script.id)">
                查 看 卷 宗
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <button
        class="nav-arrow right-arrow"
        :class="{ disabled: !canNext }"
        @click="nextPage"
      >
        &#10095;
      </button>
    </main>
  </div>
</template>

<script src="./HistoryRecord.js"></script>
<style scoped src="./HistoryRecord.css"></style>