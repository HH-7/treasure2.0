import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    regions: [
      {
        id: 'library',
        name: '古老的图书馆',
        description: '探索充满神秘古籍的图书馆',
        difficulty: '中等',
        icon: '📚',
        levels: [
          {
            level: 1,
            question: '在图书馆最古老的区域，你发现了一本泛黄的日记。日记中提到宝藏藏在"知识汇聚之地"。这是指哪里？',
            options: ['天文台', '中央阅览室', '古籍修复室', '地下档案库'],
            answer: 1,
            points: 100
          },
          {
            level: 2,
            question: '在中央阅览室，你发现书架上有本突出的书。书名是《失落的文明》，书中夹着一张地图。地图上的标记指向哪里？',
            options: ['钟楼', '喷泉花园', '古老橡树', '石像鬼雕像'],
            answer: 2,
            points: 150
          },
          {
            level: 3,
            question: '在古老橡树下，你发现了一个金属盒子。盒子上刻着谜题："我有很多钥匙，却打不开任何锁。我有很多页面，却写不出任何字。我是什么？"',
            options: ['书架', '字典', '钢琴', '地图册'],
            answer: 0,
            points: 200
          },
          {
            level: 4,
            question: '解开谜题后，你在特定书架发现了一个隐藏的开关。按下开关，一个秘密通道打开了。通道通向哪里？',
            options: ['馆长办公室', '地下密室', '塔楼', '花园温室'],
            answer: 1,
            points: 250
          },
          {
            level: 5,
            question: '在密室中，你终于找到了传说中的宝藏！但要打开宝箱，需要回答最后一个问题：知识最大的价值是什么？',
            options: ['权力', '财富', '智慧', '传承'],
            answer: 3,
            points: 300
          }
        ]
      }
    ],
    currentRegion: null,
    currentLevel: 0,
    currentScore: 0
  }),
  
  getters: {
    getRegionById: (state) => (id) => {
      return state.regions.find(region => region.id === id)
    },
    getCurrentQuestion: (state) => {
      if (state.currentRegion && state.currentLevel < state.currentRegion.levels.length) {
        return state.currentRegion.levels[state.currentLevel]
      }
      return null
    },
    getTotalLevels: (state) => {
      return state.currentRegion ? state.currentRegion.levels.length : 0
    },
    isGameCompleted: (state) => {
      return state.currentRegion && state.currentLevel >= state.currentRegion.levels.length
    }
  },
  
  actions: {
    startGame() {
      // 自动选择图书馆作为唯一地区
      this.currentRegion = this.regions[0]
      this.currentLevel = 0
      this.currentScore = 0
    },
    
    answerQuestion(answerIndex) {
      const currentQuestion = this.getCurrentQuestion
      if (currentQuestion && answerIndex === currentQuestion.answer) {
        this.currentScore += currentQuestion.points
        return { correct: true, points: currentQuestion.points, treasureFound: Math.random() > 0.5 }
      }
      return { correct: false, points: 0, treasureFound: false }
    },
    
    nextLevel() {
      this.currentLevel++
    },
    
    resetGame() {
      this.currentRegion = null
      this.currentLevel = 0
      this.currentScore = 0
    },
    
    saveProgress() {
      const progress = {
        regionId: this.currentRegion?.id,
        level: this.currentLevel,
        score: this.currentScore,
        timestamp: Date.now()
      }
      localStorage.setItem('gameProgress', JSON.stringify(progress))
    },
    
    loadProgress() {
      const saved = localStorage.getItem('gameProgress')
      if (saved) {
        const progress = JSON.parse(saved)
        if (progress.regionId) {
          this.currentRegion = this.regions.find(r => r.id === progress.regionId)
          this.currentLevel = progress.level
          this.currentScore = progress.score
          return true
        }
      }
      return false
    }
  }
})