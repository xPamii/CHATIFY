import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, Pressable, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import ProfileScreen from "./ProfileScreen";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();

  const themeColors = {
    primary: "#00D26A",
    background: applied === "light" ? "#F8FAFC" : "#0A0F1C",
    card: applied === "light" ? "#FFFFFF" : "#1E293B",
    inactiveIcon: applied === "light" ? "#94A3B8" : "#64748B",
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = "chatbubble-ellipses";
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Calls") iconName = "call";
          else if (route.name === "Profile") iconName = "person";

          const scaleAnim = useRef(new Animated.Value(1)).current;
          useEffect(() => {
            Animated.spring(scaleAnim, {
              toValue: focused ? 1.15 : 1,
              useNativeDriver: true,
              friction: 6,
            }).start();
          }, [focused]);

          return (
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? themeColors.primary : "transparent",
                borderRadius: 20,
                padding: 10,
                elevation: focused ? 5 : 0,
              }}
            >
              <Ionicons
                name={iconName as any}
                size={24}
                color={focused ? "#fff" : color}
              />
            </Animated.View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 8 : 4,
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactiveIcon,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 16,
          marginBottom: 16,
          height: 68,
          borderRadius: 20,
          backgroundColor: themeColors.card,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 10,
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
