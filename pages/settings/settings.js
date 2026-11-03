const app = getApp()

Page({
  data: {
    sound: true,
    vibrate: true
  },

  onLoad() {
    const s = app.globalData.settings
    this.setData({ sound: s.sound, vibrate: s.vibrate })
  },

  toggleSound(e) {
    const s = { ...app.globalData.settings, sound: e.detail.value }
    app.saveSettings(s)
    this.setData({ sound: e.detail.value })
  },

  toggleVibrate(e) {
    const s = { ...app.globalData.settings, vibrate: e.detail.value }
    app.saveSettings(s)
    this.setData({ vibrate: e.detail.value })
  },

  clearProgress() {
    wx.showModal({
      title: '清除进度',
      content: '确定要清除所有通关记录，重新开始吗？',
      confirmText: '清除',
      confirmColor: '#d9534f',
      success: (res) => {
        if (res.confirm) {
          app.globalData.unlocked = 1
          wx.setStorageSync('sokoban_unlocked', 1)
          wx.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  }
})
