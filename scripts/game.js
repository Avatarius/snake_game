`use strict`;
import { Snake } from "./snake.js";
import { Food } from "./food.js";

let lastTimeRendered = 0;
const board = document.querySelector(".game-board");
const defaultSnakePosition = [
  /* { x: 11, y: 11 },
  {x: 10, y: 11},
  {x: 9, y: 11}, */
  {x: 3, y: 11},
  {x: 2, y: 11},
  {x: 1, y: 11},
];
const snake = new Snake(defaultSnakePosition);
let food;
let previousDirection = {x: 1, y: 0};

const dialog = document.querySelector('.dialog');
const dialogForm = document.querySelector('.dialog__form');
dialogForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  snake.reset();
  snake.changeDirection({x: 1, y: 0});
  draw();
  dialog.close();
  // startGame();
});

function startGame(currentTime) {
  window.requestAnimationFrame(startGame);
  const secondsSinceLastTimeRendered = (currentTime - lastTimeRendered) / 1000;
  if (secondsSinceLastTimeRendered < 1 / snake.snakeSpeed) return;
  lastTimeRendered = currentTime;

  update();
  if (checkDefeat()) {
    dialog.showModal();
    return;
  }
  draw();
}

function checkDefeat() {
  const headPosition = snake.snakePositionArray.at(0);
  const isOutOfBoard = headPosition.x > 21 || headPosition.x < 1 || headPosition.y > 21 || headPosition.y < 1;
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
  if (snake.checkIfOnSnake(food)) {
    snake.expand();
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


//keyboard listener
document.addEventListener("keydown", function (evt) {
  const key = evt.key.toLowerCase();
  const direction = { x: 0, y: 0 };
  switch (key) {
    case "w":
    case "arrowup":
      // console.log('up');
      direction.x = 0;
      direction.y = -1;
      break;
    case "s":
    case "arrowdown":
      // console.log('down');
      direction.x = 0;
      direction.y = 1;
      break;
    case "a":
    case "arrowleft":
      // console.log('left');
      direction.x = -1;
      direction.y = 0;
      break;
    case "d":
    case "arrowright":
      // console.log('right');
      direction.x = 1;
      direction.y = 0;
      break;
    default:
      return;
  }
  // TODO перенести эту логику в snake.changePosition()
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
