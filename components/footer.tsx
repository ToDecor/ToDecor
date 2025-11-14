"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"

export function Footer() {
  const { settings } = useSettings()

  const siteName = settings?.site_name || "ToDecor"
  const phone = settings?.phone || "+216 20 000 000"
  const email = settings?.email || "contact@todecor.tn"
  const address = settings?.address || "Tunis, Tunisie"
  const facebookUrl = settings?.facebook_url
  const instagramUrl = settings?.instagram_url
  const linkedinUrl = settings?.linkedin_url

  return (
    <footer className="bg-foreground/95 text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png" // <-- Put your logo path here (in /public folder)
                alt={`${siteName} logo`}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <span className="font-serif text-lg font-semibold">{siteName}</span>
            </div>
            <p className="text-sm text-background/80">Revêtements de sol et mur haut de gamme en Tunisie.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produits" className="text-background/80 hover:text-background transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link
                  href="/produits?categorie=Sols"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Sols
                </Link>
              </li>
              <li>
                <Link
                  href="/produits?categorie=Murs"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Murs
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-background/80 hover:text-background transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contactez-nous</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${phone}`} className="text-background/80 hover:text-background transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-background/80 hover:text-background transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-background/80">{address}</span>
              </li>
            </ul>
            {(facebookUrl || instagramUrl || linkedinUrl) && (
              <div className="flex gap-3 mt-4">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/80 hover:text-background transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/80 hover:text-background transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/80 hover:text-background transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <p className="text-sm text-background/80 text-center">© 2025 {siteName}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
