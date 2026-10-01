import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Email API is running.' })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' })
  }

  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD
  const toEmail = process.env.TO_EMAIL || gmailUser

  if (!gmailUser || !gmailPassword) {
    return res.status(500).json({
      message: 'Email is not configured yet. Add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file.',
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const emailText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n')

    await transporter.sendMail({
      from: `"${name}" <${gmailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New contact request from ${name}`,
      text: emailText,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return res.json({ message: 'Message sent successfully.' })
  } catch (error) {
    console.error('SMTP send error:', error)
    return res.status(500).json({
      message: 'Failed to send email. Check your Gmail app password and SMTP credentials.',
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
