import { create } from 'zustand';

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
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
  setCurrency: (currency: string) => void;
  loadDemoData: () => void;
}

const DEFAULT_BUDGETS = {
  Food: 200,
  Entertainment: 100,
  Transport: 80,
  Utilities: 150,
  Rent: 1000,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Monthly Salary',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    amount: 85.5,
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '3',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    title: 'Gas Refill',
    amount: 45.0,
    type: 'expense',
    category: 'Transport',
    date: new Date().toISOString(), // Today
  },
  {
    id: '5',
    title: 'Electricity Bill',
    amount: 120.0,
    type: 'expense',
    category: 'Utilities',
    date: new Date().toISOString(), // Today
  },
];

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: MOCK_TRANSACTIONS,
  budgets: DEFAULT_BUDGETS,
  currency: 'USD', // USD, INR, EUR, etc.

  addTransaction: (t) =>
    set((state) => ({
      transactions: [
        {
          ...t,
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    })),

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

  loadDemoData: () => set({ transactions: MOCK_TRANSACTIONS, budgets: DEFAULT_BUDGETS }),
}));
