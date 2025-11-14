"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"

const values = [
  {
    title: "Qualité Premium",
    description: "Revêtements haut de gamme sélectionnés avec soin pour la durabilité et l'esthétique",
  },
  {
    title: "Expertise",
    description: "Années d'expérience dans le secteur de la décoration intérieure",
  },
  {
    title: "Service Client",
    description: "Conseil personnalisé et support réactif du début à la fin de votre projet",
  },
  {
    title: "Installation Pro",
    description: "Équipe qualifiée assurant une pose parfaite avec respect des délais",
  },
]

export function AboutSection() {
  const { settings } = useSettings()

  const title = settings?.about_title || "À propos de ToDecor"
  const description1 =
    settings?.about_description ||
    "Depuis plus de 15 ans, ToDecor est le partenaire de confiance des architectes, décorateurs et particuliers en Tunisie. Nous proposons une sélection exclusive de revêtements de sol et mur haut de gamme, associée à un service d'installation professionnel."
  const description2 =
    settings?.about_description_2 ||
    "Notre engagement : transformer vos espaces en créations élégantes et durables, en vous accompagnant à chaque étape de votre projet."

  return (
    <section id="about" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{description1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{description2}</p>

            {/* CTA */}
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                En savoir plus
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Values Grid */}
          <div className="space-y-4">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
