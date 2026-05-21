"use client"

import { Home, TrendingUp, DollarSign, ArrowRight } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function ServicesSection({ content }: { content: SiteContent }) {
  const { services, contact } = content
  const wa = (msg: string) => `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(msg)}`

  const list = [
    { data: services.service1, icon: Home, link: wa("Bonjour Chabane, je cherche à acheter un appartement à Oran."), accent: true },
    { data: services.service2, icon: DollarSign, link: wa("Bonjour Chabane, j'ai un bien à vendre à Oran."), accent: false },
    { data: services.service3, icon: TrendingUp, link: wa("Bonjour Chabane, je cherche des opportunités d'investissement à Oran."), accent: false },
  ]

  return (
    <section id="services" className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" /><span className="text-gold text-xs font-medium tracking-widest uppercase">{services.sectionLabel}</span><div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">{services.sectionTitle} <span className="text-gold">quelle que soit votre situation</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{services.sectionSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {list.map(({ data, icon: Icon, link, accent }) => (
            <div key={data.tag} className={`relative rounded-lg p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent ? "bg-navy text-white" : "bg-card border border-border"}`}>
              <span className={`inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-5 w-fit ${accent ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}>{data.tag}</span>
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5 bg-gold/10 border border-gold/20"><Icon size={22} className="text-gold" /></div>
              <h3 className={`font-serif text-xl font-bold mb-3 ${accent ? "text-white" : "text-navy"}`}>{data.title}</h3>
              <p className={`text-sm leading-relaxed mb-5 flex-1 ${accent ? "text-white/70" : "text-muted-foreground"}`}>{data.desc}</p>
              <ul className="flex flex-col gap-2 mb-7">
                {[data.benefit1, data.benefit2, data.benefit3].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                    <span className={`text-xs leading-relaxed ${accent ? "text-white/75" : "text-muted-foreground"}`}>{b}</span>
                  </li>
                ))}
              </ul>
              <a href={link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-semibold group transition-colors ${accent ? "text-gold hover:text-white" : "text-navy hover:text-gold"}`}>
                {data.cta}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
