import { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const KEY_GAP = 4;
const CONTAINER_PADDING = 8;
const UTILITY_HEIGHT = 22;
const SYSTEM_FONT = Platform.select({ default: "System" });

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
  const [keyMode, setKeyMode] = useState<KeyMode>("letters");

  const KB_BG = "#000000";
  const KEY_BG = "#2C2C2E";
  const KEY_BG_PRESSED = "#3A3A3C";
  const KEY_TEXT = "#FFFFFF";

  const currentRows = useMemo(() => {
    if (keyMode === "symbols1") return SYMBOLS1_ROWS;
    if (keyMode === "symbols2") return SYMBOLS2_ROWS;
    return LETTER_ROWS;
  }, [keyMode]);

  const ROW_COUNT = 5;

  const keyHeight = useMemo(() => {
    const available = height - UTILITY_HEIGHT - (ROW_COUNT - 1) * KEY_GAP;
    return Math.max(30, Math.min(Math.floor(available / ROW_COUNT), 52));
  }, [height]);

  const handleModeToggle = useCallback(() => {
    setKeyMode((prev) => {
      if (prev === "letters") return "symbols1";
      if (prev === "symbols1") return "symbols2";
      return "letters";
    });
  }, []);

  const bottomLeftLabel = keyMode === "letters" ? "!#1" : keyMode === "symbols1" ? "1/2" : "2/2";

  const renderKey = useCallback(
    (char: string, flexVal: number = 1) => (
      <Pressable
        key={char}
        onPress={() => onInsert(char)}
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
    [onInsert, keyHeight],
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
    [onBackspace, onNewline, keyHeight],
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
            <Text style={[styles.spaceText, { color: "#8E8E93" }]}>
              {keyMode === "letters" ? "English (UK)" : ""}
            </Text>
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
    [keyHeight, keyMode, handleModeToggle, onInsert, onDismissKeyboard, onToggleProgramming, bottomLeftLabel, renderActionKey],
  );

  const showUtility = onToggleProgramming || onDismissKeyboard;

  return (
    <View style={[styles.container, { backgroundColor: KB_BG, height }]}>
      {showUtility && (
        <View style={[styles.utilityBar, { height: UTILITY_HEIGHT }]}>
          <View style={{ flex: 1 }} />
          {onToggleProgramming && (
            <Pressable onPress={onToggleProgramming} style={styles.utilityIcon} accessibilityRole="button" accessibilityLabel="Switch keyboard mode">
              <MaterialCommunityIcons name="code-tags" size={13} color={KEY_TEXT} style={{ opacity: 0.35 }} />
            </Pressable>
          )}
          {onDismissKeyboard && (
            <Pressable onPress={onDismissKeyboard} style={styles.utilityIcon} accessibilityRole="button" accessibilityLabel="Hide keyboard">
              <MaterialCommunityIcons name="chevron-down" size={13} color={KEY_TEXT} style={{ opacity: 0.35 }} />
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.keysArea}>
        {renderRow(currentRows.row1, false)}
        {renderRow(currentRows.row2, false)}
        {renderRow(currentRows.row3, false)}
        {renderRow(currentRows.row4, true)}
        {renderBottomRow()}
      </View>
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
  },
  utilityIcon: {
    padding: 4,
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
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    includeFontPadding: false,
  },
  spaceText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    includeFontPadding: false,
  },
});
