import { useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "./ThemeProvider";
import { Colors } from "../constants/Colors";
import { Spacing } from "../constants/Spacing";
import { Typography } from "../constants/Typography";

interface QwertyKeyboardProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  onBackspace?: () => void;
  onNewline?: () => void;
  onCursorMove?: (direction: "left" | "right" | "up" | "down") => void;
  onToggleProgramming?: () => void;
  height?: number;
}

interface QwertyKey {
  primary: string;
  secondary?: string;
}

const ROW1: QwertyKey[] = [
  { primary: "q", secondary: "1" },
  { primary: "w", secondary: "2" },
  { primary: "e", secondary: "3" },
  { primary: "r", secondary: "4" },
  { primary: "t", secondary: "5" },
  { primary: "y", secondary: "6" },
  { primary: "u", secondary: "7" },
  { primary: "i", secondary: "8" },
  { primary: "o", secondary: "9" },
  { primary: "p", secondary: "0" },
];

const ROW2: QwertyKey[] = [
  { primary: "a", secondary: "@" },
  { primary: "s", secondary: "$" },
  { primary: "d" },
  { primary: "f" },
  { primary: "g" },
  { primary: "h", secondary: "#" },
  { primary: "j" },
  { primary: "k" },
  { primary: "l", secondary: ";" },
];

const ROW3: QwertyKey[] = [
  { primary: "z" },
  { primary: "x", secondary: "*" },
  { primary: "c", secondary: "(" },
  { primary: "v", secondary: ")" },
  { primary: "b", secondary: "[" },
  { primary: "n", secondary: "]" },
  { primary: "m", secondary: "-" },
  { primary: ",", secondary: "<" },
  { primary: ".", secondary: ">" },
  { primary: "/", secondary: "?" },
];

const LONG_PRESS_DELAY = 200;

export default function QwertyKeyboard({
  onInsert,
  onBackspace,
  onNewline,
  onCursorMove,
  onToggleProgramming,
  height = 280,
}: QwertyKeyboardProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressKey = useRef<string | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);

  const handlePressIn = useCallback((key: QwertyKey) => {
    longPressKey.current = key.primary;
    longPressTimer.current = setTimeout(() => {
      if (longPressKey.current === key.primary) {
        setLongPressActive(true);
      }
    }, LONG_PRESS_DELAY);
  }, []);

  const handlePressOut = useCallback(
    (key: QwertyKey) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      const isLong = longPressActive && longPressKey.current === key.primary;
      setLongPressActive(false);
      longPressKey.current = null;
      if (isLong && key.secondary) {
        onInsert(key.secondary);
      } else {
        onInsert(key.primary);
      }
    },
    [longPressActive, onInsert]
  );

  const renderKey = useCallback(
    (key: QwertyKey) => {
      const isActive = longPressActive && longPressKey.current === key.primary;
      return (
        <Pressable
          key={key.primary}
          onPressIn={() => handlePressIn(key)}
          onPressOut={() => handlePressOut(key)}
          style={({ pressed }) => [
            styles.key,
            {
              backgroundColor: pressed || isActive
                ? colors.primaryContainer
                : colors.surfaceContainer,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={key.primary}
        >
          <Text
            style={[
              isActive && key.secondary ? styles.keySecondary : styles.keyPrimary,
              { color: isActive ? colors.primary : colors.onSurface },
            ]}
          >
            {isActive && key.secondary ? key.secondary : key.primary}
          </Text>
        </Pressable>
      );
    },
    [longPressActive, colors, handlePressIn, handlePressOut]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerLow, height },
      ]}
    >
      <View style={styles.toolbarRow}>
        <View style={styles.toolbarFixed}>
          <Pressable
            onPress={onToggleProgramming}
            style={({ pressed }) => [
              styles.toolbarIcon,
              {
                backgroundColor: pressed
                  ? colors.primaryContainer
                  : colors.primaryContainer + "33",
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Switch to programming keyboard"
          >
            <MaterialCommunityIcons
              name="code-tags"
              size={20}
              color={colors.primary}
            />
          </Pressable>
          <Pressable
            onPress={onBackspace}
            style={({ pressed }) => [
              styles.toolbarIcon,
              {
                backgroundColor: pressed
                  ? colors.outlineVariant
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Backspace"
          >
            <MaterialCommunityIcons
              name="backspace"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
          <Pressable
            onPress={onNewline}
            style={({ pressed }) => [
              styles.toolbarIcon,
              {
                backgroundColor: pressed
                  ? colors.outlineVariant
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="New line"
          >
            <MaterialCommunityIcons
              name="keyboard-return"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
        <View style={styles.spaceRow}>
          <Pressable
            onPress={() => onInsert(" ")}
            style={({ pressed }) => [
              styles.spaceBar,
              {
                backgroundColor: pressed
                  ? colors.primaryContainer
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Space"
          >
            <Text style={[styles.spaceText, { color: colors.onSurfaceVariant }]}>
              space
            </Text>
          </Pressable>
          <View style={styles.dpadSmall}>
            <Pressable
              onPress={() => onCursorMove?.("left")}
              style={({ pressed }) => [
                styles.dpadBtn,
                {
                  backgroundColor: pressed
                    ? colors.primaryContainer
                    : colors.surfaceContainer,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={16}
                color={colors.onSurfaceVariant}
              />
            </Pressable>
            <Pressable
              onPress={() => onCursorMove?.("right")}
              style={({ pressed }) => [
                styles.dpadBtn,
                {
                  backgroundColor: pressed
                    ? colors.primaryContainer
                    : colors.surfaceContainer,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={colors.onSurfaceVariant}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.keysContainer}>
        <View style={styles.row}>{ROW1.map(renderKey)}</View>
        <View style={[styles.row, styles.rowIndent]}>
          {ROW2.map(renderKey)}
        </View>
        <View style={[styles.row, styles.rowIndent2]}>
          {ROW3.map(renderKey)}
        </View>
      </View>
    </View>
  );
}

const KEY_SIZE = 32;
const KEY_GAP = 4;

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xs,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
    marginBottom: 4,
  },
  toolbarFixed: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  toolbarIcon: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.xs,
  },
  spaceRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.xs,
  },
  spaceBar: {
    flex: 1,
    maxWidth: 120,
    paddingVertical: 6,
    borderRadius: Spacing.xs,
    alignItems: "center",
  },
  spaceText: {
    ...Typography.mono,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dpadSmall: {
    flexDirection: "row",
    gap: 2,
  },
  dpadBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  keysContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    gap: KEY_GAP,
  },
  row: {
    flexDirection: "row",
    gap: KEY_GAP,
  },
  rowIndent: {
    paddingLeft: KEY_SIZE * 0.5 + KEY_GAP,
  },
  rowIndent2: {
    paddingLeft: KEY_SIZE * 1.2 + KEY_GAP * 2,
  },
  key: {
    width: KEY_SIZE,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  keyPrimary: {
    ...Typography.mono,
    fontSize: 14,
  },
  keySecondary: {
    ...Typography.mono,
    fontSize: 13,
    fontWeight: "700",
  },
});
