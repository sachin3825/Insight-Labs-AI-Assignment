import { COIN_MAPPINGS } from "../utils/constants";

export class MessageParser {
  static parseIntent(message: string) {
    const text = message.toLowerCase().trim();

    // Price queries
    if (
      this.matchesPattern(text, ["price", "trading", "worth", "cost", "value"])
    ) {
      const coin = this.extractCoin(text);
      return {
        intent: "getPrice",
        coin: coin || "bitcoin",
        confidence: coin ? 0.9 : 0.6,
      };
    }

    // Trending/popular coins
    if (
      this.matchesPattern(text, [
        "trending",
        "popular",
        "hot",
        "top coins",
        "best",
      ])
    ) {
      return {
        intent: "getTrending",
        confidence: 0.9,
      };
    }

    // Portfolio management
    if (
      this.matchesPattern(text, [
        "i have",
        "holding",
        "own",
        "bought",
        "portfolio",
      ])
    ) {
      const holding = this.extractHolding(text);
      if (holding) {
        return {
          intent: "addHolding",
          ...holding,
          confidence: 0.9,
        };
      }
    }

    // Portfolio value check
    if (
      this.matchesPattern(text, [
        "portfolio value",
        "my holdings",
        "total worth",
        "net worth",
      ])
    ) {
      return {
        intent: "getPortfolioValue",
        confidence: 0.9,
      };
    }

    // Chart requests
    if (
      this.matchesPattern(text, ["chart", "graph", "price history", "trend"])
    ) {
      const coin = this.extractCoin(text);
      return {
        intent: "showChart",
        coin: coin || "bitcoin",
        confidence: coin ? 0.9 : 0.6,
      };
    }

    // Stats request
    if (
      this.matchesPattern(text, ["stats", "information", "details", "about"])
    ) {
      const coin = this.extractCoin(text);
      return {
        intent: "getStats",
        coin: coin || "bitcoin",
        confidence: coin ? 0.9 : 0.6,
      };
    }

    return {
      intent: "unknown",
      confidence: 0.0,
      originalMessage: message,
    };
  }

  static matchesPattern(text: string, keywords: string[]) {
    return keywords.some((keyword: string) => text.includes(keyword));
  }

  static extractCoin(text: string) {
    for (const [key, value] of Object.entries(COIN_MAPPINGS)) {
      if (text.includes(key)) {
        return value;
      }
    }
    return null;
  }

  static extractHolding(text: string) {
    const patterns = [
      /(?:i have|holding|own|bought)\s+(\d+\.?\d*)\s+(btc|bitcoin|eth|ethereum|ada|cardano|sol|solana|doge|dogecoin)/i,
      /(\d+\.?\d*)\s+(btc|bitcoin|eth|ethereum|ada|cardano|sol|solana|doge|dogecoin)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]);
        const coinSymbol = match[2].toLowerCase();
        const coin = this.extractCoin(coinSymbol);

        if (coin && amount > 0) {
          return { amount, coin };
        }
      }
    }
    return null;
  }
}
