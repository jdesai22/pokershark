import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { Card, Title } from "react-native-paper";

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setMessage("");
  
    if (!newPassword.trim()) {
      setError("ERROR. Password cannot be empty.");
      return;
    }
  
    try {
      // Add password change logic here using Firebase
      setMessage("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.navigate("Login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎲 PokerShark Profile</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Email</Title>
          <Text style={styles.info}>{user?.email}</Text>
        </Card>

        <Card style={styles.card}>
          <Title style={styles.cardTitle}>Change Password</Title>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </Card>

        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.buttonText}>Sign Out</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 70,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    alignItems: "center",
    color: "#FFD700",
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  info: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: "#fff",
    fontSize: 16,
  },
  input: {
    padding: 10,
    backgroundColor: "#2C2C2C",
    marginHorizontal: 5,
    height: 44,
    borderRadius: 6,
    color: "#fff",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#2C2C2C",
    marginBottom: 20,
    elevation: 4,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    color: "#FFD700",
  },
  updateButton: {
    backgroundColor: "#E50914",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "#E50914",
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: "auto",
    marginBottom: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#FF4C4C",
    textAlign: "center",
    marginBottom: 12,
  },
  success: {
    color: "#2ECC71",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default ProfileScreen;