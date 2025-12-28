import { Box, Text, useInput } from 'ink';
import type React from 'react';
import { useState } from 'react';
import { useAppStore } from '../../ui/store';
import type { LocalJSXCommand } from '../types';

interface TokenInputProps {
  onSubmit: (token: string) => void;
  onCancel: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onSubmit, onCancel }) => {
  const [token, setToken] = useState('');

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.return) {
      if (token.trim()) {
        onSubmit(token.trim());
      }
      return;
    }

    if (key.backspace || key.delete) {
      setToken((prev) => prev.slice(0, -1));
      return;
    }

    // Handle character input (including pasted content)
    if (input && !key.ctrl && !key.meta) {
      // Filter out non-printable characters
      const printableInput = Array.from(input)
        .filter((char) => {
          const charCode = char.charCodeAt(0);
          return (charCode >= 32 && charCode <= 126) || charCode >= 160;
        })
        .join('');

      if (printableInput) {
        setToken((prev) => prev + printableInput);
      }
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor="blue"
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Box marginBottom={1}>
        <Text bold color="blue">
          登录 BIOSAN 管理平台
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">
          平台地址: https://mgplat.biosan.cn/manage/login
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="cyan">请输入您的 Token: </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="yellow">Token: </Text>
        <Text color="cyan">{'*'.repeat(token.length)}</Text>
        <Text color="gray">{token ? '' : '|'}</Text>
      </Box>

      <Box>
        <Text color="gray">(Enter: 提交, ESC: 取消)</Text>
      </Box>
    </Box>
  );
};

interface LoginSelectProps {
  onExit: (message: string) => void;
}

export const LoginSelect: React.FC<LoginSelectProps> = ({ onExit }) => {
  const { bridge, cwd } = useAppStore();

  const handleTokenSubmit = async (token: string) => {
    try {
      // Save token to global config
      const result = await bridge.request('config.set', {
        cwd,
        isGlobal: true,
        key: 'biosanToken',
        value: token,
      });

      if (result.success) {
        onExit('✓ 登陆成功');
      } else {
        onExit('✗ 登陆失败');
      }
    } catch (error) {
      onExit(`✗ 登陆时出错: ${error}`);
    }
  };

  const handleCancel = () => {
    onExit('登录已取消');
  };

  return <TokenInput onSubmit={handleTokenSubmit} onCancel={handleCancel} />;
};

export function createLoginCommand(): LocalJSXCommand {
  return {
    type: 'local-jsx',
    name: 'login',
    description: '登录 BIOSAN 管理平台',
    async call(onDone, _context, _args) {
      const LoginComponent = () => {
        return (
          <LoginSelect
            onExit={(message) => {
              onDone(message);
            }}
          />
        );
      };
      return <LoginComponent />;
    },
  };
}
