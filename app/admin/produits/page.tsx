"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Edit, Search } from "lucide-react"

interface Product {
  id: string
  name: string
  reference: string
  price: number
  category: string
  material: string
  stock_quantity: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, reference, price, category, material, stock_quantity")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id)
        if (error) throw error
        setProducts(products.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des produits</h1>
          <p className="text-muted-foreground mt-2">Gérez votre catalogue de revêtements</p>
        </div>
        <Button asChild>
          <Link href="/admin/produits/nouveau">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou référence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Référence</th>
                    <th className="text-left py-3 font-semibold">Nom</th>
                    <th className="text-left py-3 font-semibold">Catégorie</th>
                    <th className="text-left py-3 font-semibold">Prix</th>
                    <th className="text-left py-3 font-semibold">Matériau</th>
                    <th className="text-left py-3 font-semibold">Stock</th>
                    <th className="text-right py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3">
                        <span className="text-xs font-mono text-muted-foreground">{product.reference || "-"}</span>
                      </td>
                      <td className="py-3">{product.name}</td>
                      <td className="py-3">{product.category}</td>
                      <td className="py-3">{product.price.toLocaleString("fr-TN")} DT</td>
                      <td className="py-3">{product.material}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.stock_quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 flex gap-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/produits/${product.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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
