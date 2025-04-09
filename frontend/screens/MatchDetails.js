import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const MatchDetails = ({ route }) => {
  const { name, matchDetails } = route.params;
  const [randomImages, setRandomImages] = useState([]);
  const [cardImages, setCardImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Dynamically load all card images from assets
    const loadCardImages = async () => {
      try {
        // Use a more dynamic approach with a mapping function
        const cardAssets = [
          require("../assets/images/cards/card1.png"),
          require("../assets/images/cards/card2.png"),
          require("../assets/images/cards/card3.png"),
          require("../assets/images/cards/card4.png"),
          require("../assets/images/cards/card5.png"),
          require("../assets/images/cards/card6.png"),
          require("../assets/images/cards/card7.png"),
          require("../assets/images/cards/card8.png"),
          // Add more as needed
        ];

        setCardImages(cardAssets);

        // Select 3 random images if we have images
        if (cardAssets.length > 0) {
          const shuffled = [...cardAssets].sort(() => 0.5 - Math.random());
          setRandomImages(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading card images:", error);
      }
    };

    loadCardImages();
  }, []);

  // Handle image change - fix the calculation for the current image index
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const imageWidth = width * 0.8; // This should match the width in your View style
    const newIndex = Math.round(contentOffsetX / imageWidth);
    setCurrentImageIndex(newIndex);
  };

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

      {/* Simple Image Carousel */}
      {randomImages.length > 0 && (
        <View style={styles.carouselContainer}>
          <Text style={styles.detail}>Match Highlights</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: width * 0.8 }}
          >
            {randomImages.map((image, index) => (
              <View
                key={index}
                style={[styles.imageContainer, { width: width * 0.8 }]}
              >
                <Image
                  source={image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {randomImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentImageIndex ? "#FFD700" : "#555",
                  },
                ]}
              />
            ))}
          </View>
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
  carouselContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    height: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default MatchDetails;
