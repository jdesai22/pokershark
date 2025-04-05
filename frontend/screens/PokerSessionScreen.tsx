import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { firestore } from "@/config";
import { Ionicons } from "@expo/vector-icons";

// Card suits and values
const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const CARD_VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

interface HandData {
  id: string;
  cards: {
    suit: string;
    value: string;
  }[];
  amountWon: number;
  amountLost: number;
  folded: boolean;
  won: boolean;
  vpip: boolean; // Voluntarily Put Money In Pot
}

interface SessionSummary {
  buy_in: number;
  date: string;
  final_amount: number;
  hands_folded: number;
  hands_played: number;
  hands_won: number;
  hands_won_details: HandData[];
  vpip_hands: number;
}

const PokerSessionScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [buyIn, setBuyIn] = useState("");
  const [currentHand, setCurrentHand] = useState<HandData>({
    id: Date.now().toString(),
    cards: Array(2).fill({ suit: SUITS[0], value: CARD_VALUES[0] }),
    amountWon: 0,
    amountLost: 0,
    folded: false,
    won: false,
    vpip: false,
  });
  const [hands, setHands] = useState<HandData[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );

  // Start a new session
  const startSession = () => {
    if (!buyIn || isNaN(parseFloat(buyIn)) || parseFloat(buyIn) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid buy-in amount");
      return;
    }

    setIsSessionActive(true);
    setHands([]);
    // Initialize the first hand
    resetHandForm();
    // Expand the first card by default
    setExpandedCardIndex(0);
  };

  // Reset the current hand form
  const resetHandForm = () => {
    setCurrentHand({
      id: Date.now().toString(),
      cards: Array(2).fill({ suit: SUITS[0], value: CARD_VALUES[0] }),
      amountWon: 0,
      amountLost: 0,
      folded: false,
      won: false,
      vpip: false,
    });
  };

  // Update a card in the current hand
  const updateCard = (
    index: number,
    field: "suit" | "value",
    value: string
  ) => {
    const updatedCards = [...currentHand.cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };

    setCurrentHand({
      ...currentHand,
      cards: updatedCards,
    });
  };

  // Save the current hand and prepare for the next one
  const saveHand = () => {
    // Validate hand data if needed
    setHands([...hands, currentHand]);
    resetHandForm();
    // Collapse all card sections when starting a new hand
    setExpandedCardIndex(null);
  };

  // Toggle the expanded state of a card section
  const toggleCardExpansion = (index: number) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  // Get the display text for a card
  const getCardDisplayText = (card: { suit: string; value: string }) => {
    return `${card.value}${card.suit}`;
  };

  // End the session and save results
  const endSession = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a session");
      return;
    }

    // Calculate session summary
    const handsPlayed = hands.length;
    const handsFolded = hands.filter((hand) => hand.folded).length;
    const handsWon = hands.filter((hand) => hand.won).length;
    const handsWonDetails = hands.filter((hand) => hand.won);
    const vpipHands = hands.filter((hand) => hand.vpip).length;

    // Calculate final amount (buy-in + total won - total lost)
    const totalWon = hands.reduce((sum, hand) => sum + hand.amountWon, 0);
    const totalLost = hands.reduce((sum, hand) => sum + hand.amountLost, 0);
    const finalAmount = parseFloat(buyIn) + totalWon - totalLost;

    const sessionSummary: SessionSummary = {
      buy_in: parseFloat(buyIn),
      date: new Date().toISOString(),
      final_amount: finalAmount,
      hands_folded: handsFolded,
      hands_played: handsPlayed,
      hands_won: handsWon,
      hands_won_details: handsWonDetails,
      vpip_hands: vpipHands,
    };

    try {
      // Save to Firestore
      await addDoc(collection(firestore, "poker-sessions"), {
        userId: user.uid,
        ...sessionSummary,
      });

      Alert.alert(
        "Session Saved",
        "Your poker session has been saved successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setIsSessionActive(false);
              setBuyIn("");
              setHands([]);
              // Optionally navigate to stats or history screen
              // navigation.navigate('Stats');
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving session:", error);
      Alert.alert("Error", "Failed to save your session. Please try again.");
    }
  };

  // Render an individual card picker
  const renderCardPicker = (index: number) => {
    const isExpanded = expandedCardIndex === index;
    const card = currentHand.cards[index];

    return (
      <View style={styles.cardContainer} key={`card-${index}`}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleCardExpansion(index)}
        >
          <Text style={styles.cardLabel}>Card {index + 1}</Text>
          <View style={styles.cardSummary}>
            <Text style={styles.cardSummaryText}>
              {getCardDisplayText(card)}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.cardPickerContainer}>
            {/* Card Value Buttons */}
            <Text style={styles.sectionLabel}>Value:</Text>
            <View style={styles.valueButtonsContainer}>
              {CARD_VALUES.map((value) => (
                <TouchableOpacity
                  key={`value-button-${value}`}
                  style={[
                    styles.valueButton,
                    card.value === value && styles.selectedValueButton,
                  ]}
                  onPress={() => updateCard(index, "value", value)}
                >
                  <Text
                    style={[
                      styles.valueButtonText,
                      card.value === value && styles.selectedButtonText,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Suit Selection Buttons */}
            <Text style={styles.sectionLabel}>Suit:</Text>
            <View style={styles.suitButtonsContainer}>
              {SUITS.map((suit) => (
                <TouchableOpacity
                  key={`suit-button-${suit}`}
                  style={[
                    styles.suitButton,
                    card.suit === suit && styles.selectedSuitButton,
                  ]}
                  onPress={() => updateCard(index, "suit", suit)}
                >
                  <Text
                    style={[
                      styles.suitButtonText,
                      card.suit === suit && styles.selectedButtonText,
                    ]}
                  >
                    {suit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  // Render the session setup form
  const renderSessionSetup = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>Start New Poker Session</Title>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Buy-in Amount ($)</Text>
          <TextInput
            style={styles.input}
            value={buyIn}
            onChangeText={setBuyIn}
            keyboardType="numeric"
            placeholder="Enter buy-in amount"
          />
        </View>
        <Button mode="contained" onPress={startSession} style={styles.button}>
          Start Session
        </Button>
      </Card.Content>
    </Card>
  );

  // Render hand tracking form
  const renderHandTracker = () => (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Hand #{hands.length + 1}</Title>

          {/* Selected Cards Display */}
          <View style={styles.selectedCardsDisplay}>
            <Text style={styles.selectedCardsLabel}>Selected Cards:</Text>
            <View style={styles.cardChipsContainer}>
              {currentHand.cards.map((card, index) => (
                <TouchableOpacity
                  key={`card-chip-${index}`}
                  style={styles.cardChip}
                  onPress={() => toggleCardExpansion(index)}
                >
                  <Text style={styles.cardChipText}>
                    {getCardDisplayText(card)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card selection */}
          <View style={styles.cardsContainer}>
            {Array(2)
              .fill(null)
              .map((_, index) => renderCardPicker(index))}
          </View>

          {/* Hand details */}
          <View style={styles.detailsContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount Won ($)</Text>
                <TextInput
                  style={styles.input}
                  value={currentHand.amountWon.toString()}
                  onChangeText={(text) =>
                    setCurrentHand({
                      ...currentHand,
                      amountWon: text ? parseFloat(text) : 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount Lost ($)</Text>
                <TextInput
                  style={styles.input}
                  value={currentHand.amountLost.toString()}
                  onChangeText={(text) =>
                    setCurrentHand({
                      ...currentHand,
                      amountLost: text ? parseFloat(text) : 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>

            {/* Hand outcome toggles */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  currentHand.folded && styles.toggleActive,
                ]}
                onPress={() =>
                  setCurrentHand({
                    ...currentHand,
                    folded: !currentHand.folded,
                    won: currentHand.folded ? currentHand.won : false,
                  })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    currentHand.folded && styles.toggleActiveText,
                  ]}
                >
                  Folded
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  currentHand.won && styles.toggleActive,
                ]}
                onPress={() =>
                  setCurrentHand({
                    ...currentHand,
                    won: !currentHand.won,
                    folded: currentHand.won ? currentHand.folded : false,
                  })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    currentHand.won && styles.toggleActiveText,
                  ]}
                >
                  Won
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  currentHand.vpip && styles.toggleActive,
                ]}
                onPress={() =>
                  setCurrentHand({ ...currentHand, vpip: !currentHand.vpip })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    currentHand.vpip && styles.toggleActiveText,
                  ]}
                >
                  VPIP
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button mode="contained" onPress={saveHand} style={styles.button}>
            Save Hand
          </Button>
        </Card.Content>
      </Card>

      {/* Display previous hands */}
      {hands.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Session Summary</Title>
            <Text style={styles.summaryText}>Hands Played: {hands.length}</Text>
            <Text style={styles.summaryText}>
              Hands Won: {hands.filter((h) => h.won).length}
            </Text>
            <Text style={styles.summaryText}>
              Hands Folded: {hands.filter((h) => h.folded).length}
            </Text>
            <Text style={styles.summaryText}>
              VPIP: {hands.filter((h) => h.vpip).length}
            </Text>
            <Text style={styles.summaryText}>
              Net Profit: $
              {hands
                .reduce((sum, h) => sum + h.amountWon - h.amountLost, 0)
                .toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={endSession}
        style={[styles.button, styles.endButton]}
      >
        End Session
      </Button>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Poker Session Tracker</Text>

        {isSessionActive ? renderHandTracker() : renderSessionSetup()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  selectedCardsDisplay: {
    marginBottom: 16,
  },
  selectedCardsLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  cardChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardChip: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  cardChipText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cardSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSummaryText: {
    fontSize: 18,
    fontWeight: "500",
    marginRight: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
  },
  endButton: {
    backgroundColor: "#d32f2f",
    marginBottom: 32,
  },
  cardsContainer: {
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardPickerContainer: {
    padding: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#666",
  },
  valueButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  valueButton: {
    width: "22%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 1,
    marginBottom: 4,
    borderRadius: 4,
  },
  selectedValueButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  valueButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  suitButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suitButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 2,
    borderRadius: 4,
  },
  selectedSuitButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  suitButtonText: {
    fontSize: 18,
  },
  selectedButtonText: {
    color: "#fff",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  toggleText: {
    fontWeight: "500",
  },
  toggleActiveText: {
    color: "#fff",
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default PokerSessionScreen;
