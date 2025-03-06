// screens/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const proximitySensorScreen = () => {
  const chartData = {
    labels: ['Nov 23', '24', '25', '26', '27', '28', '29', '30'],
    datasets: [
      {
        data: [5, 6, 8, 12, 15, 18, 22, 25],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue line
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PokerShark Analytics</Text>
        <Image
          source={{ uri: 'https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
      </View>
      <View style={styles.statsContainer}>
        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Stats</Title>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Win/Loss Ratio</Text>
              <Text style={styles.metricValue}>0.683</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Fold Ratio</Text>
              <Text style={styles.metricValue}>0.52</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>VPIP</Text>
              <Text style={styles.metricValue}>21%</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Wins</Title>
          <LineChart
            data={chartData}
            width={350}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
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
    fontWeight: 'bold',
    padding: 10,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StatsScreen;
