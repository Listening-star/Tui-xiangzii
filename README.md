# 脑子推植物 · 草坪主题推箱子

一个纯单机、无需服务器的**微信小程序**，把经典推箱子（Sokoban）做成了卡通草坪主题：
玩家是一颗会走路的**脑子**，推动一株株**植物**去喂饱**僵尸**，每过关都会弹出大字 **「脑子吃掉了你的僵尸」**。

## 玩法与元素

| 经典推箱子 | 本主题 |
|---|---|
| 玩家 | 脑子 |
| 箱子 | 植物 |
| 目标点 | 僵尸 |
| 箱子到位 | 植物对上僵尸（金色发光） |
| 墙 | 树篱 |
| 地面 | 草地（棋盘深浅交替） |

## 功能特性

- 12 个由易到难的关卡，全部经过自动求解器验证可解
- 方向按钮 + 屏幕滑动两种操作
- 撤销、重开、步数统计
- 主菜单、选关、设置、关于共 5 个页面
- 关卡解锁与进度保存在本地（`wx.setStorageSync`）
- 音效、震动开关
- 支持自定义图片替换（每个元素可独立开关）
- 纯单机、无需联网、无需服务器

## 快速开始

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 打开开发者工具，选择「导入项目」，目录选择本仓库根目录。
3. AppID 可先选择「测试号」（当前 `project.config.json` 为 `touristappid`）。
4. 导入后即可在模拟器中游玩，也可点「预览」用手机扫码体验。

> 无需安装任何依赖，也不需要构建步骤。

## 浏览器预览

不想装开发者工具也可以直接双击打开 `sokoban-preview-doubao.html`，
它是一个等价的单页 HTML 版本，用键盘方向键或屏幕按钮即可试玩全部页面。

## 目录结构

```
.
├── app.js / app.json / app.wxss     小程序入口、全局数据与配置
├── project.config.json              开发者工具项目配置
├── sitemap.json
├── utils/
│   ├── levels.js                    12 个关卡数据
│   └── config.js                    自定义图片开关与路径
├── pages/
│   ├── home/                        主菜单
│   ├── index/                       游戏页
│   ├── levels/                      选关页
│   ├── settings/                    设置页
│   └── about/                       关于页
├── images/                          自定义图片目录
├── sokoban-preview-doubao.html       浏览器预览版
└── check-levels-doubao.js           关卡可解性验证脚本
```

## 自定义图片

把正方形、透明底 PNG（建议 128×128 或 256×256）按以下文件名放入 `images/`，
再把 `utils/config.js` 中对应开关改为 `true` 即可：

`wall.png`、`floor.png`、`target.png`、`box.png`、`box-on-target.png`、`player.png`

## 添加关卡

关卡数据在 `utils/levels.js`，使用标准 Sokoban 字符：

`#` 墙、`.` 目标、`$` 箱子、`*` 箱子在目标、`@` 玩家、`+` 玩家在目标、空格为地面。

## 技术栈

原生微信小程序（WXML / WXSS / JavaScript），无第三方框架、无游戏引擎。
核心逻辑基于二维数组、碰撞检测、推箱子判定与历史快照栈。

## License

MIT
