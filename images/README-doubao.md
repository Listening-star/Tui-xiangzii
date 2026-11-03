# 图片素材目录

把要替换的图片放在本目录，要求：

- 正方形、透明底 PNG（建议 128×128 或 256×256）
- 文件名与下表一致

| 文件名 | 对应元素 |
|---|---|
| wall.png | 墙壁 |
| floor.png | 地面 |
| target.png | 目标点 |
| box.png | 箱子 |
| box-on-target.png | 箱子在目标点上 |
| player.png | 玩家 |

放好后，打开 `utils/config.js`，把 `custom` 中对应元素改为 `true`，保存即生效。
只替换其中任意几个都可以，其余元素继续使用默认的 CSS 样式。
