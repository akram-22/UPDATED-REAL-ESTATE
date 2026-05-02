"use client"

import { Play, Eye, Share2, Shield } from "lucide-react"
import { useContentStore } from "@/lib/store"

const pillars = [
  {
    icon: Eye,
    title: "Transparence totale",
    desc: "Vous voyez chaque pièce, chaque détail avant de vous déplacer. Plus de mauvaises surprises.",
  },
  {
    icon: Play,
    title: "Présentation cinématographique",
    desc: "Mes vidéos ne sont pas faites avec un téléphone tremblant. Elles donnent envie d'acheter.",
  },
  {
    icon: Share2,
    title: "Distribution ciblée",
    desc: "Les vidéos sont envoyées à mes acheteurs qualifiés avant même d'être publiées.",
  },
  {
    icon: Shield,
    title: "Confiance immédiate",
    desc: "Un bien bien présenté inspire confiance et se vend plus vite, souvent au prix demandé.",
  },
]

export function VideoSection() {
  const { content } = useContentStore()
  const { video, contact } = content
  const WHATSAPP_VIDEO = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20veux%20une%20visite%20vid%C3%A9o%20d%27un%20bien.`

  return (
    <section id="video" className="py-24 md:py-32 bg-navy overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: "var(--gold)", filter: "blur(80px)" }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: "var(--gold)", filter: "blur(100px)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">{video.sectionLabel}</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6 leading-tight text-balance">
              {video.headline.includes("comme") ? (
                <>
                  {video.headline.split("comme")[0]}comme
                  <br />
                  <span className="text-gold">{video.headline.split("comme")[1]}</span>
                </>
              ) : (
                <span className="text-gold">{video.headline}</span>
              )}
            </h2>
            <p className="text-white/65 leading-relaxed mb-5 text-pretty">{video.paragraph1}</p>
            <p className="text-white/65 leading-relaxed mb-10 text-pretty">{video.paragraph2}</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {pillars.map((p) => (
                <div key={p.title} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-gold/30 transition-colors duration-200">
                  <p.icon size={20} className="text-gold mb-2" />
                  <div className="font-semibold text-white text-sm mb-1">{p.title}</div>
                  <div className="text-white/55 text-xs leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>

            <a href={WHATSAPP_VIDEO} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
              <WhatsAppIcon />
              {video.ctaText}
            </a>
          </div>

          {/* Right: video mockup */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
              <img
                src={video.videoThumbnail}
                alt="Aperçu d'une visite vidéo professionnelle d'un appartement à Oran"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-navy/40 flex items-center justify-center">
                <a
                  href={WHATSAPP_VIDEO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-gold flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-xl"
                  aria-label="Demander une visite vidéo"
                >
                  <Play size={24} fill="var(--navy)" className="text-navy ml-1" />
                </a>
              </div>
              <div className="absolute bottom-3 right-3 bg-navy/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                Visite vidéo — 2-3 min
              </div>
            </div>

            <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-gold text-navy rounded-lg p-4 shadow-xl hidden md:block">
              <div className="font-serif text-3xl font-bold">{video.stat1Value}</div>
              <div className="text-xs font-semibold mt-0.5 leading-tight max-w-[100px]">{video.stat1Label}</div>
            </div>

            <div className="absolute -right-4 -bottom-4 bg-white rounded-lg p-4 shadow-xl max-w-[160px] hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">En ligne</span>
              </div>
              <div className="font-serif text-sm font-bold text-navy">Visite vidéo</div>
              <div className="text-xs text-muted-foreground mt-0.5">Disponible 7j/7</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
