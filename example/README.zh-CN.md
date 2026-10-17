# Compass 实践示例

[English](README.en.md) | **简体中文** | [Tiếng Việt](README.md)

以下三个项目使用同一个**任务管理**问题，复杂度逐步增加，用于体验 Compass 技能。三个应用均已实现并完成本地检查；证据和技能调用历史保存在各自项目中。

| 级别 | 项目 / 指南 | PRD | 技术栈 | 目标 |
| --- | --- | --- | --- | --- |
| 1 — 基础 | [react-vite](react-vite/README.md) | [需求](react-vite/dev/task-manager/PRD.md) | React、Vite、TypeScript | 不调用 API 的独立界面。 |
| 2 — 中级 | [nextjs-fullstack](nextjs-fullstack/README.md) | [需求](nextjs-fullstack/dev/_archived/20261015/task-manager/PRD.md) | Next.js、TypeScript | 单项目全栈应用。 |
| 3 — 高级 | [nextjs-nestjs-monorepo](nextjs-nestjs-monorepo/README.md) | [需求](nextjs-nestjs-monorepo/dev/task-manager/PRD.md) | pnpm workspace、Next.js、NestJS、TypeScript | 前后端分离的 monorepo。 |

请在各项目目录安装依赖；Compass 仓库没有统一运行这三个项目的命令。环境要求、配置和测试命令见各项目 README。README、tasks 和 walkthrough 记录交付状态；已冻结的 PRD/plan 保留为历史快照。

## 1. React + Vite：无 API 界面

- 列出、添加、编辑、删除任务并标记完成。
- 按状态筛选，使用示例数据并通过 `localStorage` 保存更改。
- 响应式布局、空列表状态和必填标题校验。
- 验收标准：浏览器操作正常，刷新后数据保留，且不产生 API 请求。

此级重点是明确 UI 需求、管理状态并验证客户端行为。

**2026-10-14 已确认：**越南语应用完成全部 5/5 个任务并满足 AC-01–AC-07。使用官方 Vite 命令创建脚手架；CRUD、三个筛选器、持久化和客户端存储恢复均已验证。Domain 8/8、controls 8/8、Chromium 12/12；build 和 typecheck 通过，lint 退出码为 0，有一条已 review 的警告。独立 review 结果为 READY。未部署生产环境，也未检查 Safari/Firefox。

参见[运行指南](react-vite/README.md)、[验证证据](react-vite/dev/task-manager/walkthrough.md)和[实际技能/提示历史](react-vite/skill-history.md#实际提示历史)。

## 2. Next.js：全栈

- 保留项目 1 的任务操作，并将数据存入 SQLite。
- 使用 Next.js App Router 和 Route Handlers 实现 CRUD。
- 在服务端校验数据；界面显示加载和保存错误状态。
- 验收标准：界面请求经过服务端，重启后数据仍在，并拒绝无效数据。

此级增加 UI → 服务端 → 数据库流程、错误处理和集成测试。身份验证和授权不在范围内。

**2026-10-15 本地结果：**已使用 Next.js 16.4.1、App Router/Route Handlers、TypeScript 和 Node 内置 SQLite 完成验证。API 5/5、controls 31/31、Chromium 14/14（11 个应用流程和 3 个 harness controls）；真实存储错误、可重复 schema 初始化及重启后数据保留均通过。锁文件安装、build、typecheck 和 lint 通过。独立交付 review 为 READY；6/6 个任务 DONE。未部署生产环境，也未检查 Safari/Firefox。

参见[运行说明](nextjs-fullstack/README.md)、[证据](nextjs-fullstack/dev/_archived/20261015/task-manager/walkthrough.md)和[技能/提示历史](nextjs-fullstack/skill-history.md)。

## 3. pnpm workspace：Next.js + NestJS

- 在 pnpm workspace 中将 Next.js 放在 `apps/web`，NestJS 放在 `apps/api`。
- NestJS 管理 API 和 SQLite；Next.js 通过 API 管理任务。
- 通过 `packages/contracts` 共享请求/响应类型，并在后端进行运行时校验。
- 在 workspace 根目录配置 API 地址、CORS 和命令。
- 验收标准：从根目录安装，运行两个应用，通过 API 完成 CRUD，并构建整个 workspace。

此级增加应用边界、API 合约、内部依赖和多服务集成检查。

**2026-10-15 本地结果：**已使用 Next.js 16.4.1、NestJS 12.1.3 和 Node 内置 SQLite 完成验证。API 9/9、Chromium 6/6；参考测试 9/9，15 种错误变体全部被发现；UI controls 15/15。干净锁文件安装、依赖顺序构建、typecheck、lint 和错误 contract 类型拒绝均通过。终端进程组收到 SIGINT/SIGTERM 后两个应用均停止并释放端口。界面在 360px/1280px、键盘操作和缺少配置情况下完成检查。未部署生产环境，也未检查 Safari/Firefox。

参见[运行说明](nextjs-nestjs-monorepo/README.md)、[验证证据](nextjs-nestjs-monorepo/dev/task-manager/walkthrough.md)和[技能/提示历史](nextjs-nestjs-monorepo/skill-history.md)。

## 技能使用与历史

使用 `comp-engineer` 执行 SDD 生命周期，或按阶段调用：`comp-intent` → `comp-plan` → `comp-tasks` → `comp-analyze` → `comp-implement` → `comp-review` → `comp-ship`。确认完成并需要归档 artifacts 时使用 `comp-done`。遵循各技能的 gates，包括测试验证、review/freeze，以及行为实现前的 context 分离。

每个项目都有独立的 `skill-history.md`，按追加方式记录实际技能调用，包括失败或受阻的尝试。不要把计划中的调用记录为已完成。适用时链接到 intent、plan、tasks 和验证证据。三个项目都完成了计划、测试编写/review/freeze 和实现；实际结果见各项目 walkthrough。
