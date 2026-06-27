"use client"

import { useEffect, useState } from "react"
import { getSiteContent, getProperties } from "@/lib/db"
import { DEFAULT_CONTENT } from "@/lib/seed-data"
import type { SiteContent, Property } from "@/lib/types"
import { NavBar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { PropertiesSection } from "@/components/properties-section"
import { PromotionsSection } from "@/components/promotions-section"
import { VideoSection } from "@/components/video-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { LeadCaptureSection } from "@/components/lead-capture-section"
import { FinalCTA } from "@/components/final-cta"
import { FAQSection } from "@/components/faq-section"

export function HomeClient() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    getSiteContent().then(setContent)
    getProperties().then(setProperties)
  }, [])

  return (
    <>
      <NavBar content={content} />
      <HeroSection content={content} />
      <AboutSection content={content} />
      <ServicesSection content={content} />
      <PropertiesSection properties={properties} content={content} />
      <FAQSection attachType="page" attachRef="properties" />
      <PromotionsSection content={content} />
      <FAQSection attachType="page" attachRef="promotions" />
      <VideoSection content={content} />
      <TestimonialsSection content={content} />
      <FAQSection attachType="page" attachRef="home" id="faq" />
      <LeadCaptureSection />
      <FinalCTA content={content} />
    </>
  )
}
