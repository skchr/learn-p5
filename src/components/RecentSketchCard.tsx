import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../styles/typography";
import { spacing, borderRadius } from "../styles/spacing";

interface RecentSketchCardProps {
  title: string;
  timeAgo: string;
  thumbnailLabel: string;
  onPress: () => void;
}

export default function RecentSketchCard({
  title,
  timeAgo,
  thumbnailLabel,
  onPress,
}: RecentSketchCardProps) {
  const surfaceDim = useThemeColor("surfaceDim");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");
  const primary = useThemeColor("primary");

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: surfaceDim }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${timeAgo}`}
    >
      <View style={[styles.thumbnail, { backgroundColor: `${primary}1A` }]}>
        <Text style={[styles.thumbnailText, { color: primary }]}>
          {thumbnailLabel}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: onSurface }]}>{title}</Text>
        <Text style={[styles.timeAgo, { color: textSecondary }]}>
          {timeAgo}
        </Text>
      </View>
      <Text style={[styles.icon, { color: textSecondary }]}>open_in_new</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    lineHeight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  timeAgo: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  icon: {
    fontSize: fontSize.lg,
  },
});
