import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Admin auth check - User:", user?.id)

  if (!user) {
    console.log("[v0] No user found, redirecting to login")
    redirect("/auth/login?redirect=/admin")
  }

  const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  console.log("[v0] Profile check - is_admin:", profile?.is_admin, "Error:", error)

  if (!profile?.is_admin) {
    console.log("[v0] User is not admin, redirecting to home")
    redirect("/?error=unauthorized")
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
