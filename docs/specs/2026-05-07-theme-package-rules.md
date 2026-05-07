# 主题文件规则

- 日期：2026-05-07
- 状态：执行稿
- 范围：内置主题目录、主题文件命名、资源槽位、fallback 与禁止项

## 1. 目标

主题资源应支持独立新增，不覆盖 `default`。`default` 始终作为内置兜底主题存在；Midjourney 或其他美术主题放在独立目录中，通过主题配置切换和覆盖部分资源。

本规则只约束静态资源与主题元数据，不允许主题包改变页面结构、交互逻辑、路由、存储或业务规则。

## 2. 目录结构

每个主题放在 `miniprogram/assets/themes/<theme-id>/` 下。

```text
miniprogram/assets/themes/
  default/
    paper-texture.png
    box-body.png
    box-lid.png
    card-bg.png
    seal.png
    heart-lamp.png
  midjourney-wood/
    theme.json
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

`default` 可以继续使用历史文件名和兼容槽位；新主题必须优先使用本规则中的标准文件名。

## 3. theme-id 规则

- 只能使用小写英文、数字和连字符。
- 不能使用中文、空格、下划线或特殊符号。
- 语义应描述主题风格，而不是日期或临时用途。

示例：

```text
default
midjourney-wood
ink-paper
moon-lamp
quiet-brass
```

## 4. theme.json 规则

每个非 `default` 主题目录应包含 `theme.json`。当前阶段可以先用 JS 配置承载同样字段；后续若接入自动发现主题，再直接读取 `theme.json`。

```json
{
  "id": "midjourney-wood",
  "name": "Midjourney 木匣主题",
  "version": "1.0.0",
  "base": "default",
  "themeClass": "theme-midjourney-wood",
  "assets": {
    "bgPaper": "/assets/themes/midjourney-wood/bg-paper.png",
    "deskSurface": "/assets/themes/midjourney-wood/desk-surface.png",
    "boxGongBody": "/assets/themes/midjourney-wood/box-gong-body.png",
    "boxGongLid": "/assets/themes/midjourney-wood/box-gong-lid.png",
    "boxGuoBody": "/assets/themes/midjourney-wood/box-guo-body.png",
    "boxGuoLid": "/assets/themes/midjourney-wood/box-guo-lid.png",
    "paperSlipGong": "/assets/themes/midjourney-wood/paper-slip-gong.png",
    "paperSlipGuo": "/assets/themes/midjourney-wood/paper-slip-guo.png",
    "paperSlipEditor": "/assets/themes/midjourney-wood/paper-slip-editor.png",
    "cardBg": "/assets/themes/midjourney-wood/card-bg.png",
    "sealIcon": "/assets/themes/midjourney-wood/seal.png",
    "sealRibbon": "/assets/themes/midjourney-wood/seal-ribbon.png",
    "heartLamp": "/assets/themes/midjourney-wood/heart-lamp.png",
    "dustMotes": "/assets/themes/midjourney-wood/dust-motes.png"
  }
}
```

字段说明：

- `id`：必须与目录名一致。
- `name`：面向配置和文档的人类可读名称。
- `version`：主题资源版本，使用 `MAJOR.MINOR.PATCH`。
- `base`：当前只允许 `"default"`。
- `themeClass`：预留给主题级样式差异，当前不允许主题包自带 WXSS。
- `assets`：资源槽位到小程序绝对路径的映射。

当前代码入口：

```text
miniprogram/config/active-theme.js
miniprogram/config/theme-assets.js
miniprogram/config/theme-registry.js
miniprogram/config/default-theme.js
miniprogram/services/resource-provider.js
```

- `active-theme.js`：配置当前启用的 `ACTIVE_THEME_ID`。
- `theme-assets.js`：维护标准文件名与资源槽位的映射。
- `theme-registry.js`：登记可用主题，主题资源路径可由 `buildThemeAssets(root)` 自动生成。
- `default-theme.js`：只保存默认兜底主题和兼容资源。
- `resource-provider.js`：把当前主题与 `DEFAULT_THEME` 合并，缺失字段回退默认主题。

## 5. 标准文件名

| 文件名 | 槽位 | 分级 | 说明 |
| --- | --- | --- | --- |
| `theme.json` | - | 必需 | 主题元数据 |
| `bg-paper.png` | `bgPaper` | 必需 | 首页纸纹背景 |
| `box-gong-body.png` | `boxGongBody` | 必需 | 功匣匣身 |
| `box-gong-lid.png` | `boxGongLid` | 必需 | 功匣匣盖 |
| `box-guo-body.png` | `boxGuoBody` | 必需 | 过匣匣身 |
| `box-guo-lid.png` | `boxGuoLid` | 必需 | 过匣匣盖 |
| `paper-slip-editor.png` | `paperSlipEditor` | 必需 | 写符弹层大符纸 |
| `paper-slip-gong.png` | `paperSlipGong` | 推荐 | 功符小符纸 |
| `paper-slip-guo.png` | `paperSlipGuo` | 推荐 | 过符小符纸 |
| `card-bg.png` | `cardBg` | 推荐 | 封存卡片底图 |
| `heart-lamp.png` | `heartLamp` | 推荐 | 心灯 |
| `seal.png` | `sealIcon` | 可选 | 印章 |
| `seal-ribbon.png` | `sealRibbon` | 可选 | 封条 |
| `desk-surface.png` | `deskSurface` | 可选 | 桌面底纹 |
| `dust-motes.png` | `dustMotes` | 可选 | 尘光或颗粒层 |

## 6. 图片制作规则

- 图片统一使用 PNG。
- 需要独立叠加或动画的资源应使用透明背景：匣身、匣盖、符纸、印章、封条、心灯。
- 背景类资源可以不透明：`bg-paper.png`、`desk-surface.png`、`card-bg.png`。
- 图片中不得写死标题、日期、评语、按钮文字或用户记录内容。
- 文字区域必须留白，确保小程序 WXML 文本仍可读。
- 同一主题内资源视角、光源和材质应一致。
- 文件名固定，不随主题名变化。

## 7. Fallback 规则

主题加载时应遵循以下顺序：

1. 优先使用当前主题的 `assets.<slot>`。
2. 当前主题缺失时回退到 `DEFAULT_THEME.assets.<slot>`。
3. 若新槽位在 `default` 中也不存在，回退到旧兼容槽位。
4. 若仍不存在，页面使用 CSS 兜底视觉，不中断主流程。

兼容映射：

| 新槽位 | 兼容兜底 |
| --- | --- |
| `bgPaper` | `paperTexture` |
| `deskSurface` | CSS 舞台光晕 |
| `boxGongBody` | `boxBody` |
| `boxGongLid` | `boxLid` |
| `boxGuoBody` | `boxBody` |
| `boxGuoLid` | `boxLid` |
| `paperSlipGong` | CSS 功符纸 |
| `paperSlipGuo` | CSS 过符纸 |
| `paperSlipEditor` | CSS 写符纸 |
| `sealRibbon` | 不展示 |
| `dustMotes` | 不展示 |

## 8. 禁止项

主题目录中不得包含或替换以下内容：

- JS、WXML、WXSS、WXS 文件
- 页面路由、tabBar、权限配置
- 本地存储结构和迁移逻辑
- 网络请求、远程脚本或可执行代码
- 用户数据、默认记录或隐私内容
- 任何密钥、token、appid、账号信息

主题只能改变静态视觉资源和未来允许的主题 token。

## 9. Midjourney 工作流

1. 先创建新主题目录，例如 `miniprogram/assets/themes/midjourney-wood/`。
2. 按标准文件名导出 PNG。
3. 写入或更新 `theme.json`。
4. 在 `theme-registry.js` 登记主题：

```js
const { buildThemeAssets } = require("./theme-assets");

const THEME_REGISTRY = {
  default: {
    id: "default",
    name: "木匣纸符默认主题",
    themeClass: "theme-default",
    assetsRoot: "/assets/themes/default",
    assets: buildThemeAssets("/assets/themes/default"),
  },
  "ink-paper": {
    id: "ink-paper",
    name: "水墨纸页主题",
    themeClass: "theme-ink-paper",
    assetsRoot: "/assets/themes/ink-paper",
    assets: buildThemeAssets("/assets/themes/ink-paper"),
  },
};
```

5. 在 `active-theme.js` 切换当前主题：

```js
const ACTIVE_THEME_ID = "ink-paper";
```

6. 在微信开发者工具中验证首页、写符、飞入、查看匣中、封存卡片和归档页。
7. 如果某张图效果不好，只替换对应 PNG，不改页面代码。

## 10. 验收标准

- 新主题不覆盖 `default` 文件。
- 删除新主题任一推荐或可选资源后，页面仍能运行并回退。
- 功匣与过匣可以使用不同图层。
- 写符弹层、飞入符纸、匣中符纸和封存卡片均由主题资源驱动。
- 主题包不包含任何逻辑文件或敏感信息。
