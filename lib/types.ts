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
  seo_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string
  canonical_url: string
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string
  title: string
  developer: string
  location: string
  description: string
  price_from: string
  price_to: string
  surface_from: string
  surface_to: string
  delivery_date: string
  types_available: string[]
  features: string[]
  images: string[]
  video_url: string
  status: "upcoming" | "selling" | "delivered"
  badge: string
  seo_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string
  canonical_url: string
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
    service4: ServiceItem
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
  promotions: {
    sectionLabel: string; headline: string; subtitle: string
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
  intent: "buy" | "sell" | "invest" | "promo" | "other"
  details: string; created_at: string; read: boolean
}

// ── SEO ───────────────────────────────────────────────────────
export interface SEOPage {
  id: string
  page_key: string
  page_label: string
  seo_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string
  canonical_url: string
  noindex: boolean
  schema_type: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  cover_alt: string
  seo_title: string
  meta_description: string
  og_image: string
  published: boolean
  category_id: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
}

// ── FAQ ───────────────────────────────────────────────────────
export type FAQAttachType = "page" | "property" | "article"

export interface FAQSection {
  id: string
  title: string
  description: string
  attach_type: FAQAttachType
  attach_ref: string
  position: number
  created_at: string
  updated_at: string
}

export interface FAQItem {
  id: string
  section_id: string
  question: string
  answer: string
  position: number
  created_at: string
  updated_at: string
}

export interface Redirect {
  id: string
  from_path: string
  to_path: string
  type: "301" | "302"
  created_at: string
}

// ── NEIGHBORHOODS ─────────────────────────────────────────────
export interface Neighborhood {
  id: string
  name: string
  slug: string
  intro: string
  amenities: string[]
  cover_image: string
  cover_alt: string
  seo_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string
  position: number
  created_at: string
  updated_at: string
}

// ── SITE SETTINGS (Google Business Profile + Analytics) ────────
export interface SiteSettings {
  id: number
  gbp_business_name: string
  gbp_phone: string
  gbp_service_area: string
  gbp_profile_url: string
  gbp_review_link: string
  gbp_post_ideas: string[]
  ga4_measurement_id: string
  gsc_verification_code: string
  seo_notes: string
  updated_at: string
}
