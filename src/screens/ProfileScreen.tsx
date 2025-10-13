import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View, ScrollView, TextInput, Alert, Modal, Pressable } from "react-native";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

type ProfileScreenProp = NativeStackNavigationProp<RootStackParamList, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const auth = useContext(AuthContext);

  const [image, setImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'bio' | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [bio, setBio] = useState("Hey there! I'm using Chatify");

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    headerBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    inputBg: applied === 'light' ? '#F8FAFC' : '#0F172A',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: themeColors.headerBg
      },
      headerTintColor: themeColors.text,
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 18,
      },
    });
  }, [navigation, applied]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
    }
  };

  const openEditModal = (field: 'name' | 'bio', currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (editingField === 'bio') {
      setBio(tempValue);
    }
    // Add API call to update backend
    setEditModalVisible(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => auth && auth.signOut(),
        },
      ],
      { cancelable: true }
    );
  };

  const ProfileInfoCard = ({
    icon,
    label,
    value,
    onEdit,
    showBorder = true
  }: {
    icon: string;
    label: string;
    value: string;
    onEdit?: () => void;
    showBorder?: boolean;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: themeColors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon as any} size={20} color={themeColors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginBottom: 4, fontWeight: '500' }}>
          {label}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: themeColors.text }}>
          {value}
        </Text>
      </View>

      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="pencil" size={20} color={themeColors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const ActionButton = ({
    icon,
    label,
    onPress,
    color = themeColors.primary
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: themeColors.card,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themeColors.border,
      }}
    >
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={{ fontSize: 12, fontWeight: '600', color: themeColors.text, marginTop: 8 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header Section */}
        <Animated.View entering={FadeInUp.duration(600)}>
          <View
            style={{
              backgroundColor: themeColors.card,
              paddingTop: 40,
              paddingBottom: 24,
              alignItems: 'center',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: themeColors.border,
            }}
          >
            {/* Profile Image */}
            <View style={{ position: 'relative', marginBottom: 16 }}>
              <Image
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 4,
                  borderColor: themeColors.primary,
                }}
                source={{ uri: image || userProfile?.profileImage }}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: themeColors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: themeColors.card,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={{ fontSize: 24, fontWeight: '800', color: themeColors.text, marginBottom: 4 }}>
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>

            {/* Phone */}
            <Text style={{ fontSize: 15, color: themeColors.textSecondary, fontWeight: '500' }}>
              {userProfile?.countryCode} {userProfile?.contactNo}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <ActionButton
                icon="share-social"
                label="Share Profile"
                onPress={() => Alert.alert("Share", "Share your profile with others")}
              />
              <ActionButton
                icon="qr-code"
                label="QR Code"
                onPress={() => Alert.alert("QR Code", "Show your QR code")}
              />
              <ActionButton
                icon="settings"
                label="Settings"
                onPress={() => navigation.navigate("SettingScreen")}
              />
            </View>
          </View>
        </Animated.View>

        {/* Profile Information Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: themeColors.textSecondary,
                marginBottom: 12,
                marginLeft: 4,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Personal Information
            </Text>
            <View
              style={{
                backgroundColor: themeColors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: themeColors.border,
                overflow: 'hidden',
              }}
            >
              <ProfileInfoCard
                icon="person"
                label="Name"
                value={`${userProfile?.firstName} ${userProfile?.lastName}`}
                onEdit={() => openEditModal('name', `${userProfile?.firstName} ${userProfile?.lastName}`)}
              />
              <ProfileInfoCard
                icon="call"
                label="Phone Number"
                value={`${userProfile?.countryCode} ${userProfile?.contactNo}`}
              />
              <ProfileInfoCard
                icon="chatbox-ellipses"
                label="Bio"
                value={bio}
                onEdit={() => openEditModal('bio', bio)}
                showBorder={false}
              />
            </View>
          </View>
        </Animated.View>

        {/* Account Statistics */}
        {/* <Animated.View entering={FadeInDown.delay(400).duration(600)}> */}
        {/* <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: themeColors.textSecondary,
                marginBottom: 12,
                marginLeft: 4,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Statistics
            </Text>
            <View
              style={{
                backgroundColor: themeColors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: themeColors.border,
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: themeColors.primary }}>
                  142
                </Text>
                <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 4, fontWeight: '500' }}>
                  Chats
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: themeColors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: themeColors.primary }}>
                  1.2K
                </Text>
                <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 4, fontWeight: '500' }}>
                  Messages
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: themeColors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: themeColors.primary }}>
                  89
                </Text>
                <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 4, fontWeight: '500' }}>
                  Groups
                </Text>
              </View>
            </View>
          </View> */}
        {/* </Animated.View> */}
        {/* Account Statistics End*/}


        {/* Privacy & Security */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: themeColors.textSecondary,
                marginBottom: 12,
                marginLeft: 4,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Privacy & Security
            </Text>
            <View
              style={{
                backgroundColor: themeColors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: themeColors.border,
                overflow: 'hidden',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: themeColors.border,
                }}
                onPress={() => Alert.alert("Blocked Contacts", "No blocked contacts")}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="ban" size={20} color={themeColors.primary} />
                </View>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: themeColors.text }}>
                  Blocked Contacts
                </Text>
                <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                }}
                onPress={() => Alert.alert("Two-Step Verification", "Enable extra security")}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="shield-checkmark" size={20} color={themeColors.primary} />
                </View>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: themeColors.text }}>
                  Two-Step Verification
                </Text>
                <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Signout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={{ paddingHorizontal: 16, marginBottom: 50 }}>
            <Pressable
              onPress={() => auth && auth.signOut()}
              className="h-14 w-full justify-center items-center rounded-xl bg-red-600 shadow-lg "
            >
              <Text className="font-bold text-lg text-white tracking-wider">
                Signout
              </Text>
            </Pressable>
          </View>
        </Animated.View>
        {/* Signout Button End*/}

      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: themeColors.card,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: themeColors.border,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: themeColors.text, marginBottom: 16 }}>
              Edit {editingField === 'bio' ? 'Bio' : 'Name'}
            </Text>
            <TextInput
              style={{
                backgroundColor: themeColors.inputBg,
                borderWidth: 2,
                borderColor: themeColors.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: themeColors.text,
                marginBottom: 20,
              }}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`Enter your ${editingField}`}
              placeholderTextColor={themeColors.textSecondary}
              multiline={editingField === 'bio'}
              maxLength={editingField === 'bio' ? 139 : 50}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: themeColors.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: themeColors.text }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: themeColors.primary,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}