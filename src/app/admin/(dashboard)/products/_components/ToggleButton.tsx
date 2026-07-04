'use client'

import { toggleProductStatus } from "../actions"

export default function ToggleButton({ id, isActive }: { id: string; isActive: boolean }) {
  async function handleToggle() {
    await toggleProductStatus(id, !isActive)
  }

  return (
    <button
      onClick={handleToggle}
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Aktif" : "Nonaktif"}
    </button>
  )
}
