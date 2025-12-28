import { Box, Text, useInput } from 'ink';
import type React from 'react';
import type { LocalJSXCommand } from '../types';

interface StatsDisplayProps {
  onExit: (message: string) => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ onExit }) => {
  // 模拟统计数据（演示用）
  const stats = {
    thisWeek: {
      codeGenerated: 2847,
      bugsFixed: 31,
      timeSaved: 12.5,
      codeReviews: 18,
      commits: 45,
      linesRefactored: 1523,
    },
    thisMonth: {
      codeGenerated: 11234,
      bugsFixed: 127,
      timeSaved: 48.3,
      codeReviews: 73,
      commits: 189,
      linesRefactored: 5891,
    },
    total: {
      codeGenerated: 45678,
      bugsFixed: 523,
      timeSaved: 198.7,
      codeReviews: 294,
      commits: 756,
      linesRefactored: 23456,
    },
  };

  // 监听按键，任意键退出
  useInput((_input, key) => {
    if (key.return || key.escape || _input === 'q') {
      onExit('');
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      flexDirection="column"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📊 开发效率统计报告
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">─────────────────────────────────────────────</Text>
      </Box>

      {/* 本周统计 */}
      <Box marginBottom={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="yellow">
            📅 本周统计
          </Text>
        </Box>
        <Box marginLeft={2} flexDirection="column">
          <Text>
            <Text color="green">✓</Text> 生成代码:{' '}
            <Text bold color="cyan">
              {stats.thisWeek.codeGenerated.toLocaleString()}
            </Text>{' '}
            行
          </Text>
          <Text>
            <Text color="green">✓</Text> 修复 Bug:{' '}
            <Text bold color="cyan">
              {stats.thisWeek.bugsFixed}
            </Text>{' '}
            个
          </Text>
          <Text>
            <Text color="green">✓</Text> 节省时间:{' '}
            <Text bold color="cyan">
              约 {stats.thisWeek.timeSaved}
            </Text>{' '}
            小时
          </Text>
          <Text>
            <Text color="green">✓</Text> Code Review:{' '}
            <Text bold color="cyan">
              {stats.thisWeek.codeReviews}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> Git 提交:{' '}
            <Text bold color="cyan">
              {stats.thisWeek.commits}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> 重构代码:{' '}
            <Text bold color="cyan">
              {stats.thisWeek.linesRefactored.toLocaleString()}
            </Text>{' '}
            行
          </Text>
        </Box>
      </Box>

      {/* 本月统计 */}
      <Box marginBottom={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="magenta">
            📅 本月统计
          </Text>
        </Box>
        <Box marginLeft={2} flexDirection="column">
          <Text>
            <Text color="green">✓</Text> 生成代码:{' '}
            <Text bold color="magenta">
              {stats.thisMonth.codeGenerated.toLocaleString()}
            </Text>{' '}
            行
          </Text>
          <Text>
            <Text color="green">✓</Text> 修复 Bug:{' '}
            <Text bold color="magenta">
              {stats.thisMonth.bugsFixed}
            </Text>{' '}
            个
          </Text>
          <Text>
            <Text color="green">✓</Text> 节省时间:{' '}
            <Text bold color="magenta">
              约 {stats.thisMonth.timeSaved}
            </Text>{' '}
            小时
          </Text>
          <Text>
            <Text color="green">✓</Text> Code Review:{' '}
            <Text bold color="magenta">
              {stats.thisMonth.codeReviews}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> Git 提交:{' '}
            <Text bold color="magenta">
              {stats.thisMonth.commits}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> 重构代码:{' '}
            <Text bold color="magenta">
              {stats.thisMonth.linesRefactored.toLocaleString()}
            </Text>{' '}
            行
          </Text>
        </Box>
      </Box>

      {/* 总计统计 */}
      <Box marginBottom={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="blue">
            📈 累计统计
          </Text>
        </Box>
        <Box marginLeft={2} flexDirection="column">
          <Text>
            <Text color="green">✓</Text> 生成代码:{' '}
            <Text bold color="blue">
              {stats.total.codeGenerated.toLocaleString()}
            </Text>{' '}
            行
          </Text>
          <Text>
            <Text color="green">✓</Text> 修复 Bug:{' '}
            <Text bold color="blue">
              {stats.total.bugsFixed}
            </Text>{' '}
            个
          </Text>
          <Text>
            <Text color="green">✓</Text> 节省时间:{' '}
            <Text bold color="blue">
              约 {stats.total.timeSaved}
            </Text>{' '}
            小时
          </Text>
          <Text>
            <Text color="green">✓</Text> Code Review:{' '}
            <Text bold color="blue">
              {stats.total.codeReviews}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> Git 提交:{' '}
            <Text bold color="blue">
              {stats.total.commits}
            </Text>{' '}
            次
          </Text>
          <Text>
            <Text color="green">✓</Text> 重构代码:{' '}
            <Text bold color="blue">
              {stats.total.linesRefactored.toLocaleString()}
            </Text>{' '}
            行
          </Text>
        </Box>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">─────────────────────────────────────────────</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="green">💡 效率提升显著！继续保持！</Text>
      </Box>

      <Box>
        <Text color="gray">(按 Enter/ESC/q 退出)</Text>
      </Box>
    </Box>
  );
};

export function createStatsCommand(): LocalJSXCommand {
  return {
    type: 'local-jsx',
    name: 'stats',
    description: '查看开发效率统计报告',
    async call(onDone, _context, _args) {
      const StatsComponent = () => {
        return (
          <StatsDisplay
            onExit={(message) => {
              onDone(message);
            }}
          />
        );
      };
      return <StatsComponent />;
    },
  };
}
