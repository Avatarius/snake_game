class Food {
  constructor(x ,y) {
    this.x = x;
    this.y = y;
  }

  draw(board) {
    const foodTemplate = document.querySelector("#food-template").content;
    const foodElement = foodTemplate.querySelector(".food").cloneNode(true);
    foodElement.style.gridColumnStart = this.x;
    foodElement.style.gridRowStart = this.y;
    board.append(foodElement);
  }
}

export { Food };
