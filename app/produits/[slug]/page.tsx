"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductImageZoom } from "@/components/product-image-zoom"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image_url: string
  gallery_urls: string[]
  material: string
  color: string
  size_options: string[]
  stock_quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCart() // Fixed function name from addToCart to addItem

  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

        if (error) throw error
        setProduct(data)
        if (data.size_options && data.size_options.length > 0) {
          setSelectedSize(data.size_options[0])
        }
      } catch (error) {
        console.error("[v0] Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, supabase])

  const handleAddToCart = () => {
    if (!product) return

    console.log("[v0] Adding product to cart:", product.name)

    addItem({
      id: `${product.id}-${selectedSize || "default"}-${Date.now()}`, // Unique ID for cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url, // Fixed from 'image' to 'image_url'
      size: selectedSize || undefined,
    })

    console.log("[v0] Product added to cart successfully")
    alert("Produit ajouté au panier!")
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Produit non trouvé</p>
        </div>
        <Footer />
      </>
    )
  }

  const productImages =
    product.gallery_urls && product.gallery_urls.length > 0
      ? product.gallery_urls
      : [product.image_url || "/placeholder.svg"]

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/produits" className="text-primary hover:underline text-sm">
              Produits
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-muted-foreground text-sm">{product.name}</span>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImageZoom images={productImages} productName={product.name} />

            {/* Info Section */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                {product.category}
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{product.name}</h1>
                <p className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Specifications */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matériau</span>
                    <span className="font-semibold text-foreground">{product.material}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Couleur</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-muted-foreground"
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="font-semibold text-foreground">{product.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock</span>
                    <span className={`font-semibold ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.stock_quantity > 0 ? "En stock" : "Rupture"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Size Selection */}
              {product.size_options && product.size_options.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Taille</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.size_options.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Quantité</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center w-16"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={product.stock_quantity === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)} className="gap-2">
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-accent text-accent" : ""}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products Section (placeholder for future expansion) */}
          <div className="mt-20 border-t border-border pt-12">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Produits similaires</h2>
            <p className="text-muted-foreground">Consultez nos autres produits dans la catégorie {product.category}</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
