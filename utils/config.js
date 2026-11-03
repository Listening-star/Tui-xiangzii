// 图片素材配置（每个元素可独立替换）
//
// 替换步骤：
// 1. 准备一张正方形、透明底 PNG（建议 128x128）；
// 2. 按下面 images 里的文件名命名，放进 images 目录；
// 3. 把 custom 中对应元素改为 true，保存即生效。
//    不想替换的元素保持 false，会继续使用默认的 CSS 绘制样式。
const config = {
  custom: {
    wall: false,        // 墙壁
    floor: false,       // 地面
    target: false,      // 目标点
    box: false,         // 箱子
    boxOnTarget: false, // 箱子在目标点上
    player: false       // 玩家
  },
  images: {
    wall: '/images/wall.png',
    floor: '/images/floor.png',
    target: '/images/target.png',
    box: '/images/box.png',
    boxOnTarget: '/images/box-on-target.png',
    player: '/images/player.png'
  }
}

module.exports = config
