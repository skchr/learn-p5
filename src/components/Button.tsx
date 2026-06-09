import { Text, Pressable, View, StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../styles/typography";

type Variant = "primary" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  accessibilityLabel,
}: ButtonProps) {
  const primary = useThemeColor("primary");
  const onPrimary = useThemeColor("onPrimary");
  const outline = useThemeColor("outline");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            variant === "primary"
              ? { backgroundColor: primary, borderColor: outline }
              : { backgroundColor: onPrimary, borderColor: primary },
            disabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              variant === "primary"
                ? { color: onPrimary }
                : { color: primary },
              styles.textBase,
              variant === "primary" ? styles.primaryText : styles.outlineText,
              disabled && styles.disabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    minHeight: 52,
    borderWidth: 2,
  },
  textBase: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.xl,
    textTransform: "uppercase",
  },
  primaryText: {
    fontWeight: fontWeight.black,
    letterSpacing: 0.8,
  },
  outlineText: {
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
  },
});
