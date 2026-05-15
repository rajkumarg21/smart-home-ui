import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (callback) => {
  const token = sessionStorage.getItem("token");

  stompClient = new Client({
    // SockJS factory
    webSocketFactory: () =>
      new SockJS(`http://localhost:8080/ws?token=${token}`),

    // Send JWT in STOMP connect headers
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    // Suppress debug logs
    debug: () => {},

    // Reconnect after 5s on disconnect
    reconnectDelay: 5000,

    onConnect: () => {
      stompClient.subscribe("/topic/device", (msg) => {
        try {
          callback(JSON.parse(msg.body));
        } catch (e) {
          console.error("[Socket] Failed to parse message:", e);
        }
      });
    },

    onStompError: (frame) => {
      console.error("[Socket] STOMP error:", frame);
    },

    onDisconnect: () => {
      console.log("[Socket] Disconnected");
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
