class Food {
  constructor() {
    this.x = this._randomIntFromInterval(1, 21);
    this.y = this._randomIntFromInterval(1, 21);
  }

  _randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  draw(board) {
    const foodTemplate = document.querySelector('#food-template').content;
    const foodElement = foodTemplate.querySelector('.food').cloneNode(true);
    foodElement.style.gridColumnStart = this.x;
    foodElement.style.gridRowStart = this.y;
    board.append(foodElement);
  }
}

export { Food };
