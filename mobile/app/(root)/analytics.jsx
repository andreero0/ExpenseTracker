import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, LineChart } from "react-native-chart-kit";
import { styles } from "../../assets/styles/analytics.styles";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

const screenWidth = Dimensions.get("window").width;

const CATEGORY_COLORS = {
  "Food & Drinks": "#FF6B6B",
  Shopping: "#4ECDC4",
  Transportation: "#45B7D1",
  Entertainment: "#FFA07A",
  Bills: "#98D8C8",
  Income: "#6C5CE7",
  Other: "#A8A8A8",
};

const PERIOD_OPTIONS = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

export default function AnalyticsScreen() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [categoryData, setCategoryData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [categories, trends, stats] = await Promise.all([
        fetch(`${API_URL}/analytics/categories/${user.id}?period=${selectedPeriod}`).then((r) => r.json()),
        fetch(`${API_URL}/analytics/trends/${user.id}?months=6`).then((r) => r.json()),
        fetch(`${API_URL}/analytics/stats/${user.id}`).then((r) => r.json()),
      ]);

      setCategoryData(categories);
      setTrendsData(trends);
      setStatsData(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, selectedPeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Prepare pie chart data
  const pieChartData =
    categoryData?.categories.map((cat, index) => ({
      name: cat.category,
      amount: cat.amount,
      color: CATEGORY_COLORS[cat.category] || COLORS.textLight,
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    })) || [];

  // Prepare line chart data
  const lineChartData = {
    labels: trendsData?.trends.map((t) => t.month) || [],
    datasets: [
      {
        data: trendsData?.trends.map((t) => t.expenses) || [0],
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity onPress={fetchAnalytics} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {PERIOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.periodButton,
              selectedPeriod === option.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(option.id)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === option.id && styles.periodButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-down" size={24} color={COLORS.expense} />
          </View>
          <Text style={styles.statLabel}>Total Expenses</Text>
          <Text style={styles.statValue}>
            ${statsData?.currentMonth.totalExpenses.toFixed(2) || "0.00"}
          </Text>
          {statsData?.comparison.expenseChange !== 0 && (
            <Text
              style={[
                styles.statChange,
                {
                  color:
                    statsData?.comparison.expenseChange > 0
                      ? COLORS.expense
                      : COLORS.income,
                },
              ]}
            >
              {statsData?.comparison.expenseChange > 0 ? "+" : ""}
              {statsData?.comparison.expenseChange.toFixed(1)}% vs last month
            </Text>
          )}
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={24} color={COLORS.income} />
          </View>
          <Text style={styles.statLabel}>Total Income</Text>
          <Text style={styles.statValue}>
            ${statsData?.currentMonth.totalIncome.toFixed(2) || "0.00"}
          </Text>
          {statsData?.comparison.incomeChange !== 0 && (
            <Text
              style={[
                styles.statChange,
                {
                  color:
                    statsData?.comparison.incomeChange > 0
                      ? COLORS.income
                      : COLORS.expense,
                },
              ]}
            >
              {statsData?.comparison.incomeChange > 0 ? "+" : ""}
              {statsData?.comparison.incomeChange.toFixed(1)}% vs last month
            </Text>
          )}
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calculator" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.statLabel}>Avg Expense</Text>
          <Text style={styles.statValue}>
            ${statsData?.currentMonth.avgExpense.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.statSubtext}>
            {statsData?.currentMonth.transactionCount || 0} transactions
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
          </View>
          <Text style={styles.statLabel}>Top Category</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {statsData?.currentMonth.topCategory || "N/A"}
          </Text>
          <Text style={styles.statSubtext}>
            ${statsData?.currentMonth.topCategoryAmount.toFixed(2) || "0.00"}
          </Text>
        </View>
      </View>

      {/* Pie Chart - Spending by Category */}
      {pieChartData.length > 0 ? (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="pie-chart" size={20} color={COLORS.primary} />
            <Text style={styles.chartTitle}>Spending by Category</Text>
          </View>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Ionicons name="pie-chart-outline" size={48} color={COLORS.textLight} />
          <Text style={styles.emptyChartText}>No spending data for this period</Text>
        </View>
      )}

      {/* Line Chart - Spending Trends */}
      {trendsData?.trends.length > 0 ? (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="trending-down" size={20} color={COLORS.primary} />
            <Text style={styles.chartTitle}>Spending Trends (Last 6 Months)</Text>
          </View>
          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
              labelColor: (opacity = 1) => COLORS.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.expense,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Ionicons name="analytics-outline" size={48} color={COLORS.textLight} />
          <Text style={styles.emptyChartText}>Not enough data for trends</Text>
        </View>
      )}

      {/* Category Breakdown List */}
      {categoryData?.categories.length > 0 && (
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Category Breakdown</Text>
          {categoryData.categories.map((cat, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: CATEGORY_COLORS[cat.category] || COLORS.textLight },
                  ]}
                />
                <Text style={styles.breakdownCategory}>{cat.category}</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={styles.breakdownAmount}>${cat.amount.toFixed(2)}</Text>
                <Text style={styles.breakdownPercentage}>
                  {cat.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
