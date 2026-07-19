import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  useColorScheme,
  StyleProp,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export type CardVariant = 'default' | 'flat' | 'outline' | 'glass';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  onPress,
  variant = 'default',
  style,
}: CardProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: themeColors.backgroundElement,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: themeColors.border,
        };
      case 'glass':
        return {
          backgroundColor: themeColors.transparentBg,
          borderWidth: 1,
          borderColor: themeColors.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: themeColors.cardBg,
          borderWidth: 1,
          borderColor: themeColors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: scheme === 'dark' ? 0.25 : 0.05,
          shadowRadius: 10,
          elevation: 3,
        };
    }
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          getVariantStyles(),
          pressed && styles.pressed,
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, getVariantStyles(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
