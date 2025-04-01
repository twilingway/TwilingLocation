// server.js
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Разрешаем все домены (можно указать конкретный)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Обработка входящих сообщений
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Отправляем сообщение всем клиентам
  });

  // Обработка отключения
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server is running on port 3000");
});
