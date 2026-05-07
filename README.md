# Pranjal | Sketches & Doodles

A sleek, modern, and highly performant sketch portfolio web application. Designed to showcase hand-drawn artwork with a beautiful "sketchbook" aesthetic featuring a CSS masonry layout, smooth Framer Motion animations, and a securely protected Admin upload portal.

![Portfolio Preview](./client/public/vite.svg) *(Replace with an actual screenshot of the portfolio)*

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Database & Storage**: Supabase (PostgreSQL & Supabase Storage)
- **Authentication**: Supabase Auth
- **Security**: Strict Row Level Security (RLS) policies, secure HTTP headers via `vercel.json`/`netlify.toml`
- **Routing**: Wouter

## ✨ Features

- **Responsive Masonry Gallery**: Pinterest-style native CSS masonry layout ensuring images display perfectly at their natural aspect ratios without JavaScript bloat.
- **Modern Aesthetic**: A uniquely crafted CSS background featuring paper fiber lines, a moody edge vignette, and a warm aged-paper tint to complement raw sketches.
- **Secure Admin Panel**: A protected `/admin` route requiring Supabase Email/Password authentication to access the drag-and-drop uploader.
- **Performant**: Extremely lightweight with minimal re-renders. No heavy WebGL backgrounds, ensuring buttery smooth scrolling even on older mobile devices.

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- `pnpm` package manager
- A [Supabase](https://supabase.com/) account.

### 2. Supabase Configuration
Create a new Supabase project and execute the SQL file provided in the repository to set up the database and storage bucket:

1. Go to the **SQL Editor** in your Supabase dashboard.
2. Paste and run the contents of `setup-supabase.sql` (if you have table creation scripts) and then `supabase-rls-policies.sql` to enforce Row Level Security.
3. Go to **Authentication -> Users** and create an Admin user (email and password). You will use this to log into your admin panel.

### 3. Environment Variables
Rename `.env.example` to `.env` and fill in your Supabase project details:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: Do not commit your `.env` file to version control. It is already included in `.gitignore`.)*

### 4. Install & Run
```bash
# Install dependencies
pnpm install

# Start the Vite development server
pnpm run dev
```
Open `http://localhost:5173` in your browser.

## 🛡️ Security Architecture

This application operates on a "Backend-as-a-Service" model where the React client interfaces directly with Supabase. Security is guaranteed via:
- **Supabase Auth**: The admin upload portal is gated by secure session tokens.
- **Row Level Security (RLS)**: The database is configured to reject any `INSERT` or `DELETE` requests unless the request comes from an actively authenticated Admin session. Public users have read-only (`SELECT`) access.

## 📦 Deployment

The project is pre-configured for seamless deployment to **Vercel** or **Netlify**. Both platforms will automatically detect the Vite framework.

1. Push your code to GitHub.
2. Import the repository into Vercel/Netlify.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables to the environment variables section of your hosting provider.
4. Deploy!

*Security Note: The included `vercel.json` and `netlify.toml` files will automatically enforce strict HTTP security headers (CSP, HSTS, X-Frame-Options) upon deployment.*

## 📄 License
This project is licensed under the MIT License.
