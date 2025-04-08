import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from "react-native";
import { DeviceMotion } from "expo-sensors";
import * as Brightness from "expo-brightness";
import * as Haptics from "expo-haptics";
import Slider from "@react-native-community/slider";

export default function MotionSensorScreen() {
  const [motionData, setMotionData] = useState(null);
  const [brightnessReduced, setBrightnessReduced] = useState(false);
  const [dimmingEnabled, setDimmingEnabled] = useState(true);
  const [brightnessLevel, setBrightnessLevel] = useState(1);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      subscription = DeviceMotion.addListener((motion) => {
        setMotionData(motion);
        if (dimmingEnabled) {
          if (motion.rotation?.beta > 0.8) {
            Brightness.setSystemBrightnessAsync(brightnessLevel);
            setBrightnessReduced(true);
          } else {
            Brightness.setSystemBrightnessAsync(0);
            setBrightnessReduced(false);
          }
        }
      });
      await DeviceMotion.setUpdateInterval(100);
    };

    subscribe();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [dimmingEnabled, brightnessLevel]);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        Brightness.setSystemBrightnessAsync(1);
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>❤️ PokerShark Dimming</Text>
      {brightnessReduced && (
        <Text style={styles.brightnessStatus}>Brightening Screen</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setDimmingEnabled(!dimmingEnabled);
        }}
        style={styles.updateButton}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
          {dimmingEnabled ? "Disable Dimming" : "Enable Dimming"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.adjustText}>Adjust Maximum Brightness Level:</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={brightnessLevel}
        onValueChange={setBrightnessLevel}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#000000"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFD700", 
  },
  brightnessStatus: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  adjustText: {
    marginTop: 20,
    color: "#FFD700",
    fontSize: 16,
  },
  slider: {
    width: "80%",
    height: 40,
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#E50914", 
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
});
