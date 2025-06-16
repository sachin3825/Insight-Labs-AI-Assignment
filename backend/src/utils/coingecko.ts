import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const coingeckoClient = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
  },
});
