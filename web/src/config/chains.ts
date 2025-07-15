import { polygon, mainnet } from 'wagmi/chains'
import { http } from 'viem'
import { createConfig } from 'wagmi'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets'

export const chains = [polygon, mainnet] as const

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        rainbowWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'PolyLend',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  }
)

export const config = createConfig({
  connectors,
  chains,
  transports: {
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
})
