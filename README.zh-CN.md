# Compass

[English](README.md) | [Tiếng Việt](README.vi.md) | **简体中文**

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

本项目采用 [Apache License 2.0](LICENSE) 许可。

**把想法或错误报告变成明确需求、可用代码和验证证据。**

Compass 为编程代理提供九个技能。从 `comp-engineer` 开始：它会选择下一步，遵循仓库惯例，并按任务规模调整规划深度。

## 为什么有 Compass

AI 生成代码的速度可能快于开发者理解成果或验证问题是否解决的速度。新手可能得到可运行的结果，却不了解其行为和限制。经验丰富的开发者仍可能需要亲自分析、拆分工作、考虑边界情况并逐步指导 AI。Compass 旨在弥补这两方面的不足。

对于新手，Compass 将想法连接到具体行为，解释值得理解的决策，并展示结果如何验证。对于经验丰富的开发者，它会检查代码库、质疑假设、比较方案，并在授权范围内推进工作直至验证。用户决定目标和重要的产品选择；代理负责该范围内的工程分析和执行。

无论请求只是一个症状、尚不明确的想法还是一个里程碑，Compass 都会调整工作方式，让下一步清晰可懂，并依据证据判断工作是否完成。

## 理念

**目标指明方向；证据决定下一步。** 职责和质量门槛保持一致，执行方式则根据任务规模、风险和可用工具调整。

1. **先明确意图，再实现。** 定义问题、范围、约束和可观察的成功标准。先检查仓库；无法推断重要决策时再询问。
2. **先看证据，再定方案。** 使用现有架构、惯例、工具链和 CI。不强加任务不需要的技术栈、架构层或依赖。
3. **用最小改动完整解决问题。** 复用现有模式，并依据行为和数据影响安排防护措施。
4. **分布式执行，责任清晰。** Coordinator 分配并集成工作、决定 DONE；implementer 在范围内自主工作；reviewer 独立检查。
5. **验证要证明结果。** 每项标准都有检查方法和实际证据。报告、工具缺失和跳过的检查都不算通过。
6. **变更后仍可追溯。** 恢复或重新规划时，保留 intent → plan → task → evidence → delivery 链接、稳定 ID、决策、备注和历史。
7. **自主权以授权为界。** 在授权范围内继续安全工作。合并、部署、破坏性数据更改和外部操作遵循项目授权与规则。

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
