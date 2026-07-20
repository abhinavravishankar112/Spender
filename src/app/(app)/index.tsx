import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFinanceStore, Transaction } from '@/store/financeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CATEGORIES = ['Food', 'Entertainment', 'Transport', 'Utilities', 'Rent', 'Salary', 'Other'];

export default function DashboardScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const { transactions, currency, addTransaction, rates, fetchRates } = useFinanceStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch live exchange rates on mount
  React.useEffect(() => {
    fetchRates();
  }, []);

  const rate = rates[currency] || 1.0;

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food');
  const [formError, setFormError] = useState('');

  // Math (converted to active display currency)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) * rate;

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) * rate;

  const balance = totalIncome - totalExpense;

  const formatMoney = (val: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleAddTransaction = () => {
    if (!title || !amount) {
      setFormError('Please enter title and amount');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid positive amount');
      return;
    }

    addTransaction({
      title,
      amount: parsedAmount,
      type,
      category,
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('Food');
    setFormError('');
    setModalVisible(false);
  };

  const recentTransactions = transactions.slice(0, 3);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <Card variant="glass" style={[styles.balanceCard, { borderColor: themeColors.primary }]}>
          <Text style={[styles.balanceLabel, { color: themeColors.textSecondary }]}>TOTAL BALANCE</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? themeColors.text : themeColors.danger }]}>
            {formatMoney(balance)}
          </Text>
        </Card>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <Card variant="default" style={[styles.statCard, { flex: 1, marginRight: Spacing.two }]}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Income</Text>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              {formatMoney(totalIncome)}
            </Text>
          </Card>
          <Card variant="default" style={[styles.statCard, { flex: 1, marginLeft: Spacing.two }]}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Expenses</Text>
            <Text style={[styles.statValue, { color: themeColors.danger }]}>
              {formatMoney(totalExpense)}
            </Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionSection}>
          <Button
            title="+ Add Transaction"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          />
        </View>

        {/* Recent Transactions List */}
        <View style={styles.transactionsHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
          <Pressable onPress={() => router.push('/(app)/transactions')}>
            <Text style={[styles.viewAllText, { color: themeColors.primary }]}>View All</Text>
          </Pressable>
        </View>

        {recentTransactions.length === 0 ? (
          <Card variant="flat" style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              No transactions yet. Add some to get started!
            </Text>
          </Card>
        ) : (
          recentTransactions.map((t) => (
            <Card key={t.id} variant="flat" style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={[styles.transactionTitle, { color: themeColors.text }]}>{t.title}</Text>
                <Text style={[styles.transactionMeta, { color: themeColors.textSecondary }]}>
                  {t.category} • {new Date(t.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: t.type === 'income' ? themeColors.success : themeColors.danger },
                ]}>
                {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount * rate)}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>New Transaction</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeText, { color: themeColors.textSecondary }]}>Cancel</Text>
              </Pressable>
            </View>

            {formError ? (
              <View style={[styles.errorBox, { backgroundColor: themeColors.danger + '15' }]}>
                <Text style={[styles.errorText, { color: themeColors.danger }]}>{formError}</Text>
              </View>
            ) : null}

            <Input
              label="Title / Description"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Starbucks Coffee"
            />

            <Input
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 5.50"
              keyboardType="decimal-pad"
            />

            {/* Type Selector */}
            <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>Transaction Type</Text>
            <View style={styles.typeSelectorRow}>
              <Pressable
                onPress={() => setType('expense')}
                style={[
                  styles.typeButton,
                  type === 'expense'
                    ? { backgroundColor: themeColors.danger, borderColor: themeColors.danger }
                    : { borderColor: themeColors.border },
                ]}>
                <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
                  Expense
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setType('income')}
                style={[
                  styles.typeButton,
                  type === 'income'
                    ? { backgroundColor: themeColors.success, borderColor: themeColors.success }
                    : { borderColor: themeColors.border },
                ]}>
                <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
                  Income
                </Text>
              </Pressable>
            </View>

            {/* Category Selector */}
            <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryBadge,
                    { borderColor: themeColors.border },
                    category === cat && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
                  ]}>
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: themeColors.text },
                      category === cat && { color: '#FFFFFF', fontWeight: 'bold' },
                    ]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Button
              title="Add Transaction"
              onPress={handleAddTransaction}
              style={styles.modalSubmitButton}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.five * 2,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    borderWidth: 1.5,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: Spacing.two,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  statCard: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionSection: {
    marginVertical: Spacing.three,
  },
  addButton: {
    alignSelf: 'stretch',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  transactionLeft: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  transactionMeta: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCard: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: Spacing.five,
    paddingBottom: Spacing.six,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    padding: Spacing.three,
    borderRadius: 8,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.two,
    marginTop: Spacing.two,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    marginBottom: Spacing.three,
  },
  typeButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.one,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.four,
  },
  categoryBadge: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    margin: Spacing.one,
  },
  categoryBadgeText: {
    fontSize: 12,
  },
  modalSubmitButton: {
    marginTop: Spacing.two,
  },
});
