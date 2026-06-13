import {
  DEFAULT_CONFIG,
  createInitialState,
  togglePause,
  updateGame,
} from "./shooter-logic.js";

const boardElement = document.querySelector("#game-board");
const scoreElement = document.querySelector("#score");
const healthElement = document.querySelector("#health");
const waveElement = document.querySelector("#wave");
const statusElement = document.querySelector("#status");
const restartButton = document.querySelector("#restart-button");
const pauseButton = document.querySelector("#pause-button");
const controlButtons = document.querySelectorAll("[data-control]");

const statefulControls = new Set(["up", "down", "left", "right", "fire"]);
const cellElements = [];
const activeControls = new Set();
const pressedKeys = new Set();
const pointerState = {
  aim: null,
  isFiring: false,
};

let state = createInitialState(DEFAULT_CONFIG);
let lastFrame = performance.now();
let animationFrameId = 0;

setupBoard();
bindEvents();
render();
animationFrameId = window.requestAnimationFrame(frame);

function frame(timestamp) {
  const deltaSeconds = Math.min((timestamp - lastFrame) / 1000, 0.05);
  lastFrame = timestamp;
  state = updateGame(state, getInputSnapshot(), deltaSeconds);
  render();
  animationFrameId = window.requestAnimationFrame(frame);
}

function setupBoard() {
  boardElement.style.gridTemplateColumns = `repeat(${state.width}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${state.height}, 1fr)`;

  for (let index = 0; index < state.width * state.height; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardElement.appendChild(cell);
    cellElements.push(cell);
  }
}

function bindEvents() {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
  restartButton.addEventListener("click", restartGame);
  pauseButton.addEventListener("click", togglePauseState);

  boardElement.addEventListener("pointerdown", handleBoardPointerDown);
  boardElement.addEventListener("pointermove", handleBoardPointerMove);
  boardElement.addEventListener("pointerup", clearPointerFire);
  boardElement.addEventListener("pointerleave", clearPointerFire);
  boardElement.addEventListener("pointercancel", clearPointerFire);

  controlButtons.forEach((button) => {
    const control = button.dataset.control;
    if (!control) {
      return;
    }

    if (!statefulControls.has(control)) {
      button.addEventListener("click", () => handleDiscreteControl(control));
      return;
    }

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      activeControls.add(control);
      button.classList.add("is-active");
    });

    const release = () => {
      activeControls.delete(control);
      button.classList.remove("is-active");
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", release);
  });

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrameId);
  });
}

function render() {
  for (const cell of cellElements) {
    cell.className = "cell";
  }

  if (state.player.invulnerability > 0) {
    paintEntity(state.player.x, state.player.y, "cell--player-hit");
  } else {
    paintEntity(state.player.x, state.player.y, "cell--player");
  }

  for (const bullet of state.bullets) {
    paintEntity(bullet.x, bullet.y, "cell--bullet");
  }

  for (const enemy of state.enemies) {
    paintEntity(enemy.x, enemy.y, "cell--enemy");
  }

  for (const impact of state.impacts) {
    paintEntity(impact.x, impact.y, "cell--impact");
  }

  scoreElement.textContent = String(state.score);
  healthElement.textContent = String(Math.max(0, state.player.health));
  waveElement.textContent = String(state.wave);
  statusElement.textContent = getStatusLabel();
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
}

function paintEntity(x, y, className) {
  const clampedX = Math.max(0, Math.min(state.width - 1, Math.floor(x)));
  const clampedY = Math.max(0, Math.min(state.height - 1, Math.floor(y)));
  const cell = cellElements[clampedY * state.width + clampedX];
  cell?.classList.add(className);
}

function getStatusLabel() {
  if (state.isGameOver) {
    return "Overrun";
  }

  if (state.isPaused) {
    return "Paused";
  }

  return "Live";
}

function getInputSnapshot() {
  const moveX =
    getAxisValue(["arrowright", "d"], ["arrowleft", "a"], ["right"], ["left"]);
  const moveY =
    getAxisValue(["arrowdown", "s"], ["arrowup", "w"], ["down"], ["up"]);

  return {
    moveX,
    moveY,
    aim: pointerState.aim,
    isFiring: pointerState.isFiring || pressedKeys.has(" ") || activeControls.has("fire"),
  };
}

function getAxisValue(positiveKeys, negativeKeys, positiveControls, negativeControls) {
  const positive =
    positiveKeys.some((key) => pressedKeys.has(key)) ||
    positiveControls.some((control) => activeControls.has(control));
  const negative =
    negativeKeys.some((key) => pressedKeys.has(key)) ||
    negativeControls.some((control) => activeControls.has(control));

  return Number(positive) - Number(negative);
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "p", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
  }

  if (key === "p") {
    togglePauseState();
    return;
  }

  pressedKeys.add(key);

  if (!pointerState.aim && ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    updateAimFromMovementKey(key);
  }
}

function handleKeyup(event) {
  pressedKeys.delete(event.key.toLowerCase());
}

function handleBoardPointerDown(event) {
  boardElement.setPointerCapture(event.pointerId);
  updatePointerAim(event);
  pointerState.isFiring = true;
}

function handleBoardPointerMove(event) {
  updatePointerAim(event);
}

function clearPointerFire(event) {
  if (event?.pointerId !== undefined && boardElement.hasPointerCapture(event.pointerId)) {
    boardElement.releasePointerCapture(event.pointerId);
  }

  pointerState.isFiring = false;
}

function updatePointerAim(event) {
  const rect = boardElement.getBoundingClientRect();
  const relativeX = ((event.clientX - rect.left) / rect.width) * state.width;
  const relativeY = ((event.clientY - rect.top) / rect.height) * state.height;
  pointerState.aim = {
    x: relativeX,
    y: relativeY,
  };
}

function updateAimFromMovementKey(key) {
  const aimByKey = {
    arrowup: { x: state.player.x, y: state.player.y - 1 },
    w: { x: state.player.x, y: state.player.y - 1 },
    arrowdown: { x: state.player.x, y: state.player.y + 1 },
    s: { x: state.player.x, y: state.player.y + 1 },
    arrowleft: { x: state.player.x - 1, y: state.player.y },
    a: { x: state.player.x - 1, y: state.player.y },
    arrowright: { x: state.player.x + 1, y: state.player.y },
    d: { x: state.player.x + 1, y: state.player.y },
  };

  pointerState.aim = aimByKey[key] ?? pointerState.aim;
}

function handleDiscreteControl(control) {
  if (control === "pause") {
    togglePauseState();
  }
}

function togglePauseState() {
  state = togglePause(state);
  render();
}

function restartGame() {
  state = createInitialState(DEFAULT_CONFIG);
  pointerState.aim = { x: state.player.x + 1, y: state.player.y };
  pointerState.isFiring = false;
  pressedKeys.clear();
  activeControls.clear();
  controlButtons.forEach((button) => button.classList.remove("is-active"));
  lastFrame = performance.now();
  render();
}
