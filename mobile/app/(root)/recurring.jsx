import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@clerk/clerk-expo";
import { styles } from "@/assets/styles/recurring.styles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export default function RecurringTransactionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const [recurring, setRecurring] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [isExpense, setIsExpense] = useState(true);

  useEffect(() => {
    loadRecurring();
  }, []);

  const loadRecurring = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/recurring/${user.id}`);
      const data = await response.json();
      setRecurring(data);
    } catch (error) {
      console.error("Error loading recurring transactions:", error);
      Alert.alert("Error", "Failed to load recurring transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/recurring`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category,
          frequency,
          start_date: startDate,
          end_date: endDate || null,
        }),
      });

      if (response.ok) {
        resetForm();
        setShowModal(false);
        loadRecurring();
        Alert.alert("Success", "Recurring transaction created");
      } else {
        Alert.alert("Error", "Failed to create recurring transaction");
      }
    } catch (error) {
      console.error("Error creating recurring transaction:", error);
      Alert.alert("Error", "Failed to create recurring transaction");
    }
  };

  const handleUpdate = async () => {
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/recurring/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: formattedAmount,
          category,
          frequency,
          start_date: startDate,
          end_date: endDate || null,
        }),
      });

      if (response.ok) {
        resetForm();
        setShowModal(false);
        setEditingId(null);
        loadRecurring();
        Alert.alert("Success", "Recurring transaction updated");
      } else {
        Alert.alert("Error", "Failed to update recurring transaction");
      }
    } catch (error) {
      console.error("Error updating recurring transaction:", error);
      Alert.alert("Error", "Failed to update recurring transaction");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this recurring transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_URL}/recurring/${id}`, { method: "DELETE" });
            loadRecurring();
          } catch (error) {
            console.error("Error deleting recurring transaction:", error);
            Alert.alert("Error", "Failed to delete recurring transaction");
          }
        },
      },
    ]);
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`${API_URL}/recurring/${id}/toggle`, { method: "PATCH" });
      loadRecurring();
    } catch (error) {
      console.error("Error toggling recurring transaction:", error);
      Alert.alert("Error", "Failed to toggle recurring transaction");
    }
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAmount(Math.abs(parseFloat(item.amount)).toString());
    setCategory(item.category);
    setFrequency(item.frequency);
    setStartDate(item.start_date.split("T")[0]);
    setEndDate(item.end_date ? item.end_date.split("T")[0] : "");
    setIsExpense(parseFloat(item.amount) < 0);
    setShowModal(true);
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setFrequency("monthly");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setIsExpense(true);
  };

  const renderRecurringItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.categoryIcon,
              {
                backgroundColor:
                  parseFloat(item.amount) < 0 ? colors.expense + "20" : colors.income + "20",
              },
            ]}
          >
            <Ionicons
              name="repeat"
              size={20}
              color={parseFloat(item.amount) < 0 ? colors.expense : colors.income}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textLight }]}>
              {item.frequency} • {item.category}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.cardAmount,
            { color: parseFloat(item.amount) < 0 ? colors.expense : colors.income },
          ]}
        >
          ${Math.abs(parseFloat(item.amount)).toFixed(2)}
        </Text>
      </View>

      <View style={[styles.cardDetails, { borderTopColor: colors.border }]}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
          <Text style={[styles.detailText, { color: colors.textLight }]}>
            Next: {new Date(item.next_occurrence).toLocaleDateString()}
          </Text>
        </View>
        {item.end_date && (
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={14} color={colors.textLight} />
            <Text style={[styles.detailText, { color: colors.textLight }]}>
              Until: {new Date(item.end_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={() => handleToggle(item.id)}
        >
          <Ionicons
            name={item.is_active ? "pause" : "play"}
            size={18}
            color={colors.primary}
          />
          <Text style={[styles.actionText, { color: colors.text }]}>
            {item.is_active ? "Pause" : "Resume"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.expense} />
        </TouchableOpacity>
      </View>

      {!item.is_active && (
        <View style={[styles.pausedBadge, { backgroundColor: colors.textLight + "20" }]}>
          <Text style={[styles.pausedText, { color: colors.textLight }]}>Paused</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Recurring Transactions
        </Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={recurring}
        renderItem={renderRecurringItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="repeat-outline" size={64} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              No recurring transactions yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
              Set up automatic transactions for bills and subscriptions
            </Text>
          </View>
        }
      />

      {/* Create/Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingId ? "Edit" : "Create"} Recurring Transaction
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={[styles.label, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Netflix Subscription"
                placeholderTextColor={colors.textLight}
              />

              <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                ]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textLight}
              />

              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: colors.text }]}>Type</Text>
                <View style={styles.switchContainer}>
                  <Text style={[styles.switchLabel, { color: isExpense ? colors.expense : colors.textLight }]}>
                    Expense
                  </Text>
                  <Switch
                    value={!isExpense}
                    onValueChange={(value) => setIsExpense(!value)}
                    trackColor={{ false: colors.expense, true: colors.income }}
                    thumbColor={colors.white}
                  />
                  <Text style={[styles.switchLabel, { color: !isExpense ? colors.income : colors.textLight }]}>
                    Income
                  </Text>
                </View>
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: category === cat ? colors.primary : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: category === cat ? colors.white : colors.text },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
              <View style={styles.frequencyGrid}>
                {FREQUENCIES.map((freq) => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.frequencyChip,
                      {
                        backgroundColor: frequency === freq.value ? colors.primary : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setFrequency(freq.value)}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        { color: frequency === freq.value ? colors.white : colors.text },
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 20 }} />
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={editingId ? handleUpdate : handleCreate}
              >
                <Text style={[styles.saveButtonText, { color: colors.white }]}>
                  {editingId ? "Update" : "Create"} Recurring Transaction
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
