class OrderProcessor {
  constructor(params) {
    this.orderData = params.orderData;
    this.kitchen = params.kitchen;
    this.courierNetwork = params.courierNetwork;
    this.strategy = params.strategy;
    this.completedDeliveries = {};
    this.numberOfOrders = this.orderData.length;
    this.state = 0;
  }

  get runStates() {
    return {
      0: 'idle',
      1: 'running',
      2: 'complete'
    }
  }

  get runComplete() {
    return this.state >= 2;
  }

  get currentState() {
    return this.runStates[this.state];
  }

  // mocks an order coming in, every 2 seconds
  ingestOrders() {
    this.startedAt = new Date();

    this.ingestOrderInterval = setInterval(function (e) {
      if (!this.orderData.length) {
        ui.log('*** All order ingested ***')
        clearInterval(this.ingestOrderInterval);
        return
      }

      let data = this.orderData.shift();
      ui.log(`ingesting order ${data.id}`)

      this.processOrder(data);
    }.bind(this), 2000);
  }

  processOrder(orderData) {
    let order = new Order(orderData);
    this.kitchen.addOrder(order);

    let courier = this.courierNetwork.createCourier();
    // if matched, assign order to specific courier
    courier.dispatch()
  }

  update() {
    this._updateDeliveries();
    this._updateCouriers();
    this._updateCompletion();
  }

  _updateDeliveries() {
    // check for ready orders
    // give them to courier, if ready
    for (let id in this.kitchen.orders) {
      let order = this.kitchen.orders[id];

      // if an order has already been picked up, skip
      // consider moving into readyOrders queue
      if (order.pickedUpAt) {
        continue;
      }

      if (order.state === 1) {
        // if no couriers arrived, skip
        if (!Object.keys(this.courierNetwork.arrivedCouriers).length) {
          continue;
        }

        // assign ready orders to couriers
        for (let courierId in this.courierNetwork.arrivedCouriers) {
          // TODO: if matching logic, courier can only pick up specific order
          let courier = this.courierNetwork.arrivedCouriers[courierId];

          // edge case check around "delete"
          if (courier.state >= 2) {
            continue;
          }

          let delivery = new Delivery({ courier: courier, order: order });
          order.outForDelivery();
          courier.outForDelivery();
          this.completedDeliveries[delivery.id] = delivery;
          this._logDelivery({ courier: courier, delivery: delivery, order: order });

          // remove from arrived, as it has bee delivered
          // remove order as it is no longer in the kitchen
          delete this.courierNetwork.arrivedCouriers[courierId];
          delete this.kitchen.orders[id];
        }
      }
    }
  }

  _logDelivery(data) {
    ui.log(`delivery ${data.delivery.id} {order ${data.order.id} with courier ${data.courier.id}} out for delivery`)
  }

  _updateCouriers() {
    // when couriers arrive, notify network / add to waiting list
    for (let i = 0; i < this.courierNetwork.inTransitCouriers.length; i++) {
      let courier = this.courierNetwork.inTransitCouriers[i];

      // remove from intransit

      if (courier.state == 1) {
        this.courierNetwork.arrivedCouriers[courier.id] = courier;
      }
    }
  }

  _updateCompletion() {
    if (Object.keys(this.completedDeliveries).length === this.numberOfOrders) {
      // debugger
    }
  }
}
