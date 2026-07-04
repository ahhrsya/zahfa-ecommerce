'use client'

import { useRouter } from "next/navigation"
import { updateOrderStatus } from "../actions"

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "diproses", label: "Diproses" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
]

export default function StatusUpdater({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateOrderStatus(id, e.target.value)
    router.refresh()
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
