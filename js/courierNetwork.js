class CourierNetwork {
  constructor() {
    this.idleCouriers = [];
    this.inTransitCouriers = [];
    this.arrivedCouriers = {};
  }

  createCourier() {
    let courier;

    // idleCouriers are unused for this project... but could be in the future
    if (this.idleCouriers.length) {
      courier = this.idleCouriers.shift();
    } else {
      courier = new Courier();
    }

    this.inTransitCouriers.push(courier);
    return courier;
  }
}
