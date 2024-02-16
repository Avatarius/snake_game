`use strict`;

class Snake {
  snakeSpeed = 2;
  currentDirection = { x: 1, y: 0 };
  previousDirection = {x: 1, y: 0};
  isStart = true;

w

  constructor(defaultSnakePosition) {
    this.snakePositionObj = defaultSnakePosition.reverse();
  }

  update() {
    // если жмём наверх, то item.x += currentPosition.y
    // если жмём вниз, то item.x += currentPosition.y * -1
    // если жмём нелево, то item.y += currentPosition.x; * -1
    // если жмём направо, то item.y += currentPosition.x
    this.snakePositionObj.forEach((item, index) => {
      const isMovingSameDirectionX = (this.currentDirection.x !== 0) && (this.currentDirection.x === this.previousDirection.x);
      const isMovingSameDirectionY = (this.currentDirection.y !== 0) && (this.currentDirection.y === this.previousDirection.y);
      const isMovingSameDirection = isMovingSameDirectionX || isMovingSameDirectionY;
      if (index === 0 && !this.isStart) { // голова
          item.x += this.currentDirection.x;
          item.y += this.currentDirection.y;
      } else if (!this.isStart && isMovingSameDirection) { // движение в том же направлении
        item.x += this.currentDirection.x;
        item.y += this.currentDirection.y;
      } else if (!this.isStart && !isMovingSameDirection) {// поворот
        const rotateDirection = {x: 1, y: 0};
        item.x += rotateDirection.x;
        // item.y += rotateDirection.y;
      }
      // console.log(`current: ${JSON.stringify(this.currentDirection)}, previous: ${JSON.stringify(this.previousDirection)}`);
    });
    this.isStart = false;
    this.changeDirection(this.currentDirection);

  }
  draw(board) {
    this.snakePositionObj.forEach((item) => {
      // add new node
      const snakeTemplate = document.querySelector("#snake-template").content;
      const snakeElement = snakeTemplate
        .querySelector(".snake")
        .cloneNode(true);
      snakeElement.style.gridColumnStart = item.x;
      snakeElement.style.gridRowStart = item.y;
      board.append(snakeElement);
    });
  }

  changeDirection(directionObj) {
    this.previousDirection.x = this.currentDirection.x;
    this.previousDirection.y = this.currentDirection.y;

    this.currentDirection.x = directionObj.x;
    this.currentDirection.y = directionObj.y;
  }
}

export { Snake };
