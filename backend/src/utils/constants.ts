const COIN_MAPPINGS = {
  bitcoin: "bitcoin",
  btc: "bitcoin",
  ethereum: "ethereum",
  eth: "ethereum",
  cardano: "cardano",
  ada: "cardano",
  solana: "solana",
  sol: "solana",
  dogecoin: "dogecoin",
  doge: "dogecoin",
  ripple: "ripple",
  xrp: "ripple",
  litecoin: "litecoin",
  ltc: "litecoin",
  chainlink: "chainlink",
  link: "chainlink",
};

const RESPONSE_SUGGESTIONS = [
  "Try asking: 'What's the price of Bitcoin?'",
  "Ask: 'Show me trending coins'",
  "Say: 'I have 2 ETH' to track your portfolio",
  "Request: 'Show me a chart for Ethereum'",
  "Ask: 'What are the stats for Solana?'",
];

const constants = {
  COINGECKO_BASE_URL: "https://api.coingecko.com/api/v3",
  RATE_LIMIT_DELAY: 1000,
};

export { COIN_MAPPINGS, RESPONSE_SUGGESTIONS, constants };
