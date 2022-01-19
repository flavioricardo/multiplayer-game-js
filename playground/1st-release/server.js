import express from "express";
import http from "http";
import { Server } from "socket.io";

import createGame from "./public/game.js";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("public"));

const game = createGame();

// game.addPlayer({
//   playerId: "player1",
//   playerX: 0,
//   playerY: 0,
// });

// game.addFruit({
//   fruitId: "fruit1",
//   fruitX: 5,
//   fruitY: 5,
// });

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`Player connected on server with id ${playerId}`);

  socket.emit("setup", game.state);
});

server.listen(3000, () => {
  console.log(`Server running on port 3000!`);
});
