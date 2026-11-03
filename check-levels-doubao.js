// 关卡可解性验证：推箱子级 BFS（玩家可达性 + 角落死锁剪枝）
const levels = require('./utils/levels.js')

const k = (r, c) => r + ',' + c

function parse(map) {
  const rows = map.length
  const cols = Math.max(...map.map(r => r.length))
  const walls = new Set()
  const targets = new Set()
  const boxes = new Set()
  let player = null
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = c < map[r].length ? map[r][c] : ' '
      const key = k(r, c)
      if (ch === '#') walls.add(key)
      if (ch === '.' || ch === '*' || ch === '+') targets.add(key)
      if (ch === '$' || ch === '*') boxes.add(key)
      if (ch === '@' || ch === '+') player = key
    }
  }
  return { walls, targets, boxes, player }
}

// 玩家在当前箱子配置下可到达的格子
function reachable(player, walls, boxes) {
  const seen = new Set([player])
  const queue = [player]
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  while (queue.length) {
    const [r, c] = queue.shift().split(',').map(Number)
    for (const [dr, dc] of dirs) {
      const key = k(r + dr, c + dc)
      if (walls.has(key) || boxes.has(key) || seen.has(key)) continue
      seen.add(key)
      queue.push(key)
    }
  }
  return seen
}

function cornerDeadlock(bkey, walls, targets) {
  if (targets.has(bkey)) return false
  const [r, c] = bkey.split(',').map(Number)
  const u = walls.has(k(r - 1, c)), d = walls.has(k(r + 1, c))
  const l = walls.has(k(r, c - 1)), rr = walls.has(k(r, c + 1))
  return (u && l) || (u && rr) || (d && l) || (d && rr)
}

function solvable(level) {
  const { walls, targets, boxes, player } = parse(level.map)
  const start = player + '|' + [...boxes].sort().join(';')
  const seen = new Set([start])
  const queue = [{ player, boxes }]
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  while (queue.length) {
    const cur = queue.shift()
    if ([...cur.boxes].every(b => targets.has(b))) return true
    const reach = reachable(cur.player, walls, cur.boxes)
    for (const b of cur.boxes) {
      const [r, c] = b.split(',').map(Number)
      for (const [dr, dc] of dirs) {
        const pusher = k(r - dr, c - dc)   // 玩家需站的位置
        const dest = k(r + dr, c + dc)      // 箱子新位置
        if (!reach.has(pusher)) continue
        if (walls.has(dest) || cur.boxes.has(dest)) continue
        if (cornerDeadlock(dest, walls, targets)) continue
        const nboxes = new Set(cur.boxes)
        nboxes.delete(b)
        nboxes.add(dest)
        const state = b + '|' + [...nboxes].sort().join(';')
        if (!seen.has(state)) {
          seen.add(state)
          queue.push({ player: b, boxes: nboxes })
        }
      }
    }
  }
  return false
}

let allOk = true
levels.forEach(lv => {
  const ok = solvable(lv)
  if (!ok) allOk = false
  console.log(`${lv.name}：${ok ? '可解' : '*** 不可解 ***'}`)
})
console.log(allOk ? '\n全部关卡可解 ✓' : '\n存在不可解关卡 ✗')
process.exit(allOk ? 0 : 1)
