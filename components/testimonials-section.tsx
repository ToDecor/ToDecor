"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Testimonial {
  id: string
  name: string
  message: string
  rating: number
  image_url?: string
  created_at: string
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_verified", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Chargement des témoignages...</p>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-foreground">Témoignages de nos clients</h2>
          <p className="text-muted-foreground">
            Les premiers témoignages arrivent bientôt! Soyez les premiers à partager votre expérience.
          </p>
          <button
            onClick={() => {
              setLoading(true)
              fetchTestimonials()
            }}
            className="mt-4 px-4 py-2 bg-accent text-background rounded hover:opacity-90 transition"
          >
            Rafraîchir
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-foreground">
            Témoignages de nos clients
          </h2>
          <p className="text-muted-foreground">
            Découvrez ce que nos clients satisfaits pensent de nos services et produits premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="bg-background border border-border">
              <CardHeader className="flex items-center gap-3 mb-2">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted/50"></div>
                )}
                <CardTitle className="font-serif text-foreground">{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{t.message}"</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(t.created_at).toLocaleDateString("fr-TN", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
