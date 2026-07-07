import { useState, useCallback, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "./ThemeProvider";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";

interface QwertyKeyboardProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  onBackspace?: () => void;
  onNewline?: () => void;
  onCursorMove?: (direction: "left" | "right" | "up" | "down") => void;
  onToggleProgramming?: () => void;
  height?: number;
}

interface QwertyLetterKey {
  type: "letter";
  primary: string;
  secondary?: string;
}

interface QwertyActionKey {
  type: "action";
  action: "backspace" | "enter";
}

type QwertyKey = QwertyLetterKey | QwertyActionKey;

const ROW1: QwertyKey[] = [
  { type: "letter", primary: "q", secondary: "1" },
  { type: "letter", primary: "w", secondary: "2" },
  { type: "letter", primary: "e", secondary: "3" },
  { type: "letter", primary: "r", secondary: "4" },
  { type: "letter", primary: "t", secondary: "5" },
  { type: "letter", primary: "y", secondary: "6" },
  { type: "letter", primary: "u", secondary: "7" },
  { type: "letter", primary: "i", secondary: "8" },
  { type: "letter", primary: "o", secondary: "9" },
  { type: "letter", primary: "p", secondary: "0" },
  { type: "action", action: "backspace" },
];

const ROW2: QwertyKey[] = [
  { type: "letter", primary: "a", secondary: "@" },
  { type: "letter", primary: "s", secondary: "$" },
  { type: "letter", primary: "d" },
  { type: "letter", primary: "f" },
  { type: "letter", primary: "g" },
  { type: "letter", primary: "h", secondary: "#" },
  { type: "letter", primary: "j" },
  { type: "letter", primary: "k" },
  { type: "letter", primary: "l", secondary: ";" },
  { type: "action", action: "enter" },
];

const ROW3: QwertyKey[] = [
  { type: "letter", primary: "z" },
  { type: "letter", primary: "x", secondary: "*" },
  { type: "letter", primary: "c", secondary: "(" },
  { type: "letter", primary: "v", secondary: ")" },
  { type: "letter", primary: "b", secondary: "[" },
  { type: "letter", primary: "n", secondary: "]" },
  { type: "letter", primary: "m", secondary: "-" },
  { type: "letter", primary: ",", secondary: "<" },
  { type: "letter", primary: ".", secondary: ">" },
  { type: "letter", primary: "/", secondary: "?" },
];

const LONG_PRESS_DELAY = 200;
const KEY_SIZE = 42;
const KEY_GAP = 6;
const ACTION_KEY_WIDTH = KEY_SIZE * 1.6;

export default function QwertyKeyboard({
  onInsert,
  onBackspace,
  onNewline,
  onCursorMove,
  onToggleProgramming,
  height = 300,
}: QwertyKeyboardProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressKey = useRef<string | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);

  const handlePressIn = useCallback((key: QwertyLetterKey) => {
    longPressKey.current = key.primary;
    longPressTimer.current = setTimeout(() => {
      if (longPressKey.current === key.primary) {
        setLongPressActive(true);
      }
    }, LONG_PRESS_DELAY);
  }, []);

  const handlePressOut = useCallback(
    (key: QwertyLetterKey) => {
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

  const renderLetterKey = useCallback(
    (key: QwertyLetterKey) => {
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

  const renderActionKey = useCallback(
    (key: QwertyActionKey) => {
      const isBackspace = key.action === "backspace";
      const onPress = isBackspace ? onBackspace : onNewline;
      const iconName = isBackspace ? "backspace" : "keyboard-return";
      const label = isBackspace ? "Backspace" : "Enter";
      return (
        <Pressable
          key={key.action}
          onPress={onPress}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: pressed
                ? colors.primaryContainer
                : colors.surfaceContainer,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      );
    },
    [onBackspace, onNewline, colors]
  );

  const renderKey = useCallback(
    (key: QwertyKey) => {
      if (key.type === "action") return renderActionKey(key);
      return renderLetterKey(key);
    },
    [renderLetterKey, renderActionKey]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerLow, height },
      ]}
    >
      <View style={styles.keysContainer}>
        <View style={styles.row}>{ROW1.map(renderKey)}</View>
        <View style={[styles.row, styles.rowIndent]}>
          {ROW2.map(renderKey)}
        </View>
        <View style={[styles.row, styles.rowIndent2]}>
          {ROW3.map(renderKey)}
        </View>

        <View style={styles.bottomRow}>
          <Pressable
            onPress={onToggleProgramming}
            style={({ pressed }) => [
              styles.toolBtn,
              {
                backgroundColor: pressed
                  ? colors.primaryContainer
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Switch to programming keyboard"
          >
            <MaterialCommunityIcons
              name="code-tags"
              size={22}
              color={colors.primary}
            />
          </Pressable>

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

          <View style={styles.dpadGroup}>
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
                size={20}
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
                size={20}
                color={colors.onSurfaceVariant}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  keysContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
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
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionKey: {
    width: ACTION_KEY_WIDTH,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  keyPrimary: {
    ...Typography.mono,
    fontSize: 16,
  },
  keySecondary: {
    ...Typography.mono,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: KEY_GAP,
    width: "100%",
    paddingHorizontal: 4,
  },
  toolBtn: {
    width: KEY_SIZE + 8,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  spaceBar: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  spaceText: {
    ...Typography.mono,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dpadGroup: {
    flexDirection: "row",
    gap: KEY_GAP,
  },
  dpadBtn: {
    width: KEY_SIZE + 8,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
