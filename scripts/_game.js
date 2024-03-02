`use strict`;
import { Snake } from "./snake.js";
import { Food } from "./food.js";

const board = document.querySelector(".game-board");
const dialog = document.querySelector(".dialog");
const dialogForm = document.querySelector(".dialog__form");
const scoreSpan = document.querySelector(".score__span");

let stop = false;
let food;
let score = 0;
let lastTimeRendered = 0;
const defaultSnake = [
  /* { x: 11, y: 11 },
  {x: 10, y: 11},
  {x: 9, y: 11}, */
  { x: 3, y: 11 },
  { x: 2, y: 11 },
  { x: 1, y: 11 },
];
const snake = new Snake(defaultSnake);

let previousDirection = { x: 1, y: 0 };

function updateScore(reset = false) {
  const resultScore = reset ? 0 : ++score;
  scoreSpan.textContent = resultScore;
}

dialogForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  stop = false;
  snake.reset();
  updateScore(true);
  dialog.close();
  startGame(0);
});

function startGame(currentTime) {
  if (!stop) {
    window.requestAnimationFrame(startGame);
  }
  const secondsSinceLastTimeRendered = (currentTime - lastTimeRendered) / 1000;
  if (secondsSinceLastTimeRendered < 1 / snake.speed) return;
  lastTimeRendered = currentTime;
  update();
  if (checkDefeat()) {
    dialog.showModal();
    stop = true;
  }
  draw();
}

function checkDefeat() {
  const headPosition = snake.snakePositionArray.at(0);
  const isOutOfBoard =
    headPosition.x > 21 ||
    headPosition.x < 1 ||
    headPosition.y > 21 ||
    headPosition.y < 1;
  const isSelfCollide = snake.snakePositionArray.some((item, index) => {
    if (index !== 0) {
      return item.x === headPosition.x && item.y === headPosition.y;
    }
  });
  return isOutOfBoard || isSelfCollide;

}

function update() {
  snake.update();
  if (!food) {
    food = new Food();
  }
  // проверить находится ли голова змеи и еда на одной позиции
  if (snake.snakePositionArray[0].x === food.x && snake.snakePositionArray[0].y  === food.y) {
    snake.expand();
    updateScore();
    food = null;
  }
}

function draw() {
  const snakeElements = board.querySelectorAll(".snake");
  if (snakeElements) snakeElements.forEach((item) => item.remove());
  snake.draw(board);

  const foodElement = board.querySelector('.food');
  if (foodElement) foodElement.remove();
  if (food) food.draw(board);
}

document.addEventListener("keydown", function (evt) {
  const key = evt.key.toLowerCase();
  switch (key) {
    case "w":
    case "ц":
    case "arrowup":
      snake.pushNewDirection({ x: 0, y: -1 });
      break;
    case "s":
    case "ы":
    case "arrowdown":
      snake.pushNewDirection({ x: 0, y: 1 });
      break;
    case "a":
    case "ф":
    case "arrowleft":
      snake.pushNewDirection({ x: -1, y: 0 });
      break;
    case "d":
    case "в":
    case "arrowright":
      snake.pushNewDirection({ x: 1, y: 0 });
      break;
    default:
      return;
  }
});

window.requestAnimationFrame(startGame);
