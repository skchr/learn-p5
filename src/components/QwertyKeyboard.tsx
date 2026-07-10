import { useState, useCallback, useRef, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Animated, ScrollView } from "react-native";
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
  onDismissKeyboard?: () => void;
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
];

const SYMBOL_TOOLBAR_ITEMS = [
  "()", "{}", "[]", '""', "''", "``", "===", ",", ".", "=", ":", "!", "<", ">", "+", "-", "/", "%", "#", "@",
];

const LONG_PRESS_DELAY = 200;
const CONTAINER_PADDING = 6;
const KEY_GAP = 5;
const ACTION_KEY_RATIO = 1.4;
const ROW1_LETTER_COUNT = 10;
const ROW1_UNITS = ROW1_LETTER_COUNT + ACTION_KEY_RATIO;
const TOOLBAR_HEIGHT = 40;
const BOTTOM_EXTRA = 4;

export default function QwertyKeyboard({
  onInsert,
  onBackspace,
  onNewline,
  onCursorMove,
  onToggleProgramming,
  onDismissKeyboard,
  height = 300,
}: QwertyKeyboardProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const { width: screenWidth } = useWindowDimensions();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressKey = useRef<string | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);
  const [popupChar, setPopupChar] = useState<string | null>(null);
  const popupAnim = useRef(new Animated.Value(0)).current;
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const keyLayouts = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});

  const dims = useMemo(() => {
    const availWidth = screenWidth - CONTAINER_PADDING * 2;
    const keySize = Math.floor((availWidth - (ROW1_LETTER_COUNT + 1) * KEY_GAP) / ROW1_UNITS);
    const rowsArea = height - TOOLBAR_HEIGHT - BOTTOM_EXTRA;
    const targetHeight = Math.min(keySize, Math.floor((rowsArea - KEY_GAP * 3) / 4));
    const keyHeight = Math.max(38, Math.min(targetHeight, 48));
    return {
      keySize,
      actionKeyWidth: Math.floor(keySize * ACTION_KEY_RATIO),
      keyHeight,
    };
  }, [screenWidth, height]);

  const showPopup = useCallback((char: string, x: number, y: number) => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    setPopupChar(char);
    setPopupPos({ x, y });
    popupAnim.setValue(0);
    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
    popupTimer.current = setTimeout(() => {
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => setPopupChar(null));
    }, 200);
  }, [popupAnim]);

  const handlePressIn = useCallback((key: QwertyLetterKey) => {
    longPressKey.current = key.primary;
    longPressTimer.current = setTimeout(() => {
      if (longPressKey.current === key.primary) {
        setLongPressActive(true);
      }
    }, LONG_PRESS_DELAY);
  }, []);

  const handlePressOut = useCallback(
    (key: QwertyLetterKey, keyX: number, keyY: number) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      const isLong = longPressActive && longPressKey.current === key.primary;
      setLongPressActive(false);
      longPressKey.current = null;
      const char = isLong && key.secondary ? key.secondary : key.primary;
      onInsert(char);
      showPopup(char, keyX, keyY);
    },
    [longPressActive, onInsert, showPopup]
  );

  const handleSpacePress = useCallback(() => {
    onInsert(" ");
  }, [onInsert]);

  const handleSymbolToolbarPress = useCallback((s: string) => {
    onInsert(s);
  }, [onInsert]);

  const renderLetterKey = useCallback(
    (key: QwertyLetterKey, rowIdx: number, colIdx: number) => {
      const isActive = longPressActive && longPressKey.current === key.primary;
      const keyW = dims.keySize;
      const keyH = dims.keyHeight;
      return (
        <Pressable
          key={key.primary}
          onPressIn={() => handlePressIn(key)}
          onPressOut={() => handlePressOut(key, colIdx * (keyW + KEY_GAP) + keyW / 2, 0)}
          onLayout={(e) => {
            e.target.measureInWindow((x, y, w, h) => {
              keyLayouts.current[key.primary] = { x, y, w, h };
            });
          }}
          style={({ pressed }) => [
            {
              width: keyW,
              height: keyH,
              borderRadius: Math.min(keyH / 2.5, 10),
              alignItems: "center",
              justifyContent: "center",
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
    [longPressActive, colors, handlePressIn, handlePressOut, dims]
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
            {
              width: dims.actionKeyWidth,
              height: dims.keyHeight,
              borderRadius: Math.min(dims.keyHeight / 2.5, 10),
              alignItems: "center",
              justifyContent: "center",
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
    [onBackspace, onNewline, colors, dims]
  );

  const renderKey = useCallback(
    (key: QwertyKey, rowIdx: number, colIdx: number) => {
      if (key.type === "action") return renderActionKey(key);
      return renderLetterKey(key, rowIdx, colIdx);
    },
    [renderLetterKey, renderActionKey]
  );

  const popupBottom = dims.keyHeight * 3 + KEY_GAP * 4 + 12;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerLow, height },
      ]}
    >
      <View style={[styles.toolbarRow, { borderBottomColor: colors.outlineVariant + "33" }]}>
        <Pressable
          onPress={onToggleProgramming}
          style={({ pressed }) => ({
            padding: 6,
            borderRadius: 8,
            backgroundColor: pressed ? colors.primaryContainer : "transparent",
          })}
          accessibilityRole="button"
          accessibilityLabel="Switch to programming keyboard"
        >
          <MaterialCommunityIcons name="code-tags" size={18} color={colors.primary} />
        </Pressable>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.symbolsScrollContent}
          keyboardShouldPersistTaps="always"
        >
          {SYMBOL_TOOLBAR_ITEMS.map((s) => (
            <Pressable
              key={s}
              onPress={() => handleSymbolToolbarPress(s)}
              style={({ pressed }) => ({
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: pressed ? colors.primaryContainer : colors.surfaceContainer,
                marginHorizontal: 2,
              })}
            >
              <Text style={[styles.symbolToolbarText, { color: colors.onSurface }]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          onPress={onDismissKeyboard}
          style={({ pressed }) => ({
            padding: 6,
            borderRadius: 8,
            backgroundColor: pressed ? colors.primaryContainer : "transparent",
          })}
          accessibilityRole="button"
          accessibilityLabel="Hide keyboard"
        >
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <View style={styles.keysContainer}>
        <View style={[styles.row, { gap: KEY_GAP }]}>
          {ROW1.map((key, i) => renderKey(key, 0, i))}
        </View>
        <View style={[styles.row, { gap: KEY_GAP }, { paddingLeft: dims.keySize * 0.5 + KEY_GAP }]}>
          {ROW2.map((key, i) => renderKey(key, 1, i))}
        </View>
        <View style={[styles.row, { gap: KEY_GAP }, { paddingLeft: dims.keySize * 1.4 + KEY_GAP * 2 }]}>
          {ROW3.map((key, i) => renderKey(key, 2, i))}
        </View>

        <View style={[styles.bottomRow, { gap: KEY_GAP }]}>
          <Pressable
            onPress={() => onCursorMove?.("left")}
            style={({ pressed }) => [
              styles.navKey,
              {
                width: dims.keySize + 4,
                height: dims.keyHeight,
                borderRadius: Math.min(dims.keyHeight / 2.5, 10),
                backgroundColor: pressed
                  ? colors.primaryContainer
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Move cursor left"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </Pressable>

          <Pressable
            onPress={handleSpacePress}
            style={({ pressed }) => [
              styles.spaceBar,
              {
                height: dims.keyHeight,
                borderRadius: Math.min(dims.keyHeight / 2.5, 10),
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

          <Pressable
            onPress={() => onCursorMove?.("right")}
            style={({ pressed }) => [
              styles.navKey,
              {
                width: dims.keySize + 4,
                height: dims.keyHeight,
                borderRadius: Math.min(dims.keyHeight / 2.5, 10),
                backgroundColor: pressed
                  ? colors.primaryContainer
                  : colors.surfaceContainer,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Move cursor right"
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </View>

      {popupChar !== null && (
        <Animated.View
          style={[
            styles.popup,
            {
              opacity: popupAnim,
              transform: [
                { translateX: popupPos.x },
                { scale: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
              ],
              backgroundColor: colors.surfaceContainerHigh,
              borderColor: colors.outlineVariant,
              bottom: popupBottom,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.popupChar, { color: colors.onSurface }]}>
            {popupChar}
          </Text>
          <View style={[styles.popupArrow, { borderTopColor: colors.surfaceContainerHigh }]} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    height: TOOLBAR_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  symbolsScrollContent: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  symbolToolbarText: {
    fontFamily: "JetBrainsMono",
    fontSize: 14,
    fontWeight: "700",
  },
  keysContainer: {
    alignItems: "center",
    paddingHorizontal: CONTAINER_PADDING,
    gap: KEY_GAP,
    paddingTop: 6,
  },
  row: {
    flexDirection: "row",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 2,
  },
  keyPrimary: {
    ...Typography.mono,
    fontSize: 17,
  },
  keySecondary: {
    ...Typography.mono,
    fontSize: 15,
    fontWeight: "700",
  },
  navKey: {
    alignItems: "center",
    justifyContent: "center",
  },
  spaceBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spaceText: {
    ...Typography.mono,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  popup: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  popupArrow: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  popupChar: {
    fontFamily: "JetBrainsMono",
    fontSize: 28,
    fontWeight: "700",
  },
});
