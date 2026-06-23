import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "./ThemeProvider";
import { Colors } from "../constants/Colors";
import { Spacing } from "../constants/Spacing";
import { Typography } from "../constants/Typography";
import { P5_SYMBOLS } from "../data/p5Symbols";

interface P5FunctionDef {
  label: string;
  insert: string;
  paramTypes: ("string" | "number" | "array" | "color" | "boolean")[];
  disabled?: boolean;
}

const p5Functions: P5FunctionDef[] = [
  { label: "setup", insert: "function setup() {\n  \n}", paramTypes: [] },
  { label: "draw", insert: "function draw() {\n  \n}", paramTypes: [] },
  { label: "createCanvas", insert: "createCanvas()", paramTypes: ["number", "number"] },
  { label: "background", insert: "background()", paramTypes: ["number", "string"] },
  { label: "fill", insert: "fill()", paramTypes: ["number", "string"] },
  { label: "circle", insert: "circle()", paramTypes: ["number", "number", "number"] },
  { label: "stroke", insert: "stroke()", paramTypes: ["number", "string"] },
  { label: "strokeWeight", insert: "strokeWeight()", paramTypes: ["number"] },
  { label: "line", insert: "line()", paramTypes: ["number", "number", "number", "number"] },
  { label: "rect", insert: "rect()", paramTypes: ["number", "number", "number", "number"] },
  { label: "ellipse", insert: "ellipse()", paramTypes: ["number", "number", "number", "number"] },
  { label: "noStroke", insert: "noStroke()", paramTypes: [] },
];

type PairedSymbol = {
  open: string;
  close: string;
  display: string;
  hintTrigger: "string" | "array" | null;
};

const pairedSymbols: PairedSymbol[] = [
  { open: "(", close: ")", display: "( )", hintTrigger: null },
  { open: "{", close: "}", display: "{ }", hintTrigger: null },
  { open: "[", close: "]", display: "[ ]", hintTrigger: "array" },
  { open: "<", close: ">", display: "< >", hintTrigger: null },
  { open: '"', close: '"', display: '" "', hintTrigger: "string" },
];

const singleSymbols = [
  ";", ",", "=", "+", "-", "*", "/", ".",
];

interface ProgrammingKeyboardProps {
  onInsert: (text: string, cursorOffset?: number) => void;
  exerciseSymbols?: string[];
  onToggleKeyboard?: () => void;
  onRequestSystemKeyboard?: () => void;
  onBackspace?: () => void;
  onNewline?: () => void;
  onFormat?: () => void;
  onCursorMove?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  keyboardVisible?: boolean;
  usedFunctions?: string[];
  height?: number;
}

