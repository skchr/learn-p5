import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useThemeColor } from "../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../styles/typography";
import { spacing, borderRadius } from "../styles/spacing";

export default function Dashboard() {
  const surface = useThemeColor("surface");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");
  const surfaceDim = useThemeColor("surfaceDim");
  const primary = useThemeColor("primary");

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Header title="Dashboard" />
      <View style={styles.body}>
        <Text style={[styles.greeting, { color: onSurface }]}>
          Hello, Coder!
        </Text>
        <Text style={[styles.levelInfo, { color: textSecondary }]}>
          Level 3 · 84% to next level
        </Text>

        <View
          style={[styles.progressBg, { backgroundColor: surfaceDim }]}
        >
          <View style={[styles.progressFill, { backgroundColor: primary }]} />
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: `${primary}1A` }]}>
            <Text style={[styles.statValue, { color: primary }]}>3</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Level
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: `${primary}1A` }]}>
            <Text style={[styles.statValue, { color: primary }]}>2.4k</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              XP
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: `${primary}1A` }]}>
            <Text style={[styles.statValue, { color: primary }]}>7</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Streak
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: onSurface }]}>
            Quick Actions
          </Text>
          <View style={styles.actionList}>
            <View
              style={[styles.actionCard, { backgroundColor: surfaceDim }]}
            >
              <Text style={[styles.actionTitle, { color: onSurface }]}>
                Continue Learning
              </Text>
              <Text style={[styles.actionSubtitle, { color: textSecondary }]}>
                Pick up where you left off
              </Text>
            </View>
            <View
              style={[styles.actionCard, { backgroundColor: surfaceDim }]}
            >
              <Text style={[styles.actionTitle, { color: onSurface }]}>
                Up next
              </Text>
              <Text style={[styles.actionSubtitle, { color: textSecondary }]}>
                Continue your next exercise
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  greeting: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
  },
  levelInfo: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  progressBg: {
    height: 8,
    borderRadius: borderRadius.full,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "84%",
    borderRadius: borderRadius.full,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    marginTop: 4,
  },
  quickActions: {
    marginTop: 40,
  },
  sectionTitle: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    marginBottom: 16,
  },
  actionList: {
    gap: 12,
  },
  actionCard: {
    borderRadius: borderRadius.xl,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionTitle: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  actionSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
});
