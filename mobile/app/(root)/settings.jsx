import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/assets/styles/settings.styles";
import { useUser } from "@clerk/clerk-expo";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, currentTheme, isDarkMode, setTheme, toggleDarkMode, availableThemes } = useTheme();

  const themeOptions = [
    { name: "coffee", label: "Coffee", icon: "cafe", color: "#8B593E" },
    { name: "forest", label: "Forest", icon: "leaf", color: "#2E7D32" },
    { name: "purple", label: "Purple", icon: "color-palette", color: "#6A1B9A" },
    { name: "ocean", label: "Ocean", icon: "water", color: "#0277BD" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.white }]}>
                {user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.emailAddresses[0]?.emailAddress || "User"}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textLight }]}>
                Free Plan
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            APPEARANCE
          </Text>
        </View>

        {/* Dark Mode Toggle */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            THEME
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {themeOptions.map((theme, index) => (
            <TouchableOpacity
              key={theme.name}
              style={[
                styles.themeRow,
                index !== themeOptions.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => setTheme(theme.name)}
            >
              <View style={styles.themeLeft}>
                <View
                  style={[
                    styles.themeIcon,
                    { backgroundColor: theme.color + "20" },
                  ]}
                >
                  <Ionicons name={theme.icon} size={24} color={theme.color} />
                </View>
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  {theme.label}
                </Text>
              </View>
              {currentTheme === theme.name && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            SECURITY
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/biometric-setup")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print" size={24} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Biometric Authentication
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            DATA
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.settingRow,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => router.push("/export")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Export Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/currency")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cash-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Currency Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            FEATURES
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.settingRow,
              { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => router.push("/recurring")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="repeat-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Recurring Transactions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/offline")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-offline-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Offline Mode
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>
            ABOUT
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Version
            </Text>
            <Text style={[styles.settingValue, { color: colors.textLight }]}>
              1.1.0
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
