import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActionSheetIOS,
  Alert,
  ImageBackground,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { useDeleteMessage } from "../socket/UseDeleteMessage";
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<RootStackParamList, "SingleChatScreen">;

export default function SingleChatScreen({ route, navigation }: SingleChatScreenProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const [messages, setMessages] = useState<Chat[]>(singleChat.messages || []);
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const deleteMessage = useDeleteMessage();
  const [input, setInput] = useState("");
  const [editingMessage, setEditingMessage] = useState<Chat | null>(null);
  const { applied } = useTheme();

  const themeColors = {
    text: applied === 'light' ? '#0F172A' : '#F8FAFC',
    textSecondary: applied === 'light' ? '#64748B' : '#CBD5E1',
    primary: '#00D26A',
    headerBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    inputBg: applied === 'light' ? '#F8FAFC' : '#1E293B',
    inputContainer: applied === 'light' ? '#FFFFFF' : '#0F172A',
    border: applied === 'light' ? '#E2E8F0' : '#334155',
    myMessageBg: '#00D26A',
    theirMessageBg: applied === 'light' ? '#FFFFFF' : '#1E293B',
    theirMessageText: applied === 'light' ? '#0F172A' : '#F8FAFC',
    chatBg: applied === 'light' ? '#F8FAFC' : '#0A0F1C',
  };

  useEffect(() => {
    setMessages(singleChat.messages);
  }, [singleChat.messages]);

 useLayoutEffect(() => {
  navigation.setOptions({
    headerStyle: { backgroundColor: themeColors.headerBg },
    headerShadowVisible: false,
    title: "",
    headerLeft: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </Pressable>

        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: profileImage }}
            style={{
              height: 44,
              width: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: themeColors.primary,
            }}
          />
          {friend?.status === "ONLINE" && (
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: themeColors.primary,
                borderWidth: 2,
                borderColor: themeColors.headerBg,
              }}
            />
          )}
        </View>

        <View>
          <Text style={{ fontWeight: '700', fontSize: 17, color: themeColors.text }}>
            {friend ? `${friend.firstName} ${friend.lastName}` : friendName}
          </Text>
          <Text style={{ fontSize: 12, color: themeColors.textSecondary, fontWeight: '500' }}>
            {friend?.status === "ONLINE"
              ? "Online"
              : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
          </Text>
        </View>
      </View>
    ),
    headerRight: () => (
      <Pressable
        onPress={() => console.log('Open chat options')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        })}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={themeColors.text} />
      </Pressable>
    ),
  });
}, [friend?.status, friend?.updatedAt, themeColors]);


  const handleDeleteMessage = (msg: Chat) => {
    Alert.alert("Delete Message", "Are you sure you want to delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMessage(msg.from.id, msg.to.id, msg.id);
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, message: "Message deleted" } : m))
          );
        },
      },
    ]);
  };

  const handleEditMessage = (msg: Chat) => {
    setEditingMessage(msg);
    setInput(msg.message);
  };

  const openMessageMenu = (msg: Chat) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Edit Message", "Delete Message"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleEditMessage(msg);
          if (buttonIndex === 2) handleDeleteMessage(msg);
        }
      );
    } else {
      Alert.alert("Message Options", "Choose an action", [
        { text: "Edit", onPress: () => handleEditMessage(msg) },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteMessage(msg) },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;
    return (
      <TouchableOpacity onLongPress={() => openMessageMenu(item)} activeOpacity={0.8}>
        <View
          style={{
            marginVertical: 4,
            marginHorizontal: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxWidth: '75%',
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            backgroundColor: isMe ? themeColors.myMessageBg : themeColors.theirMessageBg,
            borderRadius: 18,
            borderTopRightRadius: isMe ? 4 : 18,
            borderTopLeftRadius: isMe ? 18 : 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text 
            style={{ 
              color: isMe ? '#FFFFFF' : themeColors.theirMessageText, 
              fontSize: 15,
              lineHeight: 20,
            }}
          >
            {item.message}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 }}>
            <Text 
              style={{ 
                color: isMe ? 'rgba(255, 255, 255, 0.8)' : themeColors.textSecondary, 
                fontSize: 11,
                marginRight: 4,
                fontWeight: '500',
              }}
            >
              {formatChatTime(item.createdAt)}
            </Text>
            {isMe && (
              <Ionicons
                name={
                  item.status === "READ"
                    ? "checkmark-done"
                    : item.status === "DELIVERED"
                    ? "checkmark-done"
                    : "checkmark"
                }
                size={14}
                color={item.status === "READ" ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSendChat = () => {
    if (!input.trim()) return;
    if (editingMessage) {
      console.log("Edited:", editingMessage.id, "=>", input);
      setEditingMessage(null);
    } else {
      sendMessage(chatId, input);
    }
    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.chatBg }}>
      <StatusBar 
        backgroundColor={themeColors.headerBg}
        barStyle={applied === "light" ? "dark-content" : "light-content"}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          inverted
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Editing Indicator */}
        {editingMessage && (
          <View 
            style={{
              backgroundColor: themeColors.inputContainer,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderTopWidth: 1,
              borderTopColor: themeColors.border,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: themeColors.primary, fontWeight: '700' }}>
                Editing Message
              </Text>
              <Text 
                style={{ fontSize: 14, color: themeColors.textSecondary, marginTop: 2 }}
                numberOfLines={1}
              >
                {editingMessage.message}
              </Text>
            </View>
            <TouchableOpacity onPress={() => { setEditingMessage(null); setInput(""); }}>
              <Ionicons name="close-circle" size={24} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: themeColors.inputContainer,
            borderTopWidth: 1,
            borderTopColor: themeColors.border,
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: themeColors.inputBg,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
              maxHeight: 120,
              borderWidth: 1,
              borderColor: themeColors.border,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              multiline
              placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
              placeholderTextColor={themeColors.textSecondary}
              style={{
                fontSize: 15,
                color: themeColors.text,
                maxHeight: 100,
              }}
            />
          </View>
          
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              backgroundColor: themeColors.primary,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleSendChat}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}