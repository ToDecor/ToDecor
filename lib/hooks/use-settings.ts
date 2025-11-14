"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type WebsiteSettings = {
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
}

function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  // Simple approximation to oklch - for production, use a color conversion library
  const lightness = (r + g + b) / 3
  const chroma = Math.max(r, g, b) - Math.min(r, g, b)
  const hue = Math.atan2(g - b, r - g) * 180 / Math.PI
  
  return `${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(0)}`
}

export function useSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("website_settings").select("*").single()

      if (error) {
        console.error("[v0] Error fetching settings:", error)
      } else {
        setSettings(data)
        if (data) {
          const root = document.documentElement
          root.style.setProperty('--primary', `oklch(${hexToOklch(data.primary_color)})`)
          root.style.setProperty('--secondary', `oklch(${hexToOklch(data.secondary_color)})`)
          root.style.setProperty('--accent', `oklch(${hexToOklch(data.accent_color)})`)
          console.log('[v0] Theme colors applied:', {
            primary: data.primary_color,
            secondary: data.secondary_color,
            accent: data.accent_color
          })
        }
      }
      setLoading(false)
    }

    fetchSettings()
  }, [])

  return { settings, loading }
}
