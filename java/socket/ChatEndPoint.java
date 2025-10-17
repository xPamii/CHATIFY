package socket;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.internal.LinkedTreeMap;
import entity.Chat;
import entity.Status;
import entity.User;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import util.HibernateUtil;

@ServerEndpoint(value = "/chat")
public class ChatEndPoint {

    private static final Gson GSON = new Gson();
    private int userId;

    @OnOpen
    public void onOpen(Session session) {
        String query = session.getQueryString();
        if (query != null && query.startsWith("userId=")) {
            userId = Integer.parseInt(query.substring("userId=".length()));
            ChatService.register(userId, session);
            UserService.updateLogInStatus(userId);
            UserService.updateFriendChatStatus(userId);
//            ChatService.sendToUser(userId,
//                    ChatService.friendListEnvelope(ChatService.getFriendChatsForUser(userId)));
        }
    }

    @OnClose
    public void onClose(Session session) {
        if (userId > 0) { // userId != null
            ChatService.unregister(userId);
            UserService.updateLogOutStatus(userId);
        }
    }

    @OnError

    public void onError(Session session, Throwable throwable) {
        try {
            // If userId wasn't set (e.g., no userId query), log and skip
            if (userId > 0) {
                UserService.updateLogOutStatus(userId);
            } else {
                System.out.println("⚠️ onError: userId not set for session. Query: " + session.getQueryString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            throwable.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            Map<String, Object> map = ChatEndPoint.GSON.fromJson(message, Map.class);
            String type = (String) map.get("type");
            switch (type) {
                case "PING": {
                    JsonObject responseObject = new JsonObject();
                    responseObject.addProperty("type", "PONG");
                    ChatService.sendToUser(userId, responseObject);
                    break;
                }
                case "send_chat": {
                    int fromId = (int) map.get("fromId");
                    int toId = (int) map.get("toId");
                    String chatText = (String) map.get("message");
                    org.hibernate.Session s = HibernateUtil.getSessionFactory().openSession();
                    User fromUser = (User) s.get(User.class, fromId);
                    User toUser = (User) s.get(User.class, toId);

                    if (fromUser != null && toUser != null) {
                        Chat chat = new Chat(fromUser, chatText, toUser, "", Status.SENT);
                        chat.setCreatedAt(new Date());
                        chat.setUpdatedAt(new Date());
                        ChatService.deliverChat(chat);
                    }
                    break;
                }
                case "get_chat_list": {
                    ChatService.sendToUser(userId,
                            ChatService.friendListEnvelope(ChatService.getFriendChatsForUser(userId)));
                    break;
                }
                case "get_single_chat": {
                    int friendId = (int) ((double) map.get("friendId"));
                    List<Chat> chats = ChatService.getChatHistory(userId, friendId);
                    Map<String, Object> envelop = ChatService.singleChatEnvelope(chats);
                    ChatService.sendToUser(userId, envelop);
                    ChatService.sendToUser(userId,
                            ChatService.friendListEnvelope(ChatService.getFriendChatsForUser(userId)));
                    break;
                }
                case "send_message": {
                    int friendId = (int) ((double) map.get("toUserId"));
                    String chat = String.valueOf(map.get("message"));
                    ChatService.saveNewChat(userId, friendId, chat);
                    break;
                }
                case "get_friend_data": {
                    int friendId = (int) ((double) map.get("friendId"));
                    Map<String, Object> envelope = UserService.getFriendData(friendId);

                    if (envelope != null) {
                        ChatService.sendToUser(userId, envelope);
                    } else {
                        System.out.println("⚠️ No friend found with id " + friendId);
                    }
                    break;
                }

                case "get_all_users": {
                    Map<String, Object> envelope = UserService.getAllUsers(userId);
                    ChatService.sendToUser(userId, envelope);
                    break;
                }
                case "save_new_contact": {
                    LinkedTreeMap userObject = (LinkedTreeMap) map.get("user"); //com.google.gson.internal
                    User user = new User(
                            String.valueOf(userObject.get("firstName")),
                            String.valueOf(userObject.get("lastName")),
                            String.valueOf(userObject.get("countryCode")),
                            String.valueOf(userObject.get("contactNo")));
                    Map<String, Object> envelope = UserService.saveNewContact(userId, user);
                    ChatService.sendToUser(userId, envelope);
                    Map<String, Object> e = UserService.getAllUsers(userId);
                    ChatService.sendToUser(userId, e);
                    break;
                }
                case "set_user_profile": {
                    Map<String, Object> envelope = UserService.getMyProfileData(userId);
                    ChatService.sendToUser(userId, envelope);
                    break;
                }

                case "delete_message": {
                    Number chatIdNum = (Number) map.get("chatId");
                    int chatId = chatIdNum.intValue();

                    Map<String, Object> envelope = ChatService.deleteMessage(chatId, userId);

                    if (envelope != null) {
                        ChatService.sendToUser(userId, envelope);
                    } else {
                        System.out.println("⚠️ Could not delete message with id " + chatId);
                    }
                    break;
                }

                default: {
                    System.out.println("Ignored unknown client type: " + type);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
