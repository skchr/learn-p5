import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../styles/typography";
import { spacing, borderRadius } from "../styles/spacing";

interface StatItem {
  icon: string;
  value: string;
  label: string;
}

interface StatsCardProps {
  items: StatItem[];
}

export default function StatsCard({ items }: StatsCardProps) {
  const surfaceDim = useThemeColor("surfaceDim");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[styles.item, { backgroundColor: surfaceDim }]}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <View>
            <Text style={[styles.value, { color: onSurface }]}>
              {item.value}
            </Text>
            <Text style={[styles.label, { color: textSecondary }]}>
              {item.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing[4],
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  icon: {
    fontSize: fontSize.lg,
  },
  value: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
  },
});
