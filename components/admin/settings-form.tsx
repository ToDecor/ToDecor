"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { Loader2, Save, Check } from 'lucide-react'
import { ImageUpload } from "@/components/admin/image-upload"

type Settings = {
  id: string
  site_name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  phone: string
  email: string
  address: string
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  currency: string
  tax_rate: number
  satisfied_clients: number
  years_experience: number
  projects_completed: number
  category_sols_image: string
  category_murs_image: string
  category_accessoires_image: string
  about_title: string
  about_description: string
  about_description_2: string
}

export function SettingsForm({ initialSettings }: { initialSettings: Settings | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Settings>(
    initialSettings || {
      id: "00000000-0000-0000-0000-000000000001",
      site_name: "ToDecor",
      logo_url: null,
      primary_color: "#D4AF37",
      secondary_color: "#8B7355",
      accent_color: "#F5F5DC",
      phone: "+216 20 000 000",
      email: "contact@todecor.tn",
      address: "Tunis, Tunisie",
      facebook_url: null,
      instagram_url: null,
      linkedin_url: null,
      currency: "DT",
      tax_rate: 19.0,
      satisfied_clients: 500,
      years_experience: 15,
      projects_completed: 1000,
      category_sols_image: "/luxury-parquet-flooring.jpg",
      category_murs_image: "/elegant-wall-tiles.jpg",
      category_accessoires_image: "/decor-accessories.jpg",
      about_title: "À propos de ToDecor",
      about_description:
        "Depuis plus de 15 ans, ToDecor est le partenaire de confiance des architectes, décorateurs et particuliers en Tunisie. Nous proposons une sélection exclusive de revêtements de sol et mur haut de gamme, associée à un service d'installation professionnel.",
      about_description_2:
        "Notre engagement : transformer vos espaces en créations élégantes et durables, en vous accompagnant à chaque étape de votre projet.",
    },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    const { error } = await supabase.from("website_settings").update(settings).eq("id", settings.id)

    if (error) {
      console.error("[v0] Error updating settings:", error)
      alert("Erreur lors de la sauvegarde des paramètres")
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      console.log('[v0] Settings saved, reloading page to apply theme...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }

    setLoading(false)
  }

  const updateField = (field: keyof Settings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Marque</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Réseaux</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Identité de Marque</CardTitle>
              <CardDescription>Nom du site et logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nom du Site</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => updateField("site_name", e.target.value)}
                  placeholder="ToDecor"
                />
              </div>
              <ImageUpload
                label="Logo du site"
                currentImage={settings.logo_url}
                onImageChange={(url) => updateField("logo_url", url)}
                bucket="site-assets"
                description="Téléchargez le logo de votre site (PNG ou SVG recommandé, max 5MB)"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Palette de Couleurs</CardTitle>
              <CardDescription>Personnalisez les couleurs du thème</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Couleur Primaire</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => updateField("primary_color", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => updateField("primary_color", e.target.value)}
                      placeholder="#D4AF37"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Couleur Secondaire</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => updateField("secondary_color", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => updateField("secondary_color", e.target.value)}
                      placeholder="#8B7355"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Couleur d'Accent</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={settings.accent_color}
                      onChange={(e) => updateField("accent_color", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.accent_color}
                      onChange={(e) => updateField("accent_color", e.target.value)}
                      placeholder="#F5F5DC"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
              <CardDescription>Téléphone, email et adresse affichés dans le footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+216 20 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="contact@todecor.tn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Tunis, Tunisie"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Réseaux Sociaux</CardTitle>
              <CardDescription>Liens vers vos profils sociaux (affichés dans le footer)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url || ""}
                  onChange={(e) => updateField("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/todecor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url || ""}
                  onChange={(e) => updateField("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/todecor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  value={settings.linkedin_url || ""}
                  onChange={(e) => updateField("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/company/todecor"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Accueil</CardTitle>
              <CardDescription>Chiffres affichés sur la bannière principale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="satisfied_clients">Clients Satisfaits</Label>
                  <Input
                    id="satisfied_clients"
                    type="number"
                    value={settings.satisfied_clients}
                    onChange={(e) => updateField("satisfied_clients", Number(e.target.value))}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Années d'Expérience</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    value={settings.years_experience}
                    onChange={(e) => updateField("years_experience", Number(e.target.value))}
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects_completed">Projets Réalisés</Label>
                  <Input
                    id="projects_completed"
                    type="number"
                    value={settings.projects_completed}
                    onChange={(e) => updateField("projects_completed", Number(e.target.value))}
                    placeholder="1000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images des Catégories</CardTitle>
              <CardDescription>Images affichées pour chaque catégorie de produits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                label="Image Catégorie Sols"
                currentImage={settings.category_sols_image}
                onImageChange={(url) => updateField("category_sols_image", url)}
                bucket="site-assets"
                description="Image pour parquet, moquette, vinyle (max 5MB)"
              />
              <ImageUpload
                label="Image Catégorie Murs"
                currentImage={settings.category_murs_image}
                onImageChange={(url) => updateField("category_murs_image", url)}
                bucket="site-assets"
                description="Image pour carrelage, papier peint (max 5MB)"
              />
              <ImageUpload
                label="Image Catégorie Accessoires"
                currentImage={settings.category_accessoires_image}
                onImageChange={(url) => updateField("category_accessoires_image", url)}
                bucket="site-assets"
                description="Image pour accessoires de décoration (max 5MB)"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section À Propos</CardTitle>
              <CardDescription>Contenu affiché dans la section "À propos" de la page d'accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_title">Titre</Label>
                <Input
                  id="about_title"
                  value={settings.about_title}
                  onChange={(e) => updateField("about_title", e.target.value)}
                  placeholder="À propos de ToDecor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_description">Description (Premier paragraphe)</Label>
                <textarea
                  id="about_description"
                  value={settings.about_description}
                  onChange={(e) => updateField("about_description", e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Depuis plus de 15 ans, ToDecor..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_description_2">Description (Deuxième paragraphe)</Label>
                <textarea
                  id="about_description_2"
                  value={settings.about_description_2}
                  onChange={(e) => updateField("about_description_2", e.target.value)}
                  rows={3}
                  className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Notre engagement : transformer vos espaces..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Sauvegardé
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
