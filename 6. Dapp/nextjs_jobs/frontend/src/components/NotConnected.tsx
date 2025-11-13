import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet } from "lucide-react"

const NotConnected = () => {
  return (
    <Alert className="bg-orange-100 text-background">
      <Wallet />
      <AlertTitle>Attention !</AlertTitle>
      <AlertDescription className="text-background">
        Veuillez connecter votre Wallet
      </AlertDescription>
    </Alert>
  )
}

export default NotConnected