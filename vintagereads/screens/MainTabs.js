import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Library from './Library';
import UserProfile from './UserProfile';
import Wishlist from './WishlistScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Library') {
            iconName = 'book'; 
          } else if (route.name === 'UserProfile') {
            iconName = 'person'; 
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#006f61',  // Dark teal color for active icon
        tabBarInactiveTintColor: '#b0b0b0',  // Lighter gray for inactive icon
        tabBarStyle: {
          backgroundColor: '#004d47',  // Dark teal background for the tab bar
          height: 60, 
          paddingBottom: 5,
          paddingTop: 5,
          borderTopWidth: 0, 
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5, 
          color: '#b0b0b0', // Light gray for the label
        },
        headerShown: false, 
      })}
    >
      {/* Home Tab */}
      <Tab.Screen 
        name="Home" 
        component={Library} 
        options={{
          tabBarLabel: 'Home',
        }} 
      />
      <Tab.Screen 
        name="Library" 
        component={Wishlist} 
        options={{
          tabBarLabel: 'Library',
        }} 
      />
      
      {/* User Profile Tab */}
      <Tab.Screen 
        name="UserProfile" 
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile',
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
