const levelsData = require('../../utils/levels.js')
const app = getApp()

Page({
  data: {
    items: [],
    total: levelsData.length,
    cleared: 0
  },

  onShow() {
    const unlocked = app.globalData.unlocked
    const items = levelsData.map((lv, i) => ({
      index: i,
      num: i + 1,
      status: i + 1 < unlocked ? 'cleared' : (i + 1 === unlocked ? 'current' : 'locked')
    }))
    this.setData({ items, cleared: Math.min(unlocked - 1, levelsData.length) })
  },

  enter(e) {
    const index = e.currentTarget.dataset.index
    if (index + 1 > app.globalData.unlocked) {
      wx.showToast({ title: '该关卡未解锁', icon: 'none' })
      return
    }
    wx.redirectTo({ url: '/pages/index/index?level=' + index })
  }
})
