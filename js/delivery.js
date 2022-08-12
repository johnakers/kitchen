class Delivery {
  constructor(params) {
    this.id = this._getRandomId()
    this.courier = params.courier;
    this.order = params.order;
    this.createdAt = new Date();
  }

  get metadata() {
    return {
      foodWaitDifference: (this.order.pickedUpAt - this.order.readyAt) / 1000.0,
      courierWaitDifference: (this.courier.pickedUpAt - this.courier.arrivedAt) / 1000.0
    };
  }

  _getRandomId() {
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomNumber = Math.floor(Math.random() * 10000);

    return `d_${randomLetter}${randomNumber}`;
  }
}
