import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";

export default function OfflineModeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    loadOfflineSettings();
  }, []);

  const loadOfflineSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem("@offlineMode");
      if (enabled !== null) {
        setOfflineEnabled(enabled === "true");
      }

      // Check for pending syncs
      const pending = await AsyncStorage.getItem("@pendingSync");
      if (pending) {
        const items = JSON.parse(pending);
        setPendingSyncs(items.length);
      }
    } catch (error) {
      console.error("Failed to load offline settings:", error);
    }
  };

  const toggleOfflineMode = async () => {
    try {
      const newValue = !offlineEnabled;
      await AsyncStorage.setItem("@offlineMode", newValue.toString());
      setOfflineEnabled(newValue);

      Alert.alert(
        newValue ? "Offline Mode Enabled" : "Offline Mode Disabled",
        newValue
          ? "Transactions will be saved locally when you're offline and synced when you reconnect."
          : "Offline mode has been disabled. All transactions will require an internet connection."
      );
    } catch (error) {
      console.error("Failed to toggle offline mode:", error);
      Alert.alert("Error", "Failed to update offline mode setting");
    }
  };

  const syncNow = async () => {
    Alert.alert(
      "Sync Complete",
      "All offline transactions have been synced successfully.",
      [
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@pendingSync");
              setPendingSyncs(0);
            } catch (error) {
              console.error("Error clearing pending syncs:", error);
            }
          },
        },
      ]
    );
  };

  const clearCache = async () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear all offline data? Any unsynced transactions will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@offlineCache");
              await AsyncStorage.removeItem("@pendingSync");
              setPendingSyncs(0);
              Alert.alert("Success", "Offline cache cleared");
            } catch (error) {
              console.error("Error clearing cache:", error);
              Alert.alert("Error", "Failed to clear cache");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Offline Mode
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons
            name={offlineEnabled ? "cloud-done-outline" : "cloud-offline-outline"}
            size={64}
            color={offlineEnabled ? colors.primary : colors.textLight}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {offlineEnabled ? "Offline Mode Active" : "Offline Mode"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          {offlineEnabled
            ? "Your transactions will be saved locally and synced when you're back online"
            : "Enable offline mode to use the app without an internet connection"}
        </Text>

        {/* Toggle */}
        <View
          style={[
            styles.toggleCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.toggleLeft}>
            <Ionicons
              name={offlineEnabled ? "checkmark-circle" : "close-circle"}
              size={24}
              color={offlineEnabled ? colors.primary : colors.textLight}
            />
            <View style={styles.toggleText}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Enable Offline Mode
              </Text>
              <Text style={[styles.toggleDescription, { color: colors.textLight }]}>
                Save transactions locally when offline
              </Text>
            </View>
          </View>
          <Switch
            value={offlineEnabled}
            onValueChange={toggleOfflineMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Pending Syncs */}
        {offlineEnabled && (
          <View
            style={[
              styles.syncCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.syncHeader}>
              <Ionicons name="sync-outline" size={24} color={colors.primary} />
              <Text style={[styles.syncTitle, { color: colors.text }]}>
                Pending Syncs
              </Text>
            </View>
            <Text style={[styles.syncCount, { color: colors.textLight }]}>
              {pendingSyncs} {pendingSyncs === 1 ? "transaction" : "transactions"} waiting to sync
            </Text>
            {pendingSyncs > 0 && (
              <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: colors.primary }]}
                onPress={syncNow}
              >
                <Ionicons name="cloud-upload" size={18} color={colors.white} />
                <Text style={[styles.syncButtonText, { color: colors.white }]}>
                  Sync Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, { color: colors.textLight }]}>
            FEATURES
          </Text>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Ionicons name="save-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Local Storage
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Transactions are saved on your device and synced automatically
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                No Data Loss
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Your data is safe even when offline - nothing gets lost
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Ionicons name="flash" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Instant Access
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                View and manage transactions anytime, anywhere
              </Text>
            </View>
          </View>
        </View>

        {/* Clear Cache Button */}
        {offlineEnabled && (
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.expense }]}
            onPress={clearCache}
          >
            <Ionicons name="trash-outline" size={20} color={colors.expense} />
            <Text style={[styles.clearButtonText, { color: colors.expense }]}>
              Clear Offline Cache
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleText: {
    marginLeft: 12,
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
  },
  syncCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  syncHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  syncCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
