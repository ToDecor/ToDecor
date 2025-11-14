"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Download } from "lucide-react"

interface Order {
  id: string
  order_number: string
  total_amount: number
  vat_amount: number
  status: string
  created_at: string
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  processing: { label: "En cours", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
        fetchOrders(user.id)
      }
    }

    checkAuth()
  }, [supabase, router])

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDownloadInvoice = (orderId: string, orderNumber: string) => {
    // In production, this would generate and download an actual PDF
    window.open(`/api/invoices/${orderNumber}.pdf`, "_blank")
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Tableau de bord client</h1>
              <p className="text-muted-foreground mt-2">Bienvenue {user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>

          {/* Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mes commandes</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Vous n'avez pas encore de commandes</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("fr-TN")}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {(order.total_amount + order.vat_amount).toLocaleString("fr-TN")} DT
                            </p>
                            <Badge className={config.color}>{config.label}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(order.id, order.order_number)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Facture
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}
