# 任务管理器 — React + Vite

[English](README.en.md) | **简体中文** | [Tiếng Việt](README.md)

Compass 示例项目 1。技术栈：React、TypeScript、Vite；pnpm 管理项目依赖。产品需求见 [PRD.md](dev/task-manager/PRD.md)。用户于 2026-10-14 接受本地交付；5/5 个任务已完成。

## 功能

一个独立的越南语单页浏览器应用：

- 添加、行内编辑、取消编辑、确认删除，以及完成/重新打开任务。
- 三种状态筛选；最新任务优先；空列表和无匹配结果分别提示。
- 首次打开时提供三个示例任务；`localStorage` 在刷新后保留修改和空列表。
- Unicode 标题校验、安全文本渲染，并处理损坏或被阻止的存储；写入失败时保留数据和表单输入。
- 适配 360px/1280px，包含输入标签、可见焦点和键盘支持。

AC-01–AC-07 已在[walkthrough](dev/task-manager/walkthrough.md)中验证。[技能和提示历史](skill-history.md#实际提示历史)记录了请求及测试/review 迭代。PRD 和 plan 是已冻结快照；当前完成状态记录在 README、tasks 和 walkthrough 中。

## 本地运行

```sh
cd example/react-vite
pnpm install
pnpm dev
```

打开终端输出的 Vite 地址。按 Vite 指南需要 Node 20.19+ 或 22.12+；实现时使用 Node 26.9.0 和 pnpm 10.22.0。

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm preview
```

使用官方命令创建脚手架：`pnpm create vite <target> --template react-ts --no-interactive --no-immediate`（[Vite 指南](https://vite.dev/guide/)）。

## 测试

测试使用 Node 原生 TypeScript 支持。验证使用 Node 26；此 runner 尚未用更低版本 Node 检查。

```sh
pnpm test
pnpm test:controls
pnpm exec playwright install chromium
pnpm test:browser
```

Playwright 会在 127.0.0.1:4173 启动开发服务器；该端口必须空闲。测试套件由独立作者编写，经独立 review 后冻结于 [test-freeze.json](test-freeze.json)。

## 使用与限制

首次启动包含三个示例任务。输入标题后点击 Add 或按 Enter。每行可编辑并选择 Save/Cancel；复选框切换完成状态；通过 All/Active/Completed 筛选。删除和恢复示例数据都需要确认。

标题会去除首尾空格，长度为 1–200 个 Unicode code point，可重复。数据使用当前 origin 专属键 `compass-example-react-vite.tasks.v1`；刷新后保留修改和空列表。其他 origin/端口使用独立存储。损坏数据会保留，直到用户确认重置。无法读取存储时会禁用写入；写入失败会保留列表和表单供重试。

没有业务 API、后端或 secret。仅支持单个标签页；设备或多个标签页之间不会同步。重置会用示例数据替换列表，并要求确认。

## 验证结果

- Domain 8/8；controls 8/8；Chromium browser 12/12。
- Build 和 typecheck PASS；lint 退出码 0，有一条已 review 的 localStorage 初始化警告。
- 检查了 360px/1280px 截图、键盘 CRUD、刷新、console，以及没有业务 fetch/XHR。
- 保留 v1 套件；通过完整 PRD/plan revision 和 v2 review/freeze 修复 harness 问题，没有为了错误测试改变产品行为。

独立代码和交付 review：READY，无 blocker。未部署；未检查 Firefox/Safari。最新交付状态见 walkthrough。
