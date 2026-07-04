'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateSettings } from "../actions"

export default function SettingsForm({
  fields,
  settings,
}: {
  fields: { key: string; label: string; type: string }[]
  settings: Record<string, string>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    await updateSettings(form)
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.key}
              defaultValue={settings[field.key] || ""}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          ) : (
            <input
              type={field.type}
              name={field.key}
              defaultValue={settings[field.key] || ""}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          )}
        </div>
      ))}
      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  )
}
