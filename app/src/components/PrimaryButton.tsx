import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius, typography } from '../theme/theme';

interface Props extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  variant = 'solid',
  style,
  ...rest
}: Props) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, isOutline && styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  solid: { backgroundColor: colors.white },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  pressed: { opacity: 0.85 },
  label: { ...typography.button, color: colors.primary },
  labelOutline: { color: colors.white },
});
