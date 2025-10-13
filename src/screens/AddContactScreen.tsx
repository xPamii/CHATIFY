import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

type ContactProps = NativeStackNavigationProp<RootStackParamList, "AddContactScreen">;

export default function AddContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  

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
              We use your contacts to help you find friends who are already on the app. Your contacts stay private.
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
              Add Phone Number
            </Text>

            {/* Country Picker */}
            <Pressable
              onPress={() => setShow(true)}
              style={{
                backgroundColor: themeColors.inputBackground,
                borderColor: themeColors.border,
                borderWidth: 2,
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 16,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCountryNameButton
                  withCallingCode
                  visible={show}
                  onClose={() => setShow(false)}
                  onSelect={(c) => {
                    setCountryCode(c.cca2);
                    setCountry(c);
                    setCallingCode(`+${c.callingCode}`);
                    setShow(false);
                  }}
                />
              </View>
              <AntDesign
                name="caret-down"
                size={16}
                color={themeColors.textSecondary}
              />
            </Pressable>

            {/* Phone Number Input */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Country Code */}
              <View
                style={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 18,
                  paddingVertical: 4,
                  width: '25%',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 4,
                  }}
                >
                  Code
                </Text>
                <TextInput
                  inputMode="tel"
                  style={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontWeight: '600',
                    padding: 0,
                  }}
                  editable={false}
                  value={country ? `+${country.callingCode}` : callingCode}
                />
              </View>

              {/* Phone Number */}
              <View
                style={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 18,
                  paddingVertical: 4,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 4,
                  }}
                >
                  Phone Number
                </Text>
                <TextInput
                  inputMode="tel"
                  style={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontWeight: '600',
                    padding: 0,
                  }}
                  placeholder="77 #### ###"
                  placeholderTextColor={themeColors.textSecondary}
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                />
              </View>
            </View>
          </Animated.View>

          {/* --- Footer / Buttons --- */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} className="mt-8">
            <Pressable
              onPress={() => {
                const validCountryCode = validateCountryCode(callingCode);
                const validPhoneNo = validatePhoneNo(phoneNo);

                if (validCountryCode) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validCountryCode,
                  });
                } else if (validPhoneNo) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: validPhoneNo,
                  });
                } else {
                  setUserData((previous) => ({
                    ...previous,
                    countryCode: country ? `+${country.callingCode}` : callingCode,
                    contactNo: phoneNo,
                  }));
                  navigation.replace("AvatarScreen");
                }
              }}
              className="h-14 w-full justify-center items-center rounded-full bg-primary shadow-lg"
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
                STEP 2 OF 3
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