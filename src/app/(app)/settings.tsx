import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFinanceStore } from '@/store/financeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'EUR', name: 'Euro (€)' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const { currency, setCurrency, loadDemoData } = useFinanceStore();

  const handleSignOut = () => {
    // Navigate back to login
    router.replace('/(auth)/login');
  };

  const handleClearData = () => {
    loadDemoData();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        
        {/* Profile Card */}
        <Card variant="flat" style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: themeColors.text }]}>John Doe</Text>
            <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>john.doe@example.com</Text>
          </View>
        </Card>

        {/* Currency Card */}
        <ThemedText style={styles.sectionTitle}>Currency Settings</ThemedText>
        <Card variant="default">
          {CURRENCIES.map((curr) => (
            <Pressable
              key={curr.code}
              onPress={() => setCurrency(curr.code)}
              style={[
                styles.currencyRow,
                { borderBottomColor: themeColors.border },
                currency === curr.code && { backgroundColor: themeColors.backgroundSelected },
              ]}>
              <Text style={[styles.currencyName, { color: themeColors.text }]}>{curr.name}</Text>
              {currency === curr.code ? (
                <Text style={[styles.checkText, { color: themeColors.primary }]}>✓</Text>
              ) : null}
            </Pressable>
          ))}
        </Card>

        {/* App Settings */}
        <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.four }]}>Maintenance</ThemedText>
        <Card variant="default" style={styles.maintenanceCard}>
          <Text style={[styles.maintenanceDescription, { color: themeColors.textSecondary }]}>
            Reset all spending limits, categories, and load default mock transaction values.
          </Text>
          <Button
            title="Reset Mock Data"
            onPress={handleClearData}
            variant="outline"
            size="sm"
            style={styles.resetButton}
          />
        </Card>

        {/* Sign Out */}
        <View style={styles.signOutWrapper}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="danger"
            style={styles.signOutButton}
          />
        </View>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    marginBottom: Spacing.five,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.four,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  profileEmail: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: Spacing.two,
    paddingLeft: Spacing.one,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
  },
  currencyName: {
    fontSize: 15,
    fontWeight: '500',
  },
  checkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  maintenanceCard: {
    padding: Spacing.four,
    alignItems: 'flex-start',
  },
  maintenanceDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  resetButton: {
    alignSelf: 'stretch',
  },
  signOutWrapper: {
    marginTop: Spacing.six,
  },
  signOutButton: {
    alignSelf: 'stretch',
  },
});
