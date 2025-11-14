"use client"

import { useSettings } from "@/lib/hooks/use-settings"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useSettings()
  
  return <>{children}</>
}
