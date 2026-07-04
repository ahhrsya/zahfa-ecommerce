"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
}

export default function Header({ categories }: { categories: Category[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const count = localStorage.getItem("zahfa_cart_count")
    if (count) setCartCount(parseInt(count, 10))

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "zahfa_cart_count") {
        setCartCount(parseInt(e.newValue || "0", 10))
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-1 max-w-7xl mx-auto">
        <button
          className="lg:hidden p-3 text-stone-500 hover:text-stone-800"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Zahfa" width={260} height={80} className="h-20 w-auto" priority />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="hidden lg:block p-3 text-stone-500 hover:text-stone-800"
            aria-label="Cari"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            className="lg:hidden p-3 text-stone-500 hover:text-stone-800"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Cari"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link href="/wishlist" className="p-3 text-stone-500 hover:text-stone-800" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>

          <Link href="/cart" className="relative p-3 text-stone-500 hover:text-stone-800" aria-label="Keranjang">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-stone-900 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-6 pb-5">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full px-0 py-2 border-b border-stone-300 bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex border-t border-stone-100">
        <div className="flex items-center justify-center gap-10 py-3 max-w-7xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
              Produk
              <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-52">
                <div className="bg-white shadow-md border border-stone-200 py-2">
                  <Link
                    href="/products"
                    className="block px-5 py-2.5 text-xs uppercase tracking-wider text-stone-800 font-semibold hover:text-stone-900 transition-colors border-b border-stone-100 mb-1"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Semua Produk
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-5 py-2.5 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/koleksi" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            Koleksi
          </Link>
          <Link href="/about" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            Tentang Kami
          </Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
            Kontak
          </Link>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <Image src="/logo.png" alt="Zahfa" width={200} height={60} className="h-14 w-auto" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-stone-500 hover:text-stone-800"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
              <div className="px-6 mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3">Produk</p>
                <Link
                  href="/products"
                  className="block py-2.5 text-sm font-semibold text-stone-800 hover:text-stone-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Semua Produk
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="block py-2.5 pl-4 text-sm text-stone-700 hover:text-stone-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <hr className="mx-6 my-4 border-stone-100" />

              <div className="px-6 space-y-1">
                <Link
                  href="/koleksi"
                  className="block py-2.5 text-sm text-stone-700 hover:text-stone-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Koleksi
                </Link>
                <Link
                  href="/about"
                  className="block py-2.5 text-sm text-stone-700 hover:text-stone-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/blog"
                  className="block py-2.5 text-sm text-stone-700 hover:text-stone-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="block py-2.5 text-sm text-stone-700 hover:text-stone-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kontak
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
