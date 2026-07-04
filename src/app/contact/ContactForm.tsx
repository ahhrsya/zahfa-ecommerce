"use client"

import { useState } from "react"

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")

    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/contact", { method: "POST", body: form })
      if (!res.ok) throw new Error("Failed")
      e.currentTarget.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-800 mb-2">Pesan Terkirim!</h3>
        <p className="text-sm text-stone-500">
          Terima kasih! Kami akan segera merespon pesan Anda. Cek email Anda untuk konfirmasi.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">Nama Lengkap</label>
        <input
          type="text" id="name" name="name" required
          className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          placeholder="Masukkan nama Anda"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
        <input
          type="email" id="email" name="email" required
          className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          placeholder="Masukkan email Anda"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">Nomor Telepon</label>
        <input
          type="tel" id="phone" name="phone"
          className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          placeholder="Masukkan nomor telepon"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">Pesan</label>
        <textarea
          id="message" name="message" required rows={5}
          className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none"
          placeholder="Tulis pesan Anda..."
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-500">Gagal mengirim pesan. Silakan coba lagi.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Mengirim...
          </>
        ) : (
          "Kirim Pesan"
        )}
      </button>
    </form>
  )
}
