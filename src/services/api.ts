// Free API with no key required for exchange rates
const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

export interface ExchangeRates {
  USD: number;
  INR: number;
  EUR: number;
  [key: string]: number;
}

const FALLBACK_RATES: ExchangeRates = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data && data.rates) {
      return {
        USD: data.rates.USD || 1.0,
        INR: data.rates.INR || 83.5,
        EUR: data.rates.EUR || 0.92,
      };
    }
    return FALLBACK_RATES;
  } catch (error) {
    console.warn('Failed to fetch live exchange rates, using offline fallback rates:', error);
    return FALLBACK_RATES;
  }
}

/**
 * Mock function to sync transactions to a server
 */
export async function syncTransactionsToServer(transactions: any[]): Promise<boolean> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Successfully synced ${transactions.length} transactions to server.`);
    return true;
  } catch (error) {
    console.error('Failed to sync transactions to server:', error);
    return false;
  }
}
