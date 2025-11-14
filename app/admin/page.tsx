"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch orders count and revenue
        const { data: orders } = await supabase.from("orders").select("id, total_amount, vat_amount")

        const { data: products } = await supabase.from("products").select("id")

        const { data: profiles } = await supabase.from("profiles").select("id")

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

        setStats({
          totalOrders: orders?.length || 0,
          totalRevenue,
          totalProducts: products?.length || 0,
          totalCustomers: profiles?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [supabase])

  const dashboardCards = [
    {
      title: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-blue-100 to-blue-50",
    },
    {
      title: "Produits",
      value: stats.totalProducts,
      icon: Package,
      color: "from-amber-100 to-amber-50",
    },
    {
      title: "Chiffre d'affaires",
      value: `${stats.totalRevenue.toLocaleString("fr-TN")} DT`,
      icon: DollarSign,
      color: "from-green-100 to-green-50",
    },
    {
      title: "Clients",
      value: stats.totalCustomers,
      icon: Users,
      color: "from-purple-100 to-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Bienvenue dans votre espace d'administration ToDecor</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className={`bg-gradient-to-br ${card.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Consultez vos commandes, produits et messages dans les sections dédiées.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
