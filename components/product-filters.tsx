"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category?: string
    priceRange: [number, number]
    material?: string
    color?: string
  }) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedMaterial, setSelectedMaterial] = useState<string>()

  const categories = ["Sols", "Murs", "Accessoires"]
  const materials = ["Parquet", "Moquette", "Vinyle", "Carrelage", "Papier peint", "Divers"]

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
    onFiltersChange({
      category: selectedCategory,
      priceRange: value,
      material: selectedMaterial,
    })
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? undefined : category
    setSelectedCategory(newCategory)
    onFiltersChange({
      category: newCategory,
      priceRange,
      material: selectedMaterial,
    })
  }

  const handleMaterialChange = (material: string) => {
    const newMaterial = selectedMaterial === material ? undefined : material
    setSelectedMaterial(newMaterial)
    onFiltersChange({
      category: selectedCategory,
      priceRange,
      material: newMaterial,
    })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catégories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prix (DT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString("fr-TN")} DT</span>
            <span>{priceRange[1].toLocaleString("fr-TN")} DT</span>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matériau</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((material) => (
            <button
              key={material}
              onClick={() => handleMaterialChange(material)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                selectedMaterial === material
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {material}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setPriceRange([0, 5000])
          setSelectedCategory(undefined)
          setSelectedMaterial(undefined)
          onFiltersChange({
            priceRange: [0, 5000],
          })
        }}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  )
}
