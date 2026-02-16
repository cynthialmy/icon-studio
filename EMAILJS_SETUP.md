# EmailJS Setup Instructions

To enable email notifications for waitlist signups, follow these steps:

## 1. Install EmailJS Package

```bash
npm install @emailjs/browser
```

## 2. Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## 3. Connect Email Service

1. Go to https://dashboard.emailjs.com/admin/integration
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions to connect your email
5. Copy the **Service ID** (you'll need this)

## 4. Create Email Template

1. Go to https://dashboard.emailjs.com/admin/template
2. Click "Create New Template"
3. Set up your template with these variables:
   - `{{user_email}}` - The email of the person who signed up
   - `{{to_email}}` - Your recipient email
   - `{{message}}` - The message content
   - `{{reply_to}}` - Reply-to email address

4. Example template:
   ```
   Subject: New Waitlist Signup - {{user_email}}
   
   You have a new waitlist signup!
   
   Email: {{user_email}}
   Message: {{message}}
   
   Reply to: {{reply_to}}
   ```

5. Copy the **Template ID** (you'll need this)

## 5. Get Your Public Key

1. Go to https://dashboard.emailjs.com/admin/account/general
2. Find your **Public Key**
3. Copy it

## 6. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   VITE_RECIPIENT_EMAIL=apecyncyn@gmail.com
   ```

## 7. Test It Out

1. Start your dev server: `npm run dev`
2. Fill out the waitlist form
3. Check your email (apecyncyn@gmail.com) for the notification

## Notes

- The free tier allows 200 emails per month
- If EmailJS is not configured, the form will still work but emails won't be sent (it will just log to console)
- Make sure to add `.env` to your `.gitignore` file to keep your keys secure
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)

## Troubleshooting

- If emails aren't sending, check the browser console for errors
- Make sure all environment variables are prefixed with `VITE_` (required for Vite)
- Verify your EmailJS service is active and connected
- Check that your template variables match the code ({{user_email}}, {{to_email}}, etc.)
