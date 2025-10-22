import { defineStore } from 'pinia'

export const useTreasureStore = defineStore('treasure', {
  state: () => ({
    treasures: [
      { id: 1, name: '古老日记', icon: '📖', region: 'library', rarity: 'common', collected: false },
      { id: 2, name: '神秘地图', icon: '🗺️', region: 'library', rarity: 'rare', collected: false },
      { id: 3, name: '青铜钥匙', icon: '🔑', region: 'library', rarity: 'epic', collected: false },
      { id: 4, name: '智慧之书', icon: '📚', region: 'library', rarity: 'legendary', collected: false },
      { id: 5, name: '学者勋章', icon: '🏅', region: 'library', rarity: 'legendary', collected: false }
    ],
    collectedTreasures: JSON.parse(localStorage.getItem('collectedTreasures') || '[]')
  }),
  
  getters: {
    getTreasuresByRegion: (state) => (regionId) => {
      return state.treasures.filter(t => t.region === regionId)
    },
    
    getCollectedCount: (state) => {
      return state.collectedTreasures.length
    },
    
    getTotalCount: (state) => {
      return state.treasures.length
    },
    
    getCollectionProgress: (state) => {
      return Math.round((state.collectedTreasures.length / state.treasures.length) * 100)
    },
    
    isCollected: (state) => (treasureId) => {
      return state.collectedTreasures.includes(treasureId)
    }
  },
  
  actions: {
    collectTreasure(treasureId) {
      if (!this.collectedTreasures.includes(treasureId)) {
        this.collectedTreasures.push(treasureId)
        this.saveTreasures()
      }
    },
    
    saveTreasures() {
      localStorage.setItem('collectedTreasures', JSON.stringify(this.collectedTreasures))
    },
    
    loadTreasures() {
      const saved = localStorage.getItem('collectedTreasures')
      if (saved) {
        this.collectedTreasures = JSON.parse(saved)
      }
    }
  }
})