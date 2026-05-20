"use client"

import { Phone, Instagram, Youtube } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function FinalCTA({ content }: { content: SiteContent }) {
  const { finalCta, footer, contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Bonjour Chabane, je suis prêt à passer à l'action pour mon projet immobilier à Oran.")}`

  return (
    <>
      <section className="relative py-28 md:py-36 bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10" style={{ background: "var(--gold)", filter: "blur(80px)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold" /><span className="text-gold text-xs font-medium tracking-widest uppercase">{finalCta.label}</span><div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {finalCta.headline}<br /><span className="text-gold">{finalCta.headlineGold}</span>
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-xl mx-auto">{finalCta.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn text-base px-10 py-4 w-full sm:w-auto justify-center"><WaIcon />{finalCta.ctaPrimaryText}</a>
            <a href={`tel:+${contact.whatsappNumber}`} className="btn-outline-gold text-base px-10 py-4 w-full sm:w-auto justify-center" style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)" }}>
              <Phone size={17} />{finalCta.ctaSecondaryText}
            </a>
          </div>
          <p className="text-white/35 text-xs">{finalCta.availabilityText}</p>
        </div>
      </section>

      <footer className="bg-navy border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="font-serif text-xl text-white font-bold">{footer.brandName}</div>
              <div className="text-gold text-xs tracking-widest uppercase mt-0.5">{footer.brandTagline}</div>
              <div className="text-white/40 text-xs mt-3">{footer.brandSubtitle}</div>
            </div>
            <nav className="flex flex-wrap justify-center gap-5 text-sm">
              {[["Services","#services"],["Biens","#properties"],["À propos","#about"],["Contact","#contact"]].map(([label,href]) => (
                <a key={href} href={href} className="text-white/50 hover:text-gold transition-colors">{label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a href={footer.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-colors"><Instagram size={15} /></a>
              <a href={footer.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-colors"><Youtube size={15} /></a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-colors"><WaIcon small /></a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-white/25 text-xs">
            © {new Date().getFullYear()} {footer.brandName} — Tous droits réservés.
          </div>
        </div>
      </footer>
    </>
  )
}

function WaIcon({ small }: { small?: boolean }) {
  const s = small ? 15 : 18
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
