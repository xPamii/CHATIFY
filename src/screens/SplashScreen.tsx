import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackNavigationProp<RootStackParamList, "SplashScreen">;

export default function SplashScreen() {

  const navigation = useNavigation<Props>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      navigation.replace("OnboardingScreen");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "0deg"],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff', '#ffffff']}
      className="flex-1 justify-center items-center"
    >
      <StatusBar hidden={true} />

      {/* Animated background circles */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 384,
          height: 384,
          backgroundColor: '#02ab13ff',
          borderRadius: 192,
          opacity: shimmerOpacity,
          top: -100,
          right: -100,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          backgroundColor: '#02ab13ff',
          borderRadius: 160,
          opacity: shimmerOpacity,
          bottom: -100,
          left: -100,
        }}
      />

      {/* Logo container with glow effect */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { rotate: rotation }]
        }}
      >
        {/* Glow effect behind logo */}
        {/* <Animated.View 
          style={{ 
            position: 'absolute',
            width: 140,
            height: 140,
            backgroundColor: '#ffffff',
            borderRadius: 70,
            opacity: shimmerOpacity,
            left: -10,
            top: -15,
            shadowColor: '#00D26A',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 30,
          }}
        /> */}
        {/* className="bg-white/5 p-6 rounded-3xl border border-white/10" */}
        <View >
          <Image
            source={require("../../assets/CHATIFY-ICON-NBG.png")}
            className="w-80 h-80"
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Brand name */}
      <Animated.View style={{ opacity: fadeAnim }} className="-mt-20 items-center">
        <Text className="text-4xl font-black text-black tracking-wider mb-1">
          CHATIFY
        </Text>
        <View className="h-1 w-24 bg-[#00D26A] rounded-full mt-3" />
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="mt-6 px-8"
      >
        <Text className="text-base text-gray-400 tracking-wide text-center font-medium">
          Connect. Chat. Share.
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={{
          opacity: shimmerOpacity,
          position: 'absolute',
          bottom: 80,
        }}
        className="flex-row space-x-20"
      >
        <View className="w-2.5 h-2.5 bg-[#000000] rounded-full" />
        <View className="w-2.5 h-2.5 bg-[#000000] rounded-full" />
        <View className="w-2.5 h-2.5 bg-[#000000] rounded-full" />
      </Animated.View>

      <Animated.View className="absolute bottom-10" style={{ opacity: fadeAnim }}>
        <View className="justify-center items-center">
          <Text className="text-xs font-bold text-slate-600 ">
            DEVELOPED BY {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text className="text-xs font-bold text-slate-600 ">
            VERSION {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}