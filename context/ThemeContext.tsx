import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const lightColors = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  shadow: '#000000',
  cardBackground: '#ffffff',
  headerBackground: '#ffffff',
  inputBackground: '#ffffff',
};

const darkColors = {
  primary: '#60a5fa',
  primaryLight: '#1e3a5f',
  danger: '#f87171',
  dangerLight: '#3b1f1f',
  background: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  shadow: '#000000',
  cardBackground: '#1e293b',
  headerBackground: '#1e293b',
  inputBackground: '#334155',
};

type Theme = 'light' | 'dark';
type Colors = typeof lightColors;

type ThemeContextType = {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    AsyncStorage.getItem("theme").then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const colors = theme === 'dark' ? darkColors : lightColors;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
