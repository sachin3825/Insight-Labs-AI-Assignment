import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

const formatNumber = (num: number, decimals = 2) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatCurrency = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e7) return `${(value / 1e7).toFixed(2)}Cr`;
  return value.toLocaleString();
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { generateId, formatNumber, formatCurrency, sleep };
