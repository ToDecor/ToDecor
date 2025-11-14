"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from 'lucide-react'
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
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

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

  const fetchTestimonials = async () => {
    try {
      console.log("[v0] Fetching testimonials with is_verified = true")
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_verified", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) {
        console.error("[v0] Testimonials error:", error)
        throw error
      }
      
      console.log("[v0] Testimonials fetched:", data?.length || 0)
      setTestimonials(data || [])
    } catch (error) {
      console.error("[v0] Error fetching testimonials:", error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchTestimonials()
  }

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">Chargement des témoignages...</p>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Témoignages de nos clients
            </h2>
            <p className="text-lg text-muted-foreground">
              Les premiers témoignages arrivent bientôt! Soyez les premiers à partager votre expérience ToDecor en bas de page.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-accent text-background rounded-md text-sm font-medium hover:opacity-90"
            >
              Rafraîchir les témoignages
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-28 bg-background transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Témoignages de nos clients</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez ce que nos clients satisfaits pensent de nos services et produits premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {testimonial.image_url && (
                    <img
                      // The image is commented out for now. If it still crashes, the base64 string is too large.
                      // If you want to enable it later, uncomment the img tag and ensure it's not the crash source.
                      /*
                      <img
                        src={testimonial.image_url || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      */
                      <span className="text-sm text-red-500">[Image Placeholder]</span>
                  )}
                  <h3 className="font-serif font-semibold text-foreground">{testimonial.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* FIX 1: Add a check for created_at to prevent new Date() crash */}
                  {testimonial.created_at ? (
                    new Date(testimonial.created_at).toLocaleDateString("fr-TN", {
                      year: "numeric",
                      month: "long",
                    })
                  ) : (
                    "Date inconnue"
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-1">
                  {/* FIX 2: Use testimonial.rating || 0 to prevent Array constructor crash if rating is null/undefined */}
                  {[...Array(testimonial.rating || 0)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.message}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}