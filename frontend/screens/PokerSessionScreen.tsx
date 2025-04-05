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
  Modal,
} from "react-native";
import { Card, Title, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { firestore } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";

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
  photoUri?: string; // Add photo URI to hand data
  handNotation?: string; // Add hand notation field
}

interface WonHandSummary {
  handNotation: string;
  amountWon: number;
  photoUri?: string;
}

interface SessionSummary {
  name: string;
  buy_in: number;
  date: string;
  final_amount: number;
  hands_folded: number;
  hands_played: number;
  hands_won: number;
  hands_won_details: string[];
  vpip_hands: number;
}

const PokerSessionScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [buyIn, setBuyIn] = useState("");
  const [sessionName, setSessionName] = useState("");
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

  // Add camera-related state
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = React.useRef<CameraView>(null);

  // Start a new session
  const startSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Invalid Input", "Please enter a session name");
      return;
    }

    if (!buyIn || isNaN(parseFloat(buyIn)) || parseFloat(buyIn) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid buy-in amount");
      return;
    }

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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

  // Handle taking a photo
  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos."
        );
        return;
      }
    }
    setIsCameraVisible(true);
  };

  // Handle photo capture
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCurrentHand({ ...currentHand, photoUri: photo.uri });
        setIsCameraVisible(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    }
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

  // Format cards into poker notation (e.g., KQo for offsuit, KQs for suited)
  const getHandNotation = (cards: { suit: string; value: string }[]) => {
    if (cards.length !== 2) return "";

    // Sort values so higher card comes first
    const cardValues = CARD_VALUES;
    const sortedCards = [...cards].sort(
      (a, b) => cardValues.indexOf(b.value) - cardValues.indexOf(a.value)
    );

    const notation = sortedCards[0].value + sortedCards[1].value;
    const isSuited = sortedCards[0].suit === sortedCards[1].suit;

    return notation + (isSuited ? "s" : "o");
  };

  // Save the current hand and prepare for the next one
  const saveHand = async () => {
    // Provide haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Add hand notation before saving
    const handWithNotation = {
      ...currentHand,
      handNotation: getHandNotation(currentHand.cards),
    };

    // Validate hand data if needed
    setHands([...hands, handWithNotation]);
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

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Calculate session summary
    const handsPlayed = hands.length;
    const handsFolded = hands.filter((hand) => hand.folded).length;
    const handsWon = hands.filter((hand) => hand.won).length;
    const handsWonDetails: string[] = hands
      .filter((hand) => hand.won)
      .map((hand) => hand.handNotation || "");
    const vpipHands = hands.filter((hand) => hand.vpip).length;

    // Calculate final amount (buy-in + total won - total lost)
    const totalWon = hands.reduce((sum, hand) => sum + hand.amountWon, 0);
    const totalLost = hands.reduce((sum, hand) => sum + hand.amountLost, 0);
    const finalAmount = parseFloat(buyIn) + totalWon - totalLost;

    const sessionSummary: SessionSummary = {
      name: sessionName,
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
      // await addDoc(collection(firestore, "poker-sessions"), {
      //   userId: user.uid,
      //   ...sessionSummary,
      // });
      console.log(sessionSummary);

      Alert.alert(
        "Session Saved",
        "Your poker session has been saved successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setIsSessionActive(false);
              setBuyIn("");
              setSessionName("");
              setHands([]);
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

  // Render camera modal
  const renderCameraModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isCameraVisible}
      onRequestClose={() => setIsCameraVisible(false)}
    >
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          mode="picture"
          facing="back"
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsCameraVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );

  // Render photo preview
  const renderPhotoPreview = () => (
    <View style={styles.photoPreviewContainer}>
      {currentHand.photoUri ? (
        <>
          <Image
            source={{ uri: currentHand.photoUri }}
            style={styles.photoPreview}
          />
          <TouchableOpacity
            style={styles.removePhotoButton}
            onPress={() =>
              setCurrentHand({ ...currentHand, photoUri: undefined })
            }
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.addPhotoButton}
          onPress={handleTakePhoto}
        >
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render the session setup form
  const renderSessionSetup = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>Start New Poker Session</Title>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Name</Text>
          <TextInput
            style={styles.input}
            value={sessionName}
            onChangeText={setSessionName}
            placeholder="Enter session name (e.g., Friday Night Game)"
            autoCapitalize="words"
          />
        </View>

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

          {/* Add photo preview section */}
          {renderPhotoPreview()}

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
      {renderCameraModal()}
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
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  closeButton: {
    padding: 8,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "white",
  },
  photoPreviewContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  addPhotoText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default PokerSessionScreen;
