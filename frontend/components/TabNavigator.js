// navigation/TabNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // For icons
import StatsScreen from '../screens/StatsScreen';
import MatchHistory from '../screens/MatchHistory';

const EmptyScreen = () => {
  return null;
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Stats') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Refresh') {
              iconName = 'refresh';
            } else if (route.name === 'Wallet') {
              iconName = 'wallet';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: { height: 60, paddingBottom: 10, marginBottom: 20 },
        })}
      >
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Search" component={MatchHistory} />
        <Tab.Screen name="Refresh" component={EmptyScreen} /> 
        <Tab.Screen name="Wallet" component={EmptyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
