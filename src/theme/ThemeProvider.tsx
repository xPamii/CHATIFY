import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme, useColorScheme } from "nativewind";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export type ThemeOption = "light" | "dark" | "system";

const THEME_KEY = "@app_color_scheme";

type ThemeContextType = {
  preference: ThemeOption;
  applied: "light" | "dark"; // use on runtime
  setPreference: (themeOption: ThemeOption) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [getPreferenceState, setPreferenceState] =
    useState<ThemeOption>("system");
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          setPreferenceState(savedTheme);
          setColorScheme(savedTheme);
        } else {
          setPreferenceState("system");
          setColorScheme("system");
        }
      } catch (error) {
        console.warn("Failed to load theme: " + error);
      } finally {
        setReady(true);
      }
    })();
  }, [setColorScheme]);

  const setPreference = async (themeOption: ThemeOption) => {
    try {
      if (themeOption === "system") {
        await AsyncStorage.removeItem(THEME_KEY);
        setPreferenceState("system");
        setColorScheme("system");
      } else {
        await AsyncStorage.setItem(THEME_KEY, themeOption);
        setPreferenceState(themeOption);
        setColorScheme(themeOption);
      }
    } catch (error) {
      console.warn("Failed to save theme: " + error);
    }
  };

  if (!isReady) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ThemeContext.Provider
      value={{
        preference: getPreferenceState,
        applied: colorScheme ?? "light",
        setPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
