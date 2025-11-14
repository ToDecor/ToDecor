import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Simple HTML to PDF content - in production, use a library like html-to-pdf
function generateInvoiceHTML(order: any, items: any[], company: any) {
  const date = new Date(order.created_at).toLocaleDateString("fr-TN")
  const itemsHTML = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.products.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0;">${item.unit_price.toFixed(2)}</td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e0e0e0;">${(item.quantity * item.unit_price).toFixed(2)}</td>
      </tr>
    `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Facture ${order.order_number}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company-info { }
        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .invoice-details { text-align: right; }
        .invoice-title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
        .section-title { font-weight: bold; margin-top: 30px; margin-bottom: 10px; }
        .totals { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; margin: 5px 0; }
        .total-value { width: 150px; }
        .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-info">
            <div class="company-name">${company.name}</div>
            <p>${company.address}<br/>
            Téléphone: ${company.phone}<br/>
            Email: ${company.email}</p>
          </div>
          <div class="invoice-details">
            <div class="invoice-title">FACTURE</div>
            <p>N°: ${order.order_number}<br/>
            Date: ${date}</p>
          </div>
        </div>

        <div class="section-title">Client</div>
        <p>${order.delivery_address}<br/>
        ${order.delivery_city}</p>

        <div class="section-title">Détails de la commande</div>
        <table>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
          ${itemsHTML}
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Sous-total:</span>
            <span class="total-value">${order.total_amount.toFixed(2)} DT</span>
          </div>
          <div class="total-row">
            <span>TVA (19%):</span>
            <span class="total-value">${order.vat_amount.toFixed(2)} DT</span>
          </div>
          <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span class="total-value">${(order.total_amount + order.vat_amount).toFixed(2)} DT</span>
          </div>
        </div>

        <p style="margin-top: 40px; font-size: 12px; color: #666;">
          Merci de votre achat ! Cette facture est générée automatiquement.
        </p>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Invoice generation started")
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get order
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error("[v0] Error fetching order:", orderError)
      throw orderError
    }

    console.log("[v0] Order fetched:", order.order_number)

    // Get order items with product details
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, products(name)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("[v0] Error fetching order items:", itemsError)
      throw itemsError
    }

    console.log("[v0] Order items fetched:", items?.length)

    const { data: settings } = await supabase.from("website_settings").select("*").single()

    const companyInfo = {
      name: settings?.site_name || "ToDecor",
      address: settings?.address || "Tunis, Tunisie",
      phone: settings?.phone || "+216 20 000 000",
      email: settings?.email || "contact@todecor.tn",
    }

    // Generate invoice HTML
    const htmlContent = generateInvoiceHTML(order, items, companyInfo)

    // Generate invoice number
    const invoiceNumber = `FAC-${Date.now()}`

    console.log("[v0] Generated invoice number:", invoiceNumber)

    const { data: existingInvoice } = await supabase.from("invoices").select("*").eq("order_id", orderId).maybeSingle()

    if (existingInvoice) {
      console.log("[v0] Invoice already exists, returning existing invoice")
      return NextResponse.json({
        success: true,
        invoiceNumber: existingInvoice.invoice_number,
        invoiceUrl: existingInvoice.invoice_url,
        htmlContent,
      })
    }

    // Store invoice record in database
    const { data: invoiceRecord, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        order_id: orderId,
        invoice_number: invoiceNumber,
        total_amount: order.total_amount,
        vat_amount: order.vat_amount,
        invoice_url: `/invoices/${invoiceNumber}.html`,
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("[v0] Error creating invoice:", invoiceError)
      throw invoiceError
    }

    console.log("[v0] Invoice created successfully:", invoiceRecord.id)

    return NextResponse.json({
      success: true,
      invoiceNumber,
      invoiceUrl: `/invoices/${invoiceNumber}.html`,
      htmlContent,
    })
  } catch (error) {
    console.error("[v0] Invoice generation error:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}
