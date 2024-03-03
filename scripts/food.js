class Food {
  constructor(x ,y) {
    this.x = x;
    this.y = y;
  }

  draw(board) {
    /* const foodTemplate = document.querySelector("#food-template").content;
    const foodElement = foodTemplate.querySelector(".food").cloneNode(true);
    foodElement.style.gridColumnStart = this.x;
    foodElement.style.gridRowStart = this.y;
    board.append(foodElement); */
    const gridItem = document.querySelector(`.board__game__item_${this.x}_${this.y}`);
    gridItem.classList.add('food');
  }
}

export { Food };