export default function ProgrammingKeyboard({ onInsert, exerciseSymbols = [], onToggleKeyboard, onRequestSystemKeyboard, onBackspace, onNewline, onFormat, onCursorMove, keyboardVisible = true, usedFunctions = [], height = 240 }: ProgrammingKeyboardProps) {
  const { colorScheme } = useThemeContext();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [hintType, setHintType] = useState<"string" | "array" | null>(null);
  const [popupSymbol, setPopupSymbol] = useState<string | null>(null);

  const handleFunctionPress = useCallback((fn: P5FunctionDef) => {
    const parenIndex = fn.insert.indexOf("()");
    const cursorOffset = parenIndex >= 0 ? parenIndex + 1 : undefined;
    onInsert(fn.insert, cursorOffset);
    const hasString = fn.paramTypes.some((p) => p === "string");
    const hasArray = fn.paramTypes.some((p) => p === "array");
    if (hasString) {
      setHintType("string");
    } else if (hasArray) {
      setHintType("array");
    } else {
      setHintType(null);
    }
  }, [onInsert]);

  const handleSinglePress = useCallback((sym: string) => {
    setHintType(null);
    onInsert(sym);
  }, [onInsert]);

  const handlePairedPress = useCallback((pair: PairedSymbol) => {
    setHintType(null);
    onInsert(pair.open + pair.close, 1);
  }, [onInsert]);

  const handleExercisePress = useCallback((sym: string) => {
    setHintType(null);
    onInsert(sym + "()", 1);
  }, [onInsert]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLow, height }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.symbolsRow}
        contentContainerStyle={styles.symbolsContent}
      >
        <Pressable
          onPress={keyboardVisible ? onRequestSystemKeyboard : onToggleKeyboard}
          style={({ pressed }) => [
            styles.keyboardIcon,
            { backgroundColor: pressed ? colors.primaryContainer : colors.primaryContainer + "33" },
          ]}
          accessibilityRole="button"
          accessibilityLabel={keyboardVisible ? "Show system keyboard" : "Show in-app keyboard"}
        >
          <MaterialCommunityIcons name={keyboardVisible ? "keyboard-outline" : "keyboard-variant"} size={20} color="#ED225D" />
        </Pressable>
        <Pressable
          onPress={onBackspace}
          style={({ pressed }) => [
            styles.editorBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Backspace"
        >
          <MaterialCommunityIcons name="backspace" size={18} color={colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={onNewline}
          style={({ pressed }) => [
            styles.editorBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="New line"
        >
          <MaterialCommunityIcons name="keyboard-return" size={18} color={colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={onFormat}
          style={({ pressed }) => [
            styles.editorBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Format code"
        >
          <MaterialCommunityIcons name="code-tags" size={18} color={colors.onSurfaceVariant} />
        </Pressable>
        <View style={styles.arrowSeparator} />
        <Pressable
          onPress={() => onCursorMove?.('left')}
          style={({ pressed }) => [
            styles.arrowBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move cursor left"
        >
          <MaterialCommunityIcons name="arrow-left-bold" size={16} color={colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={() => onCursorMove?.('right')}
          style={({ pressed }) => [
            styles.arrowBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move cursor right"
        >
          <MaterialCommunityIcons name="arrow-right-bold" size={16} color={colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={() => onCursorMove?.('up')}
          style={({ pressed }) => [
            styles.arrowBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move cursor up"
        >
          <MaterialCommunityIcons name="arrow-up-bold" size={16} color={colors.onSurfaceVariant} />
        </Pressable>
        <Pressable
          onPress={() => onCursorMove?.('down')}
          style={({ pressed }) => [
            styles.arrowBtn,
            { backgroundColor: pressed ? colors.outlineVariant : colors.surfaceContainer },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move cursor down"
        >
          <MaterialCommunityIcons name="arrow-down-bold" size={16} color={colors.onSurfaceVariant} />
        </Pressable>
        {pairedSymbols.map((pair) => {
          const hinted = pair.hintTrigger && pair.hintTrigger === hintType;
          return (
            <Pressable
              key={pair.display}
              onPress={() => handlePairedPress(pair)}
              style={({ pressed }) => [
                styles.symbolButton,
                {
                  backgroundColor: hinted
                    ? pressed ? colors.primaryContainer : colors.primaryContainer + "4D"
                    : pressed ? colors.outlineVariant : colors.surfaceContainer,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={pair.display}
            >
              <Text style={[styles.symbolText, { color: hinted ? colors.primary : colors.onSurfaceVariant }]}>
                {pair.display}
              </Text>
            </Pressable>
          );
        })}
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

      {exerciseSymbols.length > 0 && (
        <View style={styles.exerciseRow}>
          {exerciseSymbols.map((sym) => (
            <Pressable
              key={sym}
              onPress={() => handleExercisePress(sym)}
              style={({ pressed }) => [
                styles.exerciseKey,
                { backgroundColor: pressed ? colors.primaryContainer : colors.surfaceContainer },
              ]}
              accessibilityRole="button"
              accessibilityLabel={sym}
            >
              <Text style={[styles.exerciseKeyText, { color: colors.primary }]}>
                {sym}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.functionsContainer}>
        {p5Functions.map((fn) => {
          const isDisabled = fn.disabled || usedFunctions.includes(fn.label);
          return (
            <Pressable
              key={fn.label}
              onPress={isDisabled ? undefined : () => handleFunctionPress(fn)}
              onLongPress={() => setPopupSymbol(fn.label)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.functionKey,
                {
                  backgroundColor: isDisabled
                    ? colors.surfaceContainerHigh
                    : pressed
                      ? colors.primaryContainer
                      : colors.surfaceContainerHigh,
                  opacity: isDisabled ? 0.4 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={fn.label}
            >
              <Text style={[styles.functionKeyText, { color: isDisabled ? colors.onSurfaceVariant : colors.primaryFixedDim }]}>
                {fn.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Modal transparent visible={popupSymbol !== null} onRequestClose={() => setPopupSymbol(null)}>
        <Pressable style={styles.popupOverlay} onPress={() => setPopupSymbol(null)}>
          <Pressable style={[styles.popupCard, { backgroundColor: colors.surfaceContainerHigh }]}>
            {popupSymbol && (() => {
              const ref = P5_SYMBOLS.find(s => s.name === popupSymbol);
              return ref ? (
                <>
                  <Text style={[popupTextStyles.popupTitle, { color: colors.onSurface }]}>{ref.syntax}</Text>
                  <Text style={[popupTextStyles.popupDesc, { color: colors.onSurfaceVariant }]}>{ref.description}</Text>
                  {ref.parameters.map(p => (
                    <Text key={p.name} style={[popupTextStyles.popupParam, { color: colors.onSurfaceVariant }]}>
                      <Text style={{ color: colors.primary }}>{p.name}</Text>
                      {' '}({p.type}): {p.description}
                    </Text>
                  ))}
                </>
              ) : (
                <Text style={[popupTextStyles.popupTitle, { color: colors.onSurface }]}>{popupSymbol}</Text>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const popupTextStyles = StyleSheet.create({
  popupTitle: {
    fontFamily: "JetBrainsMono",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  popupDesc: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  popupParam: {
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    paddingLeft: 8,
  },
});

const styles = StyleSheet.create({
  container: {
  },
  symbolsRow: {
    maxHeight: 44,
  },
  symbolsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  keyboardIcon: {
    flexShrink: 0,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.xs,
  },
  editorBtn: {
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.xs,
  },
  arrowSeparator: {
    width: 1,
    height: 18,
    backgroundColor: "#6B7280",
    marginHorizontal: Spacing.xs,
  },
  arrowBtn: {
    flexShrink: 0,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.xs,
  },
  symbolButton: {
    flexShrink: 0,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.xs,
  },
  symbolText: {
    ...Typography.mono,
    fontSize: 18,
  },
  exerciseRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 6,
  },
  exerciseKey: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Spacing.xs,
  },
  exerciseKeyText: {
    ...Typography.monoLabel,
  },
  functionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 6,
  },
  functionKey: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: Spacing.xs,
  },
  functionKeyText: {
    ...Typography.mono,
    fontSize: 15,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupCard: {
    marginHorizontal: Spacing.lg,
    padding: 20,
    borderRadius: 12,
    maxHeight: "60%",
    width: "85%",
  },
});
