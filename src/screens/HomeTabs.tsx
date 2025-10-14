import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import ProfileScreen from "./ProfileScreen";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();

  const themeColors = {
    primary: '#00D26A',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    activeText: '#00D26A',
    inactiveText: applied === 'light' ? '#94A3B8' : '#64748B',
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = "chatbubble-ellipses";
          
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Calls") iconName = "call";
          else if (route.name === "Profile") iconName = "person";

          return (
            <Ionicons
              name={iconName as any}
              size={24}
              color={focused ? themeColors.activeText : themeColors.inactiveText}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: themeColors.activeText,
        tabBarInactiveTintColor: themeColors.inactiveText,
        tabBarStyle: {
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          height: 64,
          backgroundColor: themeColors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: themeColors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="Chats" component={ChatsScreen} />
      <Tabs.Screen name="Status" component={StatusScreen} />
      <Tabs.Screen name="Calls" component={CallsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}