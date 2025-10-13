import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, TouchableOpacity, View, ScrollView, StatusBar, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { useTheme } from "../theme/ThemeProvider";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

type NewContactScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewContactScreen"
>;

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPhoneNoFocused, setIsPhoneNoFocused] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    inputBackground: applied === 'light' ? '#FFFFFF' : '#0F172A',
    borderFocused: '#00D26A',
    headerBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    accent: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: themeColors.headerBg
      },
      headerTintColor: themeColors.text,
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: themeColors.text }}>
              New Contact
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, themeColors]);

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName: firstName,
      lastName: lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
      setFirstName("");
      setLastName("");
      setCallingCode("+94");
      setPhoneNo("");
      navigation.goBack();
    }, 2000);
  };

  const handleSave = () => {
    const firstNameValid = validateFirstName(firstName);
    const lastNameValid = validateLastName(lastName);
    const countryCodeValid = validateCountryCode(callingCode);
    const phoneNoValid = validatePhoneNo(phoneNo);

    if (firstNameValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: firstNameValid,
      });
    } else if (lastNameValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: lastNameValid,
      });
    } else if (countryCodeValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: countryCodeValid,
      });
    } else if (phoneNoValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: phoneNoValid,
      });
    } else {
      sendData();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar
        backgroundColor={themeColors.headerBg}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />

      {/* Decorative gradient blobs */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(700)}>
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: themeColors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="person-add" size={40} color={themeColors.primary} />
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: themeColors.text, marginBottom: 8 }}>
              Add New Contact
            </Text>
            <Text style={{ fontSize: 15, color: themeColors.textSecondary, lineHeight: 22 }}>
              Enter contact details to add a new person to your network
            </Text>
          </View>
        </Animated.View>

        {/* Form Card */}
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
          {/* First Name */}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: themeColors.inputBackground,
                borderColor: isFirstNameFocused ? themeColors.borderFocused : themeColors.border,
                borderWidth: 2,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
            >
              <Ionicons name="person-outline" size={20} color={themeColors.primary} style={{ marginRight: 10 }} />
              <FloatingLabelInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
                containerStyles={{ flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
                labelStyles={{
                  color: themeColors.textSecondary,
                  paddingHorizontal: 0,
                  fontWeight: '500',
                }}
                customLabelStyles={{
                  colorFocused: themeColors.primary,
                  colorBlurred: themeColors.textSecondary,
                  fontSizeFocused: 12,
                }}
                inputStyles={{
                  color: themeColors.text,
                  fontSize: 16,
                  paddingTop: 16,
                  fontWeight: '500',
                }}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: themeColors.inputBackground,
                borderColor: isLastNameFocused ? themeColors.borderFocused : themeColors.border,
                borderWidth: 2,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
            >
              <Ionicons name="person-outline" size={20} color={themeColors.primary} style={{ marginRight: 10 }} />
              <FloatingLabelInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
                containerStyles={{ flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
                labelStyles={{
                  color: themeColors.textSecondary,
                  paddingHorizontal: 0,
                  fontWeight: '500',
                }}
                customLabelStyles={{
                  colorFocused: themeColors.primary,
                  colorBlurred: themeColors.textSecondary,
                  fontSizeFocused: 12,
                }}
                inputStyles={{
                  color: themeColors.text,
                  fontSize: 16,
                  paddingTop: 16,
                  fontWeight: '500',
                }}
              />
            </View>
          </View>

          {/* Country Picker */}
          <View style={{ marginBottom: 20 }}>
            <Pressable
              onPress={() => setShow(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: themeColors.inputBackground,
                borderColor: themeColors.border,
                borderWidth: 2,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
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
              <Ionicons name="chevron-down" size={20} color={themeColors.textSecondary} />
            </Pressable>
          </View>

          {/* Phone Number */}
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Country Code */}
              <View
                style={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  width: '25%',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: themeColors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 4 }}>
                  Code
                </Text>
                <Text style={{ color: themeColors.text, fontSize: 16, fontWeight: '600' }}>
                  {country ? `+${country.callingCode}` : callingCode}
                </Text>
              </View>

              {/* Phone Number */}
              <View
                style={{
                  backgroundColor: themeColors.inputBackground,
                  borderColor: isPhoneNoFocused ? themeColors.borderFocused : themeColors.border,
                  borderWidth: 2,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  flex: 1,
                }}
              >
                <FloatingLabelInput
                  label="Phone Number"
                  inputMode="tel"
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  onFocus={() => setIsPhoneNoFocused(true)}
                  onBlur={() => setIsPhoneNoFocused(false)}
                  containerStyles={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
                  labelStyles={{
                    color: themeColors.textSecondary,
                    paddingHorizontal: 0,
                    fontWeight: '500',
                  }}
                  customLabelStyles={{
                    colorFocused: themeColors.primary,
                    colorBlurred: themeColors.textSecondary,
                    fontSizeFocused: 12,
                  }}
                  inputStyles={{
                    color: themeColors.text,
                    fontSize: 16,
                    paddingTop: 16,
                    fontWeight: '500',
                  }}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={{ marginTop: 32, marginBottom: 40 }}>
          <Pressable
            onPress={handleSave}
            style={{
              height: 56,
              backgroundColor: themeColors.primary,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 }}>
              Save Contact
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent animationType="fade" visible={successModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.card,
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: themeColors.border,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: themeColors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons name="checkmark-circle" size={50} color={themeColors.primary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: themeColors.text, marginBottom: 8 }}>
              Contact Added!
            </Text>
            <Text style={{ fontSize: 15, color: themeColors.textSecondary, textAlign: 'center' }}>
              {firstName} {lastName} has been added to your contacts
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}