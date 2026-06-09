import { useColorScheme } from "react-native";
import { Colors, type ThemeColorKey } from "../constants/Colors";

export function useThemeColor(key: ThemeColorKey) {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"][key];
}
