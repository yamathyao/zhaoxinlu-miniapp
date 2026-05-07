# 收念匣 / Shounian Box Miniapp

> 把今日一念，轻轻收进匣中。<br>
> Gently collect each day's thoughts into a quiet box.

## 🌿 项目简介 / Overview

**收念匣** 是一个面向日常自省的微信小程序原型。用户可以记录一天中的“小功”与“小过”，把这些值得回看的一念收入对应匣中，并在一天结束时封存为一张今日卡片。

**Shounian Box** is a mini app prototype for daily self-reflection. Users can record small acts of virtue and moments of fault, place these thoughts into matching boxes, and seal them into a daily card at the end of the day.

## 🧭 当前方向 / Current Direction

当前版本先聚焦在 **每日自我记录**：

- 写下一条“功”或“过”
- 将纸符收入对应的功匣 / 过匣
- 点击匣子查看已收起的符文内容
- 当天可封存，也可解封后继续记录
- 查看今日卡片与往日归档
- 通过玩法说明与设置入口管理记录

The current version starts with **daily personal recording**:

- Write down one act of virtue or fault
- Place the paper slip into the matching virtue / fault box
- Open a box to review the slips collected inside
- Seal the day, or unseal it later on the same day to keep writing
- View the current day's card and past archive entries
- Use the help and settings entry points to understand and manage records

“收念匣”强调的是一个温和动作：把今日值得回看的念头收起来，而不是审判自己。当前视觉载体以双匣与符纸为主，未来仍可继续探索签筒、手札、账簿、灯盏，或其他更契合用户偏好的形式。

The name "Shounian Box" emphasizes a gentle action: collecting thoughts worth revisiting instead of judging oneself. The current visual metaphor focuses on paired boxes and paper slips, while future directions may still explore fortune-stick holders, handwritten booklets, ledgers, lamps, or other objects that better match user preferences.

## 🚧 当前开发进度 / Development Progress

小程序主体已经从静态骨架推进到可交互原型，当前重点放在默认版体验收口、资源配置边界预留，以及首页记录流程的仪式感与稳定性。

The Mini Program has moved from a static scaffold into an interactive prototype, with the current focus on closing the default experience, preserving resource boundaries, and stabilizing the home recording ritual.

### 🔄 进行中 / In Progress

- **默认版体验收口**：继续打磨首页写符、收入匣中、匣中查看、封存卡片和归档页的视觉稳定性；资源与话术分离只做边界预留，不接入外部下载或安装流程。<br>**Default experience closeout**: continue polishing the home writing flow, box collection, box viewer, sealed card, and archive visuals; resource and copy separation remains a boundary reservation only, without external download or install flows.

### ✅ 已完成 / Completed

- 🪶 **入场妙语**：进入小程序后先展示一句自省短句，再轻触进入今日桌面。<br>**Opening line**: shows a reflective quote before entering today's desk.
- 🧰 **双匣主界面**：今日页以功匣、过匣作为核心视觉容器。<br>**Dual-box home**: the today page centers on the virtue box and fault box.
- 📜 **写符流程**：点击“写一功”或“写一过”后，居中弹出符纸，背景完整遮罩。<br>**Slip writing flow**: tapping “write virtue” or “write fault” opens a centered paper slip with a full-screen mask.
- ✨ **收入动画**：提交后符纸飞入对应匣子，形成明确的收纳反馈。<br>**Collect animation**: submitted slips fly into the matching box.
- 🔒 **封存 / 解封**：当天记录可以封存；当天已封存时，也可以解封后继续补写。<br>**Seal / unseal**: the current day can be sealed, and can still be unsealed on the same day for more writing.
- 🔍 **匣中查看**：点击功匣或过匣会放大匣子，展示匣内符文；点击单枚符文可查看具体内容，点击空白处退出。<br>**Box viewer**: tapping a box enlarges it, shows the stored slips, lets the user inspect each slip, and closes when tapping outside.
- 🎴 **封存卡片与归档基础**：已有今日评语、封存卡片和归档页面的基础结构。<br>**Sealed card and archive base**: includes daily judgement, sealed-card presentation, and archive page scaffolding.
- 🧹 **编码整理**：小程序源文件已处理为 UTF-8 无 BOM，避免 WXSS / WXML 编译乱码。<br>**Encoding cleanup**: source files are kept as UTF-8 without BOM to avoid WXSS / WXML compilation issues.
- 🧩 **默认资源边界一期**：话术、主题 token、资源映射和默认静态素材已收敛到配置与服务入口，心灯也已作为主题资源槽接入。<br>**Default resource boundary phase 1**: copy, theme tokens, asset mapping, and default static assets are now routed through config and service entry points, with the heart lamp connected as a theme asset slot.
- 🪔 **心灯与符文体验打磨**：心灯会按功过差值阶梯变亮或变暗，匣中符文改为固定空间内堆叠，避免撑高匣子。<br>**Heart-lamp and slip polish**: the heart lamp brightens or dims by virtue/fault balance, and box slips now stack inside a fixed space without stretching the box.
- ❔ **玩法说明入口**：今日页右上角提供玩法说明入口，便于新用户快速理解记录流程。<br>**Help entry**: the today page now provides a help entry in the top-right corner for quickly understanding the recording flow.
- ⚙ **设置入口与清理能力**：今日页右上角提供设置入口，当前已支持清除当天记录与清除全部记录。<br>**Settings and cleanup**: the top-right settings entry now supports clearing today's records and clearing all records.
- ⌨ **写符弹层输入法适配**：写符弹层整体高度收短，并会在输入法弹起时跟随上移，避免底部按钮被遮挡。<br>**Keyboard-aware writing modal**: the writing modal is shorter and moves upward with the keyboard to keep action buttons reachable.
- 📝 **今日评语文案池**：今日评语已从少量固定文案升级为按日期、状态和数量稳定选择的文案池。<br>**Daily judgement pool**: daily judgement now comes from a stable pool selected by date, state, and record counts.

