import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatchDetails = ({ route }) => {
  const { name, date } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.details}>More details about this match...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 18,
    color: 'gray',
  },
  details: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MatchDetails;
