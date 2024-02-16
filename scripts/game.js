`use strict`;
import { Snake } from "./snake.js";

let lastTimeRendered = 0;
const board = document.querySelector(".game-board");
const defaultSnakePosition = [
  { x: 11, y: 11 },
  {x: 10, y: 11},
  {x: 9, y: 11},
  {x: 8, y: 11},
  {x: 7, y: 11},
  {x: 6, y: 11},
];
const snake = new Snake(defaultSnakePosition);
let previousDirection = {x: 1, y: 0};

function startGame(currentTime) {
  window.requestAnimationFrame(startGame);
  const secondsSinceLastTimeRendered = (currentTime - lastTimeRendered) / 1000;
  if (secondsSinceLastTimeRendered < 1 / snake.snakeSpeed) return;
  lastTimeRendered = currentTime;

  update();
  draw();
}

function update() {
  snake.update();
}

function draw() {
  const snakeElements = board.querySelectorAll(".snake");
  if (snakeElements) snakeElements.forEach((item) => item.remove());
  snake.draw(board);
}

//keyboard listener
document.addEventListener("keydown", function (evt) {
  const key = evt.key.toLowerCase();
  const direction = { x: 0, y: 0 };
  switch (key) {
    case "w":
    case "arrowup":
      direction.x = 0;
      direction.y = -1;
      break;
    case "s":
    case "arrowdown":
      direction.x = 0;
      direction.y = 1;
      break;
    case "a":
    case "arrowleft":
      direction.x = -1;
      direction.y = 0;
      break;
    case "d":
    case "arrowright":
      direction.x = 1;
      direction.y = 0;
      break;
    default:
      return;
  }
  // check if opposite direction
  const isOppositeXDirection = (direction.x !== 0) && (direction.x === previousDirection.x * -1);
  const isOppositeYDirection = (direction.y !== 0) && (direction.y === previousDirection.y * -1);
  const isOppositeDirection = isOppositeXDirection || isOppositeYDirection;
  //check if same direction
  const isSameXDirection = (direction.x !== 0) && (direction.x === previousDirection.x);
  const isSameYDirection = (direction.y !== 0) && (direction.y === previousDirection.y);
  const isSameDirection = isSameXDirection || isSameYDirection;

  if (!isOppositeDirection && !isSameDirection) {
    snake.changeDirection(direction);
    // update();
    // draw();
    previousDirection.x = direction.x;
    previousDirection.y = direction.y;
  }
});

window.requestAnimationFrame(startGame);
