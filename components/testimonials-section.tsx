"use client"

import { Quote, Star } from "lucide-react"
import { useContentStore } from "@/lib/store"

export function TestimonialsSection() {
  const { content } = useContentStore()
  const { testimonials } = content

  const testimonialsList = [testimonials.testimonial1, testimonials.testimonial2, testimonials.testimonial3]
  const results = [testimonials.result1, testimonials.result2, testimonials.result3, testimonials.result4]

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">{testimonials.sectionLabel}</span>
            <div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4 text-balance">
            {testimonials.headline}{" "}
            <span className="text-gold">pas des promesses</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            {testimonials.subtitle}
          </p>
        </div>

        {/* Results bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {results.map((r) => (
            <div key={r.label} className="text-center bg-card border border-border rounded-lg py-6 px-4 hover:border-gold/30 transition-colors duration-200">
              <div className="font-serif text-3xl md:text-4xl font-bold text-gold mb-1">{r.value}</div>
              <div className="text-muted-foreground text-xs leading-tight text-pretty">{r.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonialsList.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-lg p-6 flex flex-col hover:shadow-lg hover:border-gold/20 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={13} fill="var(--gold)" className="text-gold" />
                ))}
              </div>
              <Quote size={28} className="text-gold/30 mb-3" />
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 text-pretty italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-navy text-white font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-navy text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 items-center">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">Créateur de contenu UGC certifié</span>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5">
            <Star size={13} fill="var(--gold)" className="text-gold" />
            <span className="text-sm text-muted-foreground font-medium">5/5 sur les avis clients</span>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5">
            <span className="text-sm text-muted-foreground font-medium">Expert immobilier Oran depuis 2019</span>
          </div>
        </div>
      </div>
    </section>
  )
}
