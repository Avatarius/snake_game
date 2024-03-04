`use strict`;
import { Snake } from "./snake.js";
import { Food } from "./food.js";

const scoreSpan = document.querySelector(".score__span");
const menuScore = document.querySelector(".menu__score");
const details = document.querySelector(".details");

// менюшки
const board = document.querySelector(".game");
const menuStart = document.querySelector(".menu_start");
const menuPause = document.querySelector(".menu_pause");
const menuDefeat = document.querySelector(".menu_defeat");

// кнопки
const buttonEasy = document.querySelector(".menu__button_easy");
const buttonMedium = document.querySelector(".menu__button_medium");
const buttonHard = document.querySelector(".menu__button_hard");
const difficultyButtons = [buttonEasy, buttonMedium, buttonHard];
const buttonPause = document.querySelector(".details__button_pause");
const buttonReset = document.querySelector(".details__button_reset");

class Game {
  defaultSnakePosition = [
    { x: 3, y: 11 },
    { x: 2, y: 11 },
    { x: 1, y: 11 },
  ];
  stop = true;
  lastTimeRendered = 0;
  speed = 6;
  score = 0;
  food;

  constructor() {
    this.snake = new Snake(this.defaultSnakePosition);
  }

  start(currentTime) {
    if (!this.stop) {
      window.requestAnimationFrame((time) => this.start(time));
    }
    const secondsSinceLastTimeRendered =
      (currentTime - this.lastTimeRendered) / 1000;
    if (secondsSinceLastTimeRendered < 1 / this.speed) return;
    this.lastTimeRendered = currentTime;
    this.update();
    if (this.checkDefeat()) {
      this.stop = true;
      menuScore.textContent = this.score;
      board.classList.add("hidden");
      details.classList.add("hidden");
      menuDefeat.classList.remove("hidden");
      return;
    }
    this.draw();
  }

  reset() {
    this.snake.reset();
    this.updateScore(true);
    this.food = null;
    this.stop = false;
  }

  resetUI() {
    menuDefeat.classList.add("hidden");
    board.classList.add("hidden");
    menuPause.classList.add("hidden");
    details.classList.add("hidden");
    menuStart.classList.remove("hidden");
    board.classList.remove("game_filtered");
    buttonPause.classList.remove('details__button_play');
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  checkDefeat() {
    const headPosition = this.snake.snakePositionArray.at(0);
    const isOutOfBoard =
      headPosition.x > 21 ||
      headPosition.x < 1 ||
      headPosition.y > 21 ||
      headPosition.y < 1;
    const isSelfCollide = this.snake.snakePositionArray.some((item, index) => {
      if (index !== 0) {
        return item.x === headPosition.x && item.y === headPosition.y;
      }
    });
    return isOutOfBoard || isSelfCollide;
  }

  checkEating() {
    return (
      this.snake.snakePositionArray.at(0).x === this.food.x &&
      this.snake.snakePositionArray.at(0).y === this.food.y
    );
  }

  update() {
    this.snake.update();
    this.generateFood();
    if (this.checkEating()) {
      this.snake.expand();
      this.updateScore();
      this.food = null;
    }
  }

  generateFood() {
    while (!this.food) {
      const foodPosX = this.randomIntFromInterval(1, 21);
      const foodPosY = this.randomIntFromInterval(1, 21);
      const ifFoodInsideSnake = this.snake.snakePositionArray.some(
        (item) => item.x === foodPosX && item.y === foodPosY
      );
      if (ifFoodInsideSnake) {
        continue;
      } else {
        this.food = new Food(foodPosX, foodPosY);
      }
    }
  }

  draw() {
    this.clearBoard();
    this.snake.draw(board);
    if (this.food) this.food.draw(board);
  }

  clearBoard() {
    // удаляем элементы змеи
    const snakeElements = board.querySelectorAll(".snake");
    snakeElements.forEach((item) => {
      item.classList.remove("snake");
      item.classList.remove("snake__head");
    });
    // удаляем еду
    const foodElement = board.querySelector(".food");
    if (foodElement) foodElement.classList.remove("food");
    if (this.food) this.food.draw(this.board);
  }

  updateScore(reset = false) {
    this.score = reset ? 0 : ++this.score;
    scoreSpan.textContent = this.score;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// наполняем доску квадратами
const gridItemTemplate = document.querySelector("#game__item-template").content;
for (let i = 1; i <= 21; i++) {
  for (let j = 1; j <= 21; j++) {
    const gridItem = gridItemTemplate
      .querySelector(".game__item")
      .cloneNode(true);
    gridItem.style.gridColumnStart = i;
    gridItem.style.gridRowStart = j;
    gridItem.classList.add(`game__item_${i}_${j}`);
    board.append(gridItem);
  }
}

const game = new Game();

difficultyButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    let speed;
    switch (evt.target) {
      case buttonEasy:
        speed = 2;
        break;
      case buttonMedium:
        speed = 6;
        break;
      case buttonHard:
        speed = 10;
        break;
    }
    menuStart.classList.add("hidden");
    board.classList.remove("hidden");
    details.classList.remove("hidden");
    game.reset();
    game.setSpeed(speed);
    game.start(0);
  });
});

buttonPause.addEventListener("click", () => {
  game.stop = !game.stop;
  board.classList.toggle("game_filtered");
  menuPause.classList.toggle("hidden");
  buttonPause.classList.toggle('details__button_play');
  if (!game.stop) {
    game.snake.newDirectionBuffer = [];
    game.start();
  }
});

[buttonReset, menuDefeat].forEach((resetElement) => {
  resetElement.addEventListener("click", () => {
    game.stop = true;
    game.resetUI();
  });
});

document.addEventListener("keydown", (evt) => {
  const key = evt.key.toLowerCase();
  switch (key) {
    case "w":
    case "ц":
    case "arrowup":
      game.snake.pushNewDirection({ x: 0, y: -1 });
      break;
    case "s":
    case "ы":
    case "arrowdown":
      game.snake.pushNewDirection({ x: 0, y: 1 });
      break;
    case "a":
    case "ф":
    case "arrowleft":
      game.snake.pushNewDirection({ x: -1, y: 0 });
      break;
    case "d":
    case "в":
    case "arrowright":
      game.snake.pushNewDirection({ x: 1, y: 0 });
      break;
    default:
      return;
  }
});
