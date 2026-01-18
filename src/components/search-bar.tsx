"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return <Input placeholder="Tìm kiếm mood..." value={query} onChange={handleChange} className="max-w-md" />
}
