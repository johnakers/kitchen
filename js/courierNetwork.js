class CourierNetwork {
  constructor() {
    this.inTransitCouriers = [];
    this.idleCouriers = [];
    this.arrivedCouriers = {};
  }

  createCourier() {
    let courier;
    if (this.idleCouriers.length) {
      courier = this.idleCouriers.shift();
    } else {
      courier = new Courier();
    }

    this.inTransitCouriers.push(courier);
    return courier;
  }
}
