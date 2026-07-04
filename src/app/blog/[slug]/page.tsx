import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { Calendar, User, Clock, ChevronRight, ArrowLeft } from "lucide-react"
import CopyLinkButton from "@/components/CopyLinkButton"

interface Props {
  params: Promise<{ slug: string }>
}

function readingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "")
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, isActive: true },
  })

  if (!post) {
    return { title: "Artikel Tidak Ditemukan" }
  }

  const title = post.title
  const description = post.excerpt
    ? post.excerpt.slice(0, 160).replace(/\s+/g, " ").trim()
    : `Baca artikel ${post.title} di blog ${SITE_NAME}.`
  const image = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/opengraph-image`

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      url: `/blog/${slug}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug, isActive: true },
  })

  if (!post) notFound()

  const relatedPosts = await prisma.blogPost.findMany({
    where: { isActive: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const readingTimeMinutes = readingTime(post.content)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-amber-700 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-800 truncate">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700">
        {post.image && (
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className={`relative z-10 max-w-4xl mx-auto px-4 ${post.image ? "py-32" : "py-24"}`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTimeMinutes} menit baca
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-14">
        <div className="max-w-3xl mx-auto">
          {/* Featured Image (shown again if hero has overlay) */}
          {post.image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg -mt-28 z-20">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-stone prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-stone-900 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-stone-200
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-stone-600 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50/50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:text-stone-600 prose-blockquote:italic
              prose-strong:text-stone-800
              prose-ul:space-y-2 prose-li:text-stone-600
              prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-amber-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Card */}
          {post.author && (
            <div className="mt-14 p-6 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 text-lg font-semibold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-stone-800">{post.author}</p>
                <p className="text-sm text-stone-500 mt-1">
                  Penulis artikel di blog {SITE_NAME}. Menulis seputar fashion muslimah, tips gaya hijab, dan inspirasi OOTD.
                </p>
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-medium text-stone-700">Bagikan artikel ini:</p>
              <div className="flex items-center gap-3">
                <ShareButton
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${SITE_URL}/blog/${post.slug}`)}`}
                  label="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </ShareButton>
                <ShareButton
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title} — ${SITE_URL}/blog/${post.slug}`)}`}
                  label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </ShareButton>
                <CopyLinkButton url={`${SITE_URL}/blog/${post.slug}`} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-stone-50 border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-stone-800 mb-8">Artikel Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/10] bg-stone-100">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-stone-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-stone-400 mb-2">{formatDate(rp.createdAt)}</p>
                    <h3 className="text-base font-semibold text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    {rp.excerpt && (
                      <p className="text-sm text-stone-500 mt-2 line-clamp-2">{rp.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt || post.title,
            image: post.image ? `${SITE_URL}${post.image}` : undefined,
            datePublished: post.createdAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { "@type": "Person", name: post.author || SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
            wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
            timeRequired: `PT${readingTimeMinutes}M`,
          }),
        }}
      />
    </div>
  )
}

function ShareButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-100 hover:border-stone-300 transition-all"
      aria-label={`Bagikan ke ${label}`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </a>
  )
}
