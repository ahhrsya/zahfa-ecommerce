"use client"

interface Props {
  apiKey: string
  baseUrl: string
}

export default function ApiKeyCard({ apiKey, baseUrl }: Props) {
  function handleCopy() {
    navigator.clipboard.writeText(apiKey)
    alert("API Key copied!")
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 className="text-sm font-semibold text-blue-800 mb-2">🔗 API untuk Hermes AI</h2>
      <p className="text-xs text-blue-700 mb-2">
        Gunakan API Key di bawah untuk menghubungkan Hermes ke website ini.
      </p>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-white px-3 py-1.5 rounded border border-blue-200 flex-1 font-mono break-all">{apiKey}</code>
        <button
          onClick={handleCopy}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors shrink-0"
        >
          Copy
        </button>
      </div>
      <p className="text-xs text-blue-600 mt-2">
        Base URL: <code className="font-mono">{baseUrl}/api/ai</code>
      </p>
    </div>
  )
}
