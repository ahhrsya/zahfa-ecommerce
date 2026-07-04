import { prisma } from "@/lib/prisma"
import BlogForm from "../_components/BlogForm"

export default async function BlogCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams
  const post = id ? await prisma.blogPost.findUnique({ where: { id: id as string } }) : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{post ? "Edit Post" : "Tambah Post"}</h1>
      <BlogForm post={post} />
    </div>
  )
}
