# 收念匣当前范围 / Shounian Box Current Scope

- 日期 / Date: 2026-05-03
- 状态 / Status: 现阶段范围说明 / Current scope note

## 1. 目标 / Goal

收念匣第一版先把“每日自我记录”这件事做成立：用户能轻松记下一条功或过，把今日一念收进匣中，看到当天结果，并愿意第二天继续回来。

The first version of Shounian Box should make daily self-reflection feel real and lightweight: users can quickly record one act of virtue or fault, collect the day's thought into a box, see the day's result, and feel like coming back the next day.

## 2. 范围内 / In Scope

- 首页能直接开始记录
- 功 / 过两种动作都能记录
- 有即时反馈和当日结果
- 有简单的日结与历史查看
- 支持基础分享
- 保持“轻、安静、克制”的气质

- The home screen starts recording immediately
- Both virtue and fault actions can be recorded
- Immediate feedback and a daily result are shown
- Simple day summary and history views are available
- Basic sharing is supported
- The tone stays light, calm, and restrained

## 3. 范围外 / Out of Scope

- 社交排行榜
- 复杂账号体系
- 支付与交易
- 长篇日记编辑
- 强惩罚、强监督、羞辱式提醒
- 过重的宗教化或玄学表达

- Social leaderboards
- Complex account systems
- Payments and commerce
- Long-form diary editing
- Heavy punishment, surveillance, or shaming prompts
- Overly religious or mystical framing

## 4. 当前原型方向 / Current Prototype Direction

当前主要探索的是 `prototypes/boxes-demo/index.html`，它更接近“功过案”的产品气质；`prototypes/beans-demo/index.html` 保留为早期思路参考。

`prototypes/boxes-demo/index.html` is the main exploration path because it feels closer to the product's "daily record desk" tone. `prototypes/beans-demo/index.html` remains as an early concept reference.

## 5. 继续开发前要确认的事 / Before Continuing Development

1. 第一版是否仍然只做个人记录，不进入社交协作。
2. 正式小程序的首页是否继续沿用“案台 / 双匣”意象。
3. 日结页与历史页是否先做最小可用版本。
4. 记录数据是否先只存本地，还是直接规划云端。

1. Whether the first version stays personal-only and avoids social collaboration.
2. Whether the official mini app should keep the "desk / paired boxes" visual metaphor.
3. Whether the daily summary and history pages should be kept minimal first.
4. Whether data should start as local-only storage or be planned for cloud storage now.

## 6. 验收标准 / Acceptance

- 用户不需要学习复杂规则就能完成第一次记录。
- 当天状态能被清楚看见。
- 第二天回来的时候，用户能快速找到历史结果。

- Users can complete their first record without learning complex rules.
- The day's state is easy to understand.
- When they return the next day, they can quickly find the history result.
