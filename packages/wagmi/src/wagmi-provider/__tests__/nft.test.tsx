import { NFTCard } from '@ant-design/web3';
import { Mainnet } from '@ant-design/web3-assets';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mainnet } from 'wagmi/chains';

import { MetaMask } from '../../wallets';
import { AntDesignWeb3ConfigProvider } from '../config-provider';

vi.mock('wagmi/actions', () => ({
  readContract: async () => {
    return 'http://nft-metadata.com';
  },
  getAccount: () => ({}),
  disconnect: () => {},
}));

vi.mock('wagmi', () => {
  return {
    useConfig: () => {
      return {};
    },
    // https://wagmi.sh/react/hooks/useAccount
    useAccount: () => {
      return {
        chain: mainnet,
        isDisconnected: false,
        address: '0x21CDf0974d53a6e96eF05d7B324a9803735fFd3B',
      };
    },
    useConnect: () => {
      return {
        connectors: [],
        connectAsync: async () => {
          return {};
        },
      };
    },
    useDisconnect: () => {
      return {
        disconnectAsync: () => {},
      };
    },
    useSwitchChain: () => {
      return {
        switchChain: () => {},
      };
    },
    useBalance: () => {
      return {};
    },
    useEnsName: () => ({}),
  };
});

describe('WagmiWeb3ConfigProvider getMetadata', () => {
  it('NFT Metadata', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        json: () => {
          return {
            name: 'NFT name',
            description: 'NFT description',
            image: 'http://nft-metadata.com',
          };
        },
      } as any);
    });

    const App = () => (
      <AntDesignWeb3ConfigProvider
        availableChains={[mainnet]}
        availableConnectors={[]}
        walletFactorys={[MetaMask()]}
        chainAssets={[Mainnet]}
      >
        <NFTCard tokenId={213} address="0x1234" />
      </AntDesignWeb3ConfigProvider>
    );
    const { baseElement } = render(<App />);
    await waitFor(() => {
      expect(baseElement.querySelector('.ant-web3-nft-card-name')?.textContent).toBe('NFT name');
    });
  });
});
