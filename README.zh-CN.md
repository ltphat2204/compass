# Compass

[English](README.md) | [Tiếng Việt](README.vi.md) | **简体中文**

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

**把想法或错误报告变成明确需求、可用代码和验证证据。**

Compass 为编程代理提供九个技能。从 `comp-engineer` 开始：它会选择下一步，遵循仓库惯例，并按任务规模调整规划深度。

## 安装

每个编程代理选择一种安装方式。

### Codex

在终端运行：

```sh
codex plugin marketplace add ltphat2204/compass
codex plugin add compass@compass
```

打开新的 Codex 会话，选择 `compass:comp-engineer`，或在 CLI 中输入 `$compass:comp-engineer`。需要支持 `codex plugin` 的 Codex 版本。

### Claude Code

在 Claude Code 内运行：

```text
/plugin marketplace add ltphat2204/compass
/plugin install compass@compass
```

使用 `/compass:comp-engineer` 开始。

### Cursor、GitHub Copilot、OpenCode 及其他代理

在需要使用 Compass 的项目目录中运行：

```sh
npx skills add ltphat2204/compass --skill '*' --copy
```

按提示选择编程代理。这会将全部九个技能及其资源安装到该项目。选择 `comp-engineer` 开始。

[更新、卸载、原生角色与故障排查 →](docs/installation.md)

## 开始工作

使用 Codex 插件：

```text
$compass:comp-engineer 为任务列表添加 CSV 导出。允许限定范围的子代理和
独立审查。完成实现与验证后在本地交接。
```

Claude Code 中使用 `/compass:comp-engineer`。复制安装的技能可通过选择器或宿主的技能语法调用 `comp-engineer`。

描述一个功能、错误或尚不明确的想法。Compass 会检查仓库，明确关键决策，并推进已获授权的规划、实现与验证。只要求规划或审查时，工作会在相应阶段停止。

## 工作方式

```text
Intent → Plan → Tasks → Implement → Ship → Done
```

Analyze 和 Review 检查各阶段交接。小任务使用更简短的文档；行为变更仍要求独立编写测试、独立验证并在实现前冻结测试。缺少所需子代理的宿主可以规划和审查，但不能通过实现门槛。

需求、任务和证据保存在 `dev/{feature}/`。Compass 使用现有技术栈和工具。部署、合并与破坏性操作遵循项目授权和规则。

| 技能 | 用途 |
|---|---|
| `comp-engineer` | 协调整个流程或继续已有工作 |
| `comp-intent` | 明确问题和成功标准 |
| `comp-plan` | 选择实现方案 |
| `comp-tasks` | 跟踪任务及依赖 |
| `comp-analyze` | 检查需求和文档一致性 |
| `comp-implement` | 实现已就绪任务并验证结果 |
| `comp-review` | 按需求审查变更 |
| `comp-ship` | 检查并交付结果 |
| `comp-done` | 归档已接受的工作 |

## 更多信息

- [工作流程、测试门槛与示例](docs/workflow.md)
- [安装与更新](docs/installation.md)
- [示例应用：React、Next.js 和 Next.js + NestJS](example/README.md)
- [验证结果与各宿主的限制](evals/results.md)
- [维护者检查与插件提交](docs/publishing.md)
