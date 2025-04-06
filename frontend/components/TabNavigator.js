// navigation/TabNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // For icons
import StatsScreen from "../screens/StatsScreen";
import MatchHistory from "../screens/MatchHistory";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { useAuth } from "../hooks/useAuth";
import ProfileScreen from "../screens/ProfileScreen";
import SocialScreen from "@/screens/SocialScreen";
import MatchDetails from "../screens/MatchDetails";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../screens/CameraScreen";
import Dimming from "../screens/Dimming";
import PokerSessionScreen from "../screens/PokerSessionScreen";

const EmptyScreen = () => {
  return null;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Stats") {
            iconName = "home";
          } else if (route.name === "History") {
            iconName = "search";
          } else if (route.name === "Dimming") {
            iconName = "bulb";
          } else if (route.name === "Login") {
            iconName = "log-in";
          } else if (route.name === "Signup") {
            iconName = "person-add";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Social") {
            iconName = "chatbubbles";
          } else if (route.name === "Camera") {
            iconName = "camera";
          } else if (route.name === "Sessions") {
            iconName = "card";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: { height: 60, paddingBottom: 10 },
        headerShown: false,
      })}
    >
      {isAuthenticated ? (
        <>
          <Tab.Screen name="Stats" component={StatsScreen} />
          <Tab.Screen name="History" component={MatchHistory} />
          <Tab.Screen name="Dimming" component={Dimming} />
          <Tab.Screen name="Sessions" component={PokerSessionScreen} />
          <Tab.Screen name="Camera" component={CameraScreen} />
          <Tab.Screen name="Social" component={SocialScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

// export default TabNavigator; leaving this here in case the AppNavigator does not work

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide tab navigator header
        />
        <Stack.Screen name="Match Details" component={MatchDetails} />
        <Stack.Screen name="Poker Session" component={PokerSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
