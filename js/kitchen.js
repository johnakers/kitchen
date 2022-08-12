class Kitchen {
  constructor() {
    this.orders = {};
  }

  addOrder(order) {
    this.orders[order.id] = order;
    order.kitchen = this; // question mark
    ui.log(`order ${order.id} being prepared. prep time: ${order.prepTime}`);
    this.prep(order);
  }

  prep(order) {
    setTimeout(function () {
      order.prepped();
    }.bind(order), order.prepTime * 1000);
  }
}
