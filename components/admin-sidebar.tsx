"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  Images,
  LogOut,
  Menu,
  X,
  Settings,
  Star,
} from "lucide-react"

const menuItems = [
  { href: "/admin", label: "Tableau de bord", icon: BarChart3 },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/factures", label: "Factures", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/temoignages", label: "Témoignages", icon: Star },
  { href: "/admin/gallery", label: "Galerie", icon: Images },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-foreground text-background transform transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">T</span>
            </div>
            ToDecor Admin
          </Link>
        </div>

        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-background/80 hover:text-background hover:bg-primary/20"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-background/20">
          <Button variant="outline" className="w-full gap-2 text-background hover:bg-primary/20 bg-transparent" asChild>
            <Link href="/auth/logout">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
