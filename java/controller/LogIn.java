package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.Random;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

@WebServlet(name = "LogIn", urlPatterns = {"/LogIn"})
public class LogIn extends HttpServlet {

    private static final String SMS_API_URL = "http://smslenz.lk/api/send-sms";
    private static final String USER_ID = "759";
    private static final String API_KEY = "3a8819e5-5a57-48b5-bdf2-95a08d5de8c3";
    private static final String SENDER_ID = "SMSlenzDEMO"; // Test Sender ID

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String countryCode = request.getParameter("countryCode"); // e.g., "94"
        String contactNo = request.getParameter("contactNo");     // e.g., "719345025"

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (contactNo == null || contactNo.isEmpty()) {
            responseObject.addProperty("message", "Contact number is required");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria = session.createCriteria(User.class);

            try {
                // Build query for both possible DB formats
                String fullNumber = countryCode + contactNo;

                criteria.add(
                    Restrictions.or(
                        Restrictions.eq("contactNo", contactNo),
                        Restrictions.eq("contactNo", fullNumber)
                    )
                );

                User user = (User) criteria.uniqueResult();

                if (user == null) {
                    responseObject.addProperty("message", "User not found");
                } else {
                    // Generate 4-digit OTP
                    String otp = String.format("%04d", new Random().nextInt(10000));
                    user.setOtp(otp);
                    user.setUpdatedAt(new Date());

                    // Save OTP
                    Transaction tr = session.beginTransaction();
                    session.update(user);
                    tr.commit();

                    // Send OTP
                    boolean smsSent = sendOtpSms(countryCode + contactNo, otp);

                    if (smsSent) {
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "OTP sent successfully");
                    } else {
                        responseObject.addProperty("message", "Failed to send OTP");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                responseObject.addProperty("message", "Internal server error");
            } finally {
                session.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }

    private boolean sendOtpSms(String contactNumber, String otp) {
        try {
            String message = "Your login OTP is: " + otp;
            String urlParameters = "user_id=" + USER_ID
                    + "&api_key=" + API_KEY
                    + "&sender_id=" + SENDER_ID
                    + "&contact=" + contactNumber
                    + "&message=" + java.net.URLEncoder.encode(message, "UTF-8");

            URL url = new URL(SMS_API_URL + "?" + urlParameters);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setDoOutput(true);

            int responseCode = conn.getResponseCode();
            return responseCode == 200;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
