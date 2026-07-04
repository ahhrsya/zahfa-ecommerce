import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export const runtime = "edge"
export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
          color: "white",
          padding: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            opacity: 0.95,
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            opacity: 0.85,
            border: "2px solid rgba(255,255,255,0.6)",
            borderRadius: 9999,
            padding: "12px 32px",
          }}
        >
          zahfa.store
        </div>
      </div>
    ),
    { ...size }
  )
}
