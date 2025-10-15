import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function CallsScreen() {
  const { applied } = useTheme();

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
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

      {/* Decorative gradient blobs */}
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
            <Ionicons name="phone-portrait" size={70} color={themeColors.primary} />
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
            Calls Coming Soon
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
            Crystal-clear voice and video calls are on the way. Stay tuned for this exciting feature!
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
              What's Coming
            </Text>

            {/* Feature Item 1 */}
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
                <Ionicons name="call" size={24} color={themeColors.primary} />
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
                  Voice Calls
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  High-quality voice conversations with friends and contacts
                </Text>
              </View>
            </View>

            {/* Feature Item 2 */}
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
                <Ionicons name="videocam" size={24} color={themeColors.primary} />
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
                  Video Calls
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Face-to-face video calls with crystal clear quality
                </Text>
              </View>
            </View>

            {/* Feature Item 3 */}
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
                <Ionicons name="people" size={24} color={themeColors.primary} />
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
                  Group Calls
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Connect with multiple people at once
                </Text>
              </View>
            </View>

            {/* Feature Item 4 */}
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
                <Ionicons name="shield-checkmark" size={24} color={themeColors.primary} />
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
                  Secure & Private
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: themeColors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  End-to-end encryption for all calls
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notification Banner */}
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
                Get Notified
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                We'll notify you when this feature launches
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