# 收念匣小程序工程结构计划

- 日期：2026-05-03
- 阶段：正式小程序骨架起步

## 目标

在保留 `prototypes/` 探索稿的同时，新增 `miniprogram/` 正式工程骨架，让后续开发可以围绕页面、组件、服务和样式逐步推进。

## 当前目录职责

```text
miniprogram/
  app.js / app.json / app.wxss       小程序入口与全局样式
  pages/                             页面
    today/                           今日记录页
    summary/                         今日卡片页
    archive/                         往日归档页
  components/                        可复用组件
    merit-box/                       功匣 / 过匣展示
    paper-slip/                      纸符输入层
    sealed-card/                     封存卡片
    action-bar/                      底部操作栏
  constants/                         文案与静态常量
  services/                          业务服务
  utils/                             日期、存储等工具
  styles/                            共享样式变量
  assets/                            后续美术资源
```

## 第一阶段实现边界

- 使用本地存储保存今日记录与归档。
- 暂不接入云开发、登录、账号体系和远程同步。
- 先保留轻量 WXSS 动效，不引入复杂动画库。
- 视觉资产先预留目录，后续再补图片、纹理和图标。

## 下一步建议

1. 在微信开发者工具中打开工程，确认页面可预览。
2. 补 `project.config.json`，明确 `miniprogramRoot`。
3. 打磨今日页交互：纸符飞入匣子的动效、封存反馈、归档详情。
4. 明确数据模型是否继续本地优先，还是进入云开发设计。
5. 补充真实美术资产：纸纹、木匣细节、图标、分享卡片背景。
