import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TextInput,
  Button,
  Modal,
  Animated,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { getPlayerMatchHistory } from "../utils/firestoreQueries";
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
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none" // Disable default modal animation
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            {/* "X" button to close the modal */}
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Input fields */}
            <Text>Game Title</Text>
            <TextInput style={styles.input} />
            <Text>Date</Text>
            <TextInput style={styles.input} />
            <Text>Buy-in</Text>
            <TextInput style={styles.input} />
            <Text>Final Amount</Text>
            <TextInput style={styles.input} />
            <Text>Number of Hands Folded</Text>
            <TextInput style={styles.input} />
            <Text>Number of Hands Played</Text>
            <TextInput style={styles.input} />
            <Text>Number of VPIP Hands</Text>
            <TextInput style={styles.input} />
            {/* Submit button */}
            <Button title="Submit" onPress={() => hideModal()} />
          </Animated.View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>Match History</Text>
      </View>
      <View>
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
        />
      </View>
      <TouchableOpacity onPress={showModal} style={styles.newPostButton}>
        <Text style={styles.buttonText}>New Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    justifyContent: "center",
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
    fontWeight: "bold",
    padding: 10,
  },
  matchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  matchInfoContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchName: {
    fontWeight: "bold",
    marginLeft: 20,
    flex: 1,
  },
  matchDate: {
    color: "#666",
    fontSize: 14,
    marginRight: 20,
  },
  matchInfo: {
    color: "#666",
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  newPostButton: {
    backgroundColor: "black",
    padding: 15,
    marginHorizontal: 15,
    alignItems: "center",
    borderRadius: 10,
    justifySelf: "end",
    marginTop: "auto",
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default MatchHistory;
