App({
  onLaunch() {
    // 通关进度：已解锁到第几关
    const saved = wx.getStorageSync('sokoban_unlocked')
    this.globalData.unlocked = saved || 1
    // 用户设置（补全操作方式，兼容旧版本）
    const settings = wx.getStorageSync('sokoban_settings')
    this.globalData.settings = Object.assign(
      { sound: true, vibrate: true, controlMode: 'dpad' },
      settings || {}
    )
  },

  // 保存设置
  saveSettings(settings) {
    this.globalData.settings = settings
    wx.setStorageSync('sokoban_settings', settings)
  },

  // 更新解锁进度
  updateUnlocked(level) {
    if (level > this.globalData.unlocked) {
      this.globalData.unlocked = level
      wx.setStorageSync('sokoban_unlocked', level)
    }
  },

  globalData: {
    unlocked: 1,
    settings: { sound: true, vibrate: true, controlMode: 'dpad' }
  }
})
