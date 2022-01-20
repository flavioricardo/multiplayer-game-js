import express from "express";
import http from "http";
import { Server } from "socket.io";

import createGame from "./public/game.js";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("public"));

const game = createGame();
game.startGame();

game.subscribe((command) => {
  console.log(`Emiting command ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`Player connected on server with id ${playerId}`);

  game.addPlayer({ playerId: playerId });

  socket.emit("setup", game.state);

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });

  socket.on("disconnect", () => {
    game.removePlayer({ playerId: playerId });
    console.log(`Player id ${playerId} disconnected from server`);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port 3000!`);
});
