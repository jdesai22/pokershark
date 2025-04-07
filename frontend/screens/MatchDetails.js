import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MatchDetails = ({ route }) => {
  const { name, matchDetails } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Details</Text>
      <Text style={styles.detail}>Name: {name}</Text>
      <Text style={styles.detail}>
        Date: {matchDetails.date.toDate().toLocaleDateString()}
      </Text>
      <Text style={styles.detail}>Buy-in: ${matchDetails.buy_in}</Text>
      <Text style={styles.detail}>
        Final Amount: ${matchDetails.final_amount}
      </Text>
      <Text style={styles.detail}>
        Hands Folded: {matchDetails.hands_folded}
      </Text>
      <Text style={styles.detail}>
        Hands Played: {matchDetails.hands_played}
      </Text>
      <Text style={styles.detail}>Hands Won: {matchDetails.hands_won}</Text>
      <Text style={styles.detail}>VPIP Hands: {matchDetails.vpip_hands}</Text>
      {/* Optionally, render hands_won_details if needed */}
      {matchDetails.hands_won_details &&
        Array.isArray(matchDetails.hands_won_details) &&
        matchDetails.hands_won_details.length > 0 && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>Hands Won Details:</Text>
            {matchDetails.hands_won_details.map((detail, index) => (
              <Text key={index} style={styles.detailItem}>
                {detail}
              </Text>
            ))}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  detailsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  detailItem: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
    textAlign: "center",
  },
});

export default MatchDetails;
