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
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    primaryDark: '#00B359',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    inactiveIcon: applied === 'light' ? '#94A3B8' : '#64748B',
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
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // paddingTop: 20,
              }}
            >
              {focused && (
                <View
                  style={{
                    display: 'none'
                    // position: 'absolute',
                    // top: 0,
                    // width: 40,
                    // height: 4,
                    // borderRadius: 2,
                    // backgroundColor: themeColors.primary,
                  }}
                />
              )}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 22,
                  backgroundColor: focused ? themeColors.primary : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: focused ? themeColors.primary : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: focused ? 4 : 0,
                }}
              >
                <Ionicons
                  name={iconName as any}
                  size={focused ? 24 : 22}
                  color={focused ? '#FFFFFF' : themeColors.inactiveIcon}
                />
              </View>
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 10,
          // marginBottom:10
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactiveIcon,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: Platform.OS === 'ios' ? 80 : 72,
          backgroundColor: themeColors.card,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: themeColors.border,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: applied === 'light' ? 0.1 : 0.3,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          borderTopWidth: 0,
          marginLeft: 8,
          marginRight: 8,
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