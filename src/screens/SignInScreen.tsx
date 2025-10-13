import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ALERT_TYPE,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

type SignInProps = NativeStackNavigationProp<RootStackParamList, "SignInScreen">;

const API = process.env.EXPO_PUBLIC_APP_URL + "/Chatify";

export default function SignInScreen() {
  const navigation = useNavigation<SignInProps>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState("+94");
  const [contactNo, setContactNo] = useState("");
  const [isCountryCodeFocused, setIsCountryCodeFocused] = useState(false);
  const [isContactNoFocused, setIsContactNoFocused] = useState(false);

  const logo = require('../../assets/CHATIFY-ICON-NBG.png');

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    primaryDark: '#00B359',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    inputBackground: applied === 'light' ? '#FFFFFF' : '#0F172A',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    borderFocused: '#00D26A',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    accent: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
  };

  const handleLogin = async () => {
    if (!contactNo) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Contact number is required",
      });
      return;
    }

    const cleanedCountryCode = countryCode.startsWith("+")
      ? countryCode.substring(1)
      : countryCode;

    try {
      const response = await fetch(API + "/LogIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `countryCode=${cleanedCountryCode}&contactNo=${contactNo}`,
      });

      const data = await response.json();

      if (data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "OTP sent successfully",
        });
        navigation.navigate("VerifyOtpScreen", { contactNo, countryCode });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Server error. Try again later",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar hidden={true} />
      
      {/* Decorative gradient blobs */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header Section --- */}
          <Animated.View entering={FadeInUp.duration(700)} className="items-center mb-8">
            <View>
              <Image source={logo} className="h-36 w-36" resizeMode="contain" />
            </View>
            
            <Text
              className="text-4xl font-black tracking-wider -mt-5"
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
            
            <Text
              className="text-base font-medium mt-6 text-center px-4"
              style={{ color: themeColors.textSecondary, lineHeight: 24 }}
            >
              Welcome back! Sign in to continue
            </Text>
          </Animated.View>

          {/* --- Form Card --- */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={{
              backgroundColor: themeColors.card,
              borderRadius: 28,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: applied === 'light' ? 0.08 : 0.3,
              shadowRadius: 20,
              elevation: 6,
              borderWidth: 1,
              borderColor: applied === 'light' ? '#F1F5F9' : '#1E293B',
            }}
          >
            <Text
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: themeColors.text }}
            >
              Sign In
            </Text>

            {/* Phone Number Input */}
            <View>
              <Text
                style={{
                  color: themeColors.textSecondary,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                  marginLeft: 4,
                }}
              >
                Phone Number
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* Country Code */}
                <View
                  style={{
                    backgroundColor: themeColors.inputBackground,
                    borderColor: isCountryCodeFocused
                      ? themeColors.borderFocused
                      : themeColors.border,
                    borderWidth: 2,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    width: 90,
                    justifyContent: 'center',
                    shadowColor: isCountryCodeFocused ? themeColors.primary : 'transparent',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: isCountryCodeFocused ? 4 : 0,
                  }}
                >
                  <TextInput
                    style={{
                      color: themeColors.text,
                      fontSize: 16,
                      fontWeight: '600',
                      padding: 0,
                      textAlign: 'center',
                    }}
                    value={countryCode}
                    onChangeText={setCountryCode}
                    onFocus={() => setIsCountryCodeFocused(true)}
                    onBlur={() => setIsCountryCodeFocused(false)}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Phone Number */}
                <View
                  style={{
                    backgroundColor: themeColors.inputBackground,
                    borderColor: isContactNoFocused
                      ? themeColors.borderFocused
                      : themeColors.border,
                    borderWidth: 2,
                    borderRadius: 16,
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    flex: 1,
                  //   shadowColor: isContactNoFocused ? themeColors.primary : 'transparent',
                  //   shadowOffset: { width: 0, height: 4 },
                  //   shadowOpacity: 0.15,
                  //   shadowRadius: 8,
                  //   elevation: isContactNoFocused ? 4 : 0,
                  }}
                >
                  <TextInput
                    style={{
                      color: themeColors.text,
                      fontSize: 16,
                      fontWeight: '600',
                      padding: 0,
                    }}
                    placeholder="77 #### ###"
                    placeholderTextColor={themeColors.textSecondary}
                    keyboardType="phone-pad"
                    value={contactNo}
                    onChangeText={setContactNo}
                    onFocus={() => setIsContactNoFocused(true)}
                    onBlur={() => setIsContactNoFocused(false)}
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* --- Footer / Buttons --- */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} className="mt-8">
            <Pressable
              onPress={handleLogin}
              className="h-14 w-full justify-center items-center rounded-full bg-primary shadow-lg"
            >
              <Text className="font-bold text-lg text-white tracking-wider">
                Send OTP →
              </Text>
            </Pressable>

            <View className="mt-8 flex-row justify-center items-center">
              <View 
                style={{ 
                  height: 1, 
                  flex: 1, 
                  backgroundColor: themeColors.border 
                }} 
              />
              <Text 
                className="mx-4 text-sm font-medium"
                style={{ color: themeColors.textSecondary }}
              >
                OR
              </Text>
              <View 
                style={{ 
                  height: 1, 
                  flex: 1, 
                  backgroundColor: themeColors.border 
                }} 
              />
            </View>

            <Pressable 
              onPress={() => navigation.navigate('SignUpScreen')} 
              className="mt-8"
            >
              <Text 
                className="text-center text-base"
                style={{ color: themeColors.textSecondary }}
              >
                Don't have an account?{' '}
                <Text 
                  style={{ 
                    color: themeColors.primary, 
                    fontWeight: 'bold' 
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}