import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { StyleSheet } from "react-native";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "apps" },
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const DATE_PRESETS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "last30", label: "Last 30 Days" },
];

export const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || "");
  const [datePreset, setDatePreset] = useState(initialFilters?.datePreset || "all");

  const handleApply = () => {
    let filters = {
      category: selectedCategory === "All Categories" ? "" : selectedCategory,
      datePreset: datePreset,
    };

    // Calculate date range based on preset
    if (datePreset !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (datePreset) {
        case "today":
          filters.startDate = today.toISOString();
          filters.endDate = today.toISOString();
          break;
        case "week":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          filters.startDate = weekStart.toISOString();
          filters.endDate = today.toISOString();
          break;
        case "month":
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          filters.startDate = monthStart.toISOString();
          filters.endDate = today.toISOString();
          break;
        case "last30":
          const last30Start = new Date(today);
          last30Start.setDate(today.getDate() - 30);
          filters.startDate = last30Start.toISOString();
          filters.endDate = today.toISOString();
          break;
      }
    }

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedCategory("");
    setDatePreset("all");
    onApply({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
              </Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Ionicons
                      name={category.icon}
                      size={20}
                      color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category.name && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.text} /> Date Range
              </Text>
              <View style={styles.datePresets}>
                {DATE_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetButton,
                      datePreset === preset.id && styles.presetButtonActive,
                    ]}
                    onPress={() => setDatePreset(preset.id)}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        datePreset === preset.id && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color={COLORS.textLight} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
              <Ionicons name="checkmark" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
    fontWeight: "500",
  },
  datePresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  presetButtonTextActive: {
    color: COLORS.white,
    fontWeight: "500",
  },
  customDateContainer: {
    marginTop: 16,
    gap: 12,
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    width: 50,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  applyButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  applyButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
});
