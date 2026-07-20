import { useFinanceStore } from '../financeStore';

describe('useFinanceStore', () => {
  beforeEach(() => {
    // Reset store to default mock values before each test
    useFinanceStore.getState().loadDemoData();
  });

  it('should initialize with default mock transactions and budgets', () => {
    const state = useFinanceStore.getState();
    expect(state.transactions.length).toBeGreaterThan(0);
    expect(state.budgets.Food).toBe(200);
    expect(state.currency).toBe('USD');
  });

  it('should add a transaction and convert it to base currency', () => {
    const store = useFinanceStore.getState();
    
    // Set currency to EUR and a custom rate
    store.setCurrency('EUR');
    useFinanceStore.setState({
      rates: { USD: 1.0, INR: 80.0, EUR: 0.5 }, // 1 USD = 0.5 EUR (very strong Euro)
    });

    // Add transaction of 50 EUR. Since EUR rate is 0.5, this should be stored as 100 USD (50 / 0.5)
    store.addTransaction({
      title: 'European Gift',
      amount: 50.0,
      type: 'income',
      category: 'Salary',
    });

    const updatedTransactions = useFinanceStore.getState().transactions;
    const addedTx = updatedTransactions[0];

    expect(addedTx.title).toBe('European Gift');
    expect(addedTx.amount).toBe(100.0); // Converted to base USD
    expect(addedTx.type).toBe('income');
    expect(addedTx.category).toBe('Salary');
  });

  it('should delete a transaction by ID', () => {
    const store = useFinanceStore.getState();
    const initialLength = store.transactions.length;
    const firstTxId = store.transactions[0].id;

    store.deleteTransaction(firstTxId);

    const updatedTransactions = useFinanceStore.getState().transactions;
    expect(updatedTransactions.length).toBe(initialLength - 1);
    expect(updatedTransactions.find((t) => t.id === firstTxId)).toBeUndefined();
  });

  it('should set budget limits dynamically', () => {
    const store = useFinanceStore.getState();
    expect(store.budgets.Food).toBe(200);

    store.setBudget('Food', 350);

    const updatedBudgets = useFinanceStore.getState().budgets;
    expect(updatedBudgets.Food).toBe(350);
  });

  it('should set currency selection', () => {
    const store = useFinanceStore.getState();
    expect(store.currency).toBe('USD');

    store.setCurrency('INR');

    const updatedState = useFinanceStore.getState();
    expect(updatedState.currency).toBe('INR');
  });
});
