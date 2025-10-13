import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";
import type { Chat } from "../socket/chat";
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

type HomeScreenProps = NativeStackNavigationProp<RootStackParamList, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const chatList = useChatList();
  const auth = useContext(AuthContext);
  const { applied } = useTheme();

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    primaryDark: '#00B359',
    card: applied === 'light' ? '#FFFFFF' : '#1E293B',
    inputBackground: applied === 'light' ? '#F8FAFC' : '#0F172A',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    background: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
    accent: applied === 'light' ? '#F0FDF4' : '#0F2E1C',
    unreadBadge: '#00D26A',
    online: '#00D26A',
    modalBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
  };

  const getProfileImageUrl = (chatItem: Chat) => {
    if (chatItem.profileImage && chatItem.profileImage.trim() !== "") {
      return chatItem.profileImage;
    }
    const name = chatItem.friendName || "User";
    const cleanName = name
      .trim()
      .replace(/\s+/g, "+")
      .replace(/[^a-zA-Z0-9+]/g, "");
    return `https://ui-avatars.com/api/?name=${cleanName}&background=00D26A&color=fff&bold=true&length=1`;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            paddingTop: Platform.OS === "ios" ? 50 : 20,
            paddingBottom: 5,
            backgroundColor: themeColors.background,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  marginTop: 40,
                  color: themeColors.text,
                  letterSpacing: -0.5,
                }}
              >
                Messages
              </Text>
            </View>

            {/* <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: themeColors.card,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: themeColors.border,
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={themeColors.text} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("NewChatScreen")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: themeColors.primary,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                marginTop:40,
                borderColor: themeColors.border,
              }}
            >
              <Ionicons name="add" size={25} color={themeColors.card} />
            </TouchableOpacity>

            {/* <Modal
              transparent
              animationType="fade"
              visible={isModalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => setModalVisible(false)}
              >
                <View
                  style={{
                    position: "absolute",
                    top: Platform.OS === "ios" ? 100 : 70,
                    right: 20,
                    backgroundColor: themeColors.modalBg,
                    borderRadius: 20,
                    paddingVertical: 8,
                    width: 200,
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    elevation: 8,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                    }}
                    onPress={() => {
                      navigation.navigate("ProfileScreen");
                      setModalVisible(false);
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color={themeColors.text} />
                    <Text
                      style={{
                        color: themeColors.text,
                        fontSize: 16,
                        fontWeight: "600",
                        marginLeft: 12,
                      }}
                    >
                      My Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                    }}
                    onPress={() => {
                      navigation.navigate("SettingScreen");
                      setModalVisible(false);
                    }}
                  >
                    <Ionicons name="settings-outline" size={20} color={themeColors.text} />
                    <Text
                      style={{
                        color: themeColors.text,
                        fontSize: 16,
                        fontWeight: "600",
                        marginLeft: 12,
                      }}
                    >
                      Settings
                    </Text>
                  </TouchableOpacity>

                  <View style={{ height: 1, backgroundColor: themeColors.border, marginVertical: 8 }} />

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                    }}
                    onPress={() => auth && auth.signOut()}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text
                      style={{
                        color: "#EF4444",
                        fontSize: 16,
                        fontWeight: "700",
                        marginLeft: 12,
                      }}
                    >
                      Sign Out
                    </Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal> */}
            
          </View>
        </View>
      ),
    });
  }, [themeColors, isModalVisible]);

  const filtered = chatList
    .filter((c) => {
      if (activeTab === "unread" && c.unreadCount === 0) {
        return false;
      }
      const name = c.friendName?.toLowerCase() || "";
      const msg = c.lastMessage?.toLowerCase() || "";
      const term = search.toLowerCase();
      return name.includes(term) || msg.includes(term);
    })
    .sort((a, b) => {
      const timeA = new Date(a.lastTimeStamp).getTime();
      const timeB = new Date(b.lastTimeStamp).getTime();
      return timeB - timeA;
    });

  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    const profileImageUrl = getProfileImageUrl(item);

    return (
      <Animated.View entering={FadeInRight.delay(index * 50)}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 20,
            backgroundColor: themeColors.card,
            marginVertical: 4,
            marginHorizontal: 16,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
          onPress={() =>
            navigation.navigate("SingleChatScreen", {
              chatId: item.friendId,
              friendName: item.friendName,
              lastSeenTime: formatChatTime(item.lastTimeStamp),
              profileImage: profileImageUrl,
            })
          }
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: profileImageUrl }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: themeColors.border,
              }}
              onError={() => {
                console.log("Failed to load image for:", item.friendName);
              }}
            />
            {item.isOnline && (
              <View
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  height: 16,
                  width: 16,
                  borderRadius: 8,
                  backgroundColor: themeColors.online,
                  borderWidth: 3,
                  borderColor: themeColors.card,
                }}
              />
            )}
          </View>

          <View style={{ flex: 1, marginStart: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text
                style={{
                  color: themeColors.text,
                  fontWeight: "700",
                  fontSize: 17,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.friendName}
              </Text>
              <Text
                style={{
                  color: themeColors.textSecondary,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {formatChatTime(item.lastTimeStamp)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: themeColors.textSecondary,
                  fontSize: 15,
                  flex: 1,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: themeColors.unreadBadge,
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    paddingHorizontal: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "800",
                      fontSize: 12,
                    }}
                  >
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar
        backgroundColor={themeColors.background}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />

      {/* Search Bar */}
      <Animated.View entering={FadeInUp.delay(100)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: themeColors.card,
            borderWidth: 1,
            borderColor: themeColors.border,
            borderRadius: 16,
            paddingHorizontal: 18,
            marginHorizontal: 16,
            marginBottom: 12,
            height: 52,
          }}
        >
          <Ionicons name="search" size={20} color={themeColors.textSecondary} />
          <TextInput
            style={{
              flex: 1,
              color: themeColors.text,
              fontSize: 16,
              fontWeight: "500",
              paddingStart: 12,
            }}
            placeholder="Search conversations..."
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
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInUp.delay(200)}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginVertical: 12,
            backgroundColor: themeColors.card,
            borderRadius: 16,
            padding: 4,
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: activeTab === "all" ? themeColors.primary : "transparent",
            }}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={{
                color: activeTab === "all" ? "#fff" : themeColors.textSecondary,
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              All Chats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: activeTab === "unread" ? themeColors.primary : "transparent",
            }}
            onPress={() => setActiveTab("unread")}
          >
            <Text
              style={{
                color: activeTab === "unread" ? "#fff" : themeColors.textSecondary,
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Chat List */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.friendId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 80,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: themeColors.accent,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons
                name={activeTab === "unread" ? "mail-open-outline" : "chatbubbles-outline"}
                size={56}
                color={themeColors.primary}
              />
            </View>

            <Text
              style={{
                color: themeColors.text,
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {activeTab === "unread" ? "All caught up!" : "No messages yet"}
            </Text>
            <Text
              style={{
                color: themeColors.textSecondary,
                fontSize: 15,
                textAlign: "center",
                paddingHorizontal: 40,
                lineHeight: 22,
              }}
            >
              {activeTab === "unread"
                ? "You have no unread messages at the moment"
                : "Start a conversation with someone new"}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("NewChatScreen")}
        style={{
          position: "absolute",
          bottom: 100,
          right: 24,
          height: 64,
          width: 64,
          borderRadius: 32,
          backgroundColor: themeColors.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: themeColors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}