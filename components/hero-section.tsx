"use client"

import { ArrowDown } from "lucide-react"
import { useContentStore } from "@/lib/store"

export function HeroSection() {
  const { content } = useContentStore()
  const { hero, contact } = content
  const WHATSAPP_LINK = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20cherche%20un%20bien%20immobilier%20%C3%A0%20Oran.`

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={hero.backgroundImage}
          alt="Vue panoramique de la ville d'Oran, Algérie"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/50 to-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/40 via-transparent to-navy/20" />
      </div>

      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-gold/40 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-xs font-medium tracking-widest uppercase">{hero.badge}</span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6 text-balance">
          {hero.headline.includes(",") ? (
            <>
              {hero.headline.split(",")[0]},
              <br />
              <span className="text-gold">{hero.headline.split(",").slice(1).join(",")}</span>
            </>
          ) : (
            <span>{hero.headline}</span>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
          {hero.subheadline}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
          {[
            { value: hero.stat1Value, label: hero.stat1Label },
            { value: hero.stat2Value, label: hero.stat2Label },
            { value: hero.stat3Value, label: hero.stat3Label },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-gold">{stat.value}</div>
              <div className="text-white/60 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            <WhatsAppIcon />
            {hero.ctaPrimaryText}
          </a>
          <a
            href="#properties"
            className="btn-outline-gold text-base px-8 py-4 w-full sm:w-auto justify-center border-white/40 text-white hover:bg-white/10 hover:border-white"
          >
            {hero.ctaSecondaryText}
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Découvrir</span>
          <ArrowDown size={16} />
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
