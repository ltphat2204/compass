# 任务管理器 — Next.js 与 NestJS

[English](README.en.md) | **简体中文** | [Tiếng Việt](README.md)

pnpm workspace 中的独立应用：`apps/web`（Next.js App Router）、`apps/api`（NestJS + Node 内置 SQLite）以及 `packages/contracts`（共享 TypeScript 类型）。浏览器直接调用 API；Next.js 不访问数据库。

## 本地运行

需要 Node >=24.15 和 pnpm 10.22.0。在此目录执行：

```sh
pnpm install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

打开 http://localhost:3000；API 地址为 http://localhost:3001/api/tasks。Ctrl+C 或 SIGTERM 会停止两个应用。默认数据库 `apps/api/data/tasks.sqlite` 创建为空，重启时不会填充示例数据或覆盖。

## 配置

- API `.env`：`PORT` 默认 3001；`WEB_ORIGIN` 必须是准确的 web origin；必填 `DATABASE_PATH`，相对路径以 `apps/api` 为基准。配置缺失或无法打开数据库时，API 会报错退出。进程环境变量优先于文件。
- Web `.env.local`：`NEXT_PUBLIC_API_URL` 必须是 API 的 HTTP(S) origin，不能包含 `/api` 或尾部斜杠。这是公开变量，Next.js 会在 build 时嵌入；更改后需要重新 build（或重启 dev）。
- 只有 API 知道 SQLite 路径。不要将 secret 放入 `NEXT_PUBLIC_*` 变量。

## 根目录命令

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

Build 会先编译 contracts，再编译两个应用。测试使用 `tests/v3` 中的独立 acceptance suite。首次测试前安装 Chromium：

```sh
pnpm --dir tests/v3 install --frozen-lockfile
pnpm --dir tests/v3 exec playwright install chromium
```

build 后可在两个终端分别本地运行生产版本：

```sh
pnpm --filter @example/api start
pnpm --filter @example/web start
```

开发时先运行 `pnpm --filter @example/contracts build`，再执行 `pnpm --filter @example/api dev` 和 `pnpm --filter @example/web dev`。单独运行应用时可用 `PORT` 修改端口。根目录 `pnpm dev` 支持 `API_PORT` 和 `WEB_PORT`；其他配置会继承。无需修改 env 文件的示例：

```sh
API_PORT=4101 WEB_PORT=4100 WEB_ORIGIN=http://localhost:4100 NEXT_PUBLIC_API_URL=http://localhost:4101 DATABASE_PATH=/tmp/tasks-demo.sqlite pnpm dev
```

## 行为与 API

越南语界面支持添加、编辑、取消、完成状态、筛选和确认删除。标题去除首尾空格，长度为 1–200 个 Unicode code point，并保留内部空格。内容按纯文本渲染。ID 和创建时间不可变；结果按 `createdAt DESC, id DESC` 排序。SQLite 在响应前提交；GET 不缓存。并发更新采用最后写入优先。

| 请求 | 响应 |
| --- | --- |
| GET `/api/tasks` | 200 `{ tasks: Task[] }` |
| POST `/api/tasks`，body `{ title }` | 201 `{ task: Task }` |
| PATCH `/api/tasks/:id`，body 含 `title` 和/或 `completed` | 200 `{ task: Task }` |
| DELETE `/api/tasks/:id` | 204，无 body |

POST/PATCH 需要 `Content-Type: application/json`。格式错误/额外字段/JSON 错误返回 400；ID 不存在返回 404；content type 错误返回 415；存储错误返回 500。错误格式为 `{ error: { code, message } }`，不包含内部细节。CORS 仅允许准确的 `WEB_ORIGIN`，包括 preflight；这不是身份验证。

加载失败时重启 API 并选择 **Retry**。如果写入响应丢失，草稿会保留；下一次 mutation 前选择 **Retry** 重新加载。不要自动重发，因为之前的写入可能已成功。重新加载后先检查列表，避免重复添加。

限制：本地单用户应用；没有身份验证、部署、ORM，也不与其他示例同步。

## 验证

2026-10-15 本地结果记录在[walkthrough](dev/task-manager/walkthrough.md)：HTTP/API 9/9；Chromium 6/6；参考检查 9/9，发现 15 种错误变体；UI controls 15/15。干净锁文件安装、依赖顺序 build、typecheck、lint 和错误 contract 类型拒绝均通过。已检查缺少配置、CORS、真实 SQLite 错误、重启持久化、丢失响应恢复，以及 360px/1280px 键盘界面。终端进程组 Ctrl+C/SIGTERM 会停止两个应用并释放端口。独立 review READY；6/6 个任务 DONE。未检查 Safari/Firefox、远程 CI 或生产部署。

## Compass 和历史

- [PRD/intent](dev/task-manager/PRD.md)、[plan](dev/task-manager/plan.md)、[tasks](dev/task-manager/tasks.md) 和 [walkthrough](dev/task-manager/walkthrough.md)。
- [实际技能/提示历史](skill-history.md)。
- [Freeze v3](dev/task-manager/freeze-v3.json) 和 [acceptance suite 指南](tests/v3/README.md)。根目录 `pnpm test` 选择 v3；v1/v2 和源 revision 保留为历史。

PRD/plan 是已冻结的源快照；交付状态记录在 tasks 和 walkthrough 中。Artifacts 暂留于 `dev/task-manager/`，待确认完成后再由 `comp-done` 归档。
