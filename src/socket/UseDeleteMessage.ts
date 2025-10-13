import { useWebSocket } from "./WebSocketProvider";

export function useDeleteMessage() {
  const { sendMessage } = useWebSocket();

  const deleteMsg = (fromUserId: number, toUserId: number, messageId: number) => {
    sendMessage({
      type: "delete_message",
      fromUserId,
      toUserId,
      chatId:messageId,
    });
  };

  return deleteMsg;
}
