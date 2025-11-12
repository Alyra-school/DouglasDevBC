import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-xl font-bold text-white">SS</span>
          </div>
          <span className="hidden font-bold text-xl md:inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SimpleStorage
          </span>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header