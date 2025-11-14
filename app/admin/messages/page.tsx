"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { updateMessageStatus, deleteMessage } from "@/lib/actions/admin-actions"
import { Trash2, Mail, MailOpen } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (messageId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "new" ? "read" : "new"
      await updateMessageStatus(messageId, newStatus)
      await fetchMessages()
    } catch (error) {
      console.error("[v0] Error updating message:", error)
    }
  }

  const handleDelete = async (messageId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteMessage(messageId)
        await fetchMessages()
      } catch (error) {
        console.error("[v0] Error deleting message:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">Consultez les messages des clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({messages.filter((m) => m.status === "new").length} nouveau
              {messages.filter((m) => m.status === "new").length !== 1 ? "x" : ""})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground">Aucun message</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="border border-border rounded-lg p-4 hover:bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{msg.name}</p>
                        <Badge variant={msg.status === "new" ? "default" : "secondary"} className="text-xs">
                          {msg.status === "new" ? (
                            <>
                              <Mail className="w-3 h-3 mr-1" />
                              Nouveau
                            </>
                          ) : (
                            <>
                              <MailOpen className="w-3 h-3 mr-1" />
                              Lu
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">
                          {msg.email}
                        </a>
                        {msg.phone && (
                          <a href={`tel:${msg.phone}`} className="text-sm text-muted-foreground hover:underline">
                            {msg.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(msg.id, msg.status)}>
                        {msg.status === "new" ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-medium text-foreground mb-2">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(msg.created_at).toLocaleDateString("fr-TN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
