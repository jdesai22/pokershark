import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TextInput,
  Button,
  Modal,
  Animated,
  TouchableOpacity,
  FlatList,
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  getPlayerMatchHistory,
  addNewMatchToPlayerMatchHistory,
} from "../utils/firestoreQueries";
import { useAuth } from "../hooks/useAuth";

const MatchItem = ({ name, date, detailedMatchHistory }) => {
  const navigation = useNavigation();

  // Find the detailed match data using the name (or id)
  const matchDetails = detailedMatchHistory[name];

  return (
    <View style={styles.matchItem}>
      <View style={styles.matchInfoContainer}>
        <Text style={styles.matchName}>{name}</Text>
        <Text style={styles.matchDate}>{date}</Text>
      </View>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() =>
          navigation.navigate("Match Details", { name, matchDetails })
        }
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const MatchHistory = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for slide-up animation
  const { user } = useAuth(); // Get the authenticated user
  const [matchHistory, setMatchHistory] = useState([]);
  const [detailedMatchHistory, setDetailedMatchHistory] = useState([]);

  // Add state for form inputs
  const [matchName, setMatchName] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [handsFolded, setHandsFolded] = useState("");
  const [handsPlayed, setHandsPlayed] = useState("");
  const [vpipHands, setVpipHands] = useState("");

  useEffect(() => {
    const fetchMatchHistory = async () => {
      if (user) {
        const matchHistory = await getPlayerMatchHistory(user.uid);
        setDetailedMatchHistory(matchHistory.match_stats);

        // Transform matchHistory data
        const transformedData = Object.entries(matchHistory.match_stats)
          .map(([key, value]) => ({
            name: key,
            date: value.date.toDate(), // Keep as Date object for sorting
            id: key,
          }))
          .sort((a, b) => b.date - a.date) // Sort by date from most recent to oldest
          .map((item) => ({
            ...item,
            date: item.date.toLocaleDateString(), // Convert timestamp to date string after sorting
          }));

        // Use transformedData as needed
        setMatchHistory(transformedData);
      }
    };

    fetchMatchHistory();
  }, [user]); // Dependency array includes user

  // Function to show the modal with animation
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to hide the modal with animation
  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Translate the modal based on the animated value
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // Slide up from bottom
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!user) return;

    try {
      // Convert inputs to appropriate types
      const numericBuyIn = parseFloat(buyIn);
      const numericFinalAmount = parseFloat(finalAmount);
      const numericHandsFolded = parseInt(handsFolded);
      const numericHandsPlayed = parseInt(handsPlayed);
      const numericVpipHands = parseInt(vpipHands);

      // Calculate hands won (simple calculation, adjust as needed)
      const handsWon = numericHandsPlayed - numericHandsFolded;

      // Call the Firestore function to add the match
      await addNewMatchToPlayerMatchHistory(
        user.uid,
        matchName,
        new Date(matchDate), // Convert string date to Date object
        numericBuyIn,
        numericFinalAmount,
        numericHandsPlayed,
        handsWon,
        numericHandsFolded,
        numericVpipHands,
        {} // Empty object for hands_won_details
      );

      // Refresh match history
      const updatedHistory = await getPlayerMatchHistory(user.uid);
      setDetailedMatchHistory(updatedHistory.match_stats);

      // Transform updated matchHistory data
      const transformedData = Object.entries(updatedHistory.match_stats)
        .map(([key, value]) => ({
          name: key,
          date: value.date.toDate(),
          id: key,
        }))
        .sort((a, b) => b.date - a.date)
        .map((item) => ({
          ...item,
          date: item.date.toLocaleDateString(),
        }));

      setMatchHistory(transformedData);

      // Reset form fields
      setMatchName("");
      setMatchDate("");
      setBuyIn("");
      setFinalAmount("");
      setHandsFolded("");
      setHandsPlayed("");
      setVpipHands("");

      // Close modal
      hideModal();
    } catch (error) {
      console.error("Error adding match:", error);
      // You could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal for creating new match */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <ScrollView
          contentContainerStyle={styles.modalView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalLabel}>Game Title</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={matchName}
              onChangeText={setMatchName}
              placeholder="Enter game title"
            />

            <Text style={styles.modalLabel}>Date</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={matchDate}
              onChangeText={setMatchDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.modalLabel}>Buy-in</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={buyIn}
              onChangeText={setBuyIn}
              placeholder="Enter amount"
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Final Amount</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={finalAmount}
              onChangeText={setFinalAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Number of Hands Folded</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={handsFolded}
              onChangeText={setHandsFolded}
              placeholder="Enter number"
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Number of Hands Played</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={handsPlayed}
              onChangeText={setHandsPlayed}
              placeholder="Enter number"
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Number of VPIP Hands</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={vpipHands}
              onChangeText={setVpipHands}
              placeholder="Enter number"
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.newPostButton}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌟 PokerShark Match History</Text>
      </View>

      {/* Match list that scrolls independently */}
      <View style={styles.listContainer}>
        <FlatList
          data={matchHistory}
          renderItem={({ item }) => (
            <MatchItem
              name={item.name}
              date={item.date}
              detailedMatchHistory={detailedMatchHistory}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* Pinned New Post button */}
      <TouchableOpacity onPress={showModal} style={styles.fixedPostButton}>
        <Text style={styles.buttonText}>New Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  matchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 6,
  },
  matchInfoContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchName: {
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    color: "#fff",
  },
  matchDate: {
    color: "#ccc",
    fontSize: 14,
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: "#E50914",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  newPostButton: {
    backgroundColor: "#E50914",
    padding: 15,
    marginHorizontal: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: 25,
  },
  modalView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#2C2C2C",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 0,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFD700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "#1B1B1B",
  },
  modalLabel: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  listContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  fixedPostButton: {
    backgroundColor: "#E50914",
    padding: 15,
    marginHorizontal: 15,
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    marginBottom: 0,
  },
});

export default MatchHistory;
