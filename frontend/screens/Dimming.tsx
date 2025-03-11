import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import * as Brightness from 'expo-brightness';

export default function MotionSensorScreen() {
  const [motionData, setMotionData] = useState(null);
  const [brightnessReduced, setBrightnessReduced] = useState(false);

  useEffect(() => {
    let subscription;
    
    const subscribe = async () => {
      subscription = DeviceMotion.addListener((motion) => {
        setMotionData(motion);
        if (
          motion.rotation?.alpha > 0.8 ||
          motion.rotation?.beta > 0.8 ||
          motion.rotation?.gamma > 0.8
        ) {
          Brightness.setSystemBrightnessAsync(1);
          setBrightnessReduced(true);
        } else {
          Brightness.setSystemBrightnessAsync(0);
          setBrightnessReduced(false);
        }
      });
      await DeviceMotion.setUpdateInterval(100); // Updates every 100ms
    };

    subscribe();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        Brightness.setSystemBrightnessAsync(1);
      }
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Device Motion Data
      </Text>
      {brightnessReduced && (
        <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold' }}>
          Brightening Screen
        </Text>
      )}
      {motionData ? (
        <View>
          <Text>Acceleration (G):</Text>
          <Text>X: {motionData.acceleration?.x?.toFixed(4)}</Text>
          <Text>Y: {motionData.acceleration?.y?.toFixed(4)}</Text>
          <Text>Z: {motionData.acceleration?.z?.toFixed(4)}</Text>

          <Text style={{ marginTop: 10 }}>Acceleration with Gravity (G):</Text>
          <Text>X: {motionData.accelerationIncludingGravity?.x?.toFixed(4)}</Text>
          <Text>Y: {motionData.accelerationIncludingGravity?.y?.toFixed(4)}</Text>
          <Text>Z: {motionData.accelerationIncludingGravity?.z?.toFixed(4)}</Text>

          <Text style={{ marginTop: 10 }}>Rotation Rate (deg/s):</Text>
          <Text>Alpha: {motionData.rotation?.alpha?.toFixed(4)}</Text>
          <Text>Beta: {motionData.rotation?.beta?.toFixed(4)}</Text>
          <Text>Gamma: {motionData.rotation?.gamma?.toFixed(4)}</Text>

          <Text style={{ marginTop: 10 }}>Orientation:</Text>
          <Text>Pitch: {motionData.orientation?.pitch?.toFixed(4)}</Text>
          <Text>Roll: {motionData.orientation?.roll?.toFixed(4)}</Text>
          <Text>Yaw: {motionData.orientation?.yaw?.toFixed(4)}</Text>
        </View>
      ) : (
        <Text>Waiting for motion data...</Text>
      )}
    </ScrollView>
  );
}
