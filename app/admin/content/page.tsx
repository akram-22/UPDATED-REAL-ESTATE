"use client"

import { useState, useEffect } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getSiteContent, saveSiteContent } from "@/lib/db"
import { ImageUpload } from "@/components/admin/image-upload"
import type { SiteContent } from "@/lib/types"
import { DEFAULT_CONTENT } from "@/lib/seed-data"

function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string
}) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="font-semibold text-navy mb-1">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-xs mb-5">{subtitle}</p>}
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Full({ children }: { children: React.ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>
}

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSiteContent().then((c) => { setContent(c); setLoading(false) })
  }, [])

  async function handleSave() {
    await saveSiteContent(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function setHero(patch: Partial<SiteContent["hero"]>) { setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } })) }
  function setAbout(patch: Partial<SiteContent["about"]>) { setContent((c) => ({ ...c, about: { ...c.about, ...patch } })) }
  function setServices(patch: Partial<SiteContent["services"]>) { setContent((c) => ({ ...c, services: { ...c.services, ...patch } })) }
  function setVideo(patch: Partial<SiteContent["video"]>) { setContent((c) => ({ ...c, video: { ...c.video, ...patch } })) }
  function setTestimonials(patch: Partial<SiteContent["testimonials"]>) { setContent((c) => ({ ...c, testimonials: { ...c.testimonials, ...patch } })) }
  function setFinalCta(patch: Partial<SiteContent["finalCta"]>) { setContent((c) => ({ ...c, finalCta: { ...c.finalCta, ...patch } })) }
  function setFooter(patch: Partial<SiteContent["footer"]>) { setContent((c) => ({ ...c, footer: { ...c.footer, ...patch } })) }
  function setContact(patch: Partial<SiteContent["contact"]>) { setContent((c) => ({ ...c, contact: { ...c.contact, ...patch } })) }

  const SaveBtn = () => (
    <button onClick={handleSave} className="btn-primary gap-2 text-sm whitespace-nowrap">
      {saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
      {saved ? "Enregistré !" : "Enregistrer les modifications"}
    </button>
  )

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Contenu du site</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Tout modifier depuis ici. Les changements sont sauvegardés dans la base de données.</p>
        </div>
        <SaveBtn />
      </div>

      <div className="flex flex-col gap-6">
        {/* HERO */}
        <Section title="🏠 Section Hero" subtitle="Arrière-plan, titres, stats, boutons.">
          <Full><ImageUpload label="Image de fond (vue panoramique d'Oran)" value={content.hero.backgroundImage} onChange={(v) => setHero({ backgroundImage: v })} hint="Uploadez votre photo de la vue d'Oran" /></Full>
          <Full><Field label="Badge" value={content.hero.badge} onChange={(v) => setHero({ badge: v })} /></Full>
          <Full><Field label="Titre principal" value={content.hero.headline} onChange={(v) => setHero({ headline: v })} multiline /></Full>
          <Full><Field label="Sous-titre" value={content.hero.subheadline} onChange={(v) => setHero({ subheadline: v })} multiline /></Full>
          <Field label="Stat 1 — Valeur" value={content.hero.stat1Value} onChange={(v) => setHero({ stat1Value: v })} />
          <Field label="Stat 1 — Label" value={content.hero.stat1Label} onChange={(v) => setHero({ stat1Label: v })} />
          <Field label="Stat 2 — Valeur" value={content.hero.stat2Value} onChange={(v) => setHero({ stat2Value: v })} />
          <Field label="Stat 2 — Label" value={content.hero.stat2Label} onChange={(v) => setHero({ stat2Label: v })} />
          <Field label="Stat 3 — Valeur" value={content.hero.stat3Value} onChange={(v) => setHero({ stat3Value: v })} />
          <Field label="Stat 3 — Label" value={content.hero.stat3Label} onChange={(v) => setHero({ stat3Label: v })} />
          <Field label="Bouton principal" value={content.hero.ctaPrimaryText} onChange={(v) => setHero({ ctaPrimaryText: v })} />
          <Field label="Bouton secondaire" value={content.hero.ctaSecondaryText} onChange={(v) => setHero({ ctaSecondaryText: v })} />
        </Section>

        {/* ABOUT */}
        <Section title="👤 Section À propos" subtitle="Photo de profil et textes de présentation.">
          <Full><ImageUpload label="Portrait professionnel de Chabane" value={content.about.profileImage} onChange={(v) => setAbout({ profileImage: v })} hint="Uploadez votre photo professionnelle" /></Full>
          <Full><Field label="Titre" value={content.about.headline} onChange={(v) => setAbout({ headline: v })} /></Full>
          <Full><Field label="Sous-titre (en or)" value={content.about.subheadline} onChange={(v) => setAbout({ subheadline: v })} /></Full>
          <Full><Field label="Paragraphe 1" value={content.about.paragraph1} onChange={(v) => setAbout({ paragraph1: v })} multiline /></Full>
          <Full><Field label="Paragraphe 2" value={content.about.paragraph2} onChange={(v) => setAbout({ paragraph2: v })} multiline /></Full>
          <Field label="Années d'expérience" value={content.about.yearsExperience} onChange={(v) => setAbout({ yearsExperience: v })} />
          <Field label="Label carte flottante" value={content.about.experienceLabel} onChange={(v) => setAbout({ experienceLabel: v })} />
        </Section>

        {/* SERVICES */}
        <Section title="🛠️ Services" subtitle="Les 3 cartes de services.">
          <Field label="Label de section" value={content.services.sectionLabel} onChange={(v) => setServices({ sectionLabel: v })} />
          <Field label="Titre de section" value={content.services.sectionTitle} onChange={(v) => setServices({ sectionTitle: v })} />
          <Full><Field label="Sous-titre" value={content.services.sectionSubtitle} onChange={(v) => setServices({ sectionSubtitle: v })} multiline /></Full>
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Carte 1 — Achat</p></div></Full>
          <Field label="Tag" value={content.services.service1.tag} onChange={(v) => setServices({ service1: { ...content.services.service1, tag: v } })} />
          <Field label="Titre" value={content.services.service1.title} onChange={(v) => setServices({ service1: { ...content.services.service1, title: v } })} />
          <Full><Field label="Description" value={content.services.service1.desc} onChange={(v) => setServices({ service1: { ...content.services.service1, desc: v } })} multiline /></Full>
          <Field label="Avantage 1" value={content.services.service1.benefit1} onChange={(v) => setServices({ service1: { ...content.services.service1, benefit1: v } })} />
          <Field label="Avantage 2" value={content.services.service1.benefit2} onChange={(v) => setServices({ service1: { ...content.services.service1, benefit2: v } })} />
          <Field label="Avantage 3" value={content.services.service1.benefit3} onChange={(v) => setServices({ service1: { ...content.services.service1, benefit3: v } })} />
          <Field label="CTA" value={content.services.service1.cta} onChange={(v) => setServices({ service1: { ...content.services.service1, cta: v } })} />
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Carte 2 — Vente</p></div></Full>
          <Field label="Tag" value={content.services.service2.tag} onChange={(v) => setServices({ service2: { ...content.services.service2, tag: v } })} />
          <Field label="Titre" value={content.services.service2.title} onChange={(v) => setServices({ service2: { ...content.services.service2, title: v } })} />
          <Full><Field label="Description" value={content.services.service2.desc} onChange={(v) => setServices({ service2: { ...content.services.service2, desc: v } })} multiline /></Full>
          <Field label="Avantage 1" value={content.services.service2.benefit1} onChange={(v) => setServices({ service2: { ...content.services.service2, benefit1: v } })} />
          <Field label="Avantage 2" value={content.services.service2.benefit2} onChange={(v) => setServices({ service2: { ...content.services.service2, benefit2: v } })} />
          <Field label="Avantage 3" value={content.services.service2.benefit3} onChange={(v) => setServices({ service2: { ...content.services.service2, benefit3: v } })} />
          <Field label="CTA" value={content.services.service2.cta} onChange={(v) => setServices({ service2: { ...content.services.service2, cta: v } })} />
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Carte 3 — Investissement</p></div></Full>
          <Field label="Tag" value={content.services.service3.tag} onChange={(v) => setServices({ service3: { ...content.services.service3, tag: v } })} />
          <Field label="Titre" value={content.services.service3.title} onChange={(v) => setServices({ service3: { ...content.services.service3, title: v } })} />
          <Full><Field label="Description" value={content.services.service3.desc} onChange={(v) => setServices({ service3: { ...content.services.service3, desc: v } })} multiline /></Full>
          <Field label="Avantage 1" value={content.services.service3.benefit1} onChange={(v) => setServices({ service3: { ...content.services.service3, benefit1: v } })} />
          <Field label="Avantage 2" value={content.services.service3.benefit2} onChange={(v) => setServices({ service3: { ...content.services.service3, benefit2: v } })} />
          <Field label="Avantage 3" value={content.services.service3.benefit3} onChange={(v) => setServices({ service3: { ...content.services.service3, benefit3: v } })} />
          <Field label="CTA" value={content.services.service3.cta} onChange={(v) => setServices({ service3: { ...content.services.service3, cta: v } })} />
        </Section>

        {/* VIDEO */}
        <Section title="🎬 Section Vidéo">
          <Full><ImageUpload label="Miniature vidéo (thumbnail)" value={content.video.videoThumbnail} onChange={(v) => setVideo({ videoThumbnail: v })} hint="Image affichée dans le player vidéo" /></Full>
          <Field label="Label" value={content.video.sectionLabel} onChange={(v) => setVideo({ sectionLabel: v })} />
          <Full><Field label="Titre" value={content.video.headline} onChange={(v) => setVideo({ headline: v })} multiline /></Full>
          <Full><Field label="Paragraphe 1" value={content.video.paragraph1} onChange={(v) => setVideo({ paragraph1: v })} multiline /></Full>
          <Full><Field label="Paragraphe 2" value={content.video.paragraph2} onChange={(v) => setVideo({ paragraph2: v })} multiline /></Full>
          <Field label="Stat — Valeur" value={content.video.stat1Value} onChange={(v) => setVideo({ stat1Value: v })} />
          <Field label="Stat — Label" value={content.video.stat1Label} onChange={(v) => setVideo({ stat1Label: v })} />
          <Field label="Bouton CTA" value={content.video.ctaText} onChange={(v) => setVideo({ ctaText: v })} />
        </Section>

        {/* TESTIMONIALS */}
        <Section title="⭐ Témoignages">
          <Field label="Label" value={content.testimonials.sectionLabel} onChange={(v) => setTestimonials({ sectionLabel: v })} />
          <Field label="Titre" value={content.testimonials.headline} onChange={(v) => setTestimonials({ headline: v })} />
          <Full><Field label="Sous-titre" value={content.testimonials.subtitle} onChange={(v) => setTestimonials({ subtitle: v })} multiline /></Full>
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Statistiques</p></div></Full>
          <Field label="Résultat 1 — Valeur" value={content.testimonials.result1.value} onChange={(v) => setTestimonials({ result1: { ...content.testimonials.result1, value: v } })} />
          <Field label="Résultat 1 — Label" value={content.testimonials.result1.label} onChange={(v) => setTestimonials({ result1: { ...content.testimonials.result1, label: v } })} />
          <Field label="Résultat 2 — Valeur" value={content.testimonials.result2.value} onChange={(v) => setTestimonials({ result2: { ...content.testimonials.result2, value: v } })} />
          <Field label="Résultat 2 — Label" value={content.testimonials.result2.label} onChange={(v) => setTestimonials({ result2: { ...content.testimonials.result2, label: v } })} />
          <Field label="Résultat 3 — Valeur" value={content.testimonials.result3.value} onChange={(v) => setTestimonials({ result3: { ...content.testimonials.result3, value: v } })} />
          <Field label="Résultat 3 — Label" value={content.testimonials.result3.label} onChange={(v) => setTestimonials({ result3: { ...content.testimonials.result3, label: v } })} />
          <Field label="Résultat 4 — Valeur" value={content.testimonials.result4.value} onChange={(v) => setTestimonials({ result4: { ...content.testimonials.result4, value: v } })} />
          <Field label="Résultat 4 — Label" value={content.testimonials.result4.label} onChange={(v) => setTestimonials({ result4: { ...content.testimonials.result4, label: v } })} />
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Témoignage 1</p></div></Full>
          <Field label="Nom" value={content.testimonials.testimonial1.name} onChange={(v) => setTestimonials({ testimonial1: { ...content.testimonials.testimonial1, name: v } })} />
          <Field label="Rôle" value={content.testimonials.testimonial1.role} onChange={(v) => setTestimonials({ testimonial1: { ...content.testimonials.testimonial1, role: v } })} />
          <Full><Field label="Texte" value={content.testimonials.testimonial1.text} onChange={(v) => setTestimonials({ testimonial1: { ...content.testimonials.testimonial1, text: v } })} multiline /></Full>
          <Field label="Initiale (avatar)" value={content.testimonials.testimonial1.avatar} onChange={(v) => setTestimonials({ testimonial1: { ...content.testimonials.testimonial1, avatar: v } })} />
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Témoignage 2</p></div></Full>
          <Field label="Nom" value={content.testimonials.testimonial2.name} onChange={(v) => setTestimonials({ testimonial2: { ...content.testimonials.testimonial2, name: v } })} />
          <Field label="Rôle" value={content.testimonials.testimonial2.role} onChange={(v) => setTestimonials({ testimonial2: { ...content.testimonials.testimonial2, role: v } })} />
          <Full><Field label="Texte" value={content.testimonials.testimonial2.text} onChange={(v) => setTestimonials({ testimonial2: { ...content.testimonials.testimonial2, text: v } })} multiline /></Full>
          <Field label="Initiale (avatar)" value={content.testimonials.testimonial2.avatar} onChange={(v) => setTestimonials({ testimonial2: { ...content.testimonials.testimonial2, avatar: v } })} />
          <Full><div className="border-t pt-3 mt-1"><p className="text-xs font-bold text-navy uppercase tracking-widest">Témoignage 3</p></div></Full>
          <Field label="Nom" value={content.testimonials.testimonial3.name} onChange={(v) => setTestimonials({ testimonial3: { ...content.testimonials.testimonial3, name: v } })} />
          <Field label="Rôle" value={content.testimonials.testimonial3.role} onChange={(v) => setTestimonials({ testimonial3: { ...content.testimonials.testimonial3, role: v } })} />
          <Full><Field label="Texte" value={content.testimonials.testimonial3.text} onChange={(v) => setTestimonials({ testimonial3: { ...content.testimonials.testimonial3, text: v } })} multiline /></Full>
          <Field label="Initiale (avatar)" value={content.testimonials.testimonial3.avatar} onChange={(v) => setTestimonials({ testimonial3: { ...content.testimonials.testimonial3, avatar: v } })} />
        </Section>

        {/* FINAL CTA */}
        <Section title="📣 Appel à l'action finale">
          <Field label="Label" value={content.finalCta.label} onChange={(v) => setFinalCta({ label: v })} />
          <Field label="Titre ligne 1" value={content.finalCta.headline} onChange={(v) => setFinalCta({ headline: v })} />
          <Field label="Titre ligne 2 (en or)" value={content.finalCta.headlineGold} onChange={(v) => setFinalCta({ headlineGold: v })} />
          <Full><Field label="Sous-titre" value={content.finalCta.subtitle} onChange={(v) => setFinalCta({ subtitle: v })} multiline /></Full>
          <Field label="Bouton principal" value={content.finalCta.ctaPrimaryText} onChange={(v) => setFinalCta({ ctaPrimaryText: v })} />
          <Field label="Bouton secondaire" value={content.finalCta.ctaSecondaryText} onChange={(v) => setFinalCta({ ctaSecondaryText: v })} />
          <Full><Field label="Texte disponibilité" value={content.finalCta.availabilityText} onChange={(v) => setFinalCta({ availabilityText: v })} /></Full>
        </Section>

        {/* FOOTER */}
        <Section title="🔗 Footer & Réseaux sociaux">
          <Field label="Nom de la marque" value={content.footer.brandName} onChange={(v) => setFooter({ brandName: v })} />
          <Field label="Tagline" value={content.footer.brandTagline} onChange={(v) => setFooter({ brandTagline: v })} />
          <Full><Field label="Sous-titre" value={content.footer.brandSubtitle} onChange={(v) => setFooter({ brandSubtitle: v })} /></Full>
          <Field label="Lien Instagram" value={content.footer.instagramUrl} onChange={(v) => setFooter({ instagramUrl: v })} />
          <Field label="Lien YouTube" value={content.footer.youtubeUrl} onChange={(v) => setFooter({ youtubeUrl: v })} />
        </Section>

        {/* CONTACT */}
        <Section title="📞 Coordonnées">
          <Field label="Numéro WhatsApp (sans +)" value={content.contact.whatsappNumber} onChange={(v) => setContact({ whatsappNumber: v })} placeholder="213541029014" />
          <Full><Field label="Texte de disponibilité" value={content.contact.availabilityText} onChange={(v) => setContact({ availabilityText: v })} multiline /></Full>
        </Section>

        <div className="flex justify-end pb-8"><SaveBtn /></div>
      </div>
    </AdminShell>
  )
}
