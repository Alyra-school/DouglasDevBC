import { formatEther } from "viem"
import { Wallet, TrendingUp } from "lucide-react"
import { Spinner } from "../ui/spinner"

const Balance = ({ balance, isPending }: { balance: bigint, isPending: boolean }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Votre solde</p>
            <p className="text-xs text-muted-foreground/70">Balance disponible</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
      </div>

      {isPending ? (
        <div className="flex items-center gap-2">
          <Spinner className="w-6 h-6" />
          <span className="text-2xl font-bold text-muted-foreground">Chargement...</span>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">
              {Number(formatEther(balance)).toFixed(4)}
            </span>
            <span className="text-xl font-semibold text-muted-foreground">ETH</span>
          </div>
          <p className="text-sm text-muted-foreground">
            ≈ ${(Number(formatEther(balance)) * 3000).toFixed(2)} USD
          </p>
        </div>
      )}
    </div>
  )
}

export default Balance