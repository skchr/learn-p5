import { useCallback } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "./ThemeProvider";
import { Colors } from "../constants/Colors";
import { Typography } from "../constants/Typography";
import { pairedSymbols, singleSymbols } from "../data/keyboardLayout";

interface SymbolsToolbarProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  onToggleKeyboardMode: () => void;
  keyboardMode: "programming" | "qwerty";
}

export default function SymbolsToolbar({
  onInsert,
  onToggleKeyboardMode,
  keyboardMode,
}: SymbolsToolbarProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const handleSinglePress = useCallback((sym: string) => {
    onInsert(sym);
  }, [onInsert]);

  const handlePairedPress = useCallback((open: string, close: string) => {
    onInsert(open + close, 1);
  }, [onInsert]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLow }]}>
      <View style={styles.toolbarRow}>
        <Pressable
          onPress={onToggleKeyboardMode}
          style={({ pressed }) => [
            styles.modeToggle,
            { backgroundColor: pressed ? colors.primaryContainer : colors.primaryContainer + "33" },
          ]}
          accessibilityRole="button"
          accessibilityLabel={keyboardMode === "programming" ? "QWERTY keyboard" : "Programming keyboard"}
        >
          <MaterialCommunityIcons
            name={keyboardMode === "programming" ? "keyboard" : "code-tags"}
            size={20}
            color={colors.primary}
          />
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.symbolsScroll}
          contentContainerStyle={styles.symbolsContent}
        >
          {pairedSymbols.map((pair) => (
            <Pressable
              key={pair.display}
              onPress={() => handlePairedPress(pair.open, pair.close)}
              style={({ pressed }) => [
                styles.symbolButton,
                { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
              ]}
              accessibilityRole="button"
              accessibilityLabel={pair.display}
            >
              <Text style={[styles.symbolText, { color: colors.onSurfaceVariant }]}>
                {pair.display}
              </Text>
            </Pressable>
          ))}
          {singleSymbols.map((sym) => (
            <Pressable
              key={sym}
              onPress={() => handleSinglePress(sym)}
              style={({ pressed }) => [
                styles.symbolButton,
                { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
              ]}
              accessibilityRole="button"
              accessibilityLabel={sym}
            >
              <Text style={[styles.symbolText, { color: colors.onSurfaceVariant }]}>
                {sym}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 8,
  },
  modeToggle: {
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 6,
  },
  symbolsScroll: {
    flex: 1,
  },
  symbolsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: 4,
  },
  symbolButton: {
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  symbolText: {
    ...Typography.mono,
    fontSize: 16,
  },
});
