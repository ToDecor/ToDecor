"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const { settings } = useSettings()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
              <span className="text-sm text-accent font-medium">Bienvenue chez {settings?.site_name || "ToDecor"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Transformez vos espaces en créations élégantes
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Découvrez notre collection exclusive de revêtements de sol et mur haut de gamme. De la conception à
              l'installation, nous créons des espaces d'exception.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/produits">
                  Voir nos produits
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">Demander un devis</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-primary">{settings?.satisfied_clients || 500}+</div>
                <p className="text-sm text-muted-foreground">Clients satisfaits</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{settings?.years_experience || 15}+</div>
                <p className="text-sm text-muted-foreground">Années d'expérience</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{settings?.projects_completed || 1000}+</div>
                <p className="text-sm text-muted-foreground">Projets réalisés</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full rounded-2xl overflow-hidden">
            <img
              src="/luxury-interior-design-with-premium-flooring.jpg"
              alt="Luxury interior design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
