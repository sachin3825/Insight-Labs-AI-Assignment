#  Conversational Crypto Web-Chat

A full-stack AI-powered crypto assistant that supports voice + text-based queries to help users track coin prices, view trends, analyze stats, and manage holdings — all in a clean, mobile-friendly chat interface.

> 📽️ **[Demo Video](https://www.loom.com/share/b93391ab7a3f4150b54b5717403ba2fb?sid=8f178b7c-4997-41a4-9ffe-8e4a2b40588b)** – Watch the full walkthrough

---

## 🧩 Features

- 🔁 Conversational UI (text + mic)
- 💬 AI answers about coins (e.g. "What's BTC trading at?")
- 📈 7-day price charts for any coin
- 📊 Real-time portfolio tracking from user messages (e.g. "I have 2 ETH")
- 🔝 Trending coin listings
- 🧠 Assistant reads responses aloud
- ⚡ Fast response with loading indicators
- 🧵 Smooth UX with bubble layout and scroll behavior
- ❌ Friendly errors (e.g. if API rate-limits)

---


## 🧠 My Approach

I broke the problem down into several key tasks and solved each one modularly:

### ✅ Chat UI
- Built using React, TailwindCSS, and ShadCN UI.
- Voice support added using the **Web Speech API**.
- Assistant responses are spoken using `speechSynthesis`.

### ✅ Crypto Integration
- Used **CoinGecko's free API** for pricing, trending coins, charts, and metadata.
- Added API key support where required (rate-limited on production deployments).
- Fetched data through a backend proxy to avoid CORS and 403 issues.

### ✅ Holdings Tracking
- Parsed user messages like "I have 2 BTC" to store holdings.
- Calculated live portfolio value using current prices.

### ✅ Charting
- Used `recharts` to display 7-day price trend per coin.

### ✅ Error Handling
- If an API fails or times out, fallback messages like "Coin not found" or "Try again later" are shown.
- A "Thinking..." bubble appears while data loads.

---

## 🧪 Sample Questions to Try

- `What’s ETH trading at right now?`
- `Show me the top trending coins today.`
- `What’s the market cap of Dogecoin?`
- `I have 2 BTC and 3 ETH`
- `Chart for Solana for past week`

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js v18+
- Yarn or npm
- `.env.local` files in both `frontend/` and `backend/`

### 1. Clone the Repo

```bash
git clone [https://github.com/your-username/crypto-chat.git](https://github.com/sachin3825/Insight-Labs-AI-Assignment.git)
cd Insight-Labs-AI-Assignmen
````

### 2. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Set Up Environment Variables

#### `backend/.env`

```env
PORT=3000
COINGEKKO_API_KEY=your_api_key_here
```

#### `frontend/.env.local`

```env
VITE_BACKEND_URL=http://localhost:3000/api/chat
VITE_ENV=development
```

### 4. Run the App

In two separate terminals:

```bash
# Terminal 1 (Backend)
cd backend
npm run dev
```

```bash
# Terminal 2 (Frontend)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Why It Isn’t Deployed (Yet)

CoinGecko's public API rate-limits or blocks requests coming from cloud services like Render or Vercel unless:

* You use an approved key
* Or proxy all requests through a backend

Since the current project is for an assignment/demo, I focused on **functionality and robustness** over cloud deployment. You can still run the full experience locally!

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Voice APIs:** Web Speech API
* **Backend:** Node.js, Express
* **Charting:** Recharts
* **API:** CoinGecko (free)

---

