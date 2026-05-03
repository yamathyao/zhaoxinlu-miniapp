# 收念匣 / Shounian Box Miniapp

> 把今日一念，轻轻收进匣中。<br>
> Gently collect each day's thoughts into a quiet box.

## 🌿 项目简介 / Overview

**收念匣** 是一个面向日常自省的微信小程序原型。用户可以记录一天中的“小功”与“小过”，把这些值得回看的一念收入对应匣中，并在一天结束时封存为一张今日卡片。

**Shounian Box** is a mini app prototype for daily self-reflection. Users can record small acts of virtue and moments of fault, place these thoughts into matching boxes, and seal them into a daily card at the end of the day.

## 🧭 当前方向 / Current Direction

当前版本先聚焦在 **每日自我记录**：

- 写下一条“功”或“过”
- 将纸符收入对应容器
- 在当天结束时封存成今日卡片
- 后续回看自己的内在变化

The current version starts with **daily personal recording**:

- Write down one act of virtue or fault
- Place the paper slip into the matching container
- Seal the day's entries into a daily card
- Review inner changes over time

“收念匣”强调的是一个温和动作：把今日值得回看的念头收起来，而不是审判自己。当前视觉载体以双匣为主，未来仍可继续探索签筒、手札、账簿、灯盏，或其他更契合用户偏好的形式。

The name "Shounian Box" emphasizes a gentle action: collecting thoughts worth revisiting instead of judging oneself. The current visual metaphor focuses on paired boxes, while future directions may still explore fortune-stick holders, handwritten booklets, ledgers, lamps, or other objects that better match user preferences.

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

## 🛠️ 当前状态 / Current Status

当前目录同时保留 HTML / CSS / JS 原型与正式微信小程序骨架。`prototypes/` 用于快速探索交互与视觉方向，`miniprogram/` 用于后续正式开发。

This directory now keeps both HTML / CSS / JS prototypes and the formal WeChat Mini Program scaffold. `prototypes/` is for fast interaction and visual exploration, while `miniprogram/` is for ongoing product development.

- `miniprogram/`
- `assets/`
- `components/`
- `pages/`

## ✨ 项目愿景 / Vision

收念匣希望把自我记录做得轻、安静、可持续：不强调评判，而是帮助用户把每天的一念妥帖收好，并在日复一日的小记录里看见自己的变化。

Shounian Box aims to make self-reflection light, calm, and sustainable. Instead of emphasizing judgment, it helps users collect each day's thoughts with care and notice their own changes through small daily records.

## 📄 许可 / License

本项目使用 MIT License。详情见 `LICENSE`。

This project is released under the MIT License. See `LICENSE` for details.
