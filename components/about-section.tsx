"use client"

import { CheckCircle2 } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function AboutSection({ content }: { content: SiteContent }) {
  const { about, contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20souhaite%20en%20savoir%20plus.`

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5]">
              {about.profileImage
                ? <img src={about.profileImage} alt="Chabane Chawki" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-navy/10 flex items-center justify-center text-muted-foreground">Photo de profil</div>
              }
              <div className="absolute inset-0 border border-gold/20 rounded-lg pointer-events-none" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-navy text-white rounded-lg p-4 md:p-5 shadow-2xl max-w-[200px]">
              <div className="text-gold text-2xl font-serif font-bold">{about.yearsExperience}</div>
              <div className="text-white/80 text-xs leading-snug mt-0.5">{about.experienceLabel}</div>
              <div className="w-8 h-0.5 bg-gold mt-3" />
              <div className="text-white/50 text-[10px] mt-2 uppercase tracking-wider">Expert local</div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold" />)}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="section-divider" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">À propos</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
              {about.headline}<br /><span className="text-gold">{about.subheadline}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5 text-pretty">{about.paragraph1}</p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">{about.paragraph2}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["Oran Center","Bir El Djir","Es Senia","Hassi Ben Okba","Sidi Chahmi"].map((zone) => (
                <span key={zone} className="flex items-center gap-1.5 text-xs font-medium text-navy bg-secondary border border-border px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={11} className="text-gold" />{zone}
                </span>
              ))}
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
              <WaIcon />Discutons de votre projet
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function WaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
