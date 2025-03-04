import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabNavigator from "../components/TabNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <TabNavigator />
    </SafeAreaProvider>
  );
}
