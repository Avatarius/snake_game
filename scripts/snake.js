class Snake {
  snakeSpeed = 3;
  currentDirection = { x: 1, y: 0 };
  previousDirection = {x: 1, y: 0};
  isStart = true;




  constructor(defaultSnakePosition) {
    this.snakePositionArray = defaultSnakePosition;
    this.previousTailPositionX = this.snakePositionArray.at(-1).x;
    this.previousTailPositionY = this.snakePositionArray.at(-1).y;
  }

  update() {
    if (this.isStart) {
      this.isStart = false;
      return;
    };
    let previousItemX = this.snakePositionArray[0].x;
    let previousItemY = this.snakePositionArray[0].y;
    this.previousTailPositionX = this.snakePositionArray.at(-1).x;
    this.previousTailPositionY = this.snakePositionArray.at(-1).y;

    this.snakePositionArray.forEach((item, index) => {
      if (index === 0) {
        item.x += this.currentDirection.x;
        item.y += this.currentDirection.y;
      } else {
        // сохраняем позицию до изменений в переменные
        const itemPositionX = item.x;
        const itemPositionY = item.y;
        // двигаем элемент на позицию прошлого элемента
        item.x = previousItemX;
        item.y = previousItemY;
        // обновляем прошлую позицию
        previousItemX = itemPositionX;
        previousItemY = itemPositionY;
      }
    });
  }
  draw(board) {
    const snakeTemplate = document.querySelector("#snake-template").content;
    this.snakePositionArray.forEach((item) => {
      // add new node
      const snakeElement = snakeTemplate
        .querySelector(".snake")
        .cloneNode(true);
      snakeElement.style.gridColumnStart = item.x;
      snakeElement.style.gridRowStart = item.y;
      board.append(snakeElement);
    });
  }

  changeDirection(directionObj) {
    this.currentDirection.x = directionObj.x;
    this.currentDirection.y = directionObj.y;
  }

  checkIfOnSnake(obj) {
    return (this.snakePositionArray[0].x === obj.x) && (this.snakePositionArray[0].y === obj.y);
  }

  expand() {
    this.snakePositionArray.push({x: this.previousTailPositionX, y: this.previousTailPositionY});
  }


}

export { Snake };
