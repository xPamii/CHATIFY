import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebSocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  sendMessage: (data: any) => void;
}
const WebSocketContext = createContext<WebSocketContextValue | null>(null);
export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
  userId: number;
}> = ({ children, userId }) => {
  const [isConnected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (
      userId === 0 ||
      (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }
    const socket = new WebSocket(
      `wss://${process.env.EXPO_PUBLIC_WS_URL}/Chatify/chat?userId=${userId}`
    ); //wss => https

    socketRef.current = socket;

    socket.onopen = () => {
      console.log(new Date().toLocaleTimeString());

      console.log("WebSocket connected...");
      setConnected(true);
    };

    socket.onclose = () => {
      console.log(new Date().toLocaleTimeString());
      console.log("WebSocket disconnected...");
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ ...data, userId }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        userId,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebScoket must be used inside WebSocketProvider");
  }
  return ctx;
};
