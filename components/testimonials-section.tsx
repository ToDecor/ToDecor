"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Test() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_verified", true)
      console.log("fetched:", data)
      setTestimonials(data || [])
    }
    fetchTestimonials()
  }, [])

  return (
    <div>
      <h1>Testimonials</h1>
      {testimonials.map((t) => (
        <div key={t.id} style={{ border: "1px solid black", margin: 5, padding: 5 }}>
          <p>{t.name}</p>
          <p>{t.message}</p>
          <p>{t.rating}</p>
        </div>
      ))}
    </div>
  )
}
