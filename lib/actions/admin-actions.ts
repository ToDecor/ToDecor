"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Check if user is admin
export async function checkIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  return profile?.is_admin || false
}

// Product Actions
export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const material = formData.get("material") as string
  const color = formData.get("color") as string
  const stock_quantity = Number.parseInt(formData.get("stock_quantity") as string)
  const image_url = formData.get("image_url") as string
  const size_options = formData.get("size_options") as string

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      price,
      category,
      material,
      color,
      stock_quantity,
      image_url,
      gallery_urls: image_url ? [image_url] : [],
      size_options: size_options ? size_options.split(",").map((s) => s.trim()) : [],
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/produits")
  revalidatePath("/produits")
  return data
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const material = formData.get("material") as string
  const color = formData.get("color") as string
  const stock_quantity = Number.parseInt(formData.get("stock_quantity") as string)
  const image_url = formData.get("image_url") as string
  const size_options = formData.get("size_options") as string

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      category,
      material,
      color,
      stock_quantity,
      image_url,
      gallery_urls: image_url ? [image_url] : [],
      size_options: size_options ? size_options.split(",").map((s) => s.trim()) : [],
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/produits")
  revalidatePath("/produits")
  return data
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/produits")
  revalidatePath("/produits")
}

// Order Actions
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) throw error

  revalidatePath("/admin/commandes")
  revalidatePath("/dashboard")
  return data
}

// Message Actions
export async function updateMessageStatus(messageId: string, status: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", messageId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/messages")
  return data
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("contact_messages").delete().eq("id", messageId)

  if (error) throw error

  revalidatePath("/admin/messages")
}

// Contact Form Submission
export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
    })
    .select()
    .single()

  if (error) throw error

  return data
}
