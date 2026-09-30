# ChatBreaker 🔨

> **"Your conversation, visualized."**

ChatBreaker is a premium, privacy-first WhatsApp conversation analytics and visualization platform. Export any WhatsApp chat as a `.txt` file **without media**, upload it, and immediately receive a beautifully formatted editorial report alongside an interactive **Chat Wrapped** story.

---

## ✨ Features

- **🛡️ 100% Local-First & Private:**
  - WhatsApp chat exports are parsed and analyzed directly in your browser.
  - No raw messages are ever permanently stored in a database or logged on servers.
  - Memory is wiped instantly upon session reset.
- **📊 Editorial Analytics Dashboard:**
  - **Overview Statistics:** Total messages, words, characters, duration, daily velocity, and word densities.
  - **Share of Voice:** Interactive Recharts donut chart with per-participant words, message counts, and emoji frequencies.
  - **Who Starts the Conversation:** Quantifies initiative with an interactive, configurable inactivity threshold (1h, 2h, 3h, 6h, 12h, 24h).
  - **Your Rhythm:** Computes **median reply time** (avoiding weekend break skew), fastest response in seconds, longest streak, and longest silence.
  - **Activity by Hour:** 24-hour bar chart highlighting peak hours, quiet hours, and late-night owl percentage (after 10 PM).
  - **Activity by Day of Week:** Weekly volume trends and daily averages from Monday to Sunday.
  - **GitHub-Style Calendar Heatmap:** 365-day interactive grid with year selection, intensity scaling, and click-to-view day inspector.
  - **Busiest Days:** Record-breaking volume peaks ranked by single-day message count.
  - **Vocabulary & Common Phrases:** Frequency-scaled word cloud (stopwords excluded) and 2/3/4-word n-gram phrase detection.
  - **Emoji Analysis:** Top emoji rankings, participant favorites, and back-to-back emoji duos.
  - **Longest Messages:** Monologues and essays sorted by word count with expandable reading previews.
  - **Links & Media References:** URL domain breakdown and `<Media omitted>` volume tallies.
  - **The Journey Timeline:** First exchange origin story, latest message bookend, and monthly volume trend.
  - **Full-Text Explorer:** Fast search across messages with sender, type, and date filters.
- **✨ Fullscreen Chat Wrapped (`/wrapped`):**
  - A 10-screen animated story experience powered by Framer Motion.
  - Instagram/Spotify-style progress bars, keyboard navigation (Arrow keys / Spacebar), and confetti celebration!
- **🤖 Fact-Grounded AI Insights:**
  - Clear editorial observations derived strictly from computed numbers.
  - Zero hallucinated statistics, zero psychoanalysis, and zero third-party data transmission.
- **📄 Export & Share:**
  - High-resolution **PNG snapshot** and **Multi-page PDF** export with one click.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS, PostCSS (Editorial Warm Palette: `#F7F5EF`, Newsreader Serif & Plus Jakarta Sans)
- **Charts:** Recharts
- **Animations:** Framer Motion, Canvas Confetti
- **Icons:** Lucide React
- **State Management:** Zustand
- **Exports:** html2canvas, jsPDF

### Backend
- **Framework:** Python 3.11+, FastAPI
- **Data & Math:** Pandas, NumPy
- **Text & Emojis:** custom regex parser, `emoji` package
- **Schemas:** Pydantic v2
- **Testing:** Pytest, HTTPX

### Database (Optional / Saved Reports)
- **Supabase PostgreSQL** (`supabase/schema.sql` included with RLS policies)
- Stores only aggregated metric summaries — never raw text!

---

## 🚀 Quick Start

### ⚡ Run Both Frontend & Backend (Single Command)

```bash
# Starts both FastAPI backend and Vite frontend together
npm run dev:all
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 1. Frontend Only (Client-Side Mode)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
Click **"Demo Chat"** or drop any WhatsApp `.txt` export to view the dashboard immediately.

### 2. Backend (FastAPI Engine)

```bash
# Create and activate virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run FastAPI server
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation will be live at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## 🧪 Running Tests

```bash
# Run backend unit tests (Parser, Analytics, and API routes)
python -m pytest backend
```

All 12 unit tests validate:
- iOS bracketed timestamps: `[12/03/2026, 10:14:00] Paula: ...`
- Android hyphen timestamps: `12/03/2026, 10:14 - Liam: ...`
- Multiline continuation messages
- End-to-end encryption & system notifications filtering
- Median reply times and streak calculation accuracy
- Word & emoji frequency extraction

---

## 🐳 Docker Setup

Run ChatBreaker with a single command:

```bash
docker compose up --build
```
Access the application at [http://localhost:8000](http://localhost:8000).

---

## 📁 Sample Chat Files

Included in `samples/`:
- `samples/sample_duo.txt`: 2-person casual and work conversation (Android format)
- `samples/sample_group.txt`: Multi-contributor product team conversation (iOS format)
- `samples/sample_multiline.txt`: Tests multiline list formatting and continuations

---

## 📱 How to Export Your WhatsApp Chat

1. **iPhone (iOS):**
   - Open WhatsApp → Tap contact or group name at the top.
   - Scroll down → Tap **Export Chat**.
   - Select **Without Media**.
   - Save or share the `.txt` file.

2. **Android:**
   - Open WhatsApp → Tap the three dots (⋮) top-right.
   - Tap **More** → **Export chat**.
   - Choose **Without media**.
   - Save or transfer the `.txt` file.

---

## 🔒 Privacy Architecture

1. **Local Browser Engine:** Parsing and analytics run client-side by default.
2. **Ephemeral Processing:** If processed via backend API, uploaded file streams are parsed in-memory and discarded.
3. **No Raw Storage:** Supabase schemas persist aggregated JSON statistics only.
4. **No LLM Leakage:** Structured facts only; raw chat dialogues are never passed to external AI models.
