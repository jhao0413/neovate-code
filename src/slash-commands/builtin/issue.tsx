import { Box, Text } from 'ink';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../ui/store';
import type { LocalJSXCommand } from '../types';

interface Issue {
  id: number;
  title: string;
  productName: string;
  priority: string;
}

interface IssueListProps {
  onExit: (message: string) => void;
}

const priorityColors: Record<string, string> = {
  HIGH: 'red',
  MEDIUM: 'yellow',
  LOW: 'green',
};

const priorityLabels: Record<string, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

export const IssueList: React.FC<IssueListProps> = ({ onExit }) => {
  const { bridge, cwd } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shouldExit, setShouldExit] = useState(false);
  const [exitMessage, setExitMessage] = useState<string>('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // 获取保存的 token
        const tokenResult = await bridge.request('config.get', {
          cwd,
          isGlobal: true,
          key: 'biosanToken',
        });

        if (!tokenResult.success || !tokenResult.data.value) {
          setError('未找到登录 Token，请先执行 /login 命令');
          setExitMessage('未找到登录 Token，请先执行 /login 命令');
          setShouldExit(true);
          setLoading(false);
          return;
        }

        const token = tokenResult.data.value;
        const timestamp = Date.now().toString();

        // 调用接口
        const response = await fetch(
          'https://mgplat.biosan.cn/manage/server/issue/getIssuePage',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
              Connection: 'keep-alive',
              'Content-Type': 'application/json; charset=UTF-8',
              Origin: 'https://mgplat.biosan.cn',
              Referer: 'https://mgplat.biosan.cn/manage/dashboard/filter',
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
              timestamp,
              token,
            },
            body: JSON.stringify({
              pageSize: 50,
              pageNum: 1,
              actorId: 55,
              productIdList: [2, 3, 5, 6, 9, 10, 11, 36, 37, 41],
              total: 87,
              issueStatusList: ['START'],
              responsiblePersonIdSet: [55],
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.code !== 10000) {
          throw new Error(result.message || '接口返回错误');
        }

        // 提取需要的字段
        const issueList: Issue[] = result.data.data.map((item: any) => ({
          id: item.block.id,
          title: item.block.title,
          productName: item.block.productName,
          priority: item.block.priority,
        }));

        if (issueList.length === 0) {
          setExitMessage('没有找到 Issue');
          setShouldExit(true);
        }

        setIssues(issueList);
        setLoading(false);
      } catch (err) {
        const errorMsg = `获取 Issue 列表失败: ${err}`;
        setError(errorMsg);
        setExitMessage(errorMsg);
        setShouldExit(true);
        setLoading(false);
      }
    };

    fetchIssues();
  }, [bridge, cwd]);

  // Handle exit after render
  useEffect(() => {
    if (shouldExit && exitMessage) {
      onExit(exitMessage);
    }
  }, [shouldExit, exitMessage, onExit]);

  if (loading) {
    return (
      <Box
        borderStyle="round"
        borderColor="blue"
        flexDirection="column"
        padding={1}
      >
        <Text color="cyan">正在加载 Issue 列表...</Text>
      </Box>
    );
  }

  if (error || shouldExit) {
    return null;
  }

  if (issues.length === 0) {
    return null;
  }

  return (
    <Box
      borderStyle="round"
      borderColor="blue"
      flexDirection="column"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="blue">
          Issue 列表 (共 {issues.length} 个)
        </Text>
      </Box>

      {issues.map((issue, index) => (
        <Box key={issue.id} flexDirection="column" marginBottom={1}>
          <Box>
            <Text color="gray">{index + 1}. </Text>
            <Text bold>{issue.title}</Text>
          </Box>
          <Box marginLeft={3}>
            <Text color="cyan">产品: {issue.productName}</Text>
            <Text> | </Text>
            <Text color={priorityColors[issue.priority] || 'white'}>
              优先级: {priorityLabels[issue.priority] || issue.priority}
            </Text>
          </Box>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text color="gray">按任意键退出...</Text>
      </Box>
    </Box>
  );
};

export function createIssueCommand(): LocalJSXCommand {
  return {
    type: 'local-jsx',
    name: 'issue',
    description: '查看 BIOSAN 平台的 Issue 列表',
    async call(onDone, _context, _args) {
      const IssueComponent = () => {
        return (
          <IssueList
            onExit={(message) => {
              onDone(message);
            }}
          />
        );
      };
      return <IssueComponent />;
    },
  };
}
