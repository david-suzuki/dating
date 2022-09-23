import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import config from "../config/config";
import { httpService } from "services/httpService.js";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const REQUEST_USER = "requestUser";
const REGISTER_USER = "registerUser";
const SOCKET_SERVER_URL = config.chatUrl;

const useChat = (user) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on(REQUEST_USER, () => {
      socketRef.current.emit(REGISTER_USER, { user: user });
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (msg) => {
      setMessages((msg) => [...messages, msg]);
      console.log(msg);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getMessages = () => {};

  const sendMessage = (msg, receiver) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: msg,
      sender: user,
      receiver: receiver,
    });
  };

  return { messages, sendMessage, getMessages };
};

export default useChat;
