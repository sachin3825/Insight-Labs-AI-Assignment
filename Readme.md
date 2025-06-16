# Conversational Crypto Web-Chat

This project is a full-stack assignment demonstrating a crypto-based conversational interface. It supports both voice and text input to help users retrieve live coin data, view market trends, check basic stats, and track their personal holdings — all through a responsive and clean chat UI.

You can view the demo walkthrough here:  
**Demo Video:** [https://www.loom.com/share/b93391ab7a3f4150b54b5717403ba2fb?sid=8f178b7c-4997-41a4-9ffe-8e4a2b40588b](https://www.loom.com/share/b93391ab7a3f4150b54b5717403ba2fb?sid=8f178b7c-4997-41a4-9ffe-8e4a2b40588b)

---

## Features

- Clean and mobile-friendly chat interface
- Users can interact using either typed or spoken input
- Responds to queries like current coin price, market cap, or recent performance
- Displays 7-day historical price charts for supported coins
- Allows users to store crypto holdings and view live portfolio value
- Shows today's trending cryptocurrencies
- Assistant voice replies are supported via browser's speech synthesis
- Shows loading indicators while data is being fetched
- Displays fallback messages if something goes wrong (e.g., API failures)

---

## Project Structure

The codebase is organized into a monorepo with two main directories:

```

Insight-Labs-AI-Assignment/
├── frontend/   # React + Vite frontend
└── backend/    # Express.js backend

````

---

## Implementation Approach

The challenge was broken into modular tasks and implemented as follows:

### Chat Interface and Voice Support

- Developed the chat UI using React and Tailwind CSS, styled using utility-first design.
- Voice input is implemented using the Web Speech API for transcription.
- Speech synthesis is used to make the assistant reply aloud.

### Backend Integration

- All crypto data is fetched using the CoinGecko API.
- To handle API restrictions and avoid CORS issues, a backend proxy was set up using Express.
- Added support for environment-based API key usage.

### Message Understanding

- A basic intent detection system parses user messages.
- It relies on simple keyword checks to route requests like "price", "chart", "market cap", etc.
- This approach is lightweight but effective for the scope of the assignment.

### Portfolio Tracking

- Messages like "I have 2 BTC" are parsed using regex to extract coin symbol and quantity.
- The live value of the holdings is computed using the latest fetched prices and displayed in the chat.

### Chart Rendering

- Recharts is used to display 7-day price charts in response to chart-related queries.

---

## Sample Questions

Try any of the following to test the application:

- What’s ETH trading at right now?
- Show me today’s top trending coins
- What is the market cap of Dogecoin?
- I have 2 BTC and 3 ETH
- Show a chart for Solana for past week

---

## How to Run the Project Locally

### Requirements

- Node.js v18+
- npm or yarn
- CoinGecko API key (optional, but recommended for production usage)

### Steps

1. Clone the repository:

```bash
git clone https://github.com/sachin3825/Insight-Labs-AI-Assignment.git
cd Insight-Labs-AI-Assignment
````

2. Install dependencies for both frontend and backend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in `backend/`:

```
PORT=3000
COINGEKKO_API_KEY=your_api_key_here
```

Create a `.env.local` file in `frontend/`:

```
VITE_BACKEND_URL=http://localhost:3000/api/chat
VITE_ENV=development
```

4. Run the project in two terminals:

```bash
# Backend
cd backend
npm run dev
```

```bash
# Frontend
cd frontend
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Notes and Limitations

* The current implementation works for most popular cryptocurrencies like Bitcoin, Ethereum, Solana, and Dogecoin. However, not all coins from the CoinGecko API give consistent responses. To avoid errors, only a subset of valid coins is handled in practice.
* The message interpretation system uses basic keyword matching. While this works well for demo purposes, it may not scale to complex queries or multiple intents per message.
* API rate-limiting by CoinGecko can affect responses in production. To mitigate this, a backend proxy is used, but deployment services like Vercel or Render may still trigger 403 errors without paid API access.
* The project is not deployed live due to CoinGecko’s limitations on external/cloud-based requests, which interfere with smooth user experience. All functionality can be tested locally.

---

## Tech Stack

* Frontend: React, TypeScript, Vite, Tailwind CSS
* Voice Input/Output: Web Speech API
* Backend: Node.js, Express
* Charting: Recharts
* Data Source: CoinGecko API

---

## Final Thoughts

This project was built as a technical assignment to demonstrate the ability to combine frontend UX, API integration, and conversational design into a cohesive product. The codebase is modular, readable, and easily extensible for future improvements such as better NLP, user authentication, or persistent storage.

```
