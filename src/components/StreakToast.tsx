import { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "./ThemeProvider";
import { Colors } from "../constants/Colors";
import { STREAK_TIERS } from "../hooks/useStreak";

interface StreakToastProps {
  visible: boolean;
  streakCount: number;
  tierProgress: number;
  nextTier: number;
  onDismiss: () => void;
}

export default function StreakToast({
  visible,
  streakCount,
  tierProgress,
  nextTier,
  onDismiss,
}: StreakToastProps) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    if (visible) {
      translateY.setValue(-120);
      progressAnim.setValue(0);
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }).start();
      Animated.timing(progressAnim, {
        toValue: tierProgress,
        duration: 1200,
        useNativeDriver: false,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (!visible) return null;

  const tierIdx = STREAK_TIERS.indexOf(nextTier);
  const prevTier = tierIdx > 0 ? STREAK_TIERS[tierIdx - 1] : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerHighest,
          transform: [{ translateY }],
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="fire" size={22} color="#FF6B35" />
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {streakCount}-day streak!
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {prevTier > 0 ? `${prevTier}+ days` : "Getting started"} · Next tier: {nextTier}d
          </Text>
        </View>
      </View>
      <View style={[styles.progressOuter, { backgroundColor: colors.surfaceDim }]}>
        <Animated.View style={[styles.progressInner, { backgroundColor: colors.primary, width: progressWidth }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: "Inter",
    fontSize: 12,
    marginTop: 1,
  },
  progressOuter: {
    height: 4,
    borderRadius: 9999,
    marginTop: 8,
    overflow: "hidden",
  },
  progressInner: {
    height: "100%",
    borderRadius: 9999,
  },
});
