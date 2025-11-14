"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  total_amount: number
  vat_amount: number
  status: string
  created_at: string
  delivery_address: string
  delivery_city: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

        if (error) throw error
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, supabase])

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

  if (!order) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Commande non trouvée</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Commande confirmée !</h1>
            <p className="text-lg text-muted-foreground">
              Merci pour votre commande. Nous traiterons votre demande rapidement.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="font-semibold text-foreground">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(order.created_at).toLocaleDateString("fr-TN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-semibold text-amber-600 capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-primary text-lg">
                    {(order.total_amount + order.vat_amount).toLocaleString("fr-TN")} DT
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Adresse de livraison</p>
                <p className="text-foreground">
                  {order.delivery_address}
                  <br />
                  {order.delivery_city}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 gap-2">
              <Link href="/dashboard">
                <Home className="w-4 h-4" />
                Voir mes commandes
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 gap-2 bg-transparent">
              <Link href="/produits">Continuer les achats</Link>
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">1.</span> Nous confirmerons votre commande par email
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">2.</span> Vous recevrez une facture PDF à télécharger
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">3.</span> Suivi de votre livraison en temps réel
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}
