# AGENTS.md

本文件记录 `shounian-miniapp` 仓库内“收念匣”项目的协作约定。

## 项目定位

- 当前仓库用于沉淀“收念匣”微信小程序的产品方向、交互原型与后续工程代码。
- 现阶段以 `prototypes/` 中的 HTML / CSS / JS 原型为主，正式小程序工程尚未建立。
- 后续新增正式工程时，优先放在 `miniprogram/`、`assets/`、`components/`、`pages/` 等清晰目录中。

## 资源配置边界

- 默认版本必须完整内置并可离线运行，不依赖外部资源。
- 页面与组件应优先通过 `services/copy-service.js`、`services/theme-service.js` 与 `services/resource-provider.js` 读取话术、主题和静态资源入口。
- 可替换资源仅限 `copy`、`theme`、`assets` 等静态内容；不得通过资源包替换 JS 逻辑、WXML / WXSS 结构、页面路由、本地存储模型或业务规则。
- 新增话术时优先维护 `miniprogram/config/default-copy.js`，避免在页面、组件或服务中散落硬编码中文文案。
- 新增皮肤或资源槽位时优先维护 `miniprogram/config/default-theme.js` 和资源服务入口，避免页面直接拼接未来可替换资源路径。
- 当前阶段只做默认资源分离和边界预留，不做外部下载、安装页、资源市场或远程代码执行。

## 开发原则
- 优先保持小步修改，避免在一个提交中混合产品、设计、工程化和重构。
- 修改原型时应同步检查对应的 HTML / CSS / JS 文件，避免交互与样式脱节。
- 新增正式小程序代码前，应先明确当前产品范围、页面结构、数据模型与本地存储策略。
- 不在源码中硬编码密钥、Token、AppSecret 或真实用户数据。

## 文档约定

- 产品说明、设计说明放在 `docs/specs/`。
- 执行计划、阶段拆解放在 `docs/plans/`。
- 重要方向变化应同步更新 `README.md`。

## 验证建议

- 文档改动：检查 Markdown 排版、链接路径、双语内容一致性。
- 原型改动：在浏览器中打开对应 `index.html` 做基础交互检查。
- 小程序工程改动：后续建立工程后，按微信开发者工具和项目脚本补充验证命令。

## Git 约定

- 提交信息使用中文摘要，格式为 `<type>(scope): <summary>`。
- 常用类型：`feat`、`fix`、`docs`、`refactor`、`test`、`chore`。
- 示例：`docs: 整理 README 中英双语内容`。
