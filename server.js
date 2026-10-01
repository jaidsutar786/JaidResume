import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin))
  },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Email API is running.' })
})

app.post('/api/contact', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const toEmail = process.env.TO_EMAIL

  if (!resendApiKey || !fromEmail || !toEmail) {
    return res.status(500).json({
      message: 'Email is not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and TO_EMAIL in Render.',
    })
  }

  try {
    const safeName = name.replace(/[\r\n]+/g, ' ').slice(0, 120)
    const safePhone = phone || 'Not provided'
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New contact request from ${safeName}`,
        text: [
          `Name: ${safeName}`,
          `Email: ${email}`,
          `Phone: ${safePhone}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <h3>New Contact Request</h3>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      console.error('Resend API send failed:', response.status, errorDetails)
      return res.status(502).json({
        message: 'Email provider rejected the message. Check the Resend API key and verified sender domain.',
      })
    }

    return res.json({ message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Resend request error:', error.message)
    return res.status(502).json({
      message: 'Could not reach the email provider. Please try again later.',
    })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
