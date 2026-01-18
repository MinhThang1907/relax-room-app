"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-primary">
          Relax Room
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Trang chủ
            </Button>
          </Link>
          <Link href="/moods">
            <Button size="sm">Bắt đầu</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
