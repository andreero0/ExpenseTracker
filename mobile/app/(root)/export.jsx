import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ExportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      // Fetch all transactions
      const response = await fetch(`${API_URL}/transactions/${user.id}`);
      const transactions = await response.json();

      if (transactions.length === 0) {
        Alert.alert("No Data", "You don't have any transactions to export.");
        return;
      }

      // Create CSV content
      const headers = "Date,Title,Amount,Category\n";
      const rows = transactions
        .map(
          (t) =>
            `${new Date(t.created_at).toLocaleDateString()},${t.title},${t.amount},${t.category}`
        )
        .join("\n");
      const csv = headers + rows;

      // Save to file
      const filename = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        Alert.alert("Success", "Transactions exported successfully!");
      } else {
        Alert.alert(
          "Error",
          "Sharing is not available on this device. File saved to app directory."
        );
      }
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      Alert.alert("Error", "Failed to export transactions");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    Alert.alert(
      "Coming Soon",
      "PDF export will be available in the next update. Use CSV export for now.",
      [{ text: "OK" }]
    );
  };

  const exportOptions = [
    {
      id: "csv",
      title: "Export to CSV",
      description: "Download your transactions as a CSV file",
      icon: "document-text-outline",
      color: "#2ECC71",
      onPress: exportToCSV,
    },
    {
      id: "pdf",
      title: "Export to PDF",
      description: "Generate a formatted PDF report",
      icon: "document-outline",
      color: "#E74C3C",
      onPress: exportToPDF,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Export Data
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="cloud-download-outline" size={64} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Export Your Data
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Download your transaction history in your preferred format
        </Text>

        {/* Export Options */}
        <View style={styles.optionsContainer}>
          {exportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={option.onPress}
              disabled={isExporting}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: option.color + "20" },
                ]}
              >
                <Ionicons name={option.icon} size={32} color={option.color} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textLight }]}>
                  {option.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {isExporting && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Exporting...
            </Text>
          </View>
        )}

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textLight }]}>
            Your data is exported with all transaction details including date, amount, category, and descriptions.
          </Text>
        </View>
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
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
