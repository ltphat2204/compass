# 示例 2：全栈任务管理器

[English](README.en.md) | **简体中文** | [Tiếng Việt](README.md)

独立的越南语应用，使用 Next.js App Router、TypeScript、Route Handlers 和 SQLite。支持添加/编辑/删除/确认/取消、完成状态及三种筛选。数据通过同源 HTTP API 写入服务端；任务不存入 localStorage。

## 本地运行

已验证环境：Node 26.9.0、pnpm 10.22.0、Next.js 16.4.1、React 19.3.0。SQLite 使用内置 `node:sqlite`，无需 ORM 或独立数据库服务。

```sh
cd example/nextjs-fullstack
pnpm install --frozen-lockfile
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

打开[本地应用](http://localhost:3000)。默认数据库为 `data/tasks.sqlite`，初始为空。schema 初始化可重复执行且不会删除数据；API 在 schema 缺失时也会创建。不会自动填充示例数据；保留数据库文件即可在重启后保留数据。

如需使用其他数据库路径，请在同一 shell 中、**初始化和启动应用之前**导出变量：

```sh
export DATABASE_PATH="$PWD/data/custom.sqlite"
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

相对路径以项目目录为基准。[.env.example](.env.example) 说明该变量；`db:init` 直接通过 Node 运行，不会读取 Next.js `.env` 文件。两个命令须使用同一导出变量。不要提交数据库或 journal/WAL 文件；这些文件已忽略。备份数据库前先停止应用。

本地运行生产构建：

```sh
pnpm build
pnpm start --hostname 127.0.0.1
```

## 行为与 API

标题会去除首尾空格，长度为 1–200 个 Unicode code point，允许重复并保留内部空格。ID 和时间由服务端创建，编辑时不变。结果按最新优先，ID 降序作为并列顺序。标题按纯文本渲染。

| API | 成功响应 |
| --- | --- |
| `GET /api/tasks` | `200 { tasks: Task[] }` |
| `POST /api/tasks`，body `{ title }` | `201 { task: Task }` |
| `PATCH /api/tasks/:id`，body 含 `title` 和/或 `completed` | `200 { task: Task }` |
| `DELETE /api/tasks/:id` | `204`，无 body |

错误 JSON/body/字段/类型返回 400，不支持的 content type 返回 415，ID 不存在返回 404，存储错误返回通用 500。错误格式为 `{ error: { code, message } }`。

界面仅在保存成功后更新。失败时保留草稿和原数据，并提供重新加载列表的操作。由于响应丢失时服务端可能已成功写入，mutation 不会自动重试；重试前请重新加载并确认状态。任务状态不再匹配时会从当前筛选中移除。空列表和筛选无结果分别提示；表单有标签，支持键盘焦点和小屏布局。

这是本地单用户示例，没有身份验证、授权或生产部署。

## 验证

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` 运行独立 controls、HTTP/API、Chromium UI、真实 SQLite 故障及重启/schema 重复初始化检查。runner 使用临时数据库和 3102 端口，会停止其进程，不会删除 `data/`。测试使用生产服务器，因此先执行 build。端口占用时运行 `TEST_PORT=3112 pnpm test`；仅运行 controls：`pnpm test:controls`。

2026-10-15 本地结果：锁文件安装、build、typecheck、lint PASS；HTTP/API 5/5、controls 31/31、Chromium 14/14。真实 SQLite 故障、重复 schema 初始化和重启后数据保留均通过。用户接受本地交付。独立 review READY；6/6 个任务 DONE。未检查 Safari/Firefox、远程 CI 或生产部署。参见[最终 review](dev/_archived/20261015/task-manager/final-review.md)和[walkthrough](dev/_archived/20261015/task-manager/walkthrough.md)。

## Compass 和历史

- [PRD/intent](dev/_archived/20261015/task-manager/PRD.md)、[plan](dev/_archived/20261015/task-manager/plan.md)、[tasks](dev/_archived/20261015/task-manager/tasks.md)、[walkthrough](dev/_archived/20261015/task-manager/walkthrough.md)。
- [实际技能/提示历史](skill-history.md)，包括测试修复和 review 迭代。
- 当前 v2 freeze 和保留的 v1 artifacts 可从越南语 README 查看。归档规格保留为历史快照。
