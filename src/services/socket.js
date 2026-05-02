import SockJS from "sockjs-client";
import { Stomp } from "stompjs";

let stompClient = null;

export const connectSocket = (callback) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  // Suppress STOMP debug logs
  stompClient.debug = null;

  stompClient.connect({}, () => {
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
