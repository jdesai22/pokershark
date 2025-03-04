import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
const HomePage = () => {
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation will be handled by auth state change
      navigation.navigate("Login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Email: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default HomePage;
