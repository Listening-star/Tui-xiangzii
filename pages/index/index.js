const levels = require('../../utils/levels.js')
const config = require('../../utils/config.js')

const app = getApp()

const DIRS = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 }
}

const CFG_KEY = {
  wall: 'wall',
  floor: 'floor',
  target: 'target',
  box: 'box',
  'box-on-target': 'boxOnTarget',
  player: 'player'
}

const CHAR_MAP = {
  '#': 'wall',
  '.': 'target',
  $: 'box',
  '*': 'box-on-target',
  '@': 'player',
  '+': 'player',
  ' ': 'floor'
}

Page({
  data: {
    levelIndex: 0,
    levelName: '',
    cells: [],
    rows: 0,
    cols: 0,
    cellSize: 32,
    steps: 0,
    won: false,
    hasNext: true,
    controlMode: 'dpad',
    joyActive: false,
    joyX: 0,
    joyY: 0
  },

  onLoad(options) {
    const level = options && options.level !== undefined ? parseInt(options.level) : 0
    this.history = []
    this.targets = []
    this.joyFired = false
    this.setData({ controlMode: app.globalData.settings.controlMode || 'dpad' })
    this.loadLevel(isNaN(level) ? 0 : level)
  },

  onShow() {
    // 从设置页返回时同步最新操作方式
    const mode = app.globalData.settings.controlMode || 'dpad'
    if (mode !== this.data.controlMode) {
      this.setData({ controlMode: mode })
    }
  },

  makeCell(kind) {
    const cfgKey = CFG_KEY[kind]
    return {
      cls: kind,
      img: config.images[cfgKey],
      useImg: config.custom[cfgKey]
    }
  },

  parseLevel(level) {
    const raw = level.map
    const rows = raw.length
    const cols = Math.max.apply(null, raw.map(r => r.length))
    const cells = []
    const targets = []
    for (let r = 0; r < rows; r++) {
      const row = []
      const line = raw[r]
      for (let c = 0; c < cols; c++) {
        const ch = c < line.length ? line[c] : ' '
        const kind = CHAR_MAP[ch] || 'floor'
        if (ch === '.' || ch === '*' || ch === '+') targets.push([r, c])
        row.push(this.makeCell(kind))
      }
      cells.push(row)
    }
    return { cells, targets, rows, cols }
  },

  loadLevel(index) {
    const level = levels[index]
    const parsed = this.parseLevel(level)
    this.cells = parsed.cells
    this.targets = parsed.targets
    this.history = []

    let player = { r: 0, c: 0 }
    for (let r = 0; r < parsed.rows; r++) {
      for (let c = 0; c < parsed.cols; c++) {
        if (this.cells[r][c].cls === 'player') player = { r, c }
      }
    }
    this.player = player

    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const maxBoardW = sys.windowWidth - 24
    const maxBoardH = sys.windowHeight - 270
    let size = Math.floor(Math.min(maxBoardW / parsed.cols, maxBoardH / parsed.rows))
    if (size < 18) size = 18
    if (size > 56) size = 56

    this.setData({
      levelIndex: index,
      levelName: level.name,
      cells: this.cells,
      rows: parsed.rows,
      cols: parsed.cols,
      cellSize: size,
      steps: 0,
      won: false,
      hasNext: index < levels.length - 1
    })
  },

  move(dirName) {
    if (this.data.won) return
    const d = DIRS[dirName]
    const pr = this.player.r
    const pc = this.player.c
    const nr = pr + d.dr
    const nc = pc + d.dc
    if (nr < 0 || nr >= this.data.rows || nc < 0 || nc >= this.data.cols) return
    const targetCell = this.cells[nr][nc]
    if (targetCell.cls === 'wall') return

    const push = (targetCell.cls === 'box' || targetCell.cls === 'box-on-target')
    if (push) {
      const br = pr + d.dr * 2
      const bc = pc + d.dc * 2
      if (br < 0 || br >= this.data.rows || bc < 0 || bc >= this.data.cols) return
      const beyond = this.cells[br][bc]
      if (beyond.cls === 'wall' || beyond.cls === 'box' || beyond.cls === 'box-on-target') return

      this.saveHistory()
      const landOnTarget = beyond.cls === 'target'
      this.cells[br][bc] = this.makeCell(landOnTarget ? 'box-on-target' : 'box')
      this.cells[nr][nc] = this.makeCell('player')
    } else {
      this.saveHistory()
      this.cells[nr][nc] = this.makeCell('player')
    }

    const standingOnTarget = this.isTarget(pr, pc)
    this.cells[pr][pc] = this.makeCell(standingOnTarget ? 'target' : 'floor')

    this.player = { r: nr, c: nc }
    this.setData({ cells: this.cells, steps: this.data.steps + 1 })
    this.checkWin()
  },

  isTarget(r, c) {
    return this.targets.some(t => t[0] === r && t[1] === c)
  },

  saveHistory() {
    const snapshot = this.cells.map(row => row.map(cell => ({
      cls: cell.cls,
      img: cell.img,
      useImg: cell.useImg
    })))
    this.history.push({
      cells: snapshot,
      player: { r: this.player.r, c: this.player.c },
      steps: this.data.steps
    })
  },

  checkWin() {
    const done = this.targets.every(t => this.cells[t[0]][t[1]].cls === 'box-on-target')
    if (done) {
      this.setData({ won: true })
      app.updateUnlocked(this.data.levelIndex + 2)
      if (app.globalData.settings.vibrate && wx.vibrateShort) {
        wx.vibrateShort({ type: 'medium' })
      }
    }
  },

  onUp() { this.move('up') },
  onDown() { this.move('down') },
  onLeft() { this.move('left') },
  onRight() { this.move('right') },

  onTouchStart(e) {
    this.touchStart = e.touches[0]
  },
  onTouchEnd(e) {
    if (!this.touchStart) return
    const t = e.changedTouches[0]
    const dx = t.clientX - this.touchStart.clientX
    const dy = t.clientY - this.touchStart.clientY
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (Math.max(absX, absY) < 20) return
    if (absX > absY) {
      this.move(dx > 0 ? 'right' : 'left')
    } else {
      this.move(dy > 0 ? 'down' : 'up')
    }
    this.touchStart = null
  },

  // ===== 操纵杆 =====
  onJoyStart(e) {
    this.joyFired = false
    this.setData({ joyActive: true })
    wx.createSelectorQuery()
      .in(this)
      .select('.joy-base')
      .boundingClientRect((rect) => {
        if (!rect) return
        this.joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        this.joyMaxR = rect.width * 0.3 - 2
        this.joyTriggerR = this.joyMaxR * 0.42
        this.updateJoy(e.touches[0].clientX, e.touches[0].clientY)
      })
      .exec()
  },

  onJoyMove(e) {
    if (!this.joyCenter) return
    const t = e.touches[0]
    this.updateJoy(t.clientX, t.clientY)
  },

  updateJoy(px, py) {
    let dx = px - this.joyCenter.x
    let dy = py - this.joyCenter.y
    const len = Math.hypot(dx, dy)
    if (len > this.joyMaxR) {
      dx = dx / len * this.joyMaxR
      dy = dy / len * this.joyMaxR
    }
    this.setData({ joyX: Math.round(dx), joyY: Math.round(dy) })
    if (Math.hypot(dx, dy) >= this.joyTriggerR) {
      if (!this.joyFired) {
        this.joyFired = true
        const dir = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up')
        this.move(dir)
      }
    } else {
      this.joyFired = false
    }
  },

  onJoyEnd() {
    this.joyFired = false
    this.setData({ joyActive: false, joyX: 0, joyY: 0 })
  },

  undo() {
    if (this.history.length === 0) {
      wx.showToast({ title: '没有可撤销的步骤', icon: 'none' })
      return
    }
    const prev = this.history.pop()
    this.cells = prev.cells
    this.player = prev.player
    this.setData({ cells: this.cells, steps: prev.steps, won: false })
  },

  restart() {
    this.loadLevel(this.data.levelIndex)
  },

  goHome() {
    wx.navigateBack({ delta: 1 })
  },

  goLevels() {
    wx.redirectTo({ url: '/pages/levels/levels' })
  },

  nextLevel() {
    if (this.data.levelIndex < levels.length - 1) {
      this.loadLevel(this.data.levelIndex + 1)
    }
  }
})
