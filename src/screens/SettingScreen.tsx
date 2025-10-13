import { Text, TouchableOpacity, View, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight } from 'react-native-reanimated';

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStackParamList, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  
  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [messagePreview, setMessagePreview] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    headerBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    danger: '#EF4444',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
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

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 24 }}>
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
        {title}
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
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    showBorder = true,
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
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
        <Text style={{ fontSize: 16, fontWeight: '600', color: themeColors.text }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const ToggleItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange,
    showBorder = true,
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    value: boolean;
    onValueChange: (value: boolean) => void;
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
        <Text style={{ fontSize: 16, fontWeight: '600', color: themeColors.text }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: themeColors.border, true: themeColors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={themeColors.border}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={["right", "bottom", "left"]}>
      <StatusBar 
        backgroundColor={themeColors.headerBg}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <Animated.View entering={FadeInRight.delay(100)}>
          <SettingsSection title="Appearance">
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: themeColors.text, marginBottom: 12 }}>
                Choose Theme
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: preference === option ? themeColors.primary : themeColors.background,
                      borderWidth: 1,
                      borderColor: preference === option ? themeColors.primary : themeColors.border,
                      alignItems: 'center',
                    }}
                    onPress={() => setPreference(option)}
                  >
                    <Ionicons 
                      name={
                        option === 'light' ? 'sunny' : 
                        option === 'dark' ? 'moon' : 
                        'phone-portrait'
                      } 
                      size={20} 
                      color={preference === option ? '#FFFFFF' : themeColors.textSecondary}
                      style={{ marginBottom: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: preference === option ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </SettingsSection>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View entering={FadeInRight.delay(200)}>
          <SettingsSection title="Notifications">
            <ToggleItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive message notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
            <ToggleItem
              icon="eye"
              title="Message Preview"
              subtitle="Show message content in notifications"
              value={messagePreview}
              onValueChange={setMessagePreview}
            />
            <ToggleItem
              icon="volume-high"
              title="Sound"
              subtitle="Play sound for new messages"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
            <ToggleItem
              icon="phone-portrait"
              title="Vibration"
              subtitle="Vibrate on new messages"
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              showBorder={false}
            />
          </SettingsSection>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View entering={FadeInRight.delay(300)}>
          <SettingsSection title="Privacy & Security">
            <ToggleItem
              icon="checkmark-done"
              title="Read Receipts"
              subtitle="Let others see when you read their messages"
              value={readReceipts}
              onValueChange={setReadReceipts}
            />
            <ToggleItem
              icon="time"
              title="Last Seen"
              subtitle="Show your last seen time to others"
              value={lastSeen}
              onValueChange={setLastSeen}
            />
            <SettingsItem
              icon="lock-closed"
              title="Blocked Users"
              subtitle="Manage blocked contacts"
              onPress={() => Alert.alert("Blocked Users", "This feature is coming soon")}
            />
            <SettingsItem
              icon="shield-checkmark"
              title="Two-Step Verification"
              subtitle="Add extra security to your account"
              onPress={() => Alert.alert("Two-Step Verification", "This feature is coming soon")}
              showBorder={false}
            />
          </SettingsSection>
        </Animated.View>

        {/* Chat Settings Section */}
        <Animated.View entering={FadeInRight.delay(400)}>
          <SettingsSection title="Chat Settings">
            <SettingsItem
              icon="chatbubbles"
              title="Chat Backup"
              subtitle="Back up your chats to cloud"
              onPress={() => Alert.alert("Chat Backup", "This feature is coming soon")}
            />
            <SettingsItem
              icon="download"
              title="Media Auto-Download"
              subtitle="Manage auto-download settings"
              onPress={() => Alert.alert("Media Settings", "This feature is coming soon")}
            />
            <SettingsItem
              icon="color-palette"
              title="Chat Wallpaper"
              subtitle="Customize your chat background"
              onPress={() => Alert.alert("Wallpaper", "This feature is coming soon")}
              showBorder={false}
            />
          </SettingsSection>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInRight.delay(500)}>
          <SettingsSection title="Account">
            <SettingsItem
              icon="person"
              title="Account Info"
              subtitle="View and edit your profile"
              onPress={() => navigation.navigate("ProfileScreen")}
            />
            <SettingsItem
              icon="phone-portrait"
              title="Change Number"
              subtitle="Update your phone number"
              onPress={() => Alert.alert("Change Number", "This feature is coming soon")}
            />
            <SettingsItem
              icon="trash"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={() => Alert.alert(
                "Delete Account",
                "Are you sure you want to delete your account? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive" }
                ]
              )}
              showBorder={false}
            />
          </SettingsSection>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInRight.delay(600)}>
          <SettingsSection title="About">
            <SettingsItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help or report issues"
              onPress={() => Alert.alert("Support", "Contact support@chatify.com")}
            />
            <SettingsItem
              icon="document-text"
              title="Terms & Privacy Policy"
              subtitle="Read our terms and privacy policy"
              onPress={() => Alert.alert("Legal", "This feature is coming soon")}
            />
            <SettingsItem
              icon="information-circle"
              title="App Version"
              subtitle="Version 1.0.0"
              showBorder={false}
            />
          </SettingsSection>
        </Animated.View>

        {/* Extra padding at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}