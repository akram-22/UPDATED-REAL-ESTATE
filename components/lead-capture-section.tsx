"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { createLead } from "@/lib/db"

export function LeadCaptureSection() {
  const [form, setForm] = useState({ name: "", phone: "", intent: "buy", details: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) { setError("Nom et téléphone sont obligatoires."); return }
    setError("")
    setLoading(true)
    const result = await createLead({ name: form.name, phone: form.phone, intent: form.intent as any, details: form.details })
    setLoading(false)
    if (result) { setSuccess(true); setForm({ name: "", phone: "", intent: "buy", details: "" }) }
    else { setError("Une erreur s'est produite. Réessayez.") }
  }

  const cls = "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"

  if (success) {
    return (
      <section id="contact" className="py-24 bg-cream">
        <div className="max-w-xl mx-auto px-5 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-navy mb-2">Message reçu !</h2>
          <p className="text-muted-foreground">Chabane vous contactera dans les 2 heures.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="max-w-xl mx-auto px-5">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Contact</span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy mb-3">Parlez-moi de votre projet</h2>
          <p className="text-muted-foreground">Je vous réponds personnellement dans les 2 heures.</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Votre nom *</label>
              <input type="text" placeholder="Ex: Mohamed A." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Téléphone / WhatsApp *</label>
              <input type="tel" placeholder="Ex: 0541 00 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Votre projet</label>
            <select value={form.intent} onChange={(e) => setForm({ ...form, intent: e.target.value })} className={cls}>
              <option value="buy">🏠 Je cherche à acheter</option>
              <option value="sell">💰 Je veux vendre mon bien</option>
              <option value="invest">📈 Je veux investir</option>
              <option value="other">💬 Autre demande</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Détails (optionnel)</label>
            <textarea rows={3} placeholder="Décrivez votre projet en quelques mots..." value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className={`${cls} resize-none`} />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <button type="button" onClick={handleSubmit} disabled={loading} className="whatsapp-btn justify-center py-3.5 text-base disabled:opacity-60">
            {loading ? "Envoi en cours..." : "Envoyer ma demande"}
          </button>
          <p className="text-center text-xs text-muted-foreground">Réponse garantie sous 2h — Disponible 7j/7</p>
        </div>
      </div>
    </section>
  )
}
