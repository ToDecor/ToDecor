"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct } from "@/lib/actions/admin-actions"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPopular, setIsPopular] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)

      // Generate slug from name
      const name = formData.get("name") as string
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      formData.set("slug", slug)
      formData.set("is_popular", isPopular.toString())

      if (imageUrl) {
        formData.set("image_url", imageUrl)
      }

      await createProduct(formData)
      router.push("/admin/produits")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du produit")
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-serif font-bold text-foreground">Nouveau produit</h1>
          <p className="text-muted-foreground mt-2">Ajoutez un nouveau produit au catalogue</p>
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
                <Input id="reference" name="reference" placeholder="ex: TD-SOL-001" />
                <p className="text-xs text-muted-foreground">Code unique pour identifier le produit</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (DT) *</Label>
                <Input id="price" name="price" type="number" step="0.01" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Select name="material" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Input id="color" name="color" required placeholder="ex: Beige" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantité en stock *</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" required defaultValue="0" />
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
              <Textarea id="description" name="description" rows={4} />
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
              <Input id="size_options" name="size_options" placeholder="1m x 1m, 2m x 2m, 3m x 3m" />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer le produit"}
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
