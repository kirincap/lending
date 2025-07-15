import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              PolyLend
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Automated Lending for Conditional Tokens
            </span>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
