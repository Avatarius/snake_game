function _createDeepCopy(array) {
  const newArray = [];
  array.forEach((item, index) => {
    newArray[index] = { x: item.x, y: item.y };
  });
  return newArray;
}

class Snake {
  isStart = true;
  direction = { x: 1, y: 0 };
  newDirectionBuffer = [];
  previousDirection = { x: 1, y: 0 };
  constructor(defaultPositionArray) {
    this.defaultPositionArray = _createDeepCopy(defaultPositionArray);
    this.snakePositionArray = _createDeepCopy(defaultPositionArray);
  }

  update() {
    let previousPosX = this.snakePositionArray.at(0).x;
    let previousPosY = this.snakePositionArray.at(0).y;
    this.tailPosX = this.snakePositionArray.at(-1).x;
    this.tailPosY = this.snakePositionArray.at(-1).y;
    if (this.isStart) {
      this.isStart = false;
      return;
    }
    this.snakePositionArray.forEach((item, index) => {
      if (index === 0) {
        item.x += this.direction.x;
        item.y += this.direction.y;
      } else {
        const currentPosX = item.x;
        const currentPosY = item.y;
        item.x = previousPosX;
        item.y = previousPosY;
        previousPosX = currentPosX;
        previousPosY = currentPosY;
      }
    });
    this.changeDirection();
  }

  draw(board) {
    const snakeTemplate = document.querySelector("#snake-template").content;
    this.snakePositionArray.forEach((item) => {
      const snakeElement = snakeTemplate
        .querySelector(".snake")
        .cloneNode(true);
      snakeElement.style.gridColumnStart = item.x;
      snakeElement.style.gridRowStart = item.y;
      board.append(snakeElement);
    });
  }

  pushNewDirection(newDirection) {
    this.newDirectionBuffer.push(newDirection);
  }

  changeDirection() {
    const newDirection = this.newDirectionBuffer.length
      ? this.newDirectionBuffer.shift()
      : this.direction;

    const isOppositeX =
      newDirection.x !== 0 && newDirection.x === this.direction.x * -1;
    const isOppositeY =
      newDirection.y !== 0 && newDirection.y === this.direction.y * -1;
    const isSameX = newDirection.x !== 0 && newDirection.x === this.direction.x;
    const isSameY =
      newDirection.y !== 0 && newDirection.y === this.direction.isOppositeY;
    const isOpposite = isOppositeX || isOppositeY;
    const isSame = isSameX || isSameY;
    if (!(isOpposite || isSame)) {
      this.direction.x = newDirection.x;
      this.direction.y = newDirection.y;
    }
  }

  expand() {
    this.snakePositionArray.push({ x: this.tailPosX, y: this.tailPosY });
  }

  reset() {
    this.isStart = true;
    this.snakePositionArray = _createDeepCopy(this.defaultPositionArray);
    this.direction.x = 1;
    this.direction.y = 0;
    this.newDirectionBuffer = [];
  }
}

export { Snake };
