"use client"

import { useRef, useState, useEffect } from "react"

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ""
    }
  }, [mounted, value])

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  function exec(command: string, val?: string) {
    document.execCommand(command, false, val)
    editorRef.current?.focus()
    handleInput()
  }

  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50 animate-pulse" />
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Toolbar
        onStyle={(cmd, val) => exec(cmd, val)}
        onImage={() => {
          const url = prompt("URL gambar:")
          if (url) exec("insertImage", url)
        }}
        onLink={() => {
          const url = prompt("URL link:")
          if (url) exec("createLink", url)
        }}
      />

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="px-5 py-4 min-h-[320px] max-h-[600px] overflow-y-auto text-[15px] leading-relaxed focus:outline-none cursor-text bg-white
          prose prose-stone max-w-none
          prose-headings:font-bold prose-headings:text-stone-900
          prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2
          prose-p:my-2 prose-p:text-stone-700
          prose-img:rounded-lg prose-img:my-4 prose-img:max-w-full
          prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
          prose-ul:my-2 prose-li:my-0.5
          prose-a:text-amber-700 prose-a:underline
          prose-strong:text-stone-900"
      />
    </div>
  )
}

function Toolbar({
  onStyle,
  onImage,
  onLink,
}: {
  onStyle: (cmd: string, val?: string) => void
  onImage: () => void
  onLink: () => void
}) {
  const buttons = [
    { cmd: "bold", icon: "B", label: "Tebal", className: "font-bold" },
    { cmd: "italic", icon: "I", label: "Miring", className: "italic" },
    { type: "divider" as const },
    { cmd: "formatBlock", val: "h2", icon: "H2", label: "Heading 2" },
    { cmd: "formatBlock", val: "h3", icon: "H3", label: "Heading 3" },
    { cmd: "formatBlock", val: "p", icon: "P", label: "Paragraf" },
    { type: "divider" as const },
    { cmd: "insertUnorderedList", icon: "•", label: "List" },
    { cmd: "insertOrderedList", icon: "1.", label: "Nomor" },
    { cmd: "formatBlock", val: "blockquote", icon: '"', label: "Kutipan" },
    { type: "divider" as const },
    { onClick: onImage, icon: "🖼", label: "Gambar" },
    { onClick: onLink, icon: "🔗", label: "Link" },
  ]

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
      {buttons.map((btn, i) => {
        if ("type" in btn && btn.type === "divider") {
          return <div key={i} className="w-px h-6 bg-gray-300 mx-1" />
        }
        if ("onClick" in btn && btn.onClick) {
          return (
            <button
              key={i}
              type="button"
              onClick={btn.onClick}
              title={btn.label}
              className="px-2.5 py-1.5 text-xs rounded hover:bg-gray-200 text-gray-700 transition-colors min-w-[32px] flex items-center justify-center"
            >
              {btn.icon}
            </button>
          )
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onStyle(btn.cmd, "val" in btn ? btn.val : undefined)}
            title={btn.label}
            className={`px-2.5 py-1.5 text-xs rounded hover:bg-gray-200 text-gray-700 transition-colors min-w-[32px] flex items-center justify-center ${"className" in btn ? btn.className : ""}`}
          >
            {btn.icon}
          </button>
        )
      })}
    </div>
  )
}
