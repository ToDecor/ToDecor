"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, tax, grandTotal, clearCart } = useCart()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "transfer",
    notes: "",
  })

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      console.log("[v0] Checkout - checking authentication")
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        console.log("[v0] Checkout - no user, redirecting to login")
        router.push('/auth/login?redirect=/checkout')
        return
      }
      
      console.log("[v0] Checkout - user authenticated:", user.id)
      setUser(user)
      setAuthChecked(true)
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: user.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          postalCode: profile.postal_code || "",
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }))
      }
    }

    getUser()
  }, [supabase, router])

  useEffect(() => {
    if (authChecked && cart.length === 0 && !loading && !success) {
      console.log("[v0] Checkout - cart empty, redirecting to products")
      router.push("/produits")
    }
  }, [cart, router, loading, success, authChecked])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("[v0] Submitting order for user:", user?.id)

    if (!user) {
      router.push('/auth/login?redirect=/checkout')
      return
    }

    try {
      // Generate order number
      const orderNumber = `CMD-${Date.now()}`

      console.log("[v0] Creating order:", orderNumber)

      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        })

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: total,
          vat_amount: tax,
          status: "pending",
          payment_method: formData.paymentMethod,
          delivery_address: formData.address,
          delivery_city: formData.city,
          delivery_postal_code: formData.postalCode,
          notes: formData.notes,
        })
        .select()
        .single()

      if (orderError) {
        console.error("[v0] Order creation error:", orderError)
        throw orderError
      }

      console.log("[v0] Order created:", orderData.id)

      // Create order items
      for (const item of cart) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: orderData.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          selected_size: item.size || null,
          selected_color: item.color || null,
        })

        if (itemError) {
          console.error("[v0] Order item error:", itemError)
          throw itemError
        }
      }

      console.log("[v0] Order items created successfully")

      // Clear cart and show success
      clearCart()
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${orderData.id}`)
      }, 2000)
    } catch (err) {
      console.error("[v0] Order submission error:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !success) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Redirection...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Commande créée avec succès !</h1>
            <p className="text-muted-foreground">Redirection vers votre confirmation...</p>
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
          <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Finaliser votre commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {error && (
                  <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Prénom"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        placeholder="Nom"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Adresse de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      placeholder="Ville"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      placeholder="Code postal"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mode de paiement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {["transfer", "cash"].map((method) => (
                      <label key={method} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">
                          {method === "transfer" ? "Virement bancaire" : "Espèces à la livraison"}
                        </span>
                      </label>
                    ))}
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Remarques (optionnel)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      placeholder="Ajoutez des instructions de livraison ou des remarques..."
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">{(item.price * item.quantity).toLocaleString("fr-TN")} DT</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{total.toLocaleString("fr-TN")} DT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVA (19%)</span>
                      <span>{tax.toLocaleString("fr-TN")} DT</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                      <span>Total</span>
                      <span className="text-primary text-lg">{grandTotal.toLocaleString("fr-TN")} DT</span>
                    </div>
                  </div>
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
