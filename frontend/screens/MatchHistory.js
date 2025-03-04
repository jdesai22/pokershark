import React from 'react';
import { FlatList, View, Text, StyleSheet, Image } from 'react-native';

const MatchHistory = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match History</Text>
        <Image
          source={{ uri: 'https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
      </View>
      <View>
        <FlatList style={styles.historyContainer}>
        </FlatList>
      </View>
    </View>
  );
}

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
  historyContainer: {
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

export default MatchHistory;
