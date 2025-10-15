import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function StatusScreen() {
  const { applied } = useTheme();

  // Re-using the same theme colors for consistency
  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A', // Consistent primary color
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    accent: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar
        backgroundColor={themeColors.background}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />

      {/* Decorative gradient blobs (Same as CallsScreen for visual continuity) */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
      >
        {/* Main Icon */}
        <Animated.View entering={FadeInUp.duration(700)} style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: themeColors.accent,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              borderWidth: 3,
              borderColor: themeColors.primary,
            }}
          >
            {/* Status-relevant Icon: Use 'refresh-circle' or 'create' for temporary status */}
            <Ionicons name="refresh-circle" size={70} color={themeColors.primary} /> 
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: themeColors.text,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Status Updates Soon
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 16,
              color: themeColors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: -10,
            }}
          >
            Share moments and updates with your contacts using temporary photo and video statuses.
          </Text>
        </Animated.View>

        {/* Features Preview */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <View
            style={{
              backgroundColor: themeColors.card,
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: themeColors.border,
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: themeColors.text,
                marginBottom: 20,
              }}
            >
              Key Features
            </Text>

            {/* Feature Item 1: Photo Status */}
            <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: themeColors.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons name="camera" size={24} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: themeColors.text,
                    marginBottom: 4,
                  }}
                >
                  Photo & Video Updates
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Share photos and short videos that disappear after 24 hours.
                </Text>
              </View>
            </View>

            {/* Feature Item 2: Text Status */}
            <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: themeColors.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons name="text" size={24} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: themeColors.text,
                    marginBottom: 4,
                  }}
                >
                  Text Statuses
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Use colorful backgrounds to share simple text updates.
                </Text>
              </View>
            </View>

            {/* Feature Item 3: Privacy Control */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: themeColors.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons name="eye-off" size={24} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: themeColors.text,
                    marginBottom: 4,
                  }}
                >
                  Granular Privacy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Control exactly who can view your status updates.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notification Banner (Re-used as a call to action) */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)}>
          <View
            style={{
              backgroundColor: themeColors.primary,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <Ionicons name="notifications" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: 2,
                }}
              >
                Stay Informed
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                We'll notify you as soon as status updates are available.
              </Text>
            </View>
          </View>

          {/* Extra padding at bottom */}
          <View style={{ height: 50 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}