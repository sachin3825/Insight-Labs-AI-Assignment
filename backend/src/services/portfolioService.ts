const portfolios = new Map();

export class PortfolioService {
  static addHolding(sessionId: string, coin: string, amount: number) {
    if (!portfolios.has(sessionId)) {
      portfolios.set(sessionId, []);
    }

    const userPortfolio = portfolios.get(sessionId);
    const existingIndex = userPortfolio.findIndex((h: any) => h.coin === coin);

    if (existingIndex >= 0) {
      userPortfolio[existingIndex].amount += amount;
    } else {
      userPortfolio.push({ coin, amount });
    }
  }

  static getPortfolio(sessionId: string) {
    return portfolios.get(sessionId) || [];
  }

  static removeHolding(sessionId: string, coin: string) {
    const userPortfolio = portfolios.get(sessionId);
    if (userPortfolio) {
      const index = userPortfolio.findIndex((h: any) => h.coin === coin);
      if (index >= 0) {
        userPortfolio.splice(index, 1);
      }
    }
  }

  static clearPortfolio(sessionId: string) {
    portfolios.delete(sessionId);
  }
}
