import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ViewStyle,
  TextStyle,
  useColorScheme,
  StyleProp,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: themeColors.secondary };
      case 'success':
        return { backgroundColor: themeColors.success };
      case 'danger':
        return { backgroundColor: themeColors.danger };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: themeColors.primary,
        };
      case 'primary':
      default:
        return { backgroundColor: themeColors.primary };
    }
  };

  const getTextStyles = (): TextStyle => {
    if (variant === 'outline') {
      return { color: themeColors.primary };
    }
    return { color: '#FFFFFF' };
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: Spacing.one * 1.5,
          paddingHorizontal: Spacing.three,
          borderRadius: 8,
        };
      case 'lg':
        return {
          paddingVertical: Spacing.three,
          paddingHorizontal: Spacing.five,
          borderRadius: 14,
        };
      case 'md':
      default:
        return {
          paddingVertical: Spacing.two * 1.5,
          paddingHorizontal: Spacing.four,
          borderRadius: 12,
        };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return 13;
      case 'lg':
        return 16;
      case 'md':
      default:
        return 15;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.baseButton,
        getVariantStyles(),
        getSizeStyles(),
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? themeColors.primary : '#FFFFFF'}
        />
      ) : (
        <Text
          style={[
            styles.baseText,
            { fontSize: getFontSize() },
            getTextStyles(),
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});
