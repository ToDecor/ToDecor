import { AuthLogin } from "@/components/auth-login"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <AuthLogin />
    </Suspense>
  )
}
