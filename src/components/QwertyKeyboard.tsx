import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Animated, ScrollView, Platform } from "react-native";
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

type KeyMode = "letters" | "symbols1" | "symbols2";

const KEY_GAP = 6;
const CONTAINER_PADDING = 8;
const UTILITY_HEIGHT = 24;
const TOOLBAR_HEIGHT = 36;
const LONG_PRESS_DELAY = 400;
const REPEAT_INTERVAL = 80;
const POPUP_DURATION = 200;

const LETTER_ROWS = {
  row1: ["1","2","3","4","5","6","7","8","9","0"],
  row2: ["q","w","e","r","t","y","u","i","o","p"],
  row3: ["a","s","d","f","g","h","j","k","l"],
  row4: ["z","x","c","v","b","n","m"],
};

const SYMBOLS1_ROWS = {
  row1: ["1","2","3","4","5","6","7","8","9","0"],
  row2: ["+","\u2212","\u00D7","\u00F7","=","/","(",")","[","]"],
  row3: ["{","}","<",">","$","\u00A3","\u20AC","\u00A5","%"],
  row4: ["^","&","*","@","#","!","?",":",";"],
};

const SYMBOLS2_ROWS = {
  row1: ["1","2","3","4","5","6","7","8","9","0"],
  row2: ["\u2022","\u25CB","\u25A1","\u25C7","\u2606","\u2660","\u2665","\u2666","\u2663"],
  row3: ["\u2605","\u25AA","\u25AB","\u25B2","\u25BC","\u25C0","\u25B6","\u00A7","\u00B6"],
  row4: ["\u2020","\u2021","\u2190","\u2192","\u2191","\u2193","\u2194","\u2195"],
};

const SYMBOL_TOOLBAR_ITEMS = [
  "()", "{}", "[]", '""', "''", "``", "===", ",", ".", "=", ":", "!", "<", ">", "+", "-", "/", "%", "#", "@",
];

const ROW2_COUNT = 10;
const ACTION_KEY_FLEX = 1.5;

function getRowPadding(count: number, hasAction: boolean) {
  const totalUnits = (hasAction ? ACTION_KEY_FLEX : 0) + count;
  const diff = ROW2_COUNT - totalUnits;
  return diff / 2;
}

