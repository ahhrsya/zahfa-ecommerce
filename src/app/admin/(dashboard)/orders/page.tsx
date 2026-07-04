import { prisma } from "@/lib/prisma"
import { formatRupiah } from "@/lib/utils"
import Link from "next/link"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  dikirim: "bg-purple-100 text-purple-700",
  selesai: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-700",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 font-medium">No. Pesanan</th>
              <th className="text-left px-4 py-3 font-medium">Pelanggan</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Tanggal</th>
              <th className="text-center px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">{o.customerName}</div>
                  <div className="text-gray-500 text-xs">{o.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatRupiah(o.total)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[o.status] || "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/orders/${o.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Belum ada pesanan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
