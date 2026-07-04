import { prisma } from "@/lib/prisma"
import SettingsForm from "./_components/SettingsForm"

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap: Record<string, string> = {}
  settings.forEach((s) => { settingsMap[s.key] = s.value })

  const fields = [
    { key: "STORE_NAME", label: "Nama Toko", type: "text" },
    { key: "STORE_DESC", label: "Deskripsi Toko", type: "textarea" },
    { key: "STORE_ADDRESS", label: "Alamat Toko", type: "textarea" },
    { key: "STORE_PHONE", label: "Telepon", type: "text" },
    { key: "STORE_EMAIL", label: "Email", type: "email" },
    { key: "WA_NUMBER", label: "Nomor WhatsApp", type: "text" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan</h1>
      <SettingsForm fields={fields} settings={settingsMap} />
    </div>
  )
}
