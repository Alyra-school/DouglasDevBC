import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bankalyra</h1>
              <p className="text-xs text-muted-foreground">Decentralized Banking</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header