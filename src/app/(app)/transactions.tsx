import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useFinanceStore, Transaction } from '@/store/financeStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';

const FILTER_TYPES = ['All', 'Income', 'Expense'];

export default function TransactionsScreen() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const { transactions, currency, deleteTransaction } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Income' | 'Expense'>('All');

  const formatMoney = (val: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  // Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = activeFilter === 'All' ||
      (activeFilter === 'Income' && t.type === 'income') ||
      (activeFilter === 'Expense' && t.type === 'expense');

    return matchesSearch && matchesType;
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <Card variant="flat" style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={[styles.transactionTitle, { color: themeColors.text }]}>{item.title}</Text>
        <Text style={[styles.transactionMeta, { color: themeColors.textSecondary }]}>
          {item.category} • {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.type === 'income' ? themeColors.success : themeColors.danger },
          ]}>
          {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
        </Text>
        <Pressable
          onPress={() => deleteTransaction(item.id)}
          style={styles.deleteButton}>
          <Text style={[styles.deleteButtonText, { color: themeColors.danger }]}>Delete</Text>
        </Pressable>
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.headerFilters}>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search transactions..."
          style={styles.searchBar}
        />

        <View style={styles.filterRow}>
          {FILTER_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => setActiveFilter(type as any)}
              style={[
                styles.filterTab,
                { borderColor: themeColors.border },
                activeFilter === type && {
                  backgroundColor: themeColors.primary,
                  borderColor: themeColors.primary,
                },
              ]}>
              <Text
                style={[
                  styles.filterTabText,
                  { color: themeColors.text },
                  activeFilter === type && { color: '#FFFFFF', fontWeight: 'bold' },
                ]}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card variant="flat" style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              No matching transactions found.
            </Text>
          </Card>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerFilters: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  searchBar: {
    marginBottom: Spacing.two,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.one,
  },
  filterTab: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.one,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.five * 2,
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
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  deleteButton: {
    paddingVertical: Spacing.one / 2,
    paddingHorizontal: Spacing.two,
  },
  deleteButtonText: {
    fontSize: 11,
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
});
