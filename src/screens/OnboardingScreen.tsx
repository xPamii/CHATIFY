import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

const slides = [
  { 
    id: "1", 
    title: "Chat Instantly", 
    desc: "Send and receive messages in real-time with lightning-fast delivery.",
    icon: "💬"
  },
  { 
    id: "2", 
    title: "Stay Connected", 
    desc: "Connect with friends, family, and groups from anywhere in the world.",
    icon: "🌍"
  },
  { 
    id: "3", 
    title: "Secure & Private", 
    desc: "Your conversations are protected with end-to-end encryption.",
    icon: "🔒"
  },
];

type ContactProps = NativeStackNavigationProp<RootStackParamList, "OnboardingScreen">;

export default function OnboardingScreen() {
    const navigation = useNavigation<ContactProps>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { applied } = useTheme();

  const logo = require('../../assets/CHATIFY-ICON-NBG.png');

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    primaryDark: '#00B359',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    accent: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar hidden={true} />
      
      {/* Decorative gradient blobs */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -150, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <View className="flex-1">
        {/* Logo & Branding */}
        <Animated.View entering={FadeInUp.duration(800)} className="items-center mt-12">
          <View>
            <Image source={logo} className="h-32 w-32" resizeMode="contain" />
          </View>
          
          <Text
            className="text-4xl font-black tracking-wider -mt-4"
            style={{ color: themeColors.text }}
          >
            CHATIFY
          </Text>
          <View
            style={{
              height: 3,
              width: 50,
              borderRadius: 50,
              backgroundColor: themeColors.primary,
              marginTop: 6,
            }}
          />
        </Animated.View>

        {/* Slides */}
        <Animated.View entering={FadeIn.delay(200)} className="flex-1 justify-center">
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <View 
                style={{ width }} 
                className="justify-center items-center px-8"
              >
                {/* Icon Circle */}
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: themeColors.accent,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 32,
                    borderWidth: 3,
                    borderColor: themeColors.primary,
                    shadowColor: themeColors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.2,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  <Text style={{ fontSize: 56 }}>{item.icon}</Text>
                </View>

                <Text 
                  className="text-3xl font-bold mb-4 text-center"
                  style={{ color: themeColors.text }}
                >
                  {item.title}
                </Text>
                <Text 
                  className="text-base text-center leading-6 px-4"
                  style={{ color: themeColors.textSecondary }}
                >
                  {item.desc}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </Animated.View>

        {/* Pagination Dots */}
        <Animated.View entering={FadeInUp.delay(400)} className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                width: currentIndex === index ? 24 : 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? themeColors.primary : themeColors.border,
                marginHorizontal: 4,
              }}
            />
          ))}
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(600)} className="px-6 mb-8">
          <TouchableOpacity
            onPress={() => navigation.replace("SignUpScreen")}
            style={{
              height: 56,
              backgroundColor: themeColors.primary,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text className="text-white font-bold text-lg tracking-wide">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace("SignInScreen")}
            style={{
              height: 56,
              backgroundColor: 'transparent',
              borderRadius: 28,
              borderWidth: 2,
              borderColor: themeColors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text 
              className="font-bold text-lg tracking-wide"
              style={{ color: themeColors.primary }}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center">
            <Text
              className="text-sm"
              style={{ color: themeColors.textSecondary }}
            >
              By continuing, you agree to our{' '}
            </Text>
          </View>
          <View className="flex-row justify-center">
            <TouchableOpacity>
              <Text
                className="text-sm font-semibold text-center "
                style={{ color: themeColors.primary }}
              >
                Terms & Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}