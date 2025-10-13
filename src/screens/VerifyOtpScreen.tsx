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
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { useState, useContext, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";

type VerifyOtpProps = NativeStackNavigationProp<RootStackParamList, "VerifyOtpScreen">;
type RouteParams = RouteProp<RootStackParamList, "VerifyOtpScreen">;

const API = process.env.EXPO_PUBLIC_APP_URL + "/Chatify";

export default function VerifyOtpScreen() {
  const navigation = useNavigation<VerifyOtpProps>();
  const route = useRoute<RouteParams>();
  const authContext = useContext(AuthContext);
  const { applied } = useTheme();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  if (!route.params) {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Error",
      textBody: "Missing parameters. Please go back and try again.",
    });
    navigation.goBack();
    return null;
  }

  const { countryCode, contactNo, userIdFromBackend } = route.params;

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Please enter complete 6-digit OTP",
      });
      return;
    }

    try {
      const response = await fetch(API + "/VerifyOtpController", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `countryCode=${countryCode}&contactNo=${contactNo}&otp=${otpString}`,
      });

      const data = await response.json();

      if (data.status && data.user) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "OTP verified successfully",
        });

        if (!authContext) {
          console.error("AuthContext not found");
          return;
        }

        await authContext.signUp(
          data.user.id?.toString() || userIdFromBackend || ""
        );
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: data.message || "Invalid OTP",
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
          {/* Back Button */}
          <Animated.View entering={FadeInUp.duration(600)}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: themeColors.card,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: themeColors.border,
                marginBottom: 20,
              }}
            >
              <Ionicons name="arrow-back" size={22} color={themeColors.text} />
            </Pressable>
          </Animated.View>

          {/* --- Header Section --- */}
          <Animated.View entering={FadeInUp.duration(700)} className="items-center mb-8">
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
            
            <Text
              className="text-base font-medium mt-6 text-center px-4"
              style={{ color: themeColors.textSecondary, lineHeight: 24 }}
            >
              We've sent a verification code to
            </Text>
            <Text
              className="text-base font-bold mt-1"
              style={{ color: themeColors.text }}
            >
              {countryCode} {contactNo}
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
              className="text-2xl font-bold mb-2 text-center"
              style={{ color: themeColors.text }}
            >
              Enter OTP
            </Text>
            <Text
              className="text-sm mb-8 text-center"
              style={{ color: themeColors.textSecondary }}
            >
              Enter the 6-digit code we sent you
            </Text>

            {/* OTP Input Boxes */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 8 }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={{
                    width: 48,
                    height: 56,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: digit ? themeColors.borderFocused : themeColors.border,
                    backgroundColor: themeColors.inputBackground,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '700',
                    color: themeColors.text,
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Resend OTP */}
            <View className="mt-6 items-center">
              <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
                Didn't receive the code?
              </Text>
              <Pressable className="mt-2">
                <Text 
                  style={{ 
                    color: themeColors.primary, 
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  Resend OTP
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* --- Footer / Buttons --- */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} className="mt-8">
            <Pressable
              onPress={handleVerifyOtp}
              className="h-14 w-full justify-center items-center rounded-full bg-primary shadow-lg"
            >
              <Text className="font-bold text-lg text-white tracking-wider">
                Verify & Continue →
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
                SECURE VERIFICATION
              </Text>
              <View 
                style={{ 
                  height: 1, 
                  flex: 1, 
                  backgroundColor: themeColors.border 
                }} 
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}