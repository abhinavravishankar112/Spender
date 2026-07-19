import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    // Mock Login for Day 2 (Firebase Auth will be added in Day 3)
    setTimeout(() => {
      setLoading(false);
      // Navigate to the dashboard
      router.replace('/(app)');
    }, 1200);
  };

  const handleDemoMode = () => {
    // Enter demo mode directly
    router.replace('/(app)');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <View style={[styles.logoContainer, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.logoText}>$</Text>
            </View>
            <ThemedText type="title" style={styles.title}>
              Spendr
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Smart personal finance tracker
            </ThemedText>
          </View>

          <Card variant="default" style={styles.card}>
            <ThemedText style={styles.cardTitle}>Sign In</ThemedText>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: themeColors.danger + '20' }]}>
                <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />

            <Pressable
              onPress={() => router.push('/(auth)/register')}
              style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: themeColors.primary }]}>
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </Card>

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
            <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
          </View>

          <Button
            title="Try Demo Mode"
            onPress={handleDemoMode}
            variant="outline"
            style={styles.demoButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five * 2,
    paddingBottom: Spacing.five,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  card: {
    alignSelf: 'stretch',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Spacing.four,
  },
  button: {
    marginTop: Spacing.two,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    padding: Spacing.three,
    borderRadius: 8,
    marginBottom: Spacing.three,
    alignSelf: 'stretch',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
    alignSelf: 'stretch',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.three,
    fontSize: 14,
    fontWeight: '500',
  },
  demoButton: {
    alignSelf: 'stretch',
  },
});
