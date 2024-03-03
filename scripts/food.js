class Food {
  constructor(x ,y) {
    this.x = x;
    this.y = y;
  }

  draw(board) {
    const gridItem = document.querySelector(`.board__game__item_${this.x}_${this.y}`);
    gridItem.classList.add('food');
  }
}

export { Food };
