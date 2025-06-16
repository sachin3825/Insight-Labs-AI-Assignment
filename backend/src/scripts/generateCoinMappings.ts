// scripts/generateCoinMappings.ts
import fs from "fs";
import path from "path";
import axios from "axios";

async function fetchCoinMappings() {
  const url = "https://api.coingecko.com/api/v3/coins/list";

  try {
    const response = await axios.get<any[]>(url);
    const coins = response.data;

    const mappings: Record<string, string> = {};

    coins.forEach((coin: any) => {
      const id = coin.id.toLowerCase();
      const symbol = coin.symbol.toLowerCase();
      const name = coin.name.toLowerCase();

      // Avoid mapping weird or duplicate symbols
      if (symbol.length > 1) mappings[symbol] = id;
      mappings[name] = id;
    });

    const fileContent = `export const COIN_MAPPINGS = ${JSON.stringify(
      mappings,
      null,
      2
    )};\n`;

    const outputPath = path.join(__dirname, "../utils/coinMappings.ts");

    fs.writeFileSync(outputPath, fileContent, "utf-8");
    console.log("✅ Coin mappings written to coinMappings.ts");
  } catch (error) {
    console.error("❌ Failed to fetch CoinGecko data:", error);
  }
}

fetchCoinMappings();
