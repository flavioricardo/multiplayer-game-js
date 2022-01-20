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

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function startGame() {
    const interval = 5000;
    setInterval(addFruit, interval);
  }

  function addPlayer(command) {
    const playerId = command?.playerId;
    const playerX =
      command?.playerX ?? Math.floor(Math.random() * state.screen.width);
    const playerY =
      command?.playerY ?? Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;
    if (playerId && state.players[playerId]) {
      delete state.players[playerId];

      notifyAll({
        type: "remove-player",
        playerId: playerId,
      });
    }
  }

  function addFruit(command) {
    const fruitId = command?.fruitId ?? Math.floor(Math.random() * 1000000);
    const fruitX =
      command?.fruitX ?? Math.floor(Math.random() * state.screen.width);
    const fruitY =
      command?.fruitY ?? Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: "add-fruit",
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY,
    });
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;
    if (fruitId && state.fruits[fruitId]) {
      delete state.fruits[fruitId];

      notifyAll({
        type: "remove-fruit",
        fruitId: fruitId,
      });
    }
  }

  function movePlayer(command) {
    notifyAll(command);

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
      ArrowRight(player) {
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
        delete state.fruits[fruitId];
      }
    }
  }

  return {
    state,
    setState,
    startGame,
    subscribe,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
  };
}
