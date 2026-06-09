import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawerContext } from "../contexts/DrawerContext";
import { useThemeColor } from "../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../styles/typography";
import { spacing, borderRadius } from "../styles/spacing";

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, right }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawerContext();
  const surface = useThemeColor("surface");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");
  const surfaceDim = useThemeColor("surfaceDim");

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, backgroundColor: surface },
      ]}
    >
      <View style={styles.leftGroup}>
        <Pressable
          onPress={openDrawer}
          style={[styles.menuButton, { backgroundColor: surfaceDim }]}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Text style={[styles.menuIcon, { color: onSurface }]}>☰</Text>
        </Pressable>
        <View>
          <Text style={[styles.title, { color: onSurface }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
  },
  menuIcon: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: undefined,
  },
  title: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    marginTop: -2,
  },
});
