import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

const formatNumber = (num: number, decimals = 2) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatCurrency = (amount: number) => {
  if (amount >= 1e7) {
    // Crores
    return `₹${(amount / 1e7).toFixed(2)} Cr`;
  } else if (amount >= 1e5) {
    // Lakhs
    return `₹${(amount / 1e5).toFixed(2)} L`;
  } else if (amount >= 1e3) {
    // Thousands
    return `₹${(amount / 1e3).toFixed(2)} K`;
  }
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { generateId, formatNumber, formatCurrency, sleep };
