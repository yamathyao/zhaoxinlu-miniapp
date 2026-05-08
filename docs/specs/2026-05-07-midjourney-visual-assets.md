# Midjourney 视觉资源接入规范

- 日期：2026-05-07
- 状态：执行稿
- 范围：默认主题静态美术资源、资源槽位与动画配合方式

## 1. 目标

让“收念匣”的图片质感可以由 Midjourney 产出的静态图提升，同时保持小程序交互、动画、数据与页面逻辑仍由本地代码控制。

本阶段只支持内置资源替换：把图片放入 `miniprogram/assets/themes/default/`，再由 `miniprogram/config/default-theme.js` 映射到页面和组件。暂不做远程下载、资源市场或运行时安装。

## 2. 设计原则

- Midjourney 负责静态质感：纸纹、木匣、符纸、印章、封条、灯盏、桌面。
- WXSS 负责动态仪式感：入场、飞入、推近、封存、呼吸、明暗和轻微视差。
- 页面和组件只读取 `theme.assets`，不直接写死具体文件名。
- 新资源槽位必须有旧槽位或 CSS 兜底，避免图片缺失导致页面不可用。
- 资源包不得替换 JS、WXML、WXSS、路由、存储与业务流程。

## 3. 推荐目录

```text
miniprogram/assets/themes/default/
  bg-paper.png
  desk-surface.png
  box-gong-body.png
  box-gong-lid.png
  box-guo-body.png
  box-guo-lid.png
  paper-slip-gong.png
  paper-slip-guo.png
  paper-slip-editor.png
  card-bg.png
  seal.png
  seal-ribbon.png
  heart-lamp.png
  dust-motes.png
```

## 4. 资源槽位

| 槽位 | 用途 | 兜底 |
| --- | --- | --- |
| `bgPaper` | 首页全屏纸纹背景 | `paperTexture` |
| `deskSurface` | 首页桌面/舞台底纹 | CSS 光晕 |
| `boxGongBody` | 功匣匣身 | `boxBody` |
| `boxGongLid` | 功匣匣盖 | `boxLid` |
| `boxGuoBody` | 过匣匣身 | `boxBody` |
| `boxGuoLid` | 过匣匣盖 | `boxLid` |
| `paperSlipGong` | 功符小符纸 | CSS 符纸 |
| `paperSlipGuo` | 过符小符纸 | CSS 符纸 |
| `paperSlipEditor` | 写符弹层大符纸 | CSS 纸面 |
| `cardBg` | 封存卡片底图 | CSS 卡片 |
| `sealRibbon` | 封存封条 | 不展示 |
| `sealIcon` | 印章 | 不展示 |
| `heartLamp` | 心灯 | CSS 心灯 |
| `dustMotes` | 轻微尘光/颗粒 | 不展示 |

## 5. Midjourney 出图建议

### 首页背景

- 文件：`bg-paper.png`
- 画面：浅暖宣纸或手账纸，轻微纤维纹理，边缘弱暗角。
- 要求：不要文字，不要明显主体，不要过暗。
- 建议比例：`3:4` 或 `9:16`。

### 桌面底纹

- 文件：`desk-surface.png`
- 画面：温润木桌或厚纸桌面，中心留给双匣。
- 要求：低对比、弱纹理，不抢主视觉。
- 建议比例：`4:3`。

### 双匣

- 文件：`box-gong-body.png`、`box-gong-lid.png`、`box-guo-body.png`、`box-guo-lid.png`
- 画面：正面略俯视的东方木匣，功匣偏暖红铜，过匣偏青灰木色。
- 要求：透明背景 PNG；匣盖与匣身视角一致；匣盖单独出图。
- 建议比例：匣身 `1:1`，匣盖 `3:1`。

### 符纸

- 文件：`paper-slip-gong.png`、`paper-slip-guo.png`、`paper-slip-editor.png`
- 画面：窄长符纸和大张书写符纸，有纸纤维、边缘磨损、淡印纹。
- 要求：中间保留可读文字区域；不要写死文字。
- 建议比例：小符纸 `1:3`，大符纸 `2:3`。

### 封存与心灯

- 文件：`card-bg.png`、`seal.png`、`seal-ribbon.png`、`heart-lamp.png`
- 画面：封存卡片可带纸纹与边框；印章和封条透明背景；心灯透明背景并有中心亮部。
- 要求：不要把日期、标题、评语画进图里。

## 6. 验证方式

- 清空缓存后打开今日页，首页、双匣、写符、飞入、封存、归档仍可完成。
- 删除任意新槽位图片后，页面仍回退到旧资源或 CSS 视觉。
- 功匣与过匣可以使用不同图片，互不影响。
- 写符弹层、飞入小符纸、匣中符纸和封存卡片均不直接依赖硬编码文件路径。

## 7. 2026-05-07 暂缓记录

本阶段暂缓继续推进 Midjourney / 主题替换开发。原因是偏写实或单张生成图直接替换现有图层时，容易与当前小程序的背景、光源、比例、遮罩和动画锚点不匹配，视觉上会显得突兀。

如果后续重启美术资源替换，优先考虑二维插画风格或扁平分层资源：

- 使用更接近当前 WXML / WXSS 图层结构的二维资源。
- 保持正面或轻微俯视的固定视角。
- 每个对象独立透明 PNG，便于代码控制位移、缩放、旋转和透明度。
- 先做一张视觉基准稿，确认光源、比例、边缘透明区和动画锚点，再批量生成其他图。
- 不优先采用完整写实场景图或强透视单图替换。
