import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug, isActive: true },
  })

  if (!post) notFound()

  const formattedDate = new Date(post.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center px-4">
        <Link
          href="/blog"
          className="absolute top-6 left-6 flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Blog
        </Link>
        <div className="max-w-3xl mx-auto pt-8">
          <p className="text-sm text-white/70 mb-3">
            {formattedDate}
            {post.author && ` — oleh ${post.author}`}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{post.title}</h1>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {post.image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-stone prose-lg max-w-none prose-headings:text-stone-800 prose-p:text-stone-600 prose-a:text-amber-700 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-200 text-sm text-stone-600 hover:bg-amber-50 transition-colors">
                <Heart className="w-4 h-4" />
                Suka
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-200 text-sm text-stone-600 hover:bg-amber-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Komentar
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-200 text-sm text-stone-600 hover:bg-amber-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Bagikan
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