### 📝 待继续 / Next

- 在微信开发者工具中回归验证今日页写符弹层、顶部玩法/设置入口、清理动作、符文飞入匣子、心灯位置、封存卡片和归档页底部按钮，优先收口默认体验。<br>Run a WeChat DevTools regression pass for the writing modal, top-right help/settings entries, cleanup actions, slip-to-box animation, heart-lamp placement, sealed card, and archive bottom controls, prioritizing the default experience closeout.
- 打磨匣子放大与退出时的过渡动画，让“推近匣子”的感觉更连贯。<br>Refine the zoom-in and exit transition so opening a box feels more continuous.
- 增加更细的符纸纹理、印章、边框与书写排版。<br>Add richer paper textures, seals, borders, and writing layout details.
- 继续扩充“今日评语”文案池，并按状态组定向提高文案质量。<br>Continue expanding the daily-judgement copy pool and improve quality by tone group.
- 完善归档页的日期浏览、历史回看与长期趋势呈现。<br>Improve archive browsing, historical review, and long-term trend presentation.
- 在微信开发者工具中做更多真机 / 模拟器视觉验收。<br>Run more visual checks in WeChat DevTools and on real or simulated devices.

## 🧪 原型 / Prototypes

| 路径 / Path | 说明 / Description |
| --- | --- |
| `prototypes/boxes-demo/index.html` | 当前主要探索方向，包含双匣、纸符、封存卡片与归档查看。<br>Main exploration prototype, including paired boxes, paper slips, sealed cards, and archive browsing. |
| `prototypes/beans-demo/index.html` | 早期探索稿，包含赤豆 / 青豆、心灯与功过记录玩法。<br>Early concept prototype, including red / green beans, a heart lamp, and virtue-fault recording interactions. |

## 📚 文档 / Docs

| 路径 / Path | 说明 / Description |
| --- | --- |
| `docs/specs/2026-04-27-gongguo-beans-design.md` | 早期玩法与设计说明。<br>Early gameplay and design notes. |
| `docs/plans/2026-04-27-gongguo-demo-plan.md` | 原型实现计划记录。<br>Prototype implementation plan. |
| `docs/specs/2026-05-03-current-scope.md` | 当前产品范围说明。<br>Current scope note. |
| `docs/specs/2026-05-06-resource-boundary-spec.md` | 默认资源边界与未来静态资源分离规范。<br>Default resource boundary and future static-resource separation spec. |
| `docs/specs/2026-05-07-midjourney-visual-assets.md` | Midjourney 视觉资源接入规范与暂缓记录。<br>Midjourney visual-asset integration notes and pause record. |
| `docs/specs/2026-05-07-theme-package-rules.md` | 主题文件规则、目录规范与 fallback 约束。<br>Theme package rules, directory conventions, and fallback constraints. |
| `docs/progress/2026-05-06-work-progress.md` | 2026-05-06 今日开发内容、验证与下一步。<br>2026-05-06 work progress, validation, and next steps. |
| `docs/progress/2026-05-07-work-progress.md` | 2026-05-07 今日开发内容、设置功能、评语池与下一步。<br>2026-05-07 work progress, settings features, judgement pool, and next steps. |

## 🛠️ 当前状态 / Current Status

当前目录同时保留 HTML / CSS / JS 原型与正式微信小程序骨架。`prototypes/` 用于快速探索交互与视觉方向，`miniprogram/` 用于后续正式开发。

This directory now keeps both HTML / CSS / JS prototypes and the formal WeChat Mini Program scaffold. `prototypes/` is for fast interaction and visual exploration, while `miniprogram/` is for ongoing product development.

- `miniprogram/`：微信小程序主体代码，包括页面、组件、服务与样式。<br>Mini Program source code, including pages, components, services, and styles.
- `prototypes/`：早期 HTML 原型与视觉探索。<br>Early HTML prototypes and visual explorations.
- `docs/`：设计说明、范围说明与实现计划。<br>Design notes, scope notes, and implementation plans.
- `assets/`：后续放置图像、图标与美术资源。<br>Future home for images, icons, and art assets.

## 开发方式 / Development

1. 在微信开发者工具中导入仓库根目录。
2. 工程入口指向 `miniprogram/`。
3. 当前版本不需要微信登录、头像、手机号或云开发。
4. 数据全部保存在本地微信 storage 中。
5. 测试时可先清空本地缓存，再重新打开首页验证首日状态。

## ✨ 项目愿景 / Vision

收念匣希望把自我记录做得轻、安静、可持续：不强调评判，而是帮助用户把每天的一念妥帖收好，并在日复一日的小记录里看见自己的变化。

Shounian Box aims to make self-reflection light, calm, and sustainable. Instead of emphasizing judgment, it helps users collect each day's thoughts with care and notice their own changes through small daily records.

## 📄 许可 / License

本项目使用 MIT License。详情见 `LICENSE`。

This project is released under the MIT License. See `LICENSE` for details.
