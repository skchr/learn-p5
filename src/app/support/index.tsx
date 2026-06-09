import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useThemeColor } from "../../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../../styles/typography";

export default function Support() {
  const surface = useThemeColor("surface");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Header title="Support" />
      <View style={styles.content}>
        <Text style={styles.emoji}>💬</Text>
        <Text style={[styles.heading, { color: onSurface }]}>Coming Soon</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Get help, report issues, or give feedback.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 16,
  },
  heading: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    marginTop: 8,
    textAlign: "center",
  },
});
