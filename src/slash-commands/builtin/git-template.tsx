import { Box, Text, useInput } from 'ink';
import type React from 'react';
import { useState } from 'react';
import type { LocalJSXCommand } from '../types';

interface GitTemplateSelectProps {
  onExit: (message: string) => void;
}

const GitTemplateSelect: React.FC<GitTemplateSelectProps> = ({ onExit }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const templates = [
    {
      name: 'Commit Message',
      key: 'commit',
      description: '生成符合公司规范的 Commit 信息模板',
      template: `feat: [模块名] 功能描述

详细说明：
- 具体修改内容 1
- 具体修改内容 2
- 具体修改内容 3

影响范围：
- 影响的模块或功能

测试情况：
✓ 单元测试已通过
✓ 集成测试已通过

关联需求/Bug：#issue-number

Co-authored-by: 开发者姓名 <email@biosan.cn>`,
    },
    {
      name: 'Pull Request',
      key: 'pr',
      description: '生成 Pull Request 描述模板',
      template: `## 📝 变更说明

### 变更类型
- [ ] 新功能 (New Feature)
- [ ] Bug 修复 (Bug Fix)
- [ ] 代码重构 (Refactoring)
- [ ] 性能优化 (Performance)
- [ ] 文档更新 (Documentation)
- [ ] 其他 (Other)

### 变更内容
简要描述本次 PR 的主要变更内容...

### 实现方案
1. 第一步做了什么
2. 第二步做了什么
3. 第三步做了什么

## 🧪 测试情况

### 测试环境
- [ ] 本地开发环境
- [ ] 测试环境
- [ ] 预发布环境

### 测试用例
- [ ] 功能测试已通过
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 回归测试已通过

## 📋 检查清单

- [ ] 代码已经过自测
- [ ] 代码符合团队编码规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 无安全漏洞
- [ ] 性能影响可接受

## 🔗 相关链接

- 需求文档: [链接]
- 设计文档: [链接]
- 关联 Issue: #issue-number

## 📸 截图/演示

（如有必要，请添加截图或 GIF 演示）

---
**审核人员**: @reviewer1 @reviewer2`,
    },
    {
      name: 'Issue Report',
      key: 'issue',
      description: '生成 Issue 报告模板',
      template: `## 🐛 问题描述

简要描述遇到的问题...

## 📍 问题位置

- **文件路径**: src/example/file.ts
- **函数/模块**: functionName
- **代码行**: 123-456

## 🔄 复现步骤

1. 第一步操作
2. 第二步操作
3. 第三步操作
4. 观察到的问题

## ✅ 期望行为

描述应该出现的正确行为...

## ❌ 实际行为

描述实际出现的错误行为...

## 🖥️ 环境信息

- **操作系统**: Linux/macOS/Windows
- **Node 版本**: v18.x.x
- **项目版本**: v1.0.0
- **浏览器** (如适用): Chrome/Firefox/Safari

## 📋 错误日志

\`\`\`
粘贴相关的错误日志或堆栈跟踪...
\`\`\`

## 📸 截图

（如有必要，请添加截图）

## 💡 可能的解决方案

（可选）如果有想法，可以描述可能的解决方案...

## 🏷️ 标签

- [ ] bug
- [ ] enhancement
- [ ] documentation
- [ ] question

---
**优先级**: High/Medium/Low
**严重程度**: Critical/Major/Minor`,
    },
    {
      name: 'Code Review',
      key: 'review',
      description: '生成 Code Review 检查清单',
      template: `## 🔍 Code Review 检查清单

### 代码质量

- [ ] 代码逻辑清晰，易于理解
- [ ] 变量和函数命名规范且语义明确
- [ ] 代码复用性良好，无明显重复代码
- [ ] 代码结构合理，模块划分清晰
- [ ] 遵循公司编码规范和最佳实践

### 功能实现

- [ ] 功能实现完整，符合需求
- [ ] 边界条件处理正确
- [ ] 异常处理完善
- [ ] 参数校验充分
- [ ] 返回值正确

### 性能和安全

- [ ] 无明显性能问题
- [ ] 数据库查询优化合理
- [ ] 无 SQL 注入风险
- [ ] 无 XSS 攻击风险
- [ ] 无敏感信息泄露
- [ ] 输入验证和过滤充分

### 测试

- [ ] 单元测试覆盖充分
- [ ] 测试用例设计合理
- [ ] 边界测试完整
- [ ] 集成测试通过

### 文档

- [ ] 代码注释充分且准确
- [ ] 复杂逻辑有说明
- [ ] API 文档已更新
- [ ] README 已更新（如需要）

### 其他

- [ ] 无调试代码残留
- [ ] 日志输出合理
- [ ] 配置文件正确
- [ ] 依赖版本合理

---
**审核结果**: ✅ 通过 / ⚠️ 需修改 / ❌ 不通过

**审核意见**:
（在此填写详细的审核意见和建议）`,
    },
  ];

  useInput((input, key) => {
    if (key.escape) {
      onExit('已取消');
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : templates.length - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev < templates.length - 1 ? prev + 1 : 0));
      return;
    }

    if (key.return) {
      const selected = templates[selectedIndex];
      onExit(
        `\n📋 ${selected.name} 模板：\n\n${selected.template}\n\n✅ 模板已生成，您可以复制使用！`,
      );
      return;
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor="green"
      flexDirection="column"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="green">
          🔧 Git 工作流模板生成器
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">选择您需要的模板类型：</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        {templates.map((template, index) => (
          <Box key={template.key} marginBottom={0}>
            <Text
              color={index === selectedIndex ? 'cyan' : 'white'}
              bold={index === selectedIndex}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              {template.name}
            </Text>
            <Text color="gray"> - {template.description}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text color="gray">(↑↓: 选择, Enter: 确认, ESC: 取消)</Text>
      </Box>
    </Box>
  );
};

export function createGitTemplateCommand(): LocalJSXCommand {
  return {
    type: 'local-jsx',
    name: 'git-template',
    description: '生成 Git 工作流模板 (Commit/PR/Issue/Review)',
    async call(onDone, _context, _args) {
      const GitTemplateComponent = () => {
        return (
          <GitTemplateSelect
            onExit={(message) => {
              onDone(message);
            }}
          />
        );
      };
      return <GitTemplateComponent />;
    },
  };
}
