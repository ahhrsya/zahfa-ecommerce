import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { truncate } from "@/lib/utils"
import { SITE_NAME } from "@/lib/site"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog & Inspirasi",
  description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}. Temukan inspirasi OOTD hijab, gaya busana muslimah modern, dan tren fashion syar'i terkini.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    title: `Blog & Inspirasi | ${SITE_NAME}`,
    description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}.`,
    images: [{ url: "/uploads/banners/hero1.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog & Inspirasi | ${SITE_NAME}`,
    description: `Baca artikel inspirasi, tips fashion, dan gaya hidup muslimah terbaru dari ${SITE_NAME}.`,
    images: ["/uploads/banners/hero1.png"],
  },
}

const POSTS_PER_PAGE = 9

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
      <section className="py-16 md:py-20 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          Inspirasi dan tips seputar busana muslimah modern
        </p>
      </section>

      {/* Posts Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500">Belum ada artikel.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-amber-100 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/9] bg-amber-100">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-stone-400 mb-2">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {post.author && ` oleh ${post.author}`}
                    </p>
                    <h2 className="text-lg font-semibold text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-stone-500 line-clamp-3">{truncate(post.excerpt, 150)}</p>
                    )}
                    <span className="inline-block mt-3 text-sm font-medium text-amber-700 group-hover:underline">
                      Baca Selengkapnya
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-amber-200 text-sm text-stone-700 hover:bg-amber-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </Link>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "bg-amber-600 text-white"
                          : "text-stone-700 hover:bg-amber-50 border border-amber-200"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-amber-200 text-sm text-stone-700 hover:bg-amber-50 transition-colors"
                  >
                    Selanjutnya
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
