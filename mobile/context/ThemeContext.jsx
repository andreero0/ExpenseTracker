import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("coffee");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preferences
  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("@theme");
      const savedDarkMode = await AsyncStorage.getItem("@darkMode");

      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
      if (savedDarkMode !== null) {
        setIsDarkMode(savedDarkMode === "true");
      }
    } catch (error) {
      console.error("Failed to load theme preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (theme, darkMode) => {
    try {
      await AsyncStorage.setItem("@theme", theme);
      await AsyncStorage.setItem("@darkMode", darkMode.toString());
    } catch (error) {
      console.error("Failed to save theme preferences:", error);
    }
  };

  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
    saveThemePreference(themeName, isDarkMode);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    saveThemePreference(currentTheme, newDarkMode);
  };

  const getThemeKey = () => {
    return isDarkMode ? `${currentTheme}Dark` : currentTheme;
  };

  const colors = THEMES[getThemeKey()] || THEMES.coffee;

  const value = {
    colors,
    currentTheme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    isLoading,
    availableThemes: ["coffee", "forest", "purple", "ocean"],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ThemeContext.Provider>
  );
};
