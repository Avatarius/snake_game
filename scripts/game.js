`use strict`;
import { Snake } from "./snake.js";
import { Food } from "./food.js";

class Game {
  board = document.querySelector(".game-board");
  dialog = document.querySelector(".dialog");
  dialogForm = document.querySelector(".dialog__form");
  scoreSpan = document.querySelector(".score__span");
  stop = false;
  lastTimeRendered = 0;
  speed = 6;
  score = 0;
  food;
  defaultSnakePosition = [
    { x: 3, y: 11 },
    { x: 2, y: 11 },
    { x: 1, y: 11 },
  ];
  constructor() {
    this.snake = new Snake(this.defaultSnakePosition);
    this.setEventListeners();
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
      // debugger;
      this.dialog.showModal();
      this.stop = true;
      return;
    }
    this.draw();
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

  update() {
    this.snake.update();
    // Генерим еду
    while (!this.food) {
      const foodPosX = this.randomIntFromInterval(1, 21);
      const foodPosY = this.randomIntFromInterval(1, 21);
      console.log(foodPosX);
      console.log(foodPosY);
      const ifFoodInsideSnake = this.snake.snakePositionArray.some(
        (item) => item.x === foodPosX && item.y === foodPosY
      );
      console.log(ifFoodInsideSnake);
      if (ifFoodInsideSnake) {
        continue;
      } else {
        this.food = new Food(foodPosX, foodPosY);
      }
      console.log(this.food);
    }
    // проверка съела ли змея еду
    if (
      this.snake.snakePositionArray.at(0).x === this.food.x &&
      this.snake.snakePositionArray.at(0).y === this.food.y
    ) {
      this.snake.expand();
      this.updateScore();
      this.food = null;
    }
  }

  draw() {
    const snakeElements = this.board.querySelectorAll(".snake");
    snakeElements.forEach((item) => item.remove());
    this.snake.draw(this.board);

    const foodElement = this.board.querySelector(".food");
    if (foodElement) foodElement.remove();
    if (this.food) this.food.draw(this.board);
  }

  updateScore(reset = false) {
    this.score = reset ? 0 : ++this.score;
    this.scoreSpan.textContent = this.score;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setEventListeners() {
    document.addEventListener("keydown", (evt) => {
      const key = evt.key.toLowerCase();
      switch (key) {
        case "w":
        case "ц":
        case "arrowup":
          this.snake.pushNewDirection({ x: 0, y: -1 });
          break;
        case "s":
        case "ы":
        case "arrowdown":
          this.snake.pushNewDirection({ x: 0, y: 1 });
          break;
        case "a":
        case "ф":
        case "arrowleft":
          this.snake.pushNewDirection({ x: -1, y: 0 });
          break;
        case "d":
        case "в":
        case "arrowright":
          this.snake.pushNewDirection({ x: 1, y: 0 });
          break;
        default:
          return;
      }
    });
    this.dialogForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.stop = false;
      this.snake.reset();
      this.updateScore(true);
      this.dialog.close();
      this.start(0);
    });
  }
}

const game = new Game();

window.requestAnimationFrame((currentTime) => game.start(currentTime));
