// screens/StatsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Title } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native";
import {
  getPlayerStats,
  addNewMatchToPlayerMatchHistory,
  updatePlayerStats,
} from "@/utils/firestoreQueries";

const StatsScreen = () => {
  const { user, isAuthenticated } = useAuth();

  const [winlossRatio, setWinlossRatio] = useState(0);
  const [foldRatio, setFoldRatio] = useState(0);
  const [vpip, setVpip] = useState(0);

  const [earnings, setEarnings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [feedbackPrompt, setFeedbackPrompt] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openrouterKey =
    "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";

  const chartConfig = {
    backgroundColor: "#1B1B1B",
    backgroundGradientFrom: "#1B1B1B",
    backgroundGradientTo: "#1B1B1B",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FFD700",
    },
  };

  const setupChartData = (earnings) => {
    // Check if earnings exist and is an array
    if (!earnings || !Array.isArray(earnings)) {
      console.log("No earnings data available");
      return;
    }

    const labels = earnings.map((_, index) => `${index + 1}`);
    labels[0] = "Game 1";
    const data = earnings;

    // Make sure we have data before setting the chart data
    if (data.length > 0) {
      setChartData({
        labels,
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (user) {
      getPlayerStats(user.uid).then((stats) => {
        setWinlossRatio(stats.win_loss_ratio);
        setFoldRatio(stats.fold_ratio);
        setVpip(stats.vpip);
        const earnings = stats.earnings;

        setEarnings(earnings);
        setupChartData(earnings);

        // Create feedback prompt for AI model
        const prompt = `Analyze this poker player's stats and provide concise feedback (under 150 chars):
- Win/Loss Ratio: ${stats.win_loss_ratio}
- Fold Ratio: ${stats.fold_ratio}
- VPIP: ${stats.vpip}
- Earnings Trend: ${earnings.join(", ")}`;
        console.log("prompt", prompt);
        setFeedbackPrompt(prompt);
      });
    }
  }, [user]);

  const getAIFeedback = async () => {
    if (!feedbackPrompt) {
      console.log("No feedback prompt available");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro-exp-03-25:free",
            messages: [
              {
                role: "user",
                content: feedbackPrompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("AI Feedback Response:", data);

      if (response.status === 429) {
        console.error("Error 429: Prompt limit exceeded");
        setAiFeedback(
          "Sorry, the AI prompt limit has been exceeded. Please try again later."
        );
        return;
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const feedback = data.choices[0].message.content;
        setAiFeedback(feedback);
        console.log("AI Feedback:", feedback);
      } else {
        // Log the full structure to understand the response format
        console.log("Response structure:", JSON.stringify(data));

        // Try to access the message content differently if needed
        if (data.choices && data.choices[0]) {
          console.log("Message object:", data.choices[0].message);
        }
      }
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      if (error.message && error.message.includes("429")) {
        setAiFeedback(
          "Sorry, the AI prompt limit has been exceeded. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💎 PokerShark Analytics</Text>
      </View>
      <View style={styles.statsContainer}>
        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Stats</Title>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Win/Loss Ratio</Text>
              <Text style={styles.metricValue}>{winlossRatio}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Fold Ratio</Text>
              <Text style={styles.metricValue}>{foldRatio}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>VPIP</Text>
              <Text style={styles.metricValue}>{vpip}</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Amount Won</Title>
          {chartData &&
            chartData.datasets &&
            chartData.datasets[0].data.length > 0 && (
              <LineChart
                data={chartData}
                width={350}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}
        </Card>

        {aiFeedback ? (
          <Card style={styles.card}>
            <Title style={styles.cardTitle}>AI Feedback</Title>
            <Text style={styles.feedbackText}>{aiFeedback}</Text>
          </Card>
        ) : null}

        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={getAIFeedback}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Get AI Feedback"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#2C2C2C",
    marginBottom: 20,
    elevation: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    color: "#FFD700",
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    color: "#ccc",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  feedbackButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#1B1B1B",
    fontWeight: "bold",
    fontSize: 16,
  },
  feedbackText: {
    color: "#fff",
    padding: 15,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default StatsScreen;
