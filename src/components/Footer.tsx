import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Image src="/logo.png" alt="Zahfa" width={260} height={80} className="h-20 w-auto mb-4" />
            <p className="text-sm text-stone-400 leading-relaxed">
              Zahfa adalah destinasi fashion wanita modern yang menyediakan berbagai koleksi pakaian
              dengan gaya terkini.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-5">Kategori</h4>
            <ul className="space-y-3">
              <li><Link href="/categories/gamis" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Gamis</Link></li>
              <li><Link href="/categories/hijab" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Hijab</Link></li>
              <li><Link href="/categories/atasan" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Atasan</Link></li>
              <li><Link href="/categories/rok" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Rok</Link></li>
              <li><Link href="/categories/aksesoris" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Aksesoris</Link></li>
              <li><Link href="/categories/mukena" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Mukena</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-5">Informasi</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/blog" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Blog</Link></li>
              <li><Link href="/cara-belanja" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Cara Belanja</Link></li>
              <li><Link href="/faq" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">FAQ</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Syarat &amp; Ketentuan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-5">Bantuan</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/pengiriman" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Informasi Pengiriman</Link></li>
              <li><Link href="/pengembalian" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Kebijakan Pengembalian</Link></li>
              <li><Link href="/size-guide" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">Panduan Ukuran</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-400">&copy; 2024 Zahfa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
