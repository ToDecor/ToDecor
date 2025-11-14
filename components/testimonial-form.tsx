"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Star } from 'lucide-react'

export function TestimonialForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 5,
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Submitting testimonial:", { name: formData.name, rating: formData.rating })
      
      const { data, error } = await supabase.from("testimonials").insert([
        {
          name: formData.name,
          message: formData.message,
          rating: formData.rating,
          is_verified: false,
        }
      ])

      if (error) {
        console.error("[v0] Supabase error:", error.message, error.details)
        throw new Error(error.message || "Erreur lors de l'insertion du témoignage")
      }

      console.log("[v0] Testimonial submitted successfully:", data)
      setSuccess(true)
      setFormData({ name: "", message: "", rating: 5 })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error: unknown) {
      console.error("[v0] Error submitting testimonial:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de l'envoi du témoignage. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-green-800 text-center">
            Merci pour votre témoignage! Il sera publié après vérification par notre équipe.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partagez votre expérience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Votre nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Votre note</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre témoignage</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Partagez votre expérience avec nos produits et services..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Envoi en cours..." : "Envoyer mon témoignage"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
