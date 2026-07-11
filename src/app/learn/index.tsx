import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import ChallengeCard from "../../components/ChallengeCard";
import { loadAllCourses } from "../../utils/courseLoader";
import { Course } from "../../data/types";
import { useThemeContext } from "../../components/ThemeProvider";
import { Colors } from "../../constants/Colors";

export default function Learn() {
 const router = useRouter();
 const [courses, setCourses] = useState<Course[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const { colorScheme } = useThemeContext();
 const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

 useEffect(() => {
 loadAllCourses()
 .then(setCourses)
 .catch((e) => setError(e.message))
 .finally(() => setLoading(false));
 }, []);

 return (
 <View style={[styles.container, { backgroundColor: colors.surface }]}>
 <Header title="p5.js Learn" />
 <FlatList
 style={styles.flatList}
 contentContainerStyle={{ paddingBottom: 32 }}
 ListHeaderComponent={
 <>
 <View style={[styles.heroCard, { backgroundColor: colors.surfaceContainerLow }]}>
 <View style={[styles.heroAccent, { backgroundColor: colors.primary }]} />
 <View style={styles.heroContent}>
 <Text style={[styles.heroTitle, { color: colors.onSurface }]}>
 Start Learning
 </Text>
 <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
 Choose a course to begin your creative coding journey.
 </Text>
 </View>
 <View style={[styles.heroStats, { borderTopColor: colors.outlineVariant + "30" }]}>
 <View style={styles.heroStat}>
 <MaterialCommunityIcons name="book-open-outline" size={18} color={colors.primary} />
 <Text style={[styles.heroStatValue, { color: colors.primary }]}>
 {courses.length}
 </Text>
 <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>
 {courses.length === 1 ? "Course" : "Courses"}
 </Text>
 </View>
 <View style={[styles.heroStatDivider, { backgroundColor: colors.outlineVariant + "30" }]} />
 <View style={styles.heroStat}>
 <MaterialCommunityIcons name="code-braces" size={18} color={colors.primary} />
 <Text style={[styles.heroStatValue, { color: colors.primary }]}>
 {courses.reduce((sum, c) => sum + c.lessons.length, 0)}
 </Text>
 <Text style={[styles.heroStatLabel, { color: colors.textSecondary }]}>
 Lessons
 </Text>
 </View>
 </View>
 </View>

 <Text style={[styles.sectionTitle, { color: colors.primary }]}>
 All Courses
 </Text>
 </>
 }
 data={loading ? [] : courses}
 keyExtractor={(item) => item.slug}
 renderItem={({ item }) => (
 <View style={styles.cardWrapper}>
 <ChallengeCard
 title={item.title}
 moduleName={item.moduleName}
 description={`${item.lessons.length} lesson${item.lessons.length > 1 ? "s" : ""} · ${item.description}`}
 onContinue={() => router.push(`/learn/${item.slug}`)}
 />
 </View>
)}
 ListEmptyComponent={
 loading ? (
 <View style={styles.emptyContainer}>
 <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
 Loading...
 </Text>
 </View>
) : error ? (
 <View style={[styles.errorContainer, { backgroundColor: colors.error + "1A" }]}>
 <Text style={[styles.errorText, { color: colors.error }]}>
 Couldn&apos;t load courses: {error}
 </Text>
 </View>
) : null
 }
 />
 </View>
);
}

const styles = StyleSheet.create({
 container: {
 flex: 1,
 },
 flatList: {
 flex: 1,
 paddingHorizontal: 16,
 paddingTop: 24,
 },
 heroCard: {
 borderRadius: 16,
 marginBottom: 32,
 overflow: "hidden",
 },
 heroAccent: {
 height: 3,
 },
 heroContent: {
 paddingHorizontal: 20,
 paddingTop: 20,
 paddingBottom: 16,
 },
 heroTitle: {
 fontFamily: "JetBrainsMono",
 fontSize: 24,
 fontWeight: "700",
 fontStyle: "italic",
 textTransform: "uppercase",
 },
 heroSubtitle: {
 fontFamily: "JetBrainsMono",
 fontSize: 15,
 marginTop: 8,
 lineHeight: 22,
 },
 heroStats: {
 flexDirection: "row",
 paddingHorizontal: 20,
 paddingVertical: 16,
 borderTopWidth: 1,
 },
 heroStat: {
 flex: 1,
 flexDirection: "row",
 alignItems: "center",
 gap: 8,
 },
 heroStatValue: {
 fontFamily: "JetBrainsMono",
 fontSize: 18,
 fontWeight: "700",
 },
 heroStatLabel: {
 fontFamily: "JetBrainsMono",
 fontSize: 12,
 },
 heroStatDivider: {
 width: 1,
 height: 20,
 marginHorizontal: 12,
 },
 sectionTitle: {
 fontFamily: "JetBrainsMono",
 fontSize: 24,
 fontWeight: "700",
 fontStyle: "italic",
 textTransform: "uppercase",
 marginBottom: 16,
 },
 cardWrapper: {
 marginBottom: 16,
 },
 emptyContainer: {
 alignItems: "center",
 paddingVertical: 48,
 },
  emptyText: {
    fontFamily: "JetBrainsMono",
    fontSize: 16,
  },
 errorContainer: {
 borderRadius: 12,
 paddingHorizontal: 16,
 paddingVertical: 24,
 alignItems: "center",
 },
  errorText: {
    fontFamily: "JetBrainsMono",
    fontSize: 16,
    textAlign: "center",
  },
});
