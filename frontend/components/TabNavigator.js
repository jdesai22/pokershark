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
const EmptyScreen = () => {
  return null;
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer style={{margin: 50}}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Stats") {
              iconName = "home";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Refresh") {
              iconName = "refresh";
            } else if (route.name === "Wallet") {
              iconName = "wallet";
            } else if (route.name === "Login") {
              iconName = "log-in";
            } else if (route.name === "Signup") {
              iconName = "person-add";
            } else if (route.name === "Profile") {
              iconName = "person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: { height: 60, paddingBottom: 10 },
          headerShown: false,
        })}
        
      >
        {isAuthenticated ? (
          <>
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Search" component={MatchHistory} />
            <Tab.Screen name="Refresh" component={EmptyScreen} />
            <Tab.Screen name="Wallet" component={EmptyScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={LoginScreen} />
            <Tab.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
