class Order {
  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.prepTime = params.prepTime;
    this.kitchen = params.kitchen
    this.state = 0;
    this.readyAt = null;
    this.pickedUpAt = null;

    // default values, solely for drawing purposes
    this.x = 10;
    this.y = 20;
  }

  get states() {
    return {
      0: 'being prepared',
      1: 'ready for pickup',
      2: 'out for delivery',
    }
  }

  get currentState() {
    return this.states[this.state];
  }

  outForDelivery() {
    this.state = 2;
    this.pickedUpAt = new Date();
  }

  prepped() {
    this.state = 1;
    this.readyAt = new Date();
    ui.log(`order ${this.id} is ${this.currentState}`)
  }
}
