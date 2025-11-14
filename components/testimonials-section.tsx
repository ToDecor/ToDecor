"use client"

import { useEffect, useState } from "react"
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">Chargement des témoignages...</p>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Témoignages de nos clients</h2>
          <p className="text-gray-500">
            Les premiers témoignages arrivent bientôt! Soyez les premiers à partager votre expérience.
          </p>
          <button
            onClick={() => {
              setLoading(true)
              fetchTestimonials()
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Rafraîchir
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Témoignages de nos clients</h2>
          <p className="text-gray-500">Découvrez ce que nos clients satisfaits pensent de nos services et produits premium.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-4">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                )}
                <h3 className="font-semibold">{t.name}</h3>
              </div>

              <div className="flex mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 mr-1 rounded-full"></div>
                ))}
              </div>

              <p className="text-gray-600 italic">"{t.message}"</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(t.created_at).toLocaleDateString("fr-TN", { year: "numeric", month: "long" })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
