import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (callback) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  // Suppress STOMP debug logs
  stompClient.debug = () => {};

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  stompClient.connect(headers, () => {
    stompClient.subscribe("/topic/device", (msg) => {
      callback(JSON.parse(msg.body));
    });
  });
};

export const disconnectSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }
};
