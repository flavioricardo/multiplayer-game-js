// Game Layer
export default function createGame() {
  // Data structure
  // Encapsulate game info in an object game
  const state = {
    players: {},
    fruits: {},
    screen: {
      height: 10,
      width: 10,
    },
  };

  console.log(state);

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayer(command) {
    const playerId = command.playerId;
    if (state.players[playerId]) delete state.players[playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;
    if (state.fruits[fruitId]) delete state.fruits[fruitId];
  }

  function movePlayer(command) {
    console.log(
      `game.movePlayer() -> Moving ${command.playerId} with ${command.keyPressed}`
    );

    const acceptedMoves = {
      ArrowUp(player) {
        console.log("Moving up");
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowDown(player) {
        console.log("Moving down");
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player) {
        console.log("Moving left");
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
      ArrowRight(player) {
        console.log("Moving right");
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
    };

    const keyPressed = command.keyPressed;
    const player = state.players[command.playerId];
    const playerId = command.playerId;
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`Collision between ${playerId} and ${fruitId}`);
        delete state.fruits[fruitId];
      }
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
  };
}
