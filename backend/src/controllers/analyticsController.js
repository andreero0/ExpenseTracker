import { sql } from "../config/db.js";

/**
 * Get spending breakdown by category
 */
export async function getCategoryBreakdown(req, res) {
  try {
    const { userId } = req.params;
    const { period = "month" } = req.query; // month, week, year, all

    let startDate;
    const now = new Date();

    switch (period) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get spending by category (expenses only, not income)
    const categoryData = await sql`
      SELECT
        category,
        ABS(SUM(amount)) as total,
        COUNT(*) as count
      FROM transactions
      WHERE user_id = ${userId}
        AND amount < 0
        AND created_at >= ${startDate.toISOString()}
      GROUP BY category
      ORDER BY total DESC
    `;

    // Calculate total expenses for percentages
    const totalExpenses = categoryData.reduce((sum, cat) => sum + parseFloat(cat.total), 0);

    // Add percentage to each category
    const categoryBreakdown = categoryData.map((cat) => ({
      category: cat.category,
      amount: parseFloat(cat.total),
      count: parseInt(cat.count),
      percentage: totalExpenses > 0 ? (parseFloat(cat.total) / totalExpenses) * 100 : 0,
    }));

    res.status(200).json({
      period,
      categories: categoryBreakdown,
      total: totalExpenses,
    });
  } catch (error) {
    console.error("Error getting category breakdown:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get spending trends over time (monthly data for last N months)
 */
export async function getSpendingTrends(req, res) {
  try {
    const { userId } = req.params;
    const { months = 6 } = req.query;

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

    // Get monthly aggregates
    const trendsData = await sql`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)) as expenses,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
        SUM(amount) as net
      FROM transactions
      WHERE user_id = ${userId}
        AND created_at >= ${monthsAgo.toISOString()}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `;

    const trends = trendsData.map((item) => ({
      month: new Date(item.month).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      expenses: parseFloat(item.expenses),
      income: parseFloat(item.income),
      net: parseFloat(item.net),
    }));

    res.status(200).json({
      months: parseInt(months),
      trends,
    });
  } catch (error) {
    console.error("Error getting spending trends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get analytics statistics
 */
export async function getAnalyticsStats(req, res) {
  try {
    const { userId } = req.params;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const currentMonthStats = await sql`
      SELECT
        COUNT(*) as transaction_count,
        ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)) as total_expenses,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_income,
        AVG(CASE WHEN amount < 0 THEN ABS(amount) ELSE NULL END) as avg_expense
      FROM transactions
      WHERE user_id = ${userId}
        AND created_at >= ${monthStart.toISOString()}
    `;

    // Last month stats for comparison
    const lastMonthStats = await sql`
      SELECT
        ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)) as total_expenses,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_income
      FROM transactions
      WHERE user_id = ${userId}
        AND created_at >= ${lastMonthStart.toISOString()}
        AND created_at < ${monthStart.toISOString()}
    `;

    // Top spending category this month
    const topCategory = await sql`
      SELECT
        category,
        ABS(SUM(amount)) as total
      FROM transactions
      WHERE user_id = ${userId}
        AND amount < 0
        AND created_at >= ${monthStart.toISOString()}
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1
    `;

    // Calculate changes from last month
    const currentExpenses = parseFloat(currentMonthStats[0].total_expenses);
    const lastExpenses = parseFloat(lastMonthStats[0]?.total_expenses || 0);
    const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;

    const currentIncome = parseFloat(currentMonthStats[0].total_income);
    const lastIncome = parseFloat(lastMonthStats[0]?.total_income || 0);
    const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;

    res.status(200).json({
      currentMonth: {
        transactionCount: parseInt(currentMonthStats[0].transaction_count),
        totalExpenses: currentExpenses,
        totalIncome: currentIncome,
        avgExpense: parseFloat(currentMonthStats[0].avg_expense || 0),
        topCategory: topCategory[0]?.category || "N/A",
        topCategoryAmount: parseFloat(topCategory[0]?.total || 0),
      },
      comparison: {
        expenseChange: expenseChange,
        incomeChange: incomeChange,
      },
    });
  } catch (error) {
    console.error("Error getting analytics stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get daily spending for current month (for detailed chart)
 */
export async function getDailySpending(req, res) {
  try {
    const { userId } = req.params;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyData = await sql`
      SELECT
        DATE(created_at) as date,
        ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)) as expenses,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income
      FROM transactions
      WHERE user_id = ${userId}
        AND created_at >= ${monthStart.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const daily = dailyData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      expenses: parseFloat(item.expenses),
      income: parseFloat(item.income),
    }));

    res.status(200).json({ daily });
  } catch (error) {
    console.error("Error getting daily spending:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
