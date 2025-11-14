"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { updateOrderStatus } from "@/lib/actions/admin-actions"
import { Eye, FileText } from "lucide-react"

interface Order {
  id: string
  order_number: string
  total_amount: number
  vat_amount: number
  status: string
  payment_method: string
  delivery_address: string
  delivery_city: string
  created_at: string
  user_id: string
}

interface Profile {
  first_name: string
  last_name: string
  phone: string
  id: string
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  processing: { label: "En cours", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      // Get unique user IDs
      const userIds = [...new Set(ordersData?.map((o) => o.user_id) || [])]

      // Fetch profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone")
        .in("id", userIds)

      if (profilesError) throw profilesError

      // Create a map of profiles by ID
      const profilesMap: Record<string, Profile> = {}
      profilesData?.forEach((profile) => {
        profilesMap[profile.id] = profile
      })

      setOrders(ordersData || [])
      setProfiles(profilesMap)
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await fetchOrders()
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
    }
  }

  const handleGenerateInvoice = async (orderId: string) => {
    setGeneratingInvoice(orderId)
    try {
      const response = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invoice")
      }

      // Open invoice in new window
      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(data.htmlContent)
        newWindow.document.close()
      }

      alert("Facture générée avec succès!")
      await fetchOrders()
    } catch (error) {
      console.error("[v0] Error generating invoice:", error)
      alert("Erreur lors de la génération de la facture")
    } finally {
      setGeneratingInvoice(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des commandes</h1>
        <p className="text-muted-foreground mt-2">Consultez et gérez toutes les commandes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {orders.length} commande{orders.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                const profile = profiles[order.user_id]

                return (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border rounded-lg hover:bg-muted/30"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-TN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {profile && (
                        <>
                          <p className="text-sm text-muted-foreground mt-1">
                            Client: {profile.first_name} {profile.last_name}
                          </p>
                          {profile.phone && <p className="text-sm text-muted-foreground">Tél: {profile.phone}</p>}
                        </>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_city && `Livraison: ${order.delivery_city}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {(order.total_amount + order.vat_amount).toLocaleString("fr-TN")} DT
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{order.payment_method}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-1 rounded border border-border bg-background text-sm"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="processing">En cours</option>
                        <option value="delivered">Livrée</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateInvoice(order.id)}
                        disabled={generatingInvoice === order.id}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande {selectedOrder.order_number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Statut</p>
                <Badge className={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color}>
                  {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Mode de paiement</p>
                <p className="font-semibold capitalize">{selectedOrder.payment_method}</p>
              </div>
              {profiles[selectedOrder.user_id] && (
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-semibold">
                    {profiles[selectedOrder.user_id].first_name} {profiles[selectedOrder.user_id].last_name}
                  </p>
                  {profiles[selectedOrder.user_id].phone && (
                    <p className="text-sm text-muted-foreground">{profiles[selectedOrder.user_id].phone}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Adresse de livraison</p>
                <p className="font-semibold">{selectedOrder.delivery_address}</p>
                <p className="font-semibold">{selectedOrder.delivery_city}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold text-primary text-lg">
                  {(selectedOrder.total_amount + selectedOrder.vat_amount).toLocaleString("fr-TN")} DT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
