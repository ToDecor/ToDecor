"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: insertError } = await supabase.from("contact_messages").insert([formData])

      if (insertError) throw insertError

      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nous contacter</h2>
          <p className="text-lg text-muted-foreground">
            Vous avez des questions ? N'hésitez pas à nous contacter pour un conseil personnalisé.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de contact</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                {submitted && (
                  <div className="flex gap-2 p-3 bg-green-100 border border-green-500 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-sm">Message envoyé avec succès !</p>
                  </div>
                )}

                <Input placeholder="Votre nom" name="name" value={formData.name} onChange={handleChange} required />
                <Input
                  type="email"
                  placeholder="Votre email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Votre téléphone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input placeholder="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                <textarea
                  placeholder="Votre message..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi..." : "Envoyer le message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
