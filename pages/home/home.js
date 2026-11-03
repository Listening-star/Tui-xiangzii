const levels = require('../../utils/levels.js')
const app = getApp()

Page({
  data: {
    total: levels.length,
    unlocked: 1,
    cleared: 0
  },

  onShow() {
    const unlocked = app.globalData.unlocked
    this.setData({
      unlocked,
      cleared: Math.min(unlocked - 1, levels.length)
    })
  },

  startGame() {
    // 从第一个未通关的关卡开始
    const level = Math.min(app.globalData.unlocked - 1, levels.length - 1)
    wx.navigateTo({ url: '/pages/index/index?level=' + level })
  },

  goLevels() {
    wx.navigateTo({ url: '/pages/levels/levels' })
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  }
})
