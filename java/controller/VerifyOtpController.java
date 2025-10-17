package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import java.util.Date;
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

@WebServlet(name = "VerifyOtpController", urlPatterns = {"/VerifyOtpController"})
public class VerifyOtpController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String contactNo = request.getParameter("contactNo");     // e.g., 719345025
        String otpInput = request.getParameter("otp");           // e.g., 1234

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (contactNo == null || contactNo.isEmpty()) {
            responseObject.addProperty("message", "Contact number is required");
        } else if (otpInput == null || otpInput.isEmpty()) {
            responseObject.addProperty("message", "OTP is required");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("contactNo", contactNo));
            User user = (User) criteria.uniqueResult();

            if (user == null) {
                responseObject.addProperty("message", "User not found");
            } else if (user.getOtp() == null || !user.getOtp().equals(otpInput)) {
                responseObject.addProperty("message", "Invalid OTP");
            } else {
                // OTP is correct, clear it for security
                Transaction tr = session.beginTransaction();
                user.setOtp(null);
                user.setUpdatedAt(new Date());
                session.update(user);
                tr.commit();
                session.close();

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "OTP verified successfully");
                responseObject.add("user", gson.toJsonTree(user));
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
