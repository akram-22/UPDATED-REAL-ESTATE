"use client"

import { useState, useEffect, useCallback } from "react"
import type { Property, SiteContent, Lead } from "./types"
import { DEFAULT_PROPERTIES, DEFAULT_CONTENT } from "./seed-data"

// ─── Storage keys ─────────────────────────────────────────────────────────────
const KEYS = {
  PROPERTIES: "chabano_properties",
  CONTENT: "chabano_content",
  LEADS: "chabano_leads",
  AUTH: "chabano_admin_session",
} as const

// ─── Admin credentials ─────────────────────────────────────────────────────────
export const ADMIN_USERNAME = "chabane"
export const ADMIN_PASSWORD = "chabano2024"

// ─── Generic localStorage helpers ─────────────────────────────────────────────
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage quota exceeded — silent fail
  }
}

// ─── Properties store ─────────────────────────────────────────────────────────
export function usePropertiesStore() {
  const [properties, setPropertiesState] = useState<Property[]>(() =>
    readStorage(KEYS.PROPERTIES, DEFAULT_PROPERTIES)
  )

  useEffect(() => {
    writeStorage(KEYS.PROPERTIES, properties)
  }, [properties])

  const addProperty = useCallback((data: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const newProp: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPropertiesState((prev) => [newProp, ...prev])
    return newProp
  }, [])

  const updateProperty = useCallback((id: string, data: Partial<Property>) => {
    setPropertiesState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
    )
  }, [])

  const deleteProperty = useCallback((id: string) => {
    setPropertiesState((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { properties, addProperty, updateProperty, deleteProperty }
}

// ─── Content store ─────────────────────────────────────────────────────────────
export function useContentStore() {
  const [content, setContentState] = useState<SiteContent>(() =>
    readStorage(KEYS.CONTENT, DEFAULT_CONTENT)
  )

  useEffect(() => {
    writeStorage(KEYS.CONTENT, content)
  }, [content])

  const updateContent = useCallback((patch: Partial<SiteContent>) => {
    setContentState((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateHero = useCallback((patch: Partial<SiteContent["hero"]>) => {
    setContentState((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }))
  }, [])

  const updateAbout = useCallback((patch: Partial<SiteContent["about"]>) => {
    setContentState((prev) => ({ ...prev, about: { ...prev.about, ...patch } }))
  }, [])

  const updateServices = useCallback((patch: Partial<SiteContent["services"]>) => {
    setContentState((prev) => ({ ...prev, services: { ...prev.services, ...patch } }))
  }, [])

  const updateVideo = useCallback((patch: Partial<SiteContent["video"]>) => {
    setContentState((prev) => ({ ...prev, video: { ...prev.video, ...patch } }))
  }, [])

  const updateTestimonials = useCallback((patch: Partial<SiteContent["testimonials"]>) => {
    setContentState((prev) => ({ ...prev, testimonials: { ...prev.testimonials, ...patch } }))
  }, [])

  const updateFinalCta = useCallback((patch: Partial<SiteContent["finalCta"]>) => {
    setContentState((prev) => ({ ...prev, finalCta: { ...prev.finalCta, ...patch } }))
  }, [])

  const updateFooter = useCallback((patch: Partial<SiteContent["footer"]>) => {
    setContentState((prev) => ({ ...prev, footer: { ...prev.footer, ...patch } }))
  }, [])

  const updateContact = useCallback((patch: Partial<SiteContent["contact"]>) => {
    setContentState((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }))
  }, [])

  return {
    content,
    updateContent,
    updateHero,
    updateAbout,
    updateServices,
    updateVideo,
    updateTestimonials,
    updateFinalCta,
    updateFooter,
    updateContact,
  }
}

// ─── Leads store ───────────────────────────────────────────────────────────────
export function useLeadsStore() {
  const [leads, setLeadsState] = useState<Lead[]>(() =>
    readStorage(KEYS.LEADS, [] as Lead[])
  )

  useEffect(() => {
    writeStorage(KEYS.LEADS, leads)
  }, [leads])

  const addLead = useCallback((data: Omit<Lead, "id" | "createdAt" | "read">) => {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setLeadsState((prev) => [newLead, ...prev])
    return newLead
  }, [])

  const markAsRead = useCallback((id: string) => {
    setLeadsState((prev) => prev.map((l) => (l.id === id ? { ...l, read: true } : l)))
  }, [])

  const deleteLead = useCallback((id: string) => {
    setLeadsState((prev) => prev.filter((l) => l.id !== id))
  }, [])

  return { leads, addLead, markAsRead, deleteLead }
}

// ─── Auth store ────────────────────────────────────────────────────────────────
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return readStorage<boolean>(KEYS.AUTH, false)
  })

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      writeStorage(KEYS.AUTH, true)
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    writeStorage(KEYS.AUTH, false)
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}

// ─── Shared read-only getters ─────────────────────────────────────────────────
export function getPropertiesSnapshot(): Property[] {
  return readStorage(KEYS.PROPERTIES, DEFAULT_PROPERTIES)
}

export function getContentSnapshot(): SiteContent {
  return readStorage(KEYS.CONTENT, DEFAULT_CONTENT)
}
