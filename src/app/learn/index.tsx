import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { useThemeColor } from "../../hooks/useThemeColor";
import { fontFamily, fontSize, fontWeight } from "../../styles/typography";
import { spacing, borderRadius } from "../../styles/spacing";
import { getCourses, getExercisesByCourse } from "../../data/exercises";

export default function LearnIndex() {
  const router = useRouter();
  const courses = getCourses();
  const surface = useThemeColor("surface");
  const onSurface = useThemeColor("onSurface");
  const textSecondary = useThemeColor("textSecondary");
  const surfaceDim = useThemeColor("surfaceDim");
  const primary = useThemeColor("primary");
  const outlineVariant = useThemeColor("outlineVariant");

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Header title="Learn" />
      <ScrollView contentContainerStyle={styles.body}>
        {courses.map((course) => {
          const exercises = getExercisesByCourse(course.id);
          return (
            <View key={course.id} style={styles.section}>
              <Text style={[styles.courseTitle, { color: onSurface }]}>
                {course.title}
              </Text>

              <View style={styles.exerciseList}>
                {exercises.map((exercise) => {
                  const completed = course.completedIds.includes(exercise.id);
                  return (
                    <Pressable
                      key={exercise.id}
                      onPress={() =>
                        router.push(
                          `/learn/${course.id}/${exercise.id}`
                        )
                      }
                      style={({ pressed }) => [
                        styles.card,
                        { backgroundColor: surfaceDim },
                        pressed && styles.cardPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${exercise.title}`}
                    >
                      <View style={styles.cardBody}>
                        <Text
                          style={[
                            styles.cardTitle,
                            { color: onSurface },
                          ]}
                        >
                          {exercise.title}
                        </Text>
                        <Text
                          style={[
                            styles.cardDesc,
                            { color: textSecondary },
                          ]}
                          numberOfLines={2}
                        >
                          {exercise.description}
                        </Text>
                      </View>
                      {completed && (
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: primary },
                          ]}
                        >
                          <Text style={styles.badgeText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[6],
  },
  courseTitle: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    marginBottom: spacing[3],
  },
  exerciseList: {
    gap: spacing[3],
  },
  card: {
    flexDirection: "row",
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.headline,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  cardDesc: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    marginTop: spacing[1],
    lineHeight: 20,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing[3],
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
});
