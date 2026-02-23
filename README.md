# Kanban Board

A full-featured project management board with real-time cross-device sync.

**Live:** [kanban-board-smoky-two.vercel.app](https://kanban-board-smoky-two.vercel.app)

## Features

- 📋 Drag-and-drop cards between columns
- ✏️ Add, edit, and delete cards with titles and descriptions
- 🎨 Customizable columns with color picker
- 🔄 Real-time sync across devices via Supabase
- 🔐 User authentication (email/password)
- 🌙 Dark theme UI
- 📱 Fully responsive

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel
- **Drag & Drop:** @hello-pangea/dnd

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/toddellis-clawd/kanban-board.git
   cd kanban-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the SQL migration in your Supabase SQL Editor:
   ```bash
   cat supabase/migration.sql
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Database Schema

- **boards** — One board per user
- **columns** — Ordered columns with custom colors
- **cards** — Cards with title, description, and position
- **RLS policies** — Users can only access their own data

## Deployment

Deployed automatically to Vercel. Push to `main` to deploy.

```bash
npx vercel --prod
```

## License

MIT

---

Built with 🦇 by [360 AI Solutions](https://360-ai-solutions.vercel.app)
