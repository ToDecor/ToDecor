"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, total, tax, grandTotal } = useCart()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  console.log("[v0] Cart page - Cart items:", cart.length)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("[v0] Cart page - User:", user?.id || "not logged in")
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleCheckout = () => {
    console.log("[v0] Checkout button clicked, user:", user?.id || "not logged in")
    if (!user) {
      console.log("[v0] Redirecting to login")
      router.push('/auth/login?redirect=/cart')
    } else {
      console.log("[v0] Redirecting to checkout")
      router.push('/checkout')
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-6">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mx-auto" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Votre panier est vide</h1>
              <p className="text-muted-foreground mb-6">Commencez vos achats pour découvrir notre sélection premium</p>
            </div>
            <Button asChild>
              <Link href="/produits">Continuer les achats</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Votre panier</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            {item.size && <p className="text-sm text-muted-foreground">Taille: {item.size}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="w-12 text-center border border-border rounded px-2 py-1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString("fr-TN")} DT x {item.quantity}
                            </p>
                            <p className="font-bold text-primary text-lg">
                              {(item.price * item.quantity).toLocaleString("fr-TN")} DT
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{total.toLocaleString("fr-TN")} DT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVA (19%)</span>
                      <span>{tax.toLocaleString("fr-TN")} DT</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-primary text-lg">{grandTotal.toLocaleString("fr-TN")} DT</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full" disabled={loading}>
                    {!user ? "Se connecter pour commander" : "Confirmer la commande"}
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/produits">Continuer les achats</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
