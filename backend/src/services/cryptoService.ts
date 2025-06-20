import axios from "axios";
import { constants } from "../utils/constants";

const currency = "inr";
const symbol = currency === "inr" ? "₹" : "$";

const axiosInstance = axios.create({
  baseURL: constants.COINGECKO_BASE_URL,
  headers: {
    "x-cg-demo-api-key": process.env.COINGEKKO_API_KEY!,
  },
});

export class CryptoService {
  static async getCurrentPrice(coinId: string) {
    try {
      const response = await axiosInstance.get("/simple/price", {
        params: {
          ids: coinId,
          vs_currencies: currency,
          include_24hr_change: true,
          include_market_cap: true,
        },
      });

      const data = (response?.data as Record<string, any>)[coinId];
      if (!data) throw new Error("Coin not found");

      console.log("data", data);

      return {
        coin: coinId,
        price: data.inr,
        change24h: data.inr_24h_change,
        marketCap: data.inr_market_cap,
        currencySymbol: symbol,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch price for ${coinId}: ${error.message}`);
    }
  }

  static async getTrendingCoins() {
    try {
      interface TrendingCoinItem {
        item: {
          id: string;
          name: string;
          symbol: string;
          market_cap_rank: number;
          thumb: string;
        };
      }
      interface TrendingCoinsResponse {
        coins: TrendingCoinItem[];
      }

      const response = await axiosInstance.get<TrendingCoinsResponse>(
        "/search/trending"
      );

      return response.data.coins.slice(0, 10).map((coin) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        rank: coin.item.market_cap_rank,
        thumb: coin.item.thumb,
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch trending coins: ${error.message}`);
    }
  }

  static async getCoinStats(coinId: string) {
    try {
      const response = await axiosInstance.get(`/coins/${coinId}`);
      const coin: any = response.data;

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        description: coin.description.en.split(".")[0] + ".",
        currentPrice: coin.market_data.current_price.inr,
        marketCap: coin.market_data.market_cap.inr,
        marketCapRank: coin.market_cap_rank,
        change24h: coin.market_data.price_change_percentage_24h,
        change7d: coin.market_data.price_change_percentage_7d,
        volume24h: coin.market_data.total_volume.inr,
        circulatingSupply: coin.market_data.circulating_supply,
        totalSupply: coin.market_data.total_supply,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch stats for ${coinId}: ${error.message}`);
    }
  }

  static async getChartData(coinId: string, days = 7) {
    try {
      const response = await axiosInstance.get(
        `/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "inr",
            days: days,
            interval: days <= 1 ? "hourly" : "daily",
          },
        }
      );

      const data = response.data as { prices: [number, number][] };

      return data.prices.map(([timestamp, price]) => ({
        timestamp,
        date: new Date(timestamp).toLocaleDateString(),
        price: price,
      }));
    } catch (error: any) {
      throw new Error(
        `Failed to fetch chart data for ${coinId}: ${error.message}`
      );
    }
  }
}
