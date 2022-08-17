class Courier {
  constructor(params) {
    this.dispatchedAt = new Date();
    this.id = this._getRandomId();
    this.eta = this._getRandomETA();
    this.orderId = params?.orderId || null;
    this.state = 0;
    this.pickedUpAt = null;
    this.possessOrderId = null;

    // for drawing purposes only
    this.x = window.innerWidth - 10;
    this.y = 10;
  }

  get states() {
    return {
      0: 'in transit',
      1: 'waiting for order',
      2: 'out for delivery'
    }
  }

  get currentState() {
    return this.states[this.state];
  }

  dispatch() {
    ui.log(`dispatching courier ${this.id}, eta: ${this.eta}`);

    this.state = 0;

    setTimeout(function () {
      this.arrived();
    }.bind(this), this.eta * 1000);
  }

  arrived() {
    this.state = 1;
    this.arrivedAt = new Date();

    ui.log(`courier ${this.id} has arrived`)
  }

  outForDelivery() {
    this.state = 2;
    this.pickedUpAt = new Date();
  }

  _getRandomId() {
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomNumber = Math.floor(Math.random() * 100000);

    return `c_${randomLetter}${randomNumber}`;
  }

  // ref: https://stackoverflow.com/a/26795289
  // ref: http://jsfiddle.net/hd9tt509/1/
  _getRandomETA() {
    // values hardcoded, but can be altered in the future for min, max (a - b) values
    return Math.floor(Math.random() * (15 - 3)) + 3;
  }
}
