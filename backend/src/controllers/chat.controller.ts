import { Request, Response } from "express";
import { MessageParser } from "../parsers/messageParser";
import { CryptoService } from "../services/cryptoService";
import { PortfolioService } from "../services/portfolioService";
import { ResponseGenerator } from "../generators/ResponseGenerator";
import { generateId } from "../utils/helper";

interface ParsedIntent {
  intent: string;
  coin?: string;
  amount?: number;
}

interface Holding {
  coin: string;
  amount: number;
}

interface PriceData {
  price: number;
  change24h?: number;
  marketCap?: number;
}

export class ChatController {
  static async handleChatMessage(req: Request, res: Response): Promise<void> {
    try {
      if (
        !req.body ||
        typeof req.body !== "object" ||
        req.body instanceof ReadableStream
      ) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      const { message, sessionId }: { message?: string; sessionId?: string } =
        req.body;

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const parsed: ParsedIntent = MessageParser.parseIntent(message);
      console.log("Parsed intent:", parsed);

      let responseData: any = null;
      let error: Error | null = null;

      try {
        responseData = await ChatController.processIntent(parsed, sessionId);
      } catch (apiError: any) {
        error = apiError;
        console.error("API Error:", apiError.message);
      }

      // Generate response
      const response = ResponseGenerator.generateResponse(
        parsed.intent,
        responseData,
        error
      );
      res.json(response);
    } catch (error: any) {
      console.error("Server error:", error);
      res.status(500).json({
        id: generateId(),
        role: "bot",
        timestamp: new Date().toISOString(),
        content: [
          {
            type: "text",
            data: "⚠️ **Server Error**\n\nSomething went wrong on our end. Please try again!",
          },
        ],
      });
    }
  }

  static async processIntent(
    parsed: ParsedIntent,
    sessionId?: string
  ): Promise<any> {
    switch (parsed.intent) {
      case "getPrice": {
        return await CryptoService.getCurrentPrice(parsed.coin!);
      }

      case "getTrending": {
        return await CryptoService.getTrendingCoins();
      }

      case "addHolding": {
        const priceData: PriceData = await CryptoService.getCurrentPrice(
          parsed.coin!
        );
        PortfolioService.addHolding(sessionId!, parsed.coin!, parsed.amount!);

        return {
          amount: parsed.amount,
          coin: parsed.coin,
          currentPrice: priceData.price,
        };
      }

      case "getPortfolioValue": {
        const portfolio: Holding[] = PortfolioService.getPortfolio(sessionId!);
        if (!portfolio || portfolio.length === 0) {
          return { holdings: [] };
        }

        const holdings = [];
        let totalValue = 0;

        for (const holding of portfolio) {
          const priceInfo: PriceData = await CryptoService.getCurrentPrice(
            holding.coin
          );
          const value = holding.amount * priceInfo.price;

          holdings.push({
            coin: holding.coin,
            amount: holding.amount,
            currentPrice: priceInfo.price,
            value,
          });

          totalValue += value;
        }

        return { holdings, totalValue };
      }

      case "showChart": {
        const chartData = await CryptoService.getChartData(parsed.coin!, 7);
        return { coin: parsed.coin, chartData };
      }

      case "getStats": {
        return await CryptoService.getCoinStats(parsed.coin!);
      }

      default:
        return null;
    }
  }
}
