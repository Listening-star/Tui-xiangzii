// 像素矩阵 -> wxss 文件生成器（12x12 网格，每像素 var(--px)）
// 用法：node pixel-gen-doubao.js  写出 pixel-sprites-doubao.wxss
const fs = require('fs')

const GRID = 12

const palettes = {
  target: { '#': '#93a786', D: '#7d9270', X: '#2e2424', M: '#5a3a3a' },
  box: { G: '#43a047', L: '#7cc97f', D: '#2e7d32', Y: '#a5d6a7' },
  player: { P: '#f49abe', L: '#fcd5e3', D: '#e06a95', X: '#5a2f3f' },
  wall: { D: '#2e5e1a', M: '#3e7a24', L: '#4f902c' }
}

const arts = {
  target: [
    '............',
    '...#######..',
    '..#########.',
    '.##########.',
    '.#X#######X.',
    '.##########.',
    '.###D##D###.',
    '.#MMMMMMMM#.',
    'M#M##M##M#M.',
    '.##########.',
    '..#########.',
    '............'
  ],
  box: [
    '............',
    '....YYYY....',
    '...GGGGGG...',
    '..GGGGGGGG..',
    '.GGLGGGGGLG.',
    '.GGGGGGGGGG.',
    'GGGGGGGGGGGG',
    '.GGGGGGGGGG.',
    '..DGGGGGGD..',
    '...DD..DD...',
    '..DDD..DDD..',
    '............'
  ],
  player: [
    '............',
    '..PPPPPPPP..',
    '.PPLPPPPLPP.',
    'PPPPPPPPPPPP',
    'PDDPPDDPPDDP',
    'PD..PD..PD..',
    'PPPPPPPPPPPP',
    '.PPXPPPPXPP.',
    '.PPPPPPPPPP.',
    '..PPPPPPPP..',
    '...PPPPPP...',
    '............'
  ],
  wall: [
    'LMLMLMLMLMLM',
    'MLMLMLMLMLML',
    'LMLMLMLMLMLM',
    'DDLMLMLMLMDD',
    'MLMLMLMLMLML',
    'LMLMLMLMLMLM',
    'MLMLMLMLMLML',
    'LMLMLMLMLMLM',
    'DDMLMLMLMLDD',
    'MLMLMLMLMLML',
    'LMLMLMLMLMLM',
    'MLMLMLMLMLML'
  ]
}

function rule(selector, name, extra) {
  const rows = arts[name]
  const pal = palettes[name]
  const shadows = []
  let base = null
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const ch = rows[y][x]
      if (ch === '.' || ch === ' ') continue
      const color = pal[ch]
      if (!base) base = { x, y, color }
      else shadows.push(`calc(var(--px) * ${x}) calc(var(--px) * ${y}) ${color}`)
    }
  }
  let out = `${selector} {\n`
  out += `  position: absolute; left: 0; top: 0; width: var(--px); height: var(--px);\n`
  if (extra) out += `  ${extra}\n`
  out += `  background: ${base.color};\n`
  out += `  box-shadow: ${shadows.join(',\n    ')};\n`
  out += `}\n`
  return out
}

let css = '/* 像素风角色（自动生成，请勿手改） */\n\n'
css += rule('.sprite-wall', 'wall') + '\n'
css += rule('.sprite-target', 'target') + '\n'
css += rule('.sprite-box', 'box') + '\n'
css += rule('.sprite-box-on-target', 'box',
  'filter: drop-shadow(0 0 calc(var(--px) * 1.5) rgba(255,216,97,.95));') + '\n'
css += rule('.sprite-player', 'player') + '\n'

// 固定尺寸的像素脑子（主菜单 logo，支持 px / rpx 单位）
function buildFixed(selector, name, unitSize, unit) {
  const rows = arts[name]
  const pal = palettes[name]
  const shadows = []
  let base = null
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const ch = rows[y][x]
      if (ch === '.' || ch === ' ') continue
      const color = pal[ch]
      if (!base) base = { x, y, color }
      else shadows.push(`${x * unitSize}${unit} ${y * unitSize}${unit} ${color}`)
    }
  }
  const total = GRID * unitSize
  let out = `${selector} {\n  position: relative; width: ${total}${unit}; height: ${total}${unit};\n}\n`
  out += `${selector}::before {\n  content: ''; position: absolute; left: 0; top: 0;\n`
  out += `  width: ${unitSize}${unit}; height: ${unitSize}${unit}; background: ${base.color};\n`
  out += `  box-shadow: ${shadows.join(',\n    ')};\n}\n`
  return out
}

css += '\n' + buildFixed('.brain-logo', 'player', 6, 'px')

fs.writeFileSync('pixel-sprites-doubao.wxss', css)
console.log('written pixel-sprites-doubao.wxss, bytes=', css.length)

// 小程序主菜单 rpx 版像素脑子（每像素 12rpx，共 144rpx）
const rpxCss = buildFixed('.brain-logo', 'player', 12, 'rpx')
fs.writeFileSync('pixel-home-doubao.wxss', rpxCss)
console.log('written pixel-home-doubao.wxss, bytes=', rpxCss.length)
