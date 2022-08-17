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

  // mocks receiving 2 orders, per second
  ingestOrders() {
    this.startedAt = new Date();
    this.state = 1;

    this.ingestOrderInterval = setInterval(function (e) {
      if (this.orderData.length <= 0) {
        ui.log('************ All order ingested ************');
        clearInterval(this.ingestOrderInterval);
        return;
      }

      // 2 orders per second
      let data = this.orderData.shift();
      ui.log(`ingesting order ${data.id}`);
      this.processOrder(data);

      let data2 = this.orderData.shift();
      ui.log(`ingesting order ${data2.id}`);
      this.processOrder(data2);
    }.bind(this), 1000);
  }

  processOrder(orderData) {
    let order = new Order(orderData);
    this.kitchen.addOrder(order);

    let courier = this.courierNetwork.createCourier();

    // if matched, assign order to specific courier
    if (this.strategy === 1) {
      courier.orderId = order.id;
    }

    courier.dispatch();
  }

  update() {
    this._updateDeliveries();
    this._updateCouriers();
  }

  _updateDeliveries() {
    // check for ready orders
    // give them to courier, if ready
    for (let id in this.kitchen.orders) {
      let order = this.kitchen.orders[id];

      // if an order has already been picked up, skip
      // consider moving into readyOrders queue
      if (order?.pickedUpAt) {
        continue;
      }

      if (order.state === 1) {
        // if no couriers arrived, skip
        if (!Object.keys(this.courierNetwork.arrivedCouriers).length) {
          continue;
        }

        // assign ready orders to couriers
        for (let courierId in this.courierNetwork.arrivedCouriers) {
          let courier = this.courierNetwork.arrivedCouriers[courierId];

          // edge case check around "delete"
          // if a courier has not been removed (already picked up an order)
          // they could pick up 2 orders... which isn't a thing
          if (courier.state >= 2) {
            continue;
          }

          // if we're matching orders to couriers
          // and the order doesn't match what the courier is supposed to pickup
          // go to next courier
          if (this.strategy === 1 && courier.orderId !== order.id) {
            continue;
          }

          // edge case check ---
          // in FIFO... a Courier can try to pick up an Order that has already been picked up
          // even though Deliveries are correct, they weren't being removed from
          // this.kitchen.orders correctly
          // need more time to dig into it, but I believe its somewhat related to p5 running every
          // frame
          if (this.kitchen.orders[id] === undefined) {
            continue;
          }

          let delivery = new Delivery({ courier: courier, order: order });
          order.outForDelivery();
          courier.outForDelivery();
          this.completedDeliveries[delivery.id] = delivery;
          this._logDelivery({ courier: courier, delivery: delivery, order: order });

          // remove courier from arrived, as it has been delivered
          // remove order as it is no longer in the kitchen
          delete this.courierNetwork.arrivedCouriers[courierId];
          delete this.kitchen.orders[id];
        }
      }
    }

    this._updateCompletion();
  }

  _logDelivery(data) {
    ui.log(`delivery ${data.delivery.id} {order ${data.order.id} with courier ${data.courier.id}} out for delivery`)
  }

  _updateCouriers() {
    // when couriers arrive, notify network / add to waiting list
    for (let i = 0; i < this.courierNetwork.inTransitCouriers.length; i++) {
      let courier = this.courierNetwork.inTransitCouriers[i];

      if (courier.state == 1) {
        this.courierNetwork.arrivedCouriers[courier.id] = courier;

        let courierIndex = this.courierNetwork.inTransitCouriers.indexOf(courier);
        this.courierNetwork.inTransitCouriers.splice(courierIndex, 1);
      }
    }
  }

  _updateCompletion() {
    if (Object.keys(this.completedDeliveries).length === this.numberOfOrders && !this.endedAt) {
      this.state = 2;
      this.endedAt = new Date();
    }
  }
}
