<template>
  <div class="script-details">
    <NavBar />

    <div class="header" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h1 class="main-title">{{ scriptTitle }}<span class="en-title"></span></h1>
        <div class="description-text">
          <p>{{ scriptAbstract }}</p>
        </div>
      </div>
      <div class="top-secret-stamp">TOP SECRET</div>
    </div>

    <div class="main-content">
      <div class="panel characters-panel parchment-container" :style="{ backgroundImage: `url(${parchmentImage})` }">
        <div class="panel-header-light">👤 人物简介</div>

        <div class="avatars">
          <div
            v-for="(char, index) in characters" :key="index"
            class="avatar-item" :class="{ active: selectedIndex === index }"
            @click="selectCharacter(index)"
          >
            <div class="avatar-circle">
              <img :src="char.img">
            </div>
            <span class="avatar-name">{{ char.name }}</span>
          </div>
        </div>

        <div class="paper-layer" :style="{ backgroundImage: `url(${paperImage})` }">
          <div class="paper-content">
            <h3 class="char-title">{{ selectedCharacter.name }}</h3>
            <p class="char-desc" v-html="selectedCharacter.desc.replace(/\n/g, '<br>')"></p>
          </div>
        </div>
      </div>

      <div class="panel ratings-panel parchment-container" :style="{ backgroundImage: `url(${parchmentImage})` }">
        <div class="panel-header">⭐ 用户评分</div>
        <div class="ratings-container">
          <div class="rating-row" v-for="(val, key) in ratingLabels" :key="key">
            <div class="rating-info">
              <span class="label">{{ val }}</span>
              <span class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.floor(ratings[key]) }">★</span>
              </span>
              <span class="score-val">{{ ratings[key] }} ★</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="panel reviews-panel parchment-container" :style="{ backgroundImage: `url(${parchmentImage})` }">
        <div class="panel-header">💬 用户评价</div>
        <div class="reviews-list">
          <div v-for="(review, i) in reviews" :key="i" class="review-item">
            <div class="review-top">
              <div class="user-meta">
                <div class="user-icon"></div>
                <span class="username">{{ review.player }}</span>
              </div>
              <div class="user-stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.stars }">★</span>
              </div>
            </div>
            <p class="review-body">{{ review.text }}</p>
            <div class="review-footer">👍 {{ review.likes }}</div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="actions-area">
      <router-link to="/character-select" class="investigate-btn">
        <span class="btn-text">进入调查</span>
        <span class="btn-sub">START INVESTIGATION</span>
      </router-link>
    </div>
  </div>
</template>

<script>
// 这里直接引入我们刚才改好的 JS 逻辑
import ScriptDetailsLogic from './ScriptDetails.js';
export default ScriptDetailsLogic;
</script>

<style scoped src="./ScriptDetails.css"></style>