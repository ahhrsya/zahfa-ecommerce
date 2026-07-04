import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { truncate } from "@/lib/utils"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog & Inspirasi",
  description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}. Temukan inspirasi OOTD hijab, gaya busana muslimah modern, dan tren fashion syar'i terkini.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    title: `Blog & Inspirasi | ${SITE_NAME}`,
    description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}.`,
    images: [{ url: `${SITE_URL}/uploads/banners/hero1.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog & Inspirasi | ${SITE_NAME}`,
    description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}.`,
    images: [`${SITE_URL}/uploads/banners/hero1.png`],
  },
}

const POSTS_PER_PAGE = 9

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1)

  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.blogPost.count({ where: { isActive: true } }),
  ])

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Blog & Inspirasi
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Inspirasi dan tips seputar busana muslimah modern, hijab styling,
            OOTD kondangan, dan tren fashion syar&apos;i terbaru.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-stone-500 text-lg mb-2">Belum ada artikel</p>
            <p className="text-stone-400 text-sm">Artikel akan segera hadir. Pantau terus ya!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300 ${
                    i === 0 && currentPage === 1 ? "sm:col-span-2 lg:col-span-2 sm:flex" : ""
                  }`}
                >
                  <div className={`relative bg-stone-100 overflow-hidden ${i === 0 && currentPage === 1 ? "sm:w-5/12 aspect-[16/10] sm:aspect-square" : "aspect-[16/10]"}`}>
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-stone-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={`p-5 md:p-6 ${i === 0 && currentPage === 1 ? "sm:w-7/12 sm:flex sm:flex-col sm:justify-center" : ""}`}>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.createdAt)}
                      </span>
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {post.author}
                        </span>
                      )}
                    </div>
                    <h2 className={`font-semibold text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 ${
                      i === 0 && currentPage === 1 ? "text-xl md:text-2xl" : "text-base md:text-lg"
                    }`}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className={`text-stone-500 line-clamp-3 ${
                        i === 0 && currentPage === 1 ? "text-sm md:text-base mt-2" : "text-sm mt-1"
                      }`}>
                        {truncate(post.excerpt, i === 0 && currentPage === 1 ? 250 : 150)}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-700 group-hover:gap-2 transition-all">
                      Baca Selengkapnya
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </Link>
                )}

                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else if (currentPage <= 4) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i
                    } else {
                      pageNum = currentPage - 3 + i
                    }
                    return (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          pageNum === currentPage
                            ? "bg-amber-600 text-white shadow-sm"
                            : "text-stone-600 hover:bg-stone-50 border border-stone-200"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
