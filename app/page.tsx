import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { PropertiesSection } from "@/components/properties-section"
import { VideoSection } from "@/components/video-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { LeadCaptureSection } from "@/components/lead-capture-section"
import { FinalCTA } from "@/components/final-cta"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function ChabanoPropertiesPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <PropertiesSection />
      <VideoSection />
      <TestimonialsSection />
      <LeadCaptureSection />
      <FinalCTA />
      <FloatingWhatsApp />
    </main>
  )
}
