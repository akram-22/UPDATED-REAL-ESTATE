import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard — Chabano Properties",
  description: "Admin CMS",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
