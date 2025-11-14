"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Star, Trash2, Check, X } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  message: string
  rating: number
  image_url?: string
  is_verified: boolean
  created_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 5,
    image_url: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error("[v0] Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from("testimonials").insert([
        {
          ...formData,
          is_verified: true,
        },
      ])

      if (error) throw error

      setFormData({ name: "", message: "", rating: 5, image_url: "" })
      await fetchTestimonials()
    } catch (error) {
      console.error("[v0] Error adding testimonial:", error)
      alert("Erreur lors de l'ajout du témoignage")
    }
  }

  const toggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("testimonials").update({ is_verified: !currentStatus }).eq("id", id)

      if (error) throw error
      await fetchTestimonials()
    } catch (error) {
      console.error("[v0] Error updating testimonial:", error)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) return

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id)

      if (error) throw error
      await fetchTestimonials()
    } catch (error) {
      console.error("[v0] Error deleting testimonial:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Gestion des Témoignages</h1>
        <p className="text-muted-foreground mt-2">Ajoutez et gérez les avis clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un témoignage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du client</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Note (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <Button type="submit">Ajouter le témoignage</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{testimonials.length} témoignage(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : testimonials.length === 0 ? (
            <p className="text-muted-foreground">Aucun témoignage</p>
          ) : (
            <div className="space-y-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {testimonial.image_url && (
                        <img
                          src={testimonial.image_url || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{testimonial.message}"</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(testimonial.created_at).toLocaleDateString("fr-TN")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerified(testimonial.id, testimonial.is_verified)}
                    >
                      {testimonial.is_verified ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteTestimonial(testimonial.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