export default function QwertyKeyboard({
  onInsert,
  onBackspace,
  onNewline,
  onToggleProgramming,
  onDismissKeyboard,
  height = 300,
}: QwertyKeyboardProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [keyMode, setKeyMode] = useState<KeyMode>("letters");
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const repeatChar = useRef<string | null>(null);
  const popupAnim = useRef(new Animated.Value(0)).current;
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupChar, setPopupChar] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0 });
  const keyLayouts = useRef<Record<string, { x: number; w: number }>>({});

  const isDark = colorScheme === "dark";
  const KB_BG = isDark ? "#000000" : "#D1D5DB";
  const KEY_BG = isDark ? "#2C2C2E" : "#FFFFFF";
  const KEY_BG_PRESSED = isDark ? "#3A3A3C" : "#E5E7EB";
  const KEY_TEXT = isDark ? "#FFFFFF" : "#1C1B1F";
  const UTILITY_ICON_OPACITY = 0.4;

  const currentRows = useMemo(() => {
    if (keyMode === "symbols1") return SYMBOLS1_ROWS;
    if (keyMode === "symbols2") return SYMBOLS2_ROWS;
    return LETTER_ROWS;
  }, [keyMode]);

  const ROW_AREA_HEIGHT = height - UTILITY_HEIGHT - TOOLBAR_HEIGHT;
  const ROW_COUNT = 5;
  const keyHeight = Math.max(34, Math.min(Math.floor((ROW_AREA_HEIGHT - (ROW_COUNT - 1) * KEY_GAP) / ROW_COUNT), 46));

  const handleModeToggle = useCallback(() => {
    setKeyMode((prev) => {
      if (prev === "letters") return "symbols1";
      if (prev === "symbols1") return "symbols2";
      return "letters";
    });
  }, []);

  const bottomLeftLabel = keyMode === "letters" ? "!#1" : keyMode === "symbols1" ? "1/2" : "2/2";

  const showPopup = useCallback((char: string, keyX: number) => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    setPopupChar(char);
    setPopupPos({ x: keyX });
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
    }, POPUP_DURATION);
  }, [popupAnim]);

  const startRepeat = useCallback((char: string) => {
    repeatChar.current = char;
    onInsert(char);
    setTimeout(() => {
      if (repeatChar.current === char) {
        repeatTimer.current = setInterval(() => {
          if (repeatChar.current === char) {
            onInsert(char);
          }
        }, REPEAT_INTERVAL);
      }
    }, LONG_PRESS_DELAY);
  }, [onInsert]);

  const stopRepeat = useCallback(() => {
    repeatChar.current = null;
    if (repeatTimer.current) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (repeatTimer.current) clearInterval(repeatTimer.current);
    };
  }, []);

  const handleKeyPressIn = useCallback((char: string) => {
    startRepeat(char);
  }, [startRepeat]);

  const handleKeyPressOut = useCallback((char: string, keyX: number) => {
    const wasRepeating = repeatChar.current === char;
    stopRepeat();
    if (!wasRepeating) {
      onInsert(char);
    }
    showPopup(char, keyX);
  }, [onInsert, showPopup, stopRepeat]);

  const renderKey = useCallback(
    (char: string, flexVal: number = 1) => (
      <Pressable
        key={char}
        onPressIn={() => handleKeyPressIn(char)}
        onPressOut={() => {
          const layout = keyLayouts.current[char];
          handleKeyPressOut(char, layout ? layout.x + layout.w / 2 : 0);
        }}
        onLayout={(e) => {
          if (e.target && (e.target as any).measureInWindow) {
            (e.target as any).measureInWindow((x: number, _y: number, w: number) => {
              keyLayouts.current[char] = { x, w };
            });
          }
        }}
        style={({ pressed }) => ({
          flex: flexVal,
          height: keyHeight,
          borderRadius: 6,
          backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
          alignItems: "center",
          justifyContent: "center",
        })}
        accessibilityRole="button"
        accessibilityLabel={char}
      >
        <Text style={[styles.keyText, { color: KEY_TEXT }]}>
          {char}
        </Text>
      </Pressable>
    ),
    [keyHeight, handleKeyPressIn, handleKeyPressOut, KEY_BG, KEY_BG_PRESSED, KEY_TEXT],
  );

  const renderActionKey = useCallback(
    (type: "backspace" | "enter", flexVal: number = ACTION_KEY_FLEX) => {
      const onPress = type === "backspace" ? onBackspace : onNewline;
      const icon = type === "backspace" ? "backspace" : "keyboard-return";
      const label = type === "backspace" ? "Backspace" : "Enter";
      return (
        <Pressable
          key={type}
          onPress={onPress}
          style={({ pressed }) => ({
            flex: flexVal,
            height: keyHeight,
            borderRadius: 6,
            backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
            alignItems: "center",
            justifyContent: "center",
          })}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <MaterialCommunityIcons name={icon} size={20} color={KEY_TEXT} />
        </Pressable>
      );
    },
    [onBackspace, onNewline, keyHeight, KEY_BG, KEY_BG_PRESSED, KEY_TEXT],
  );

  const renderRow = useCallback(
    (keys: string[], showBackspace: boolean) => {
      const pad = getRowPadding(keys.length, showBackspace);
      return (
        <View style={[styles.row, { gap: KEY_GAP }]}>
          {pad > 0 && <View style={{ flex: pad }} />}
          {keys.map((k) => renderKey(k, 1))}
          {showBackspace && renderActionKey("backspace", ACTION_KEY_FLEX)}
          {pad > 0 && <View style={{ flex: pad }} />}
        </View>
      );
    },
    [renderKey, renderActionKey],
  );

  const handleSymbolToolbarPress = useCallback((s: string) => {
    onInsert(s);
  }, [onInsert]);

  const renderBottomRow = useCallback(
    () => {
      const commaChar = keyMode === "symbols1" ? "_" : keyMode === "symbols2" ? "-" : ",";
      const periodChar = keyMode === "letters" ? "." : keyMode === "symbols1" ? "," : ".";
      return (
        <View style={[styles.row, { gap: KEY_GAP }]}>
          <Pressable
            onPress={handleModeToggle}
            onLongPress={onToggleProgramming}
            style={({ pressed }) => ({
              flex: 1.3,
              height: keyHeight,
              borderRadius: 6,
              backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
              alignItems: "center",
              justifyContent: "center",
            })}
            accessibilityRole="button"
            accessibilityLabel={bottomLeftLabel}
          >
            <Text style={[styles.keyText, { color: KEY_TEXT, fontSize: 13 }]}>
              {bottomLeftLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onInsert(commaChar)}
            style={({ pressed }) => ({
              flex: 0.85,
              height: keyHeight,
              borderRadius: 6,
              backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
              alignItems: "center",
              justifyContent: "center",
            })}
            accessibilityRole="button"
            accessibilityLabel={commaChar}
          >
            <Text style={[styles.keyText, { color: KEY_TEXT }]}>
              {commaChar}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onInsert(" ")}
            onLongPress={onDismissKeyboard}
            style={({ pressed }) => ({
              flex: 4,
              height: keyHeight,
              borderRadius: 6,
              backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
              alignItems: "center",
              justifyContent: "center",
            })}
            accessibilityRole="button"
            accessibilityLabel="Space"
          >
          </Pressable>

          <Pressable
            onPress={() => onInsert(periodChar)}
            style={({ pressed }) => ({
              flex: 0.85,
              height: keyHeight,
              borderRadius: 6,
              backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
              alignItems: "center",
              justifyContent: "center",
            })}
            accessibilityRole="button"
            accessibilityLabel={periodChar}
          >
            <Text style={[styles.keyText, { color: KEY_TEXT }]}>
              {periodChar}
            </Text>
          </Pressable>

          {renderActionKey("enter", 1.5)}
        </View>
      );
    },
    [keyHeight, keyMode, handleModeToggle, onInsert, onDismissKeyboard, onToggleProgramming, bottomLeftLabel, renderActionKey, KEY_BG, KEY_BG_PRESSED, KEY_TEXT],
  );

  const showUtility = onToggleProgramming || onDismissKeyboard;
  const popupBottom = keyHeight * 3 + KEY_GAP * 4 + 12;

  return (
    <View style={[styles.container, { backgroundColor: KB_BG, height }]}>
      {showUtility && (
        <View style={[styles.utilityBar, { height: UTILITY_HEIGHT, borderBottomColor: isDark ? "#1C1C1E" : "#C4C4C6" }]}>
          <View style={{ flex: 1 }} />
          {onToggleProgramming && (
            <Pressable onPress={onToggleProgramming} style={styles.utilityIcon} accessibilityRole="button" accessibilityLabel="Switch keyboard mode">
              <MaterialCommunityIcons name="code-tags" size={13} color={KEY_TEXT} style={{ opacity: UTILITY_ICON_OPACITY }} />
            </Pressable>
          )}
          {onDismissKeyboard && (
            <Pressable onPress={onDismissKeyboard} style={styles.utilityIcon} accessibilityRole="button" accessibilityLabel="Hide keyboard">
              <MaterialCommunityIcons name="chevron-down" size={13} color={KEY_TEXT} style={{ opacity: UTILITY_ICON_OPACITY }} />
            </Pressable>
          )}
        </View>
      )}

      <View style={[styles.toolbarRow, { height: TOOLBAR_HEIGHT, borderBottomColor: isDark ? "#1C1C1E" : "#C4C4C6" }]}>
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
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: pressed ? KEY_BG_PRESSED : "transparent",
                marginHorizontal: 2,
              })}
            >
              <Text style={[styles.symbolToolbarText, { color: KEY_TEXT }]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.keysArea}>
        {renderRow(currentRows.row1, false)}
        {renderRow(currentRows.row2, false)}
        {renderRow(currentRows.row3, false)}
        {renderRow(currentRows.row4, true)}
        {renderBottomRow()}
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
              backgroundColor: KEY_BG_PRESSED,
              bottom: popupBottom,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.popupChar, { color: KEY_TEXT }]}>
            {popupChar}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  utilityBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  utilityIcon: {
    padding: 4,
  },
  toolbarRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  symbolsScrollContent: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  symbolToolbarText: {
    fontFamily: "JetBrainsMono",
    fontSize: 14,
    fontWeight: "700",
  },
  keysArea: {
    paddingHorizontal: CONTAINER_PADDING,
    gap: KEY_GAP,
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  keyText: {
    fontFamily: "JetBrainsMono",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    includeFontPadding: false,
  },
  popup: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: "center",
    minWidth: 40,
  },
  popupChar: {
    fontFamily: "JetBrainsMono",
    fontSize: 24,
    fontWeight: "700",
  },
});
