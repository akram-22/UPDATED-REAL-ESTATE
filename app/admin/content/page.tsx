"use client"

import { useState } from "react"
import { Save, CheckCircle2, Image as ImageIcon } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { useContentStore } from "@/lib/store"
import type { SiteContent } from "@/lib/types"

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
  hint = "",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
        />
      )}
    </div>
  )
}

function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
        />
        <ImageIcon size={16} className="text-muted-foreground mt-3 flex-shrink-0" />
      </div>
      {value && (
        <div className="mt-2 rounded overflow-hidden border border-border max-h-32">
          <img src={value} alt="Aperçu" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
        </div>
      )}
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

function FullWidth({ children }: { children: React.ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>
}

export default function AdminContentPage() {
  const { content, updateHero, updateAbout, updateServices, updateVideo, updateTestimonials, updateFinalCta, updateFooter, updateContact } = useContentStore()

  const [hero, setHero] = useState({ ...content.hero })
  const [about, setAbout] = useState({ ...content.about })
  const [services, setServices] = useState({ ...content.services })
  const [video, setVideo] = useState({ ...content.video })
  const [testimonials, setTestimonials] = useState({ ...content.testimonials })
  const [finalCta, setFinalCta] = useState({ ...content.finalCta })
  const [footer, setFooter] = useState({ ...content.footer })
  const [contact, setContact] = useState({ ...content.contact })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateHero(hero)
    updateAbout(about)
    updateServices(services)
    updateVideo(video)
    updateTestimonials(testimonials)
    updateFinalCta(finalCta)
    updateFooter(footer)
    updateContact(contact)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const SaveBtn = () => (
    <button onClick={handleSave} className="btn-primary gap-2 text-sm whitespace-nowrap">
      {saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
      {saved ? "Enregistré !" : "Enregistrer les modifications"}
    </button>
  )

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Contenu du site</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Modifiez tout le contenu visible sur votre site.</p>
        </div>
        <SaveBtn />
      </div>

      <div className="flex flex-col gap-6">

        {/* ── HERO ── */}
        <Section title="🏠 Section Hero" subtitle="Première section visible sur le site — arrière-plan, titres, stats, boutons.">
          <FullWidth>
            <ImageField
              label="Image de fond (arrière-plan)"
              value={hero.backgroundImage}
              onChange={(v) => setHero({ ...hero, backgroundImage: v })}
              hint="Collez l'URL d'une image (ex: https://images.unsplash.com/...)"
            />
          </FullWidth>
          <FullWidth>
            <Field label="Badge / Accroche" value={hero.badge} onChange={(v) => setHero({ ...hero, badge: v })} placeholder="Oran, Algérie — Immobilier Premium" />
          </FullWidth>
          <FullWidth>
            <Field label="Titre principal" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} multiline placeholder="Trouvez le bien qui vous correspond..." />
          </FullWidth>
          <FullWidth>
            <Field label="Sous-titre" value={hero.subheadline} onChange={(v) => setHero({ ...hero, subheadline: v })} multiline />
          </FullWidth>
          <Field label="Stat 1 — Valeur" value={hero.stat1Value} onChange={(v) => setHero({ ...hero, stat1Value: v })} placeholder="100+" />
          <Field label="Stat 1 — Label" value={hero.stat1Label} onChange={(v) => setHero({ ...hero, stat1Label: v })} placeholder="Biens vendus" />
          <Field label="Stat 2 — Valeur" value={hero.stat2Value} onChange={(v) => setHero({ ...hero, stat2Value: v })} placeholder="48h" />
          <Field label="Stat 2 — Label" value={hero.stat2Label} onChange={(v) => setHero({ ...hero, stat2Label: v })} placeholder="Délai moyen de contact" />
          <Field label="Stat 3 — Valeur" value={hero.stat3Value} onChange={(v) => setHero({ ...hero, stat3Value: v })} placeholder="Oran" />
          <Field label="Stat 3 — Label" value={hero.stat3Label} onChange={(v) => setHero({ ...hero, stat3Label: v })} placeholder="Expert local" />
          <Field label="Bouton principal (texte)" value={hero.ctaPrimaryText} onChange={(v) => setHero({ ...hero, ctaPrimaryText: v })} />
          <Field label="Bouton secondaire (texte)" value={hero.ctaSecondaryText} onChange={(v) => setHero({ ...hero, ctaSecondaryText: v })} />
        </Section>

        {/* ── ABOUT ── */}
        <Section title="👤 Section À propos" subtitle="Votre présentation personnelle et photo de profil.">
          <FullWidth>
            <ImageField
              label="Photo de profil"
              value={about.profileImage}
              onChange={(v) => setAbout({ ...about, profileImage: v })}
              hint="Collez l'URL de votre photo professionnelle"
            />
          </FullWidth>
          <FullWidth>
            <Field label="Titre" value={about.headline} onChange={(v) => setAbout({ ...about, headline: v })} />
          </FullWidth>
          <FullWidth>
            <Field label="Sous-titre (en or)" value={about.subheadline} onChange={(v) => setAbout({ ...about, subheadline: v })} />
          </FullWidth>
          <FullWidth>
            <Field label="Paragraphe 1" value={about.paragraph1} onChange={(v) => setAbout({ ...about, paragraph1: v })} multiline />
          </FullWidth>
          <FullWidth>
            <Field label="Paragraphe 2" value={about.paragraph2} onChange={(v) => setAbout({ ...about, paragraph2: v })} multiline />
          </FullWidth>
          <Field label="Années d'expérience" value={about.yearsExperience} onChange={(v) => setAbout({ ...about, yearsExperience: v })} placeholder="5+" />
          <Field label="Label de la carte flottante" value={about.experienceLabel} onChange={(v) => setAbout({ ...about, experienceLabel: v })} />
        </Section>

        {/* ── SERVICES ── */}
        <Section title="🛠️ Section Services" subtitle="Les 3 cartes de services (Achat, Vente, Investissement).">
          <Field label="Label de section" value={services.sectionLabel} onChange={(v) => setServices({ ...services, sectionLabel: v })} />
          <Field label="Titre de section" value={services.sectionTitle} onChange={(v) => setServices({ ...services, sectionTitle: v })} />
          <FullWidth>
            <Field label="Sous-titre de section" value={services.sectionSubtitle} onChange={(v) => setServices({ ...services, sectionSubtitle: v })} multiline />
          </FullWidth>
          {/* Service 1 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Carte 1 — Achat</p></div></FullWidth>
          <Field label="Tag" value={services.service1.tag} onChange={(v) => setServices({ ...services, service1: { ...services.service1, tag: v } })} />
          <Field label="Titre" value={services.service1.title} onChange={(v) => setServices({ ...services, service1: { ...services.service1, title: v } })} />
          <FullWidth><Field label="Description" value={services.service1.desc} onChange={(v) => setServices({ ...services, service1: { ...services.service1, desc: v } })} multiline /></FullWidth>
          <Field label="Avantage 1" value={services.service1.benefit1} onChange={(v) => setServices({ ...services, service1: { ...services.service1, benefit1: v } })} />
          <Field label="Avantage 2" value={services.service1.benefit2} onChange={(v) => setServices({ ...services, service1: { ...services.service1, benefit2: v } })} />
          <Field label="Avantage 3" value={services.service1.benefit3} onChange={(v) => setServices({ ...services, service1: { ...services.service1, benefit3: v } })} />
          <Field label="Texte du bouton CTA" value={services.service1.cta} onChange={(v) => setServices({ ...services, service1: { ...services.service1, cta: v } })} />
          {/* Service 2 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Carte 2 — Vente</p></div></FullWidth>
          <Field label="Tag" value={services.service2.tag} onChange={(v) => setServices({ ...services, service2: { ...services.service2, tag: v } })} />
          <Field label="Titre" value={services.service2.title} onChange={(v) => setServices({ ...services, service2: { ...services.service2, title: v } })} />
          <FullWidth><Field label="Description" value={services.service2.desc} onChange={(v) => setServices({ ...services, service2: { ...services.service2, desc: v } })} multiline /></FullWidth>
          <Field label="Avantage 1" value={services.service2.benefit1} onChange={(v) => setServices({ ...services, service2: { ...services.service2, benefit1: v } })} />
          <Field label="Avantage 2" value={services.service2.benefit2} onChange={(v) => setServices({ ...services, service2: { ...services.service2, benefit2: v } })} />
          <Field label="Avantage 3" value={services.service2.benefit3} onChange={(v) => setServices({ ...services, service2: { ...services.service2, benefit3: v } })} />
          <Field label="Texte du bouton CTA" value={services.service2.cta} onChange={(v) => setServices({ ...services, service2: { ...services.service2, cta: v } })} />
          {/* Service 3 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Carte 3 — Investissement</p></div></FullWidth>
          <Field label="Tag" value={services.service3.tag} onChange={(v) => setServices({ ...services, service3: { ...services.service3, tag: v } })} />
          <Field label="Titre" value={services.service3.title} onChange={(v) => setServices({ ...services, service3: { ...services.service3, title: v } })} />
          <FullWidth><Field label="Description" value={services.service3.desc} onChange={(v) => setServices({ ...services, service3: { ...services.service3, desc: v } })} multiline /></FullWidth>
          <Field label="Avantage 1" value={services.service3.benefit1} onChange={(v) => setServices({ ...services, service3: { ...services.service3, benefit1: v } })} />
          <Field label="Avantage 2" value={services.service3.benefit2} onChange={(v) => setServices({ ...services, service3: { ...services.service3, benefit2: v } })} />
          <Field label="Avantage 3" value={services.service3.benefit3} onChange={(v) => setServices({ ...services, service3: { ...services.service3, benefit3: v } })} />
          <Field label="Texte du bouton CTA" value={services.service3.cta} onChange={(v) => setServices({ ...services, service3: { ...services.service3, cta: v } })} />
        </Section>

        {/* ── VIDEO ── */}
        <Section title="🎬 Section Vidéo" subtitle="La section qui présente vos visites vidéo professionnelles.">
          <FullWidth>
            <ImageField
              label="Miniature / Thumbnail de la vidéo"
              value={video.videoThumbnail}
              onChange={(v) => setVideo({ ...video, videoThumbnail: v })}
              hint="L'image affichée dans le player vidéo. Collez l'URL de votre thumbnail."
            />
          </FullWidth>
          <Field label="Label de section" value={video.sectionLabel} onChange={(v) => setVideo({ ...video, sectionLabel: v })} />
          <FullWidth><Field label="Titre" value={video.headline} onChange={(v) => setVideo({ ...video, headline: v })} multiline /></FullWidth>
          <FullWidth><Field label="Paragraphe 1" value={video.paragraph1} onChange={(v) => setVideo({ ...video, paragraph1: v })} multiline /></FullWidth>
          <FullWidth><Field label="Paragraphe 2" value={video.paragraph2} onChange={(v) => setVideo({ ...video, paragraph2: v })} multiline /></FullWidth>
          <Field label="Statistique — Valeur" value={video.stat1Value} onChange={(v) => setVideo({ ...video, stat1Value: v })} placeholder="3x" />
          <Field label="Statistique — Label" value={video.stat1Label} onChange={(v) => setVideo({ ...video, stat1Label: v })} placeholder="plus de visites sérieuses" />
          <Field label="Texte du bouton CTA" value={video.ctaText} onChange={(v) => setVideo({ ...video, ctaText: v })} />
        </Section>

        {/* ── TESTIMONIALS ── */}
        <Section title="⭐ Section Témoignages" subtitle="Les 3 avis clients et les 4 statistiques de résultats.">
          <Field label="Label de section" value={testimonials.sectionLabel} onChange={(v) => setTestimonials({ ...testimonials, sectionLabel: v })} />
          <Field label="Titre" value={testimonials.headline} onChange={(v) => setTestimonials({ ...testimonials, headline: v })} />
          <FullWidth><Field label="Sous-titre" value={testimonials.subtitle} onChange={(v) => setTestimonials({ ...testimonials, subtitle: v })} multiline /></FullWidth>
          {/* Results */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Statistiques de résultats</p></div></FullWidth>
          <Field label="Résultat 1 — Valeur" value={testimonials.result1.value} onChange={(v) => setTestimonials({ ...testimonials, result1: { ...testimonials.result1, value: v } })} />
          <Field label="Résultat 1 — Label" value={testimonials.result1.label} onChange={(v) => setTestimonials({ ...testimonials, result1: { ...testimonials.result1, label: v } })} />
          <Field label="Résultat 2 — Valeur" value={testimonials.result2.value} onChange={(v) => setTestimonials({ ...testimonials, result2: { ...testimonials.result2, value: v } })} />
          <Field label="Résultat 2 — Label" value={testimonials.result2.label} onChange={(v) => setTestimonials({ ...testimonials, result2: { ...testimonials.result2, label: v } })} />
          <Field label="Résultat 3 — Valeur" value={testimonials.result3.value} onChange={(v) => setTestimonials({ ...testimonials, result3: { ...testimonials.result3, value: v } })} />
          <Field label="Résultat 3 — Label" value={testimonials.result3.label} onChange={(v) => setTestimonials({ ...testimonials, result3: { ...testimonials.result3, label: v } })} />
          <Field label="Résultat 4 — Valeur" value={testimonials.result4.value} onChange={(v) => setTestimonials({ ...testimonials, result4: { ...testimonials.result4, value: v } })} />
          <Field label="Résultat 4 — Label" value={testimonials.result4.label} onChange={(v) => setTestimonials({ ...testimonials, result4: { ...testimonials.result4, label: v } })} />
          {/* Testimonial 1 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Témoignage 1</p></div></FullWidth>
          <Field label="Nom" value={testimonials.testimonial1.name} onChange={(v) => setTestimonials({ ...testimonials, testimonial1: { ...testimonials.testimonial1, name: v } })} />
          <Field label="Rôle / Description" value={testimonials.testimonial1.role} onChange={(v) => setTestimonials({ ...testimonials, testimonial1: { ...testimonials.testimonial1, role: v } })} />
          <FullWidth><Field label="Texte du témoignage" value={testimonials.testimonial1.text} onChange={(v) => setTestimonials({ ...testimonials, testimonial1: { ...testimonials.testimonial1, text: v } })} multiline /></FullWidth>
          <Field label="Initiale (avatar)" value={testimonials.testimonial1.avatar} onChange={(v) => setTestimonials({ ...testimonials, testimonial1: { ...testimonials.testimonial1, avatar: v } })} placeholder="K" />
          {/* Testimonial 2 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Témoignage 2</p></div></FullWidth>
          <Field label="Nom" value={testimonials.testimonial2.name} onChange={(v) => setTestimonials({ ...testimonials, testimonial2: { ...testimonials.testimonial2, name: v } })} />
          <Field label="Rôle / Description" value={testimonials.testimonial2.role} onChange={(v) => setTestimonials({ ...testimonials, testimonial2: { ...testimonials.testimonial2, role: v } })} />
          <FullWidth><Field label="Texte du témoignage" value={testimonials.testimonial2.text} onChange={(v) => setTestimonials({ ...testimonials, testimonial2: { ...testimonials.testimonial2, text: v } })} multiline /></FullWidth>
          <Field label="Initiale (avatar)" value={testimonials.testimonial2.avatar} onChange={(v) => setTestimonials({ ...testimonials, testimonial2: { ...testimonials.testimonial2, avatar: v } })} placeholder="S" />
          {/* Testimonial 3 */}
          <FullWidth><div className="border-t border-border pt-4 mt-2"><p className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Témoignage 3</p></div></FullWidth>
          <Field label="Nom" value={testimonials.testimonial3.name} onChange={(v) => setTestimonials({ ...testimonials, testimonial3: { ...testimonials.testimonial3, name: v } })} />
          <Field label="Rôle / Description" value={testimonials.testimonial3.role} onChange={(v) => setTestimonials({ ...testimonials, testimonial3: { ...testimonials.testimonial3, role: v } })} />
          <FullWidth><Field label="Texte du témoignage" value={testimonials.testimonial3.text} onChange={(v) => setTestimonials({ ...testimonials, testimonial3: { ...testimonials.testimonial3, text: v } })} multiline /></FullWidth>
          <Field label="Initiale (avatar)" value={testimonials.testimonial3.avatar} onChange={(v) => setTestimonials({ ...testimonials, testimonial3: { ...testimonials.testimonial3, avatar: v } })} placeholder="M" />
        </Section>

        {/* ── FINAL CTA ── */}
        <Section title="📣 Section Appel à l'action finale" subtitle="La grande section en bas de page avec les boutons principaux.">
          <Field label="Label" value={finalCta.label} onChange={(v) => setFinalCta({ ...finalCta, label: v })} />
          <Field label="Titre (ligne 1)" value={finalCta.headline} onChange={(v) => setFinalCta({ ...finalCta, headline: v })} />
          <Field label="Titre (ligne 2 — en or)" value={finalCta.headlineGold} onChange={(v) => setFinalCta({ ...finalCta, headlineGold: v })} />
          <FullWidth><Field label="Sous-titre" value={finalCta.subtitle} onChange={(v) => setFinalCta({ ...finalCta, subtitle: v })} multiline /></FullWidth>
          <Field label="Bouton principal (texte)" value={finalCta.ctaPrimaryText} onChange={(v) => setFinalCta({ ...finalCta, ctaPrimaryText: v })} />
          <Field label="Bouton secondaire (texte)" value={finalCta.ctaSecondaryText} onChange={(v) => setFinalCta({ ...finalCta, ctaSecondaryText: v })} />
          <FullWidth><Field label="Texte de disponibilité" value={finalCta.availabilityText} onChange={(v) => setFinalCta({ ...finalCta, availabilityText: v })} /></FullWidth>
        </Section>

        {/* ── FOOTER ── */}
        <Section title="🔗 Footer & Réseaux sociaux" subtitle="Nom de marque, tagline et liens Instagram / YouTube.">
          <Field label="Nom de la marque" value={footer.brandName} onChange={(v) => setFooter({ ...footer, brandName: v })} placeholder="Chabano Properties" />
          <Field label="Tagline" value={footer.brandTagline} onChange={(v) => setFooter({ ...footer, brandTagline: v })} placeholder="Oran, Algérie" />
          <FullWidth><Field label="Sous-titre" value={footer.brandSubtitle} onChange={(v) => setFooter({ ...footer, brandSubtitle: v })} /></FullWidth>
          <Field label="Lien Instagram" value={footer.instagramUrl} onChange={(v) => setFooter({ ...footer, instagramUrl: v })} placeholder="https://instagram.com/..." />
          <Field label="Lien YouTube" value={footer.youtubeUrl} onChange={(v) => setFooter({ ...footer, youtubeUrl: v })} placeholder="https://youtube.com/..." />
        </Section>

        {/* ── CONTACT ── */}
        <Section title="📞 Coordonnées" subtitle="Numéro WhatsApp utilisé sur tout le site.">
          <Field label="Numéro WhatsApp (sans +)" value={contact.whatsappNumber} onChange={(v) => setContact({ ...contact, whatsappNumber: v })} placeholder="213541029014" />
          <FullWidth><Field label="Texte de disponibilité" value={contact.availabilityText} onChange={(v) => setContact({ ...contact, availabilityText: v })} multiline /></FullWidth>
        </Section>

        <div className="flex justify-end pb-8">
          <SaveBtn />
        </div>
      </div>
    </AdminShell>
  )
}
