'use client'

import { deleteBanner } from "../actions"

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (confirm("Yakin ingin menghapus banner ini?")) {
      await deleteBanner(id)
    }
  }
  return <button onClick={handleDelete} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
}
