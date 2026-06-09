import { createContext, useContext, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

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
  const [preferredScheme, setPreferredScheme] = useState<ThemeColorScheme | null>(null);

  const colorScheme: ThemeColorScheme = preferredScheme ?? (systemScheme === "dark" ? "dark" : "light");

  const toggleTheme = () => {
    setPreferredScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        toggleTheme,
        setColorScheme: setPreferredScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
