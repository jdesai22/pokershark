import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Welcome to Poker Shark!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
