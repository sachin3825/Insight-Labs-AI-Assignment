// Relevant imports
import { v4 as uuidv4 } from "uuid";
import { formatCurrency, formatNumber } from "../utils/helper";

// Type Definitions
interface PriceData {
  coin: string;
  price: number;
  change24h: number;
  marketCap: number;
  currencySymbol: string;
}

interface TrendingCoin {
  rank: number;
  name: string;
  symbol: string;
}

interface HoldingData {
  coin: string;
  amount: number;
  currentPrice: number;
}

interface PortfolioData {
  totalValue: number;
  holdings: HoldingData[];
}

interface ChartData {
  coin: string;
  chartData: { time: string; value: number }[];
}

interface StatsData {
  name: string;
  symbol: string;
  description: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  circulatingSupply: number;
}

// Raw API response interface
interface RawPriceData {
  inr: number;
  inr_market_cap: number;
  inr_24h_change: number;
}

type Content =
  | { type: "text"; data: string }
  | {
      type: "table";
      data: {
        headers: string[];
        rows: (string | number)[][];
      };
    }
  | {
      type: "chart";
      data: {
        type: "line";
        chartData: ChartData["chartData"];
        coin: string;
      };
    };

interface BotResponse {
  id: string;
  role: "bot";
  timestamp: string;
  content: Content[];
}

type Intent =
  | "getPrice"
  | "getTrending"
  | "addHolding"
  | "getPortfolioValue"
  | "showChart"
  | "getStats"
  | string;

// Class Implementation
export class ResponseGenerator {
  // Helper method to transform raw API data to PriceData
  static transformRawPriceData(rawData: RawPriceData, coin: string): PriceData {
    console.log("🔄 Raw API data:", rawData);
    console.log("🔄 Mapping:", {
      "rawData.inr (price)": rawData.inr,
      "rawData.inr_24h_change (change%)": rawData.inr_24h_change,
      "rawData.inr_market_cap (market cap)": rawData.inr_market_cap,
    });

    const transformed = {
      coin,
      price: rawData.inr, // ✅ Price: 219389
      change24h: rawData.inr_24h_change, // ✅ Change: 1.76%
      marketCap: rawData.inr_market_cap, // ✅ Market Cap: 26484056972288.754
      currencySymbol: "₹",
    };

    console.log("🔄 Transformed result:", transformed);
    return transformed;
  }

  static generateResponse(
    intent: Intent,
    data: any,
    error: Error | null = null,
    coin?: string // Add coin parameter for price requests
  ): BotResponse {
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();

    if (error) {
      return {
        id: messageId,
        role: "bot",
        timestamp,
        content: [{ type: "text", data: this.getErrorMessage(error) }],
      };
    }

    switch (intent) {
      case "getPrice":
        // Always transform raw data if it has the API structure
        let priceData: PriceData;
        if (data && typeof data === "object" && "inr" in data) {
          console.log("🚀 Raw API data detected:", data);
          console.log("🚀 About to transform with coin:", coin);
          priceData = this.transformRawPriceData(
            data as RawPriceData,
            coin || "Unknown"
          );
          console.log("🚀 Final transformed data:", priceData);
        } else {
          console.log("🚀 Using data as-is (not raw API format):", data);
          priceData = data as PriceData;
        }
        return this.generatePriceResponse(messageId, timestamp, priceData);
      case "getTrending":
        return this.generateTrendingResponse(
          messageId,
          timestamp,
          data as TrendingCoin[]
        );
      case "addHolding":
        return this.generateHoldingResponse(
          messageId,
          timestamp,
          data as HoldingData
        );
      case "getPortfolioValue":
        return this.generatePortfolioResponse(
          messageId,
          timestamp,
          data as PortfolioData
        );
      case "showChart":
        return this.generateChartResponse(
          messageId,
          timestamp,
          data as ChartData
        );
      case "getStats":
        return this.generateStatsResponse(
          messageId,
          timestamp,
          data as StatsData
        );
      default:
        return this.generateUnknownResponse(messageId, timestamp);
    }
  }

  private static generatePriceResponse(
    id: string,
    timestamp: string,
    data: PriceData
  ): BotResponse {
    const change = data.change24h.toFixed(2);
    const changeText =
      data.change24h >= 0
        ? `24h Change: +${change}%`
        : `24h Change: ${change}%`;

    return {
      id,
      role: "bot",
      timestamp,
      content: [
        {
          type: "text",
          data: `${data.coin.toUpperCase()} is trading at ₹${formatNumber(
            data.price
          )}. ${changeText}. Market Cap: ₹${formatCurrency(data.marketCap)}`,
        },
      ],
    };
  }

