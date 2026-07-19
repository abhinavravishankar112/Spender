import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.circle, { backgroundColor: themeColors.primary + '15' }]}>
            <Text style={[styles.illustrationText, { color: themeColors.primary }]}>$</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            Control Your Money
          </ThemedText>
          <ThemedText style={styles.description}>
            Track transactions, set budgets, analyze category trends, and stay on top of your financial goals effortlessly.
          </ThemedText>
        </View>

        <Card variant="glass" style={styles.featureCard}>
          <Text style={[styles.featureText, { color: themeColors.text }]}>✓ Encrypted Local Database</Text>
          <Text style={[styles.featureText, { color: themeColors.text }]}>✓ Smart Budget Warnings</Text>
          <Text style={[styles.featureText, { color: themeColors.text }]}>✓ Automatic Auth Persistence</Text>
        </Card>

        <View style={styles.buttonWrapper}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    padding: Spacing.four,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.five * 2,
  },
  illustrationContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  illustrationText: {
    fontSize: 72,
    fontWeight: '800',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    paddingHorizontal: Spacing.two,
  },
  featureCard: {
    alignSelf: 'stretch',
    padding: Spacing.three * 1.5,
    marginVertical: Spacing.three,
    gap: Spacing.two,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: Spacing.two,
  },
  button: {
    alignSelf: 'stretch',
  },
});
