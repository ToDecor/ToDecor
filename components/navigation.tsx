"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, LogOut, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/lib/hooks/use-settings"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { useCart } from "@/hooks/use-cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { settings } = useSettings()
  const { itemCount } = useCart()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if user is admin
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
        setIsAdmin(profile?.is_admin || false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.is_admin || false)
          })
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/produits?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const siteName = settings?.site_name || "ToDecor"
  const logoUrl = settings?.logo_url

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logoUrl ? (
              <>
                <img src={logoUrl || "/placeholder.svg"} alt={siteName} className="h-10 w-auto" />
                <span className="font-serif text-lg font-semibold text-foreground">{siteName}</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">{siteName[0]}</span>
                </div>
                <span className="font-serif text-xl font-semibold text-foreground">{siteName}</span>
              </>
            )}
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#produits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Produits
            </Link>
            <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              À Propos
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Mon Compte
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Mes Commandes</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Dashboard Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {/* Search in mobile menu */}
            <form onSubmit={handleSearch} className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Link
              href="#produits"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Produits
            </Link>
            <Link
              href="#services"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#about"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              À Propos
            </Link>
            <Link
              href="#contact"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard">Mes Commandes</Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/admin">Dashboard Admin</Link>
                    </Button>
                  )}
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/auth/login">Connexion</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/sign-up">S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
