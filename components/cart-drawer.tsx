"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"

export function CartDrawer() {
  const { cart, removeItem, updateQuantity, total, tax, grandTotal, itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Panier ({itemCount})</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground text-center">Votre panier est vide</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/produits">Commencer les achats</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 pr-4">
                {cart.map((item) => (
                  <div key={item.id} className="border-b border-border pb-4">
                    <div className="flex gap-3 mb-2">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.size && `Taille: ${item.size}`}</p>
                        <p className="text-sm font-bold text-primary mt-1">{item.price.toLocaleString("fr-TN")} DT</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-8 text-center text-sm border border-border rounded px-1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{total.toLocaleString("fr-TN")} DT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (19%)</span>
                  <span>{tax.toLocaleString("fr-TN")} DT</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">{grandTotal.toLocaleString("fr-TN")} DT</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Procéder au paiement
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
