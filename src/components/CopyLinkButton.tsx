"use client"

export default function CopyLinkButton({ url }: { url: string }) {
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          alert("Link berhasil disalin!")
        } catch {
          prompt("Salin link ini:", url)
        }
      }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-100 hover:border-stone-300 transition-all"
      aria-label="Salin link"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <span className="hidden sm:inline">Salin Link</span>
    </button>
  )
}
