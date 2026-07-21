import { create } from 'zustand';
import { fetchExchangeRates, ExchangeRates } from '@/services/api';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Budget {
  category: string;
  amount: number;
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Record<string, number>;
  currency: string;
  rates: ExchangeRates;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
  setCurrency: (currency: string) => void;
  fetchRates: () => Promise<void>;
  loadDemoData: () => void;
}

const DEFAULT_BUDGETS = {
  Food: 200,
  Entertainment: 100,
  Transport: 80,
  Utilities: 150,
  Rent: 1000,
};

const DEFAULT_RATES: ExchangeRates = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Monthly Salary',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    amount: 85.5,
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Gas Refill',
    amount: 45.0,
    type: 'expense',
    category: 'Transport',
    date: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Electricity Bill',
    amount: 120.0,
    type: 'expense',
    category: 'Utilities',
    date: new Date().toISOString(),
  },
];

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: MOCK_TRANSACTIONS,
  budgets: DEFAULT_BUDGETS,
  currency: 'USD',
  rates: DEFAULT_RATES,

  addTransaction: (t) => {
    const { currency, rates } = get();
    // Convert entered amount to base USD
    const rate = rates[currency] || 1.0;
    const baseAmount = t.amount / rate;

    set((state) => ({
      transactions: [
        {
          ...t,
          amount: baseAmount, // Store in base USD
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    }));
  },

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setBudget: (category, amount) =>
    set((state) => ({
      budgets: {
        ...state.budgets,
        [category]: amount,
      },
    })),

  setCurrency: (currency) => set({ currency }),

  fetchRates: async () => {
    try {
      const liveRates = await fetchExchangeRates();
      set({ rates: liveRates });
    } catch (error) {
      console.warn('Failed to update live rates in store:', error);
    }
  },

  loadDemoData: () =>
    set({
      transactions: MOCK_TRANSACTIONS,
      budgets: DEFAULT_BUDGETS,
      rates: DEFAULT_RATES,
      currency: 'USD',
    }),
}));
