import { Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useBottomNavContext } from "../contexts/BottomNavContext";
import { useThemeContext } from "./ThemeProvider";

export default function BottomNavFab() {
  const { toggle, visible } = useBottomNavContext();
  const { derivedColors } = useThemeContext();

  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: pressed ? derivedColors.primaryContainer : derivedColors.primary,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={visible ? "Hide navigation" : "Show navigation"}
    >
      <MaterialCommunityIcons
        name={visible ? "chevron-down" : "chevron-up"}
        size={20}
        color="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    width: 40,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
