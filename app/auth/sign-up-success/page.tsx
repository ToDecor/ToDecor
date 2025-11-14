import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Inscription réussie !</h1>
          <p className="text-muted-foreground mt-2">Veuillez confirmer votre email avant de continuer</p>
        </div>
        <Button asChild>
          <Link href="/auth/login">Aller à la connexion</Link>
        </Button>
      </div>
    </div>
  )
}
