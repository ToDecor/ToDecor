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
  <section className="py-10 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">CRASH TEST SECTION (If you see this, the component is rendering)</h2>
      
      {/* Test 1: Check if the array length variable renders */}
      <p className="mb-4">Testimonials Count: {testimonials.length}</p>

      {/* Test 2: Iterate over the array with NO external components or complex logic */}
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="p-4 border-2 border-red-500 mb-2">
          <p className="font-semibold">Name: {testimonial.name}</p>
          <p>Message: {testimonial.message}</p>
          {/* CRITICAL: Check for any null/undefined access */}
          <p>Rating: {testimonial.rating}</p> 
          <p>Created At: {testimonial.created_at}</p>
        </div>
      ))}
      
      {/* If the array is empty, this serves as a final fallback check */}
      {testimonials.length === 0 && (
          <p>Array is empty after load.</p>
      )}
    </div>
  </section>
)