import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const casesSolved = ref(0)
  const cluesFound = ref(0)
  const currentCase = ref(null)

  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  const isCaseActive = computed(() => currentCase.value !== null)
  const achievementLevel = computed(() => {
    if (casesSolved.value >= 10) return '传奇侦探'
    if (casesSolved.value >= 5) return '资深探员'
    if (casesSolved.value >= 2) return '新手侦探'
    return '初学者'
  })

  // 动作
  function increment() {
    count.value++
  }

  function decrement() {
    if (count.value > 0) {
      count.value--
    }
  }

  function reset() {
    count.value = 0
  }

  function startCase(caseName) {
    currentCase.value = {
      name: caseName,
      startTime: new Date(),
      clues: [],
      suspects: [],
      status: 'investigating'
    }
  }

  function endCase(isSolved, clues) {
    if (isSolved) {
      casesSolved.value++
    }
    cluesFound.value += clues.length
    currentCase.value = null
  }

  function addClue(clue) {
    if (currentCase.value) {
      currentCase.value.clues.push(clue)
    }
  }

  function addSuspect(suspect) {
    if (currentCase.value) {
      currentCase.value.suspects.push(suspect)
    }
  }

  // 游戏相关的方法
  function calculateScore() {
    const baseScore = casesSolved.value * 100
    const clueBonus = cluesFound.value * 10
    const timeBonus = casesSolved.value * 20
    return baseScore + clueBonus + timeBonus
  }

  function getStats() {
    return {
      totalCases: casesSolved.value,
      totalClues: cluesFound.value,
      score: calculateScore(),
      level: achievementLevel.value,
      currentCase: currentCase.value
    }
  }

  return {
    // 状态
    count,
    casesSolved,
    cluesFound,
    currentCase,

    // 计算属性
    doubleCount,
    isCaseActive,
    achievementLevel,

    // 动作
    increment,
    decrement,
    reset,
    startCase,
    endCase,
    addClue,
    addSuspect,
    getStats
  }
})