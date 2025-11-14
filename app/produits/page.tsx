"use client"

import { useEffect, useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Search, LayoutGrid, List } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: string
  image_url: string
  material: string
  color: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    priceRange: [0, 5000] as [number, number],
    material: undefined as string | undefined,
  })

  const supabase = createClient()

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
        setFilteredProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase])

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.material.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    // Price filter
    filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

    // Material filter
    if (filters.material) {
      filtered = filtered.filter((p) => p.material === filters.material)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Notre Catalogue</h1>
            <p className="text-lg text-muted-foreground">Explorez notre sélection complète de revêtements premium</p>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <ProductFilters onFiltersChange={(newFilters) => setFilters(newFilters)} />
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Chargement des produits...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
