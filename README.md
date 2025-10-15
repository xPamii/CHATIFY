# CHATIFY: Real-Time Mobile Chat Application

## Overview

**CHATIFY** is a modern, real-time mobile chat application developed as a university project. The application utilizes **React Native** for a cross-platform mobile frontend and a robust **Java Servlet** backend integrated with **Hibernate** for database interaction. It's designed to provide secure, instant messaging, covering core features from user authentication and contact management to live, private conversations powered by **WebSockets**.

### Key Features

  * **User Authentication:** Secure sign-up and sign-in via OTP (One-Time Password) using a phone number.
  * **Real-Time Messaging:** Instant, low-latency transmission and receipt of text messages via **WebSockets**.
  * **Contact Management:** Ability to view, search, and add new contacts.
  * **Account Settings:** User control over profile information, privacy settings (e.g., Last Seen, Read Receipts), and account management.

-----

## Technical Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React Native** | Cross-platform mobile application development (iOS/Android). |
| **Backend Server** | **Java Servlet** | Handles request/response cycles and application logic. |
| **ORM** | **Hibernate** | Object-Relational Mapping (ORM) for managing the database interaction with Java objects. |
| **Database** | **MySQL** | Persistent storage for user data, messages, and contacts. |
| **Real-time** | **WebSockets** | Enabling instant, bi-directional message delivery between clients and the server. |

-----

## Installation & Setup

Follow these steps to set up and run the CHATIFY application locally for both the backend and frontend components.

### 1\. Prerequisites

You must have the following software installed on your development machine:

  * Node.js (`v16+` recommended)
  * Java Development Kit (JDK) (`[Specify Version, e.g., 17]`)
  * `[Specify Backend Build Tool, e.g., Apache Maven / Gradle]`
  * **MySQL Server**
  * Android Studio / Xcode (for running the mobile app in an emulator/simulator)

### 2\. Backend Setup (Java Server)

1.  **Clone the repository:**
    ```bash
    git clone [Your Repository URL]
    cd chatify/backend
    ```
2.  **Configure Database (MySQL):**
      * Create a database named `[Database Name]` in your local MySQL instance.
      * Update the connection details (URL, username, password) in the **Hibernate** configuration file: `[Path to config, e.g., hibernate.cfg.xml]`.
3.  **Build and Deploy the Server:**
      * Use your build tool (`Maven`/`Gradle`) to compile the project and package it as a `.war` file.
      * Deploy the `.war` file to a **Java Servlet container** (e.g., Apache Tomcat) and start the server.
    <!-- end list -->
    ```bash
    # Example command for building with Maven
    mvn clean package
    ```
    The backend server, including the WebSocket endpoints, should now be running on `http://localhost:[Port Number]/[App Name]`.

### 3\. Frontend Setup (React Native App)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure API and WebSocket URLs:**
      * Update the base URL for the REST APIs and the WebSocket endpoint URL to point to your running Java server in the client-side configuration file: `[Path to API config file]`.
4.  **Run the application:**
    ```bash
    # For iOS Simulator
    npx react-native run-ios

    # For Android Emulator
    npx react-native run-android
    ```
    The app should open in your configured emulator/simulator and connect to the local server.

-----

## Project Structure

This project follows a standard decoupled structure, separating the client and server codebases.

```
CHATIFY/
├── backend/                  # Java Servlet/Hibernate code
│   ├── src/
│   ├── webapp/               # Deployment descriptor (web.xml)
│   ├── pom.xml (or build.gradle)
│   └── ...
└── frontend/                 # React Native code
    ├── src/
    │   ├── components/       # Reusable UI elements
    │   ├── screens/          # Main application screens
    │   └── services/         # API and WebSocket interaction logic
    ├── package.json
    └── ...
```

-----

## Contact

Project Link: `https://github.com/xPamii/CHATIFY`
Developer: `PAMITH HERATH (xPamii)`
