import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
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
        <Image
          source={{ uri: "" }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.title}>Profile</Text>
        <Image
          source={{
            uri: "https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg",
          }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
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
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title="Update Password" onPress={handleChangePassword} />
        </Card>
        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.newPostButton}>
          <Text style={styles.buttonText}>Sign Out</Text>
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
    justifyContent: "space-between",
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
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  info: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  input: {
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    height: 40,
    borderRadius: 5,
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
  newPostButton: {
    backgroundColor: 'black',
    padding: 15,
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    justifySelf: 'end',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default ProfileScreen;
