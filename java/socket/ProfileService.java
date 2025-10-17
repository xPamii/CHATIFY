package socket;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;


public class ProfileService {

    // work with servlet
    public boolean saveProfileImage(int userId, HttpServletRequest request) throws IOException, ServletException, ServletException {
        Part profileImage = request.getPart("profileImage");
        String appPath = request.getServletContext().getRealPath(""); //Full path of the Web Pages folder

        String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "profile-images");

        File profileFolder = new File(newPath, String.valueOf(userId));
        if (!profileFolder.exists()) {
            profileFolder.mkdirs();
        }

        File file1 = new File(profileFolder, "profile1.png");
        Files.copy(profileImage.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return true;
    }

    //work with WebSocket
    public static String getProfileUrl(int userId) {
        try {

            URL url = new URI("https://0219c9f7612d.ngrok-free.app/Chatify/profile-images/" + userId + "/profile1.png").toURL(); // java.net.URL
            HttpURLConnection conn = (HttpURLConnection) url.openConnection(); // java.net.HttpURLConnection
            conn.setRequestMethod("HEAD");
            int responseCode = conn.getResponseCode();
            conn.connect();

            String profile;

            if (responseCode == HttpURLConnection.HTTP_OK) {
                profile = ChatService.URL + "/profile-images/" + userId + "/profile1.png";
            } else {
                profile = "";
            }
            return profile;
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
            return "";
        }
    }
    
    
}