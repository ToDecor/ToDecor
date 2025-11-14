"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Eye } from "lucide-react"

interface Invoice {
  id: string
  invoice_number: string
  total_amount: number
  vat_amount: number
  created_at: string
  order_id: string
}

interface Order {
  order_number: string
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [orders, setOrders] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false })

      if (invoicesError) throw invoicesError

      // Get order details
      const orderIds = [...new Set(invoicesData?.map((inv) => inv.order_id) || [])]
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_number")
        .in("id", orderIds)

      if (ordersError) throw ordersError

      // Create orders map
      const ordersMap: Record<string, Order> = {}
      ordersData?.forEach((order) => {
        ordersMap[order.id] = order
      })

      setInvoices(invoicesData || [])
      setOrders(ordersMap)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const invoice = invoices.find((inv) => inv.id === invoiceId)
      if (!invoice) return

      const response = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: invoice.order_id }),
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
    } catch (error) {
      console.error("Error viewing invoice:", error)
      alert("Erreur lors de l'affichage de la facture")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des factures</h1>
        <p className="text-muted-foreground mt-2">Consultez toutes les factures générées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {invoices.length} facture{invoices.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : invoices.length === 0 ? (
            <p className="text-muted-foreground">
              Aucune facture générée. Créez des factures depuis la page des commandes.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Numéro Facture</th>
                    <th className="text-left py-3 font-semibold">Commande</th>
                    <th className="text-left py-3 font-semibold">Montant TTC</th>
                    <th className="text-left py-3 font-semibold">Date</th>
                    <th className="text-right py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 font-mono text-xs">{invoice.invoice_number}</td>
                      <td className="py-3">{orders[invoice.order_id]?.order_number || "N/A"}</td>
                      <td className="py-3 font-semibold">
                        {(invoice.total_amount + invoice.vat_amount).toLocaleString("fr-TN")} DT
                      </td>
                      <td className="py-3">{new Date(invoice.created_at).toLocaleDateString("fr-TN")}</td>
                      <td className="py-3 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                          title="Voir la facture"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
