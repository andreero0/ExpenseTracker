import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
];

export default function CurrencySettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const saved = await AsyncStorage.getItem("@currency");
      if (saved) {
        setSelectedCurrency(saved);
      }
    } catch (error) {
      console.error("Failed to load currency:", error);
    }
  };

  const handleSelect = async (code) => {
    try {
      await AsyncStorage.setItem("@currency", code);
      setSelectedCurrency(code);
      Alert.alert("Success", `Currency changed to ${code}`);
    } catch (error) {
      console.error("Failed to save currency:", error);
      Alert.alert("Error", "Failed to save currency preference");
    }
  };

  const renderCurrency = ({ item }) => {
    const isSelected = selectedCurrency === item.code;
    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => handleSelect(item.code)}
      >
        <View style={styles.currencyLeft}>
          <View
            style={[
              styles.currencyIcon,
              {
                backgroundColor: isSelected ? colors.primary : colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.currencySymbol,
                { color: isSelected ? colors.white : colors.text },
              ]}
            >
              {item.symbol}
            </Text>
          </View>
          <View style={styles.currencyInfo}>
            <Text style={[styles.currencyCode, { color: colors.text }]}>
              {item.code}
            </Text>
            <Text style={[styles.currencyName, { color: colors.textLight }]}>
              {item.name}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
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
          Currency Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: colors.primary + "20" }]}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          All new transactions will use the selected currency. Existing transactions remain unchanged.
        </Text>
      </View>

      {/* Currency List */}
      <FlatList
        data={CURRENCIES}
        renderItem={renderCurrency}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
      />
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 20,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  currencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "700",
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
  },
});
