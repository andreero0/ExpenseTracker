import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/budgets.styles";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

export default function BudgetsScreen() {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/budgets/analytics/${user.id}`);
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleAddBudget = async () => {
    if (!selectedCategory || !budgetAmount || parseFloat(budgetAmount) <= 0) {
      Alert.alert("Error", "Please select a category and enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          category: selectedCategory,
          amount: parseFloat(budgetAmount),
          period: "monthly",
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Budget set successfully");
        setShowAddModal(false);
        setSelectedCategory("");
        setBudgetAmount("");
        fetchBudgets();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to set budget");
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      const response = await fetch(`${API_URL}/budgets/${id}`, { method: "DELETE" });
      if (response.ok) {
        Alert.alert("Success", "Budget deleted");
        fetchBudgets();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete budget");
    }
  };

  const renderBudgetItem = ({ item }) => {
    const percentage = Math.min(item.percentage, 100);
    const isOverBudget = item.isOverBudget;
    const categoryIcon = CATEGORIES.find((c) => c.name === item.category)?.icon || "pricetag";

    return (
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetInfo}>
            <Ionicons name={categoryIcon} size={24} color={COLORS.primary} />
            <Text style={styles.budgetCategory}>{item.category}</Text>
          </View>
          <TouchableOpacity onPress={() => {
            Alert.alert("Delete Budget", `Remove budget for ${item.category}?`, [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => handleDeleteBudget(item.id) },
            ]);
          }}>
            <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
          </TouchableOpacity>
        </View>

        <View style={styles.budgetAmounts}>
          <Text style={styles.spentAmount}>
            ${item.spent.toFixed(2)} <Text style={styles.budgetTotal}>of ${item.budget.toFixed(2)}</Text>
          </Text>
          <Text style={[styles.remainingAmount, isOverBudget && styles.overBudget]}>
            {isOverBudget ? `$${Math.abs(item.remaining).toFixed(2)} over` : `$${item.remaining.toFixed(2)} left`}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, isOverBudget && styles.progressBarOver]}
               style={{width: `${percentage}%`}} />
        </View>
        <Text style={styles.percentageText}>{percentage.toFixed(0)}% used</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budgets</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Set Budget</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No budgets set yet</Text>
            <Text style={styles.emptySubtext}>Set budgets to track your spending</Text>
          </View>
        }
      />

      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Budget</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryButton, selectedCategory === cat.name && styles.categoryButtonActive]}
                    onPress={() => setSelectedCategory(cat.name)}
                  >
                    <Ionicons name={cat.icon} size={20} color={selectedCategory === cat.name ? COLORS.white : COLORS.text} />
                    <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Monthly Budget</Text>
              <View style={styles.amountInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textLight}
                  value={budgetAmount}
                  onChangeText={setBudgetAmount}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddBudget}>
              <Text style={styles.saveButtonText}>Save Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
