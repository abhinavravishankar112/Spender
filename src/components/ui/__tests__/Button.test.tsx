import {
  getButtonVariantStyles,
  getButtonTextStyles,
  getButtonSizeStyles,
  getButtonFontSize,
} from '../Button';

describe('Button Styling Helpers', () => {
  const mockThemeColors = {
    primary: '#6366F1',
    secondary: '#475569',
    success: '#10B981',
    danger: '#EF4444',
  };

  it('resolves correct variant background colors', () => {
    expect(getButtonVariantStyles('primary', mockThemeColors).backgroundColor).toBe('#6366F1');
    expect(getButtonVariantStyles('secondary', mockThemeColors).backgroundColor).toBe('#475569');
    expect(getButtonVariantStyles('success', mockThemeColors).backgroundColor).toBe('#10B981');
    expect(getButtonVariantStyles('danger', mockThemeColors).backgroundColor).toBe('#EF4444');
    expect(getButtonVariantStyles('outline', mockThemeColors).backgroundColor).toBe('transparent');
  });

  it('resolves correct text colors', () => {
    expect(getButtonTextStyles('primary', mockThemeColors).color).toBe('#FFFFFF');
    expect(getButtonTextStyles('outline', mockThemeColors).color).toBe('#6366F1');
  });

  it('resolves correct spacing for sizes', () => {
    expect(getButtonSizeStyles('sm').borderRadius).toBe(8);
    expect(getButtonSizeStyles('md').borderRadius).toBe(12);
    expect(getButtonSizeStyles('lg').borderRadius).toBe(14);
  });

  it('resolves correct font size values', () => {
    expect(getButtonFontSize('sm')).toBe(13);
    expect(getButtonFontSize('md')).toBe(15);
    expect(getButtonFontSize('lg')).toBe(16);
  });
});
