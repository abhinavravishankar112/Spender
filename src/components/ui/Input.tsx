import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  useColorScheme,
  Pressable,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '../themed-text';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  hint?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle,
  hint,
}: InputProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText
          style={[
            styles.label,
            { color: error ? themeColors.danger : isFocused ? themeColors.primary : themeColors.textSecondary }
          ]}>
          {label}
        </ThemedText>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.backgroundElement,
            borderColor: error
              ? themeColors.danger
              : isFocused
              ? themeColors.primary
              : themeColors.border,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[
            styles.textInput,
            { color: themeColors.text },
            inputStyle
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIconContainer}>
            <Text
              style={[
                styles.eyeText,
                { color: themeColors.textSecondary }
              ]}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: themeColors.danger }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.hintText, { color: themeColors.textSecondary }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginBottom: Spacing.two * 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.one * 1.5,
    paddingLeft: Spacing.one,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 52,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
  },
  eyeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: Spacing.one,
    paddingLeft: Spacing.one,
  },
  hintText: {
    fontSize: 12,
    marginTop: Spacing.one,
    paddingLeft: Spacing.one,
    opacity: 0.8,
  },
});
