`use strict`;
import { Snake } from "./snake.js";
import { Food } from "./food.js";

class Game {
  container = document.querySelector('.container');
  board = document.querySelector(".game");
  boardPause = document.querySelector('.menu_pause');
  details = document.querySelector('.details');
  startModal = document.querySelector('.menu_start');
  defeatModal = document.querySelector('.menu_defeat');
  buttonEasy = document.querySelector('.menu__button_easy');
  buttonMedium = document.querySelector('.menu__button_medium');
  buttonHard = document.querySelector('.menu__button_hard');
  buttonPause = document.querySelector('.details__button_pause');
  buttonReset = document.querySelector('.details__button_reset');
  scoreSpan = document.querySelector(".score__span");
  boardScoreSpan = document.querySelector('.menu__score');
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
    this.populateGrid();
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
      this.stop = true;
      this.boardScoreSpan.textContent = this.score;
      this.board.classList.add('hidden');
      this.details.classList.add('hidden');
      this.defeatModal.classList.remove('hidden');
      return;
    }
    this.draw();
  }

  populateGrid() {
    const gridItemTemplate = document.querySelector('#game__item-template').content;
    for (let i = 1; i <= 21; i++) {
      for (let j = 1; j <= 21; j++) {
        const gridItem = gridItemTemplate.querySelector('.game__item').cloneNode(true);
        gridItem.style.gridColumnStart = i;
        gridItem.style.gridRowStart = j;
        gridItem.classList.add(`game__item_${i}_${j}`);
        this.board.append(gridItem);
      }
    }
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

  update() {
    this.snake.update();
    // Генерим еду
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
    snakeElements.forEach((item) => {
      item.classList.remove('snake');
      item.classList.remove('snake__head');
    });
    this.snake.draw(this.board);

    const foodElement = this.board.querySelector(".food");
    if (foodElement) foodElement.classList.remove('food');
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
    [this.buttonEasy, this.buttonMedium, this.buttonHard].forEach((button) => {
      button.addEventListener('click', (evt) => {
        let speed;
        if (evt.target === this.buttonMedium) {
          speed = 10;
        } else if (evt.target === this.buttonHard) {
          speed = 15;
        } else {
          speed = 5
        }
        this.setSpeed(speed);
        this.snake.reset();
        this.food = null;
        this.stop = false;
        this.start(0);
        this.startModal.classList.add('hidden')
        this.details.classList.remove('hidden');
        this.board.classList.remove('hidden');
        this.updateScore(true);
      })
    });
    this.buttonPause.addEventListener('click', () => {
      if (!this.stop) {
        this.stop = true;
        this.buttonPause.style.backgroundImage = 'url(../images/play.svg';
        this.boardPause.classList.remove('hidden');
        this.board.classList.add('game_filtered');

      } else {
        this.stop = false;
        this.board.classList.remove('board_game_paused');
        this.snake.newDirectionBuffer = [];
        this.start(0);
        this.buttonPause.style.backgroundImage = 'url(../images/pause.svg';
        this.boardPause.classList.add('hidden');
        this.board.classList.remove('game_filtered');
      }
    });
    this.buttonReset.addEventListener('click', () => {
      this.stop = true;
      this.startModal.classList.remove('hidden');
      this.board.classList.add('hidden');
      this.details.classList.add('hidden');
      this.board.classList.remove('board_game_paused');
      this.boardPause.classList.remove('menu_pause_visibile');
      this.board.classList.remove('game_filtered');
      this.buttonPause.style.backgroundImage = 'url(../images/pause.svg';
    });
    this.defeatModal.addEventListener('click', (evt) => {
      this.defeatModal.classList.add('hidden');
      this.startModal.classList.remove('hidden');
      this.start(0);
    })
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

  }
}

const game = new Game();

// window.requestAnimationFrame((currentTime) => game.start(currentTime));
