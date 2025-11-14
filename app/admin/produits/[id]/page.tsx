"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { updateProduct } from "@/lib/actions/admin-actions"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"

interface Product {
  id: string
  name: string
  reference: string
  is_popular: boolean
  description: string
  price: number
  category: string
  material: string
  color: string
  stock_quantity: number
  image_url: string
  size_options: string[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isPopular, setIsPopular] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          setLoading(false)
          return
        }
        console.log("[v0] Fetching product with ID:", productId)
        const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

        if (error) throw error
        setProduct(data)
        setIsPopular(data.is_popular || false)
        setImageUrl(data.image_url || "")
      } catch (err: any) {
        console.log("[v0] Error fetching product:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("is_popular", isPopular.toString())
      if (imageUrl) {
        formData.set("image_url", imageUrl)
      }
      await updateProduct(productId, formData)
      router.push("/admin/produits")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du produit")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Chargement...</div>
  }

  if (!product) {
    return <div className="text-muted-foreground">Produit non trouvé</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/produits">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Modifier le produit</h1>
          <p className="text-muted-foreground mt-2">{product.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input id="reference" name="reference" defaultValue={product.reference || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input id="name" name="name" defaultValue={product.name} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (DT) *</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select name="category" defaultValue={product.category} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sols">Sols</SelectItem>
                    <SelectItem value="Murs">Murs</SelectItem>
                    <SelectItem value="Accessoires">Accessoires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Matériau *</Label>
                <Select name="material" defaultValue={product.material} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parquet">Parquet</SelectItem>
                    <SelectItem value="Moquette">Moquette</SelectItem>
                    <SelectItem value="Vinyle">Vinyle</SelectItem>
                    <SelectItem value="Carrelage">Carrelage</SelectItem>
                    <SelectItem value="Papier peint">Papier peint</SelectItem>
                    <SelectItem value="Peinture">Peinture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur *</Label>
                <Input id="color" name="color" defaultValue={product.color} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantité en stock *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  defaultValue={product.stock_quantity}
                  required
                />
              </div>

              <div className="space-y-2 flex items-center gap-2 pt-8">
                <Checkbox id="is_popular" checked={isPopular} onCheckedChange={(checked) => setIsPopular(!!checked)} />
                <Label htmlFor="is_popular" className="cursor-pointer">
                  Marquer comme produit populaire
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={product.description || ""} />
            </div>

            <ImageUpload
              label="Image du produit"
              currentImage={imageUrl}
              onImageChange={setImageUrl}
              bucket="products"
              description="Téléchargez une image depuis votre appareil (max 5MB)"
            />

            <div className="space-y-2">
              <Label htmlFor="size_options">Options de taille (séparées par des virgules)</Label>
              <Input id="size_options" name="size_options" defaultValue={product.size_options?.join(", ") || ""} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/produits">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
