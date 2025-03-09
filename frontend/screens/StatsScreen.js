// screens/StatsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card, Title } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "@/hooks/useAuth";
import {
  getPlayerStats,
  getPlayerMatchHistory,
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
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#007AFF",
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

  useEffect(() => {
    console.log(chartData);
  }, [chartData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "" }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.title}>PokerShark Analytics</Text>
        <Image
          source={{
            uri: "https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg",
          }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
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
    color: "#666",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StatsScreen;
