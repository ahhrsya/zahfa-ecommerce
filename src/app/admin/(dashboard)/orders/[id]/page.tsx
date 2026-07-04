import { prisma } from "@/lib/prisma"
import { formatRupiah } from "@/lib/utils"
import { notFound } from "next/navigation"
import StatusUpdater from "../_components/StatusUpdater"

const statusLabels: Record<string, string> = {
  pending: "Pending",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Detail Pesanan #{order.orderNumber}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Item Pesanan</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left pb-2 font-medium">Produk</th>
                  <th className="text-center pb-2 font-medium">Varian</th>
                  <th className="text-right pb-2 font-medium">Harga</th>
                  <th className="text-right pb-2 font-medium">Qty</th>
                  <th className="text-right pb-2 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.productName}</td>
                    <td className="py-3 text-center text-gray-500">{item.variant || "-"}</td>
                    <td className="py-3 text-right">{formatRupiah(item.price)}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right font-medium">{formatRupiah(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="py-3 text-right font-semibold">Total</td>
                  <td className="py-3 text-right font-bold text-lg">{formatRupiah(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Informasi Pesanan</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "diproses" ? "bg-blue-100 text-blue-700" :
                    order.status === "dikirim" ? "bg-purple-100 text-purple-700" :
                    order.status === "selesai" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Pembayaran</dt>
                <dd className="text-gray-900 capitalize">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Tanggal</dt>
                <dd className="text-gray-900">{new Date(order.createdAt).toLocaleDateString("id-ID")}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Data Pelanggan</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-500">Nama</dt><dd className="text-gray-900">{order.customerName}</dd></div>
              <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{order.customerEmail}</dd></div>
              <div><dt className="text-gray-500">Telepon</dt><dd className="text-gray-900">{order.customerPhone}</dd></div>
              {order.customerAddress && (
                <div><dt className="text-gray-500">Alamat</dt><dd className="text-gray-900">{order.customerAddress}</dd></div>
              )}
              {order.notes && (
                <div><dt className="text-gray-500">Catatan</dt><dd className="text-gray-900">{order.notes}</dd></div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Update Status</h2>
            <StatusUpdater id={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
