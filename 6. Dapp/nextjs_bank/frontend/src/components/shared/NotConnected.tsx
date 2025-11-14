import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, Wallet } from "lucide-react"

const NotConnected = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenue sur Bankalyra</h2>
          <p className="text-muted-foreground">Connectez votre portefeuille pour commencer</p>
        </div>

        <Alert className="border-2">
          <AlertCircleIcon className="h-5 w-5" />
          <AlertTitle className="text-lg">Attention!</AlertTitle>
          <AlertDescription className="text-base">
            Veuillez vous connecter à notre DApp en cliquant sur le bouton "Connect Wallet" en haut à droite.
          </AlertDescription>
        </Alert>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-sm text-foreground mb-2">Fonctionnalités :</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              Déposer des ETH en toute sécurité
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              Retirer vos fonds à tout moment
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              Consulter l'historique des transactions
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotConnected