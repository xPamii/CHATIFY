package socket;

import com.google.gson.JsonObject;
import dto.UserDTO;
import entity.Chat;
import entity.FriendList;
import entity.Status;
import entity.User;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

public class UserService {

    // Call @OnOpen
    public static void updateLogInStatus(int userId) {
        updateStatus(userId, Status.ONLINE);
    }

    // Call @OnClose
    public static void updateLogOutStatus(int userId) {
        updateStatus(userId, Status.OFFLINE);
    }

    private static void updateStatus(int userId, Status status) {
        Session s = HibernateUtil.getSessionFactory().openSession();
        User fromUser = (User) s.get(User.class, userId);
        fromUser.setStatus(status);
        fromUser.setUpdatedAt(new Date());
        s.update(fromUser);
        s.beginTransaction().commit();
    }

    public static void updateFriendChatStatus(int userId) {
        Session s = HibernateUtil.getSessionFactory().openSession();
        Criteria c1 = s.createCriteria(FriendList.class);
        c1.add(Restrictions.eq("userId.id", userId));
        c1.add(Restrictions.eq("status", Status.ACTIVE));
        //get active friend list
        List<FriendList> myFriends = c1.list();

        Transaction tr = s.beginTransaction();
        for (FriendList myFriend : myFriends) {
            User me = myFriend.getUserId();
            User friend = myFriend.getFriendId();

            if (me.getStatus().equals(Status.ONLINE)) {
                Criteria c2 = s.createCriteria(Chat.class);
                Criterion rest1 = Restrictions.and(Restrictions.eq("from", friend),
                        Restrictions.eq("to", me), Restrictions.eq("status", Status.SENT));
                c2.add(rest1);
                List<Chat> chats = c2.list();
                for (Chat chat : chats) {
                    chat.setStatus(Status.DELIVERED);
                    chat.setUpdatedAt(new Date());
                    s.update(chat);
                }
            }
        }
        tr.commit();
        s.close();
    }

    public static Map<String, Object> getFriendData(int friendId) { // single chat header details
        Session s = HibernateUtil.getSessionFactory().openSession();
        User friend = (User) s.get(User.class, friendId);
        s.close();
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "friend_data");
        envelope.put("payload", friend);
        return envelope;
    }

    public static Map<String, Object> getAllUsers(int userId) {
        try {
            Session s = HibernateUtil.getSessionFactory().openSession();
            Map<String, Object> map = new HashMap();
            List<UserDTO> userDTOs = new ArrayList<>();

            Criteria c1 = s.createCriteria(FriendList.class);
            c1.add(Restrictions.eq("userId.id", userId));
            c1.add(Restrictions.eq("status", Status.ACTIVE));
            List<FriendList> myFriends = c1.list();

            for (FriendList myFriend : myFriends) {
                User user = myFriend.getFriendId(); // User Object
                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setDisplayName(myFriend.getDisplayName()); // From FriendList Table
                dto.setCountryCode(user.getCountryCode());
                dto.setContactNo(user.getContactNo());
                dto.setProfileImage(
                        ProfileService.getProfileUrl(user.getId()));
                dto.setCreatedAt(user.getCreatedAt());
                dto.setUpdatedAt(user.getUpdatedAt());
                dto.setStatus(user.getStatus());
                userDTOs.add(dto);
            }
            s.close();
            map.put("type", "all_users");
            map.put("payload", userDTOs);
            return map;
        } catch (HibernateException e) {
            throw new RuntimeException(e);
        }
    }

    public static Map<String, Object> saveNewContact(int myId, User user) {
        Session s = HibernateUtil.getSessionFactory().openSession();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("responseStatus", Boolean.FALSE);
        Criteria c1 = s.createCriteria(User.class);
        c1.add(Restrictions.and(Restrictions.eq("countryCode", user.getCountryCode()),
                Restrictions.eq("contactNo", user.getContactNo())));
        User u1 = (User) c1.uniqueResult();
        if (u1 == null) {
            responseObject.addProperty("message", "This user not in ChatApp");
        } else {
            User me = (User) s.get(User.class, myId);
            //Check this user already added to the FriendList Tabele
            Criteria c2 = s.createCriteria(FriendList.class);
            c2.add(Restrictions.and(Restrictions.eq("userId", me),
                    Restrictions.eq("friendId", u1)));
            FriendList friendList = (FriendList) c2.uniqueResult();
            responseObject.addProperty("responseStatus", Boolean.TRUE);
            if (friendList == null) {
                FriendList fl = new FriendList(me, u1, user.getFirstName() + " " + user.getLastName());
                s.save(fl);
                responseObject.addProperty("message", "This user added to friend list");
            } else {
                friendList.setDisplayName(user.getFirstName() + " " + user.getLastName());
                s.update(friendList);
                responseObject.addProperty("message", "This user already in friend list");
            }
        }
        s.beginTransaction().commit();
        s.close();
        Map<String, Object> map = new HashMap<>();
        map.put("type", "new_contact_response_text");
        map.put("payload", responseObject);
        return map;
    }

    public static Map<String, Object> getMyProfileData(int userId) {
        Session s = HibernateUtil.getSessionFactory().openSession();
        User user = (User) s.get(User.class, userId);
        UserDTO dto = new UserDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountryCode(user.getCountryCode());
        dto.setContactNo(user.getContactNo());
        dto.setProfileImage(ProfileService.getProfileUrl(userId));

        s.close();
        Map<String, Object> map = new HashMap();
        map.put("type", "user_profile");
        map.put("payload", dto);
        return map;
    }
}
