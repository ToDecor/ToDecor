"use client"

import { useState, useEffect, useCallback } from "react"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image_url: string
}

const CART_STORAGE_KEY = "todecor_cart"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === item.productId && p.size === item.size)

      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.size === item.size ? { ...p, quantity: p.quantity + item.quantity } : p,
        )
      }

      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.19 // TVA 19%
  const tax = total * taxRate
  const grandTotal = total + tax

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    tax,
    grandTotal,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  }
}
