import { prisma } from "@/lib/prisma"
import { Package, ShoppingCart, Clock, Users } from "lucide-react"

async function getStats() {
  const [totalProducts, totalOrders, pendingOrders, totalUsers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.user.count(),
  ])
  return { totalProducts, totalOrders, pendingOrders, totalUsers }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: "Total Produk", value: stats.totalProducts, icon: Package, color: "bg-blue-500" },
    { label: "Total Pesanan", value: stats.totalOrders, icon: ShoppingCart, color: "bg-emerald-500" },
    { label: "Pesanan Baru", value: stats.pendingOrders, icon: Clock, color: "bg-amber-500" },
    { label: "Total Pelanggan", value: stats.totalUsers, icon: Users, color: "bg-purple-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
