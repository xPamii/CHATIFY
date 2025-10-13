import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

type AvatarScreenProps = NativeStackNavigationProp<RootStackParamList, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const { applied } = useTheme();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

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
    avatarBg: applied === 'light' ? '#F1F5F9' : '#1E293B',
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const avatars = [
    require("../../assets/avatar/avatar_1.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar hidden={true} />
      
      {/* Decorative gradient blobs */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: themeColors.primary, opacity: 0.1 }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: themeColors.primary, opacity: 0.08 }} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
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
            Choose a profile picture to{'\n'}complete your account
          </Text>
        </Animated.View>

        {/* --- Avatar Selection Card --- */}
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
            Profile Picture
          </Text>

          {/* Profile Image Upload */}
          <View className="items-center mb-6">
            <Pressable
              onPress={pickImage}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View
                style={{
                  height: 140,
                  width: 140,
                  borderRadius: 70,
                  backgroundColor: themeColors.avatarBg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: image ? themeColors.primary : themeColors.border,
                  borderStyle: image ? 'solid' : 'dashed',
                  shadowColor: themeColors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: image ? 0.3 : 0,
                  shadowRadius: 12,
                  elevation: image ? 6 : 0,
                }}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      height: 134,
                      width: 134,
                      borderRadius: 67,
                    }}
                  />
                ) : (
                  <View className="items-center">
                    <View
                      style={{
                        height: 48,
                        width: 48,
                        borderRadius: 24,
                        backgroundColor: themeColors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Text className="font-bold text-3xl text-white">+</Text>
                    </View>
                    <Text
                      className="font-semibold text-sm"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Add Photo
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: themeColors.border,
              }}
            />
            <Text
              className="mx-4 text-sm font-medium"
              style={{ color: themeColors.textSecondary }}
            >
              OR CHOOSE AVATAR
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: themeColors.border,
              }}
            />
          </View>

          {/* Avatar Grid */}
          <FlatList
            data={avatars}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeIn.delay(300 + index * 50)}>
                <Pressable
                  onPress={() => {
                    const uri = Image.resolveAssetSource(item).uri;
                    setImage(uri);
                    setUserData((previous) => ({
                      ...previous,
                      profileImage: uri,
                    }));
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      height: 72,
                      width: 72,
                      borderRadius: 36,
                      marginHorizontal: 6,
                      borderWidth: 2,
                      borderColor: themeColors.border,
                      overflow: 'hidden',
                      backgroundColor: themeColors.avatarBg,
                    }}
                  >
                    <Image
                      source={item}
                      style={{
                        height: 68,
                        width: 68,
                        borderRadius: 34,
                      }}
                    />
                  </View>
                </Pressable>
              </Animated.View>
            )}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>

        {/* --- Footer / Button --- */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} className="mt-8">
          <Pressable
            disabled={loading}
            onPress={async () => {
              const validProfile = validateProfileImage(
                userData.profileImage
                  ? { uri: userData.profileImage, type: "", fileSize: 0 }
                  : null
              );
              if (validProfile) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: "Select a profile image or an avatar",
                });
              } else {
                try {
                  setLoading(true);
                  const response = await createNewAccount(userData);
                  if (response.status) {
                    const id = response.userId;
                    if (auth) {
                      await auth.signUp(String(id));
                    }
                  } else {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: response.message,
                    });
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }
            }}
            style={{
              height: 56,
              backgroundColor: loading ? themeColors.border : themeColors.primary,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: loading ? 0 : 0.3,
              shadowRadius: 16,
              elevation: loading ? 0 : 8,
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color={themeColors.primary} />
            ) : (
              <Text className="font-bold text-lg text-white tracking-wider">
                Create Account
              </Text>
            )}
          </Pressable>

          <View className="mt-8 flex-row justify-center items-center">
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: themeColors.border,
              }}
            />
            <Text
              className="mx-4 text-sm font-medium"
              style={{ color: themeColors.textSecondary }}
            >
              FINAL STEP
            </Text>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: themeColors.border,
              }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}