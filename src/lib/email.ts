import { Resend } from "resend"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@zahfa.store"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@zahfa.id"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export async function sendContactNotification(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  const resend = getResend()
  if (!resend) return

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `[Zahfa] Pesan baru dari ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #b45309;">Pesan Baru dari Website</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #78716c; width: 100px;">Nama</td><td style="padding: 8px 0;"><strong>${data.name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #78716c;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #78716c;">Telepon</td><td style="padding: 8px 0;">${data.phone || "-"}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f5f5f4; border-radius: 8px;">
          <p style="margin: 0; color: #292524;"><strong>Pesan:</strong></p>
          <p style="margin: 8px 0 0; color: #44403c; line-height: 1.6;">${data.message}</p>
        </div>
        <hr style="margin-top: 24px; border: none; border-top: 1px solid #e7e5e4;" />
        <p style="font-size: 12px; color: #a8a29e;">Email ini dikirim otomatis dari website Zahfa.</p>
      </div>
    `,
  })
}

export async function sendContactAutoReply(data: {
  name: string
  email: string
}) {
  const resend = getResend()
  if (!resend) return

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [data.email],
    subject: `Terima kasih telah menghubungi Zahfa`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #b45309;">Halo, ${data.name}!</h2>
        <p style="color: #44403c; line-height: 1.7;">
          Terima kasih telah menghubungi <strong>Zahfa</strong>.
        </p>
        <p style="color: #44403c; line-height: 1.7;">
          Kami telah menerima pesan Anda dan akan segera merespon dalam waktu 1×24 jam.
        </p>
        <p style="color: #44403c; line-height: 1.7;">
          Sementara itu, Anda juga bisa menghubungi kami langsung via WhatsApp untuk respon yang lebih cepat.
        </p>
        <div style="margin-top: 24px; padding: 20px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a;">
          <p style="margin: 0 0 8px; color: #92400e; font-weight: 600;">💬 Butuh bantuan cepat?</p>
          <p style="margin: 0; color: #92400e;">
            Hubungi kami via WhatsApp dengan klik tombol chat di pojok kanan bawah website kami.
          </p>
        </div>
        <hr style="margin-top: 24px; border: none; border-top: 1px solid #e7e5e4;" />
        <p style="font-size: 13px; color: #a8a29e;">
          Salam hangat,<br />
          <strong>Tim Zahfa</strong><br />
          Busana Muslimah Modern & Syar'i
        </p>
      </div>
    `,
  })
}
