import { createContext, useContext, useState, type ReactNode } from "react";
import { View, useColorScheme } from "react-native";

type ThemeColorScheme = "light" | "dark";

interface ThemeContextValue {
  colorScheme: ThemeColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ThemeColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: "light",
  toggleTheme: () => {},
  setColorScheme: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [manualScheme, setManualScheme] = useState<ThemeColorScheme | null>(
    null,
  );

  const colorScheme: ThemeColorScheme =
    manualScheme ?? (systemScheme === "dark" ? "dark" : "light");

  const toggleTheme = () => {
    setManualScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setColorScheme = (scheme: ThemeColorScheme) => {
    setManualScheme(scheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme, setColorScheme }}>
      <View
        className={`flex-1 ${colorScheme === "dark" ? "dark" : ""}`}
        style={{
          backgroundColor: colorScheme === "dark" ? "#121212" : "#FFFFFF",
        }}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
