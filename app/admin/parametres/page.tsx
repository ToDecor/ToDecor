import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/admin/settings-form"

export default async function ParametresPage() {
  const supabase = await createClient()

  // Fetch current settings
  const { data: settings, error } = await supabase.from("website_settings").select("*").single()

  if (error) {
    console.error("[v0] Error fetching settings:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres du Site</h1>
        <p className="text-muted-foreground mt-2">
          Gérez l'apparence, les coordonnées et les réseaux sociaux de votre site
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
