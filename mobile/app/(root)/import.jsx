import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/import.styles";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

const CATEGORIES = [
  "Food & Drinks",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills",
  "Income",
  "Other",
];

export default function ImportScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await processStatement(file);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error(error);
    }
  };

  const processStatement = async (file) => {
    setIsProcessing(true);
    setTransactions([]);

    try {
      const formData = new FormData();
      formData.append("statement", {
        uri: file.uri,
        type: file.mimeType || "application/pdf",
        name: file.name || "statement.pdf",
      });
      formData.append("userId", user.id);

      const response = await fetch(`${API_URL}/statement/process`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process statement");
      }

      if (data.transactions.length === 0) {
        Alert.alert(
          "No Transactions Found",
          "Could not extract transactions from this statement. Please check the file format."
        );
        return;
      }

      setTransactions(data.transactions);
      // Auto-select all non-duplicate transactions
      const autoSelected = new Set(
        data.transactions
          .filter((t) => !t.isDuplicate)
          .map((t, index) => index)
      );
      setSelectedTransactions(autoSelected);

      Alert.alert(
        "Success",
        `Found ${data.transactions.length} transactions!\n${
          data.duplicates > 0 ? `${data.duplicates} potential duplicates detected.` : ""
        }\n${data.isFallback ? "Using basic parser (AI not configured)." : "Parsed with AI."}`
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to process statement");
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTransaction = (index) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTransactions(newSelected);
  };

  const updateTransaction = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleImport = async () => {
    const toImport = transactions.filter((_, index) => selectedTransactions.has(index));

    if (toImport.length === 0) {
      Alert.alert("No Selection", "Please select at least one transaction to import");
      return;
    }

    Alert.alert(
      "Import Transactions",
      `Import ${toImport.length} selected transactions?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          style: "default",
          onPress: async () => {
            setIsImporting(true);
            try {
              const response = await fetch(`${API_URL}/statement/import`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  transactions: toImport,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Import failed");
              }

              Alert.alert(
                "Success",
                `Imported ${data.imported} of ${data.total} transactions!`,
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to import transactions");
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item, index }) => {
    const isSelected = selectedTransactions.has(index);
    const isDuplicate = item.isDuplicate;
    const isExpense = item.amount < 0;

    return (
      <View
        style={[
          styles.transactionCard,
          isDuplicate && styles.transactionCardDuplicate,
          isSelected && styles.transactionCardSelected,
        ]}
      >
        <View style={styles.transactionHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleTransaction(index)}
          >
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={isSelected ? COLORS.primary : COLORS.textLight}
            />
          </TouchableOpacity>
          {isDuplicate && (
            <View style={styles.duplicateBadge}>
              <Ionicons name="warning" size={14} color={COLORS.expense} />
              <Text style={styles.duplicateText}>Possible Duplicate</Text>
            </View>
          )}
        </View>

        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDate}>{item.date}</Text>
            <Text
              style={[
                styles.transactionAmount,
                { color: isExpense ? COLORS.expense : COLORS.income },
              ]}
            >
              {isExpense ? "-" : "+"}${Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.transactionCategory}>
            Category: {item.category}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import Statement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Upload Section */}
        {transactions.length === 0 && (
          <View style={styles.uploadSection}>
            <Ionicons
              name="cloud-upload-outline"
              size={80}
              color={COLORS.textLight}
            />
            <Text style={styles.uploadTitle}>Upload Bank Statement</Text>
            <Text style={styles.uploadSubtitle}>
              Upload a PDF statement and let AI extract all your transactions automatically
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                isProcessing && styles.uploadButtonDisabled,
              ]}
              onPress={handlePickDocument}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator color={COLORS.white} size="small" />
                  <Text style={styles.uploadButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="document" size={20} color={COLORS.white} />
                  <Text style={styles.uploadButtonText}>
                    Choose PDF Statement
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                Supports: Chase, Bank of America, Wells Fargo, Citibank, and
                most other banks
              </Text>
            </View>
          </View>
        )}

        {/* Transaction List */}
        {transactions.length > 0 && (
          <View style={styles.transactionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Found {transactions.length} Transactions
              </Text>
              <Text style={styles.selectedCount}>
                {selectedTransactions.size} selected
              </Text>
            </View>

            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.transactionList}
            />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setTransactions([]);
                  setSelectedTransactions(new Set());
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.importButton,
                  isImporting && styles.importButtonDisabled,
                ]}
                onPress={handleImport}
                disabled={isImporting}
              >
                {isImporting ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.white}
                    />
                    <Text style={styles.importButtonText}>
                      Import {selectedTransactions.size}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
