"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image_url: string
  category: string
  reference: string
}

export function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, image_url, category, reference")
          .eq("is_popular", true)
          .limit(4)

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("[v0] Error fetching popular products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularProducts()
  }, [supabase])

  if (loading || products.length === 0) return null

  return (
    <section
      id="popular"
      ref={sectionRef}
      className={`py-20 bg-muted/30 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-6 h-6 text-accent fill-accent" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Produits Populaires</h2>
            </div>
            <p className="text-muted-foreground">Les favoris de nos clients</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/produits">Voir tout</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className={`group overflow-hidden hover:shadow-lg transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <Link href={`/produits/${product.slug}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        product.image_url ||
                        `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Populaire
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.reference && (
                      <p className="text-xs text-muted-foreground mb-2">Réf: {product.reference}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">{product.price.toLocaleString("fr-TN")} DT</p>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
