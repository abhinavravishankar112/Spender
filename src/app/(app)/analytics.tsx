import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useFinanceStore } from '@/store/financeStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const BUDGET_CATEGORIES = ['Food', 'Entertainment', 'Transport', 'Utilities', 'Rent'];

export default function AnalyticsScreen() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const { transactions, budgets, currency, setBudget, rates } = useFinanceStore();
  const rate = rates[currency] || 1.0;

  // Budget Adjust Form State
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const formatMoney = (val: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  // Math: Calculate spent per category (for the current month/overall)
  const calculateSpent = (category: string) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category.toLowerCase() === category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleUpdateBudget = () => {
    if (!newBudgetAmount) return;
    const amt = parseFloat(newBudgetAmount);
    if (isNaN(amt) || amt <= 0) return;

    setBudget(selectedCategory, amt);
    setNewBudgetAmount('');
    setFormSuccess(`Updated ${selectedCategory} budget to ${formatMoney(amt)}!`);

    setTimeout(() => {
      setFormSuccess('');
    }, 3000);
  };

  // Math: Total spending for chart breakdown
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Category Budget Bars */}
        <ThemedText style={styles.sectionTitle}>Budget Tracker</ThemedText>
        <Card variant="default">
          {BUDGET_CATEGORIES.map((cat) => {
            const limit = budgets[cat] || 100;
            const spent = calculateSpent(cat) * rate;
            const ratio = limit > 0 ? spent / limit : 0;
            const percent = Math.min(Math.round(ratio * 100), 100);

            // Determine bar color
            let progressColor: string = themeColors.success;
            if (ratio >= 0.9) {
              progressColor = themeColors.danger;
            } else if (ratio >= 0.7) {
              progressColor = '#F59E0B'; // Amber
            }

            return (
              <View key={cat} style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <Text style={[styles.categoryName, { color: themeColors.text }]}>{cat}</Text>
                  <Text style={[styles.budgetAmount, { color: themeColors.textSecondary }]}>
                    {formatMoney(spent)} / {formatMoney(limit)}
                  </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: themeColors.border }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${percent}%`,
                        backgroundColor: progressColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.percentText, { color: progressColor }]}>
                  {Math.round(ratio * 100)}% utilized
                </Text>
              </View>
            );
          })}
        </Card>

        {/* Adjust Budgets Form */}
        <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.four }]}>Manage Budgets</ThemedText>
        <Card variant="flat" style={styles.formCard}>
          {formSuccess ? (
            <View style={[styles.successBanner, { backgroundColor: themeColors.success + '15' }]}>
              <Text style={[styles.successText, { color: themeColors.success }]}>{formSuccess}</Text>
            </View>
          ) : null}

          <Text style={[styles.fieldLabel, { color: themeColors.textSecondary }]}>Select Category</Text>
          <View style={styles.categoryRow}>
            {BUDGET_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryTab,
                  { borderColor: themeColors.border },
                  selectedCategory === cat && {
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.categoryTabText,
                    { color: themeColors.text },
                    selectedCategory === cat && { color: '#FFFFFF', fontWeight: 'bold' },
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            label={`New Budget Limit (${currency})`}
            value={newBudgetAmount}
            onChangeText={setNewBudgetAmount}
            placeholder="e.g. 250"
            keyboardType="decimal-pad"
          />

          <Button
            title={`Set ${selectedCategory} Limit`}
            onPress={handleUpdateBudget}
            style={styles.formButton}
          />
        </Card>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  budgetItem: {
    marginBottom: Spacing.four,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one * 1.5,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  budgetAmount: {
    fontSize: 13,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: Spacing.one,
    textAlign: 'right',
  },
  // Form Styles
  formCard: {
    padding: Spacing.four,
  },
  successBanner: {
    padding: Spacing.three,
    borderRadius: 8,
    marginBottom: Spacing.three,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.three,
  },
  categoryTab: {
    paddingVertical: Spacing.one * 1.5,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: Spacing.two,
    marginBottom: Spacing.two,
  },
  categoryTabText: {
    fontSize: 12,
  },
  formButton: {
    marginTop: Spacing.one,
  },
});
