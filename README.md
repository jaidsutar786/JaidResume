# Alex Morgan Resume

Responsive React + JavaScript + Tailwind CSS resume website.

## Run locally

```bash
npm install
npm run dev
```

Replace the sample content in `src/App.jsx`. Click the profile image area to upload a photo preview, use the moon button for dark mode, and use Print to export the resume as PDF from the browser.

## Contact email deployment

The contact endpoint sends through the Resend HTTPS API, so it works on Render Free without outbound SMTP. Create a Resend API key and verify a sending domain, then add these variables to the Render service:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (an address on the verified domain, for example `Jaid Sutar <contact@example.com>`)
- `TO_EMAIL` (the inbox that receives contact requests)
- `FRONTEND_URL` (the Netlify site origin, for example `https://jaidsutar.netlify.app`; comma-separate additional allowed origins)

The visitor's address is set as `reply_to`. Never put the Resend API key in frontend code or commit it to Git.
