// screens/StatsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
  // const chartData = {
  //   labels: ["Nov 23", "24", "25", "26", "27", "28", "29", "30"],
  //   datasets: [
  //     {
  //       data: [5, 6, 8, 12, 15, 18, 22, 25],
  //       color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue line
  //       strokeWidth: 2,
  //     },
  //   ],
  // };

  const { user, isAuthenticated } = useAuth();

  const [winlossRatio, setWinlossRatio] = useState(0);
  const [foldRatio, setFoldRatio] = useState(0);
  const [vpip, setVpip] = useState(0);

  const [earnings, setEarnings] = useState([]);
  const [chartData, setChartData] = useState([]);

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

  // useEffect(() => {
  //   const addMatchToPlayerMatchHistory = async () => {
  //     if (user) {
  //       const sampleData = {
  //         uuid: "R9dQWQzkJ4ZxOT9Q8pgMIEPwxVr2", // Example UUID for the player
  //         match_name: "match_004", // Name of the match
  //         match_date: new Date("2023-10-04T14:00:00Z"), // Date of the match
  //         buy_in: 20, // Buy-in amount
  //         final_amount: 15, // Final amount after the match
  //         hands_played: 80, // Total hands played in the match
  //         hands_won: 40, // Total hands won in the match
  //         hands_won_details: ["A5o", "K5o", "Q5o"],
  //         hands_folded: 5, // Total hands folded in the match
  //         vpip_hands: 30, // Total hands played in the match
  //       };

  //       await addNewMatchToPlayerMatchHistory(
  //         sampleData.uuid,
  //         sampleData.match_name,
  //         sampleData.match_date,
  //         sampleData.buy_in,
  //         sampleData.final_amount,
  //         sampleData.hands_played,
  //         sampleData.hands_won,
  //         sampleData.hands_folded,
  //         sampleData.vpip_hands,
  //         sampleData.hands_won_details
  //       );
  //       // await updatePlayerStats(
  //       //   sampleData.uuid,
  //       //   sampleData.hands_folded,
  //       //   sampleData.hands_played,
  //       //   sampleData.hands_won,
  //       //   sampleData.vpip_hands
  //       // );
  //     }
  //   };

  //   addMatchToPlayerMatchHistory();
  // }, [user]);

  useEffect(() => {
    if (user) {
      getPlayerStats(user.uid).then((stats) => {
        // console.log("Stats:", stats);
        // console.log("Stats earnings:", stats.earnings); // Check the structure of earnings
        setWinlossRatio(stats.win_loss_ratio);
        setFoldRatio(stats.fold_ratio);
        setVpip(stats.vpip);
        const earnings = stats.earnings;
        setEarnings(earnings);
        setupChartData(earnings);
      });
      // getPlayerMatchHistory(user.uid).then((matchHistory) => {
      //   console.log(matchHistory);
      // });
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(chartData);
  // }, [chartData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "" }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
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
});

export default StatsScreen;
