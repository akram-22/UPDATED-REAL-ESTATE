"use client"

import { FAQBlock, useFAQData } from "@/components/faq-block"
import type { FAQAttachType } from "@/lib/types"

export function FAQSection({ attachType, attachRef, id }: { attachType: FAQAttachType; attachRef: string; id?: string }) {
  const { loaded, hasContent } = useFAQData(attachType, attachRef)
  if (!loaded || !hasContent) return null

  return (
    <section id={id} className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <FAQBlock attachType={attachType} attachRef={attachRef} />
      </div>
    </section>
  )
}
