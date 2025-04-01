import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import io, { Socket } from "socket.io-client";

//const SOCKET_URL = "http://192.168.1.228:3000";
const SOCKET_URL = "https://arzon.emsoft.ru"; // Замените на IP вашего сервера
// const MESSENGER_URL = "/messenger";
const NOTIFICATION_URL = "/notification";
// Типизация состояний
interface Message {
  id: string;
  text: string;
}

export default function MathPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.log("[SOCKET] Инициализация клиента...");
    const newSocket = io(SOCKET_URL, {
      path: NOTIFICATION_URL,
      //   transports: ["websocket"], // Указываем транспорт WebSocket
    });

    setSocket(newSocket);

    // Подписка на события
    newSocket.on("connect", () => {
      console.log("[SOCKET] Соединение установлено. ID клиента:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[SOCKET] Ошибка подключения:", error);
    });

    newSocket.on("disconnect", () => {
      console.warn("[SOCKET] Соединение разорвано");
    });

    newSocket.on("notification", (message: string) => {
      console.log("[SOCKET] Получено сообщение:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: message },
      ]);
    });

    return () => {
      console.log("[SOCKET] Отключение клиента...");
      newSocket.disconnect(); // Отключаемся при размонтировании компонента
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      console.log("[SOCKET] Отправка сообщения:", message);
      socket.emit("sendMessage", message); // Отправляем сообщение на сервер
      setMessage(""); // Очищаем поле ввода
    }
  };

  return (
    <View style={styles.container}>
      {/* Список сообщений */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.text}</Text>
        )}
      />
      {/* Поле ввода и кнопка отправки */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  message: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});
