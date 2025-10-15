import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
// import { LinearGradient } from 'expo-linear-gradient';
import { useUserRegistration } from '../components/UserContext';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { validateFirstName, validateLastName } from '../util/Validation';
import { Ionicons } from '@expo/vector-icons';

type SignUpProps = NativeStackNavigationProp<RootStackParamList, 'SignUpScreen'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();

  const { userData, setUserData } = useUserRegistration();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar hidden={true} />

      {/* Decorative gradient blobs */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <View

            >
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
              className="text-base font-medium mt-3 text-center px-8"
              style={{ color: themeColors.textSecondary, lineHeight: 24 }}
            >
              Join thousands of users connecting{'\n'}around the world
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
            {/* --- Title --- */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              {/* <Ionicons name="person-add" size={36} color={themeColors.primary} /> */}
              <Text
                style={{
                  color: themeColors.text,
                  fontSize: 22,
                  fontWeight: '700',
                  marginTop: 8,
                }}
              >
                Create Account
              </Text>
            </View>

            {/* --- First Name --- */}
            <View style={{ marginBottom: 16 }}>
              <FloatingLabelInput
                label="First Name"
                leftComponent={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={themeColors.primary}
                    style={{ marginRight: 10 }}
                  />
                }
                value={userData.firstName}
                onChangeText={(text) =>
                  setUserData((previous) => ({
                    ...previous,
                    firstName: text,
                  }))
                }
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
                containerStyles={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: isFirstNameFocused
                    ? themeColors.borderFocused
                    : themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  shadowColor: isFirstNameFocused ? themeColors.primary : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: isFirstNameFocused ? 4 : 0,
                }}
                labelStyles={{
                  color: themeColors.textSecondary,
                  // paddingHorizontal: 1,
                  fontWeight: '500',
                }}
                customLabelStyles={{
                  colorFocused: themeColors.primary,
                  colorBlurred: themeColors.textSecondary,
                  fontSizeFocused: 13,
                }}
                inputStyles={{
                  color: themeColors.text,
                  fontSize: 16,
                  paddingTop: 18,
                  fontWeight: '500',
                }}
              />
            </View>

            {/* --- Last Name --- */}
            <View style={{ marginBottom: 8 }}>
              <FloatingLabelInput
                label="Last Name"
                leftComponent={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={themeColors.primary}
                    style={{ marginRight: 10 }}
                  />
                }
                value={userData.lastName}
                onChangeText={(text) =>
                  setUserData((previous) => ({
                    ...previous,
                    lastName: text,
                  }))
                }
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
                containerStyles={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: isLastNameFocused
                    ? themeColors.borderFocused
                    : themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  shadowColor: isLastNameFocused ? themeColors.primary : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: isLastNameFocused ? 4 : 0,
                }}
                labelStyles={{
                  color: themeColors.textSecondary,
                  // paddingHorizontal: 6,
                  fontWeight: '500',
                }}
                customLabelStyles={{
                  colorFocused: themeColors.primary,
                  colorBlurred: themeColors.textSecondary,
                  fontSizeFocused: 13,
                }}
                inputStyles={{
                  color: themeColors.text,
                  fontSize: 16,
                  paddingTop: 18,
                  fontWeight: '500',
                }}
              />
            </View>
          </Animated.View>


          {/* --- Footer / Buttons --- */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} className="mt-8">
            <Pressable
              onPress={() => {
                let validFirstName = validateFirstName(userData.firstName);
                let validLastName = validateLastName(userData.lastName);
                if (validFirstName) {
                  // skip null
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validFirstName,
                  });
                } else if (validLastName) {
                  // skip null
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validLastName,
                  });
                } else {
                  navigation.navigate("AddContactScreen");
                }
              }}
              className="h-14 w-full justify-center items-center rounded-full bg-primary shadow-lg "
            >
              <Text className="font-bold text-lg text-white tracking-wider">
                Next →
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
              onPress={() => navigation.navigate('SignInScreen')}
              className="mt-8"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                className="text-center text-base"
                style={{ color: themeColors.textSecondary }}
              >
                Already have an account?{}
                <Text
                  style={{
                    color: themeColors.primary,
                    fontWeight: 'bold'
                  }}
                >
                  Sign In
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}