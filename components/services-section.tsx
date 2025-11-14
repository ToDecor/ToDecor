"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, Lightbulb, Truck } from "lucide-react"

const services = [
  {
    icon: Lightbulb,
    title: "Conseil Personnalisé",
    description: "Nos experts vous guident dans le choix des matériaux et couleurs adaptés à votre projet.",
  },
  {
    icon: Hammer,
    title: "Installation Professionnelle",
    description: "Une équipe qualifiée assure la pose parfaite de vos revêtements avec respect des délais.",
  },
  {
    icon: Truck,
    title: "Livraison Sécurisée",
    description: "Livraison rapide et sécurisée de vos produits directement chez vous dans toute la Tunisie.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nos Services</h2>
          <p className="text-lg text-muted-foreground">
            Une expérience complète du début à la fin de votre projet de décoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
