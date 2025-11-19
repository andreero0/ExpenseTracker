// constants/colors.js

// Light themes
const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
  isDark: false,
};

const forestTheme = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  expense: "#C62828",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
  isDark: false,
};

const purpleTheme = {
  primary: "#6A1B9A",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BA68C8",
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
  isDark: false,
};

const oceanTheme = {
  primary: "#0277BD",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  expense: "#EF5350",
  income: "#26A69A",
  card: "#FFFFFF",
  shadow: "#000000",
  isDark: false,
};

// Dark themes
const coffeeDarkTheme = {
  primary: "#C88A6E",
  background: "#1A1410",
  text: "#E8DED5",
  border: "#3D2E23",
  white: "#1F1A16",
  textLight: "#B8A99D",
  expense: "#FF6B6B",
  income: "#51CF66",
  card: "#2A211B",
  shadow: "#000000",
  isDark: true,
};

const forestDarkTheme = {
  primary: "#66BB6A",
  background: "#0D1F0F",
  text: "#C8E6C9",
  border: "#1B5E20",
  white: "#162118",
  textLight: "#81C784",
  expense: "#EF5350",
  income: "#66BB6A",
  card: "#1B3319",
  shadow: "#000000",
  isDark: true,
};

const purpleDarkTheme = {
  primary: "#BA68C8",
  background: "#1A0D24",
  text: "#E1BEE7",
  border: "#4A148C",
  white: "#1F1525",
  textLight: "#CE93D8",
  expense: "#EF5350",
  income: "#66BB6A",
  card: "#2D1B3D",
  shadow: "#000000",
  isDark: true,
};

const oceanDarkTheme = {
  primary: "#4FC3F7",
  background: "#0A1929",
  text: "#B3E5FC",
  border: "#01579B",
  white: "#132F4C",
  textLight: "#81D4FA",
  expense: "#FF6B6B",
  income: "#4DD0E1",
  card: "#1A2F42",
  shadow: "#000000",
  isDark: true,
};

export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  coffeeDark: coffeeDarkTheme,
  forestDark: forestDarkTheme,
  purpleDark: purpleDarkTheme,
  oceanDark: oceanDarkTheme,
};

// Default theme (will be overridden by ThemeContext)
export const COLORS = THEMES.coffee;
