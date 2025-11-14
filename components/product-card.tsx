"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  category: string
  image_url: string
  material: string
  color: string
}

export function ProductCard({ id, name, slug, price, category, image_url, material, color }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="relative p-0 overflow-hidden h-48">
        <img
          src={image_url || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-accent text-accent" : "text-muted-foreground"}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
          {category}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Info */}
          <div className="space-y-1">
            <Link href={`/produits/${slug}`}>
              <h3 className="font-serif font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground space-x-2">
              <span>{material}</span>
              <span>•</span>
              <span
                className="inline-block w-4 h-4 rounded-full border border-muted-foreground"
                style={{ backgroundColor: color }}
              />
            </p>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-border" />

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {price.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
            <Button size="sm" variant="default" asChild className="gap-2">
              <Link href={`/produits/${slug}`}>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Voir</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
