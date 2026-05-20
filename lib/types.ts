export type PropertyType = "F2" | "F3" | "F4" | "F5+"
export type PropertyStatus = "available" | "sold" | "reserved"

export interface Property {
  id: string
  type: PropertyType
  title: string
  location: string
  price: string
  surface: string
  rooms: number
  condition: string
  badge: string
  badge_color: string
  features: string[]
  description: string
  images: string[]
  video_url: string
  residence_name: string
  developer: string
  block: string
  floor: string
  status: PropertyStatus
  created_at: string
  updated_at: string
}

export interface ServiceItem {
  tag: string; title: string; desc: string
  benefit1: string; benefit2: string; benefit3: string; cta: string
}

export interface TestimonialItem {
  name: string; role: string; text: string; stars: number; avatar: string
}

export interface ResultItem { value: string; label: string }

export interface SiteContent {
  hero: {
    headline: string; subheadline: string; badge: string
    backgroundImage: string
    stat1Value: string; stat1Label: string
    stat2Value: string; stat2Label: string
    stat3Value: string; stat3Label: string
    ctaPrimaryText: string; ctaSecondaryText: string
  }
  about: {
    headline: string; subheadline: string
    paragraph1: string; paragraph2: string
    yearsExperience: string; experienceLabel: string
    profileImage: string
  }
  services: {
    sectionLabel: string; sectionTitle: string; sectionSubtitle: string
    service1: ServiceItem; service2: ServiceItem; service3: ServiceItem
  }
  video: {
    sectionLabel: string; headline: string
    paragraph1: string; paragraph2: string
    videoThumbnail: string; stat1Value: string; stat1Label: string; ctaText: string
  }
  testimonials: {
    sectionLabel: string; headline: string; subtitle: string
    testimonial1: TestimonialItem; testimonial2: TestimonialItem; testimonial3: TestimonialItem
    result1: ResultItem; result2: ResultItem; result3: ResultItem; result4: ResultItem
  }
  finalCta: {
    label: string; headline: string; headlineGold: string
    subtitle: string; ctaPrimaryText: string; ctaSecondaryText: string; availabilityText: string
  }
  footer: {
    brandName: string; brandTagline: string; brandSubtitle: string
    instagramUrl: string; youtubeUrl: string
  }
  contact: { whatsappNumber: string; availabilityText: string }
}

export interface Lead {
  id: string; name: string; phone: string
  intent: "buy" | "sell" | "invest" | "other"
  details: string; created_at: string; read: boolean
}
