import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, mainnet, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'REVA',
  projectId: 'c4f79cc821944d9680842e34466bfb',
  chains: [bsc, mainnet, polygon],
  ssr: false,
});

export const ADMIN_WALLET = '0x6bA6285C16880fbACED253C48B5F575C429fD884'.toLowerCase();