  private static generateTrendingResponse(
    id: string,
    timestamp: string,
    data: TrendingCoin[]
  ): BotResponse {
    const tableData = {
      headers: ["Rank", "Name", "Symbol"],
      rows: data.map((coin) => [
        coin.rank || "N/A",
        coin.name,
        coin.symbol.toUpperCase(),
      ]),
    };

    return {
      id,
      role: "bot",
      timestamp,
      content: [
        { type: "text", data: "Trending Cryptocurrencies Today:" },
        { type: "table", data: tableData },
      ],
    };
  }

  private static generateHoldingResponse(
    id: string,
    timestamp: string,
    data: HoldingData
  ): BotResponse {
    const value = (data.amount * data.currentPrice).toLocaleString();

    return {
      id,
      role: "bot",
      timestamp,
      content: [
        {
          type: "text",
          data: `Added ${
            data.amount
          } ${data.coin.toUpperCase()} to your portfolio. Current Value: ₹${value}`,
        },
      ],
    };
  }

  private static generatePortfolioResponse(
    id: string,
    timestamp: string,
    data: PortfolioData
  ): BotResponse {
    if (!data.holdings || data.holdings.length === 0) {
      return {
        id,
        role: "bot",
        timestamp,
        content: [
          {
            type: "text",
            data: "Your portfolio is empty. Add a coin to get started. For example: I have 2 BTC",
          },
        ],
      };
    }

    const tableData = {
      headers: ["Asset", "Amount", "Price", "Value"],
      rows: data.holdings.map((h) => [
        h.coin.toUpperCase(),
        h.amount,
        `₹${h.currentPrice.toLocaleString()}`,
        `₹${(h.amount * h.currentPrice).toLocaleString()}`,
      ]),
    };

    return {
      id,
      role: "bot",
      timestamp,
      content: [
        {
          type: "text",
          data: `Your Portfolio Total Value: ₹${data.totalValue.toLocaleString()}`,
        },
        { type: "table", data: tableData },
      ],
    };
  }

  private static generateChartResponse(
    id: string,
    timestamp: string,
    data: ChartData
  ): BotResponse {
    return {
      id,
      role: "bot",
      timestamp,
      content: [
        { type: "text", data: `${data.coin.toUpperCase()} 7-Day Price Chart` },
        {
          type: "chart",
          data: { type: "line", chartData: data.chartData, coin: data.coin },
        },
      ],
    };
  }

  private static generateStatsResponse(
    id: string,
    timestamp: string,
    data: StatsData
  ): BotResponse {
    return {
      id,
      role: "bot",
      timestamp,
      content: [
        {
          type: "text",
          data: `${
            data.name
          } (${data.symbol.toUpperCase()}) Stats. Description: ${
            data.description
          }. Price: ₹${data.currentPrice.toLocaleString()}. Market Cap: ₹${(
            data.marketCap / 1e9
          ).toFixed(2)}B. Rank: #${data.marketCapRank}. 24h Change: ${
            data.change24h
          }%. 7d Change: ${data.change7d}%. Volume (24h): ₹${(
            data.volume24h / 1e9
          ).toFixed(2)}B. Circulating Supply: ${(
            data.circulatingSupply / 1e6
          ).toFixed(2)}M`,
        },
      ],
    };
  }

  private static generateUnknownResponse(
    id: string,
    timestamp: string
  ): BotResponse {
    const suggestions = [
      "Try asking: What's the price of Bitcoin?",
      "Ask: Show me trending coins",
      "Say: I have 2 ETH to track your portfolio",
      "Request: Show me a chart for Ethereum",
      "Ask: What are the stats for Solana?",
    ];

    const randomSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];

    return {
      id,
      role: "bot",
      timestamp,
      content: [
        {
          type: "text",
          data: `I didn't understand that. I can help with crypto prices, trending coins, portfolio tracking, and charts. Suggestion: ${randomSuggestion}`,
        },
      ],
    };
  }

  private static getErrorMessage(error: Error): string {
    const msg = error.message.toLowerCase();

    console.log(error);

    if (msg.includes("rate limit"))
      return "Too many requests. Please wait before trying again.";
    if (msg.includes("not found"))
      return "Coin not found. Please check the name and try again.";
    return "Something went wrong. Please try again later.";
  }
}
