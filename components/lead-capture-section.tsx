"use client"

import { useState } from "react"
import { Send, Phone } from "lucide-react"
import { useContentStore, useLeadsStore } from "@/lib/store"
import type { Lead } from "@/lib/types"

const intentOptions: { value: Lead["intent"]; label: string }[] = [
  { value: "buy", label: "Acheter un appartement" },
  { value: "sell", label: "Vendre mon bien" },
  { value: "invest", label: "Investir dans l'immobilier" },
  { value: "other", label: "Autre demande" },
]

export function LeadCaptureSection() {
  const { content } = useContentStore()
  const { addLead } = useLeadsStore()
  const { contact } = content
  const WHATSAPP_BASE = `https://wa.me/${contact.whatsappNumber}?text=`

  const [form, setForm] = useState({ name: "", phone: "", intent: "" as Lead["intent"] | "", details: "" })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const intentLabel = intentOptions.find((o) => o.value === form.intent)?.label ?? form.intent

    // Save lead to store (appears in admin dashboard)
    if (form.intent) {
      addLead({
        name: form.name,
        phone: form.phone,
        intent: form.intent,
        details: form.details,
      })
    }

    // Open WhatsApp with pre-filled message
    const msg = encodeURIComponent(
      `Bonjour Chabane,\n\nJe m'appelle ${form.name}.\nMon numéro : ${form.phone}\nJe souhaite : ${intentLabel}\n${form.details ? `Détails : ${form.details}` : ""}`
    )
    window.open(`${WHATSAPP_BASE}${msg}`, "_blank")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: "", phone: "", intent: "", details: "" })
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="section-divider" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">Passez à l&apos;action</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-5 leading-tight text-balance">
              Votre prochain bien est
              <br />
              <span className="text-gold">à un message de vous</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
              Ne passez pas une semaine de plus à faire défiler des annonces qui ne vous correspondent pas.
              Remplissez le formulaire ci-contre ou contactez-moi directement sur WhatsApp — je réponds
              rapidement et personnellement.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={`${WHATSAPP_BASE}Bonjour%20Chabane%2C%20je%20veux%20trouver%20mon%20bien%20%C3%A0%20Oran.`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn text-base px-8 py-4 justify-center md:justify-start"
              >
                <WhatsAppIcon />
                Écrire sur WhatsApp maintenant
              </a>
              <a
                href={`tel:+${contact.whatsappNumber}`}
                className="btn-primary text-base px-8 py-4 justify-center md:justify-start"
              >
                <Phone size={17} />
                Appeler directement
              </a>
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0 animate-pulse" />
              <p>{contact.availabilityText}</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-card border border-border rounded-xl p-7 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-navy mb-6">Envoyez-moi votre demande</h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="text-green-600" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-navy text-lg mb-1">WhatsApp ouvert !</p>
                <p className="text-muted-foreground text-sm">Votre message est pré-rempli. Il ne vous reste qu&apos;à envoyer.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Votre prénom *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Ex: Karim"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors duration-150"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Votre numéro WhatsApp *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="Ex: 0550 XX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors duration-150"
                  />
                </div>

                <div>
                  <label htmlFor="intent" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Votre objectif *</label>
                  <select
                    id="intent"
                    required
                    value={form.intent}
                    onChange={(e) => setForm({ ...form, intent: e.target.value as Lead["intent"] })}
                    className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors duration-150"
                  >
                    <option value="">-- Choisir --</option>
                    {intentOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="details" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Précisez votre demande (optionnel)</label>
                  <textarea
                    id="details"
                    rows={3}
                    placeholder="Ex: Je cherche un F3 à Bir El Djir, budget 15M DA..."
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors duration-150 resize-none"
                  />
                </div>

                <button type="submit" className="whatsapp-btn justify-center mt-2 py-4 text-base">
                  <Send size={16} />
                  Envoyer via WhatsApp
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Cliquer ouvrira WhatsApp avec votre message pré-rempli.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
