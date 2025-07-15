import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Lending Platform',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [mainnet, polygon, arbitrum],
  ssr: true, // Important for Next.js
})

export const chains = [mainnet, polygon, arbitrum]
