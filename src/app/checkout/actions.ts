"use server"

import { prisma } from "@/lib/prisma"
import { generateOrderNumber } from "@/lib/utils"

export async function createOrder(data: {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  notes?: string
  items: {
    productId: string
    productName: string
    price: number
    quantity: number
    variant?: string
  }[]
  total: number
}) {
  const orderNumber = generateOrderNumber()

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      notes: data.notes,
      total: data.total,
      status: "pending",
      paymentMethod: "whatsapp",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
      },
    },
  })

  return order
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } })
  return setting?.value
}
