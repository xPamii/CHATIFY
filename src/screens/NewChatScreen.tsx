import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";
import Animated, { FadeInRight } from 'react-native-reanimated';

type NewChatScreenProp = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const { applied } = useTheme();
  const [search, setSearch] = useState("");
  const users = useUserList();

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    headerBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    inputBg: applied === 'light' ? '#FFFFFF' : '#0F172A',
    listItemBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
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
              New Chat
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: themeColors.textSecondary }}>
              {users.length} contacts available
            </Text>
          </View>
        </View>
      ),
      headerRight: () => <View />,
    });
  }, [navigation, users, themeColors]);

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    if (!item) return null;

    const profileUri =
      item.profileImage && item.profileImage.trim().length > 0
        ? item.profileImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.firstName + " " + item.lastName
          )}&background=00D26A&color=fff&bold=true&length=1`;

    return (
      <Animated.View entering={FadeInRight.delay(index * 30)}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeColors.listItemBg,
            paddingVertical: 14,
            paddingHorizontal: 16,
            marginHorizontal: 16,
            marginVertical: 4,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
          onPress={() => {
            navigation.replace("SingleChatScreen", {
              chatId: item.id,
              friendName: `${item.firstName} ${item.lastName}`,
              lastSeenTime: item.updatedAt,
              profileImage: profileUri,
            });
          }}
        >
          <View style={{ position: 'relative', marginRight: 14 }}>
            <Image
              source={{ uri: profileUri }}
              style={{
                height: 56,
                width: 56,
                borderRadius: 28,
                backgroundColor: themeColors.border,
              }}
            />
            {item.status === "ONLINE" && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  backgroundColor: themeColors.primary,
                  borderWidth: 3,
                  borderColor: themeColors.listItemBg,
                }}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: themeColors.text, marginBottom: 4 }}>
              {item.firstName} {item.lastName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: themeColors.textSecondary,
                fontWeight: '500',
              }}
              numberOfLines={1}
            >
              {item.status === "ONLINE"
                ? "Online now"
                : "Hey there! I'm using Chatify"}
            </Text>
          </View>

          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color={themeColors.primary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const filteredUsers = (users ?? [])
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        backgroundColor={themeColors.headerBg}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />
      
      <View style={{ flex: 1 }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeColors.inputBg,
            borderWidth: 1,
            borderColor: themeColors.border,
            borderRadius: 16,
            paddingHorizontal: 18,
            marginHorizontal: 16,
            marginTop: 12,
            marginBottom: 16,
            height: 52,
          }}
        >
          <Ionicons name="search" size={20} color={themeColors.textSecondary} />
          <TextInput
            style={{
              flex: 1,
              color: themeColors.text,
              fontSize: 16,
              fontWeight: '500',
              paddingStart: 12,
            }}
            placeholder="Search contacts..."
            placeholderTextColor={themeColors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* New Contact Button */}
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: themeColors.card,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: themeColors.primary,
            }}
            onPress={() => navigation.navigate("NewContactScreen")}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: themeColors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <Ionicons name="person-add" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: themeColors.text }}>
                Add New Contact
              </Text>
              <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2, fontWeight: '500' }}>
                Invite someone to Chatify
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: themeColors.textSecondary,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {search ? `${filteredUsers.length} results` : 'All Contacts'}
          </Text>
        </View>

        {/* Contact List */}
        <FlatList
          data={filteredUsers ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 80,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <Ionicons name="people-outline" size={56} color={themeColors.primary} />
              </View>
              <Text
                style={{
                  color: themeColors.text,
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {search ? 'No contacts found' : 'No contacts yet'}
              </Text>
              <Text
                style={{
                  color: themeColors.textSecondary,
                  fontSize: 15,
                  textAlign: 'center',
                  paddingHorizontal: 40,
                  lineHeight: 22,
                }}
              >
                {search
                  ? `No results for "${search}"`
                  : 'Add new contacts to start chatting'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}