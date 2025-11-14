"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"
import { useEffect, useRef, useState } from "react"

const categories = [
  {
    id: "sols",
    name: "Sols",
    description: "Parquet, moquette, vinyle et bien plus",
    colorClass: "from-amber-100 to-orange-100",
    imageKey: "category_sols_image" as const,
  },
  {
    id: "murs",
    name: "Murs",
    description: "Carrelage, papier peint et revêtements",
    colorClass: "from-slate-100 to-gray-100",
    imageKey: "category_murs_image" as const,
  },
  {
    id: "accessoires",
    name: "Accessoires",
    description: "Finitions et compléments de qualité",
    colorClass: "from-yellow-100 to-amber-100",
    imageKey: "category_accessoires_image" as const,
  },
]

export function ProductsPreview() {
  const { settings } = useSettings()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section
      id="produits"
      ref={sectionRef}
      className={`py-20 md:py-28 bg-background transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nos Catégories de Produits</h2>
          <p className="text-lg text-muted-foreground">
            Explorez notre sélection de revêtements premium pour tous vos projets de décoration d'intérieur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const imageUrl =
              settings?.[category.imageKey] || `/placeholder.svg?height=300&width=400&query=${category.name}`

            return (
              <Card
                key={category.id}
                className={`group overflow-hidden hover:shadow-lg transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.colorClass} opacity-40`} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <Link
                      href={`/produits?categorie=${category.id}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all"
                    >
                      Explorer
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/produits">
              Voir tous les produits
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
