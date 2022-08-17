// Ui is a class that allows us to see a very rudimentary representation of Orders/Couriers/Deliveries
// it is purposefully *not* tested (there be dragons)
// it leverages the associated p5js library for the Ui elements, such as createButton and circle, etc
class Ui {
  constructor(params) {
    this.console = params.console;
    this.showLogs = true;
    this.showAnalytics = true;
    this.logs = [];
    this.strategy = null;
    this.frameRate = 30;
  }

  log(message) {
    let date = new Date()
    let text = `${message} [${date}]`;

    if (this.console) {
      console.log(text);
    }

    this.logs.unshift(text);
  }

  setup() {
    this.logsButton = createButton('HIDE LOGS');
    this.logsButton.position(5, 5);
    this.logsButton.mousePressed(this._toggleLogs.bind(this));

    this.analyticsButton = createButton('HIDE ANALYTICS');
    this.analyticsButton.position(5, 30);
    this.analyticsButton.mousePressed(this._toggleAnalytics.bind(this));

    this.fifoButton = createButton('RUN FIFO');
    this.fifoButton.position(5, 55);
    this.fifoButton.mousePressed(this._runFifo.bind(this));

    this.matchingButton = createButton('RUN MATCHING');
    this.matchingButton.position(5, 80);
    this.matchingButton.mousePressed(this._runMatching.bind(this));

    this.runButtons = [this.matchingButton, this.fifoButton];
  }

  render() {
    if (this.showLogs) {
      for (let i = 0; i < this.logs.length; i++) {
        let logMessage = this.logs[i];
        let increment = i * 12;

        textAlign(RIGHT);
        text(logMessage, width, 10 + increment);
      }
    }

    this.showCenterLine();
    this.showOrders();
    this.showCouriers();
    this.renderAnalytics();

    textAlign(LEFT);
    let strategyText = this.strategy ? `Running ${this.strategy} strategy...` : 'Idle';
    text(strategyText, 5, height - 5);
  }

  renderAnalytics() {
    let deliveries = Object.keys(op.completedDeliveries);

    // we don't want to divide by 0
    if (deliveries.length < 1) { return; }

    let sumFoodWaitTime = 0;
    let sumCourierWaitTime = 0;
    for (let i = 0; i < deliveries.length; i++) {
      let deliveryId = deliveries[i];
      let delivery = op.completedDeliveries[deliveryId];

      sumFoodWaitTime += (delivery.order.pickedUpAt - delivery.order.readyAt);
      sumCourierWaitTime += (delivery.courier.pickedUpAt - delivery.courier.arrivedAt);
    }

    let avgFoodWaitTime = sumFoodWaitTime / deliveries.length;
    let avgCourierWaitTime = sumCourierWaitTime / deliveries.length;

    if (this.showAnalytics) {
      textAlign(LEFT);
      text(`AvgFoodWaitTime: ${avgFoodWaitTime.toFixed(4)} milliseconds`, 5, height - 20);
      text(`AvgCourierWaitTime: ${avgCourierWaitTime.toFixed(4)} milliseconds`, 5, height - 35);
      text(`Deliveries: ${deliveries.length}`, 5, height - 50);
    }

    if (op.endedAt) {
      text(`RUN COMPLETE. Run time: ${(op.endedAt - op.startedAt) / 1000} seconds`, 5, height - 65);
    }
  }

  showOrders() {
    let yIncrement = 15;
    let startingX = 10;
    let finishingX = width/2;

    // making an nice iterable object would be cool, if one in JS doesn't already exist
    // looked at Map, should investigate more
    for (let i = 0; i < Object.keys(op.kitchen.orders).length; i++) {
      let orderId = Object.keys(op.kitchen.orders)[i];
      let order = op.kitchen.orders[orderId];

      if (order.state >= 2) {
        continue;
      }

      let xIncrement = 0;
      let distance = finishingX - startingX;

      if (order.state < 1) {
        xIncrement = distance / (order.prepTime * this.frameRate);
      }

      if (order.x < width/2) {
        order.x += xIncrement
       }

      fill('orange');
      circle(order.x, order.y + (i * yIncrement), 10);
      fill('black');
      textAlign(CENTER);
      text(order.name, order.x, order.y - 2 + (i * yIncrement));
    }
  }

  showCouriers() {
    let yIncrement = 15;
    let startingX = width - 10;
    let finishingX = width / 2;

    // making an nice iterable object would be cool, if one in JS doesn't already exist
    // looked at Map, should investigate more
    for (let i = 0; i < op.courierNetwork.inTransitCouriers.length; i++) {
      let courier = op.courierNetwork.inTransitCouriers[i];
      let xIncrement = 0;
      let distance = startingX - finishingX; // backwards here

      if (courier.state < 1) {
        xIncrement = distance / (courier.eta * this.frameRate);
      }

      if (courier.x > width/2) {
        courier.x -= xIncrement;
      }

      fill('cyan');
      circle(courier.x, courier.y + (i * yIncrement), 10);
      fill('black');
      textAlign(CENTER);
      text(courier.id, courier.x, courier.y - 2 + (i * yIncrement));
    }

    for (let courierId in op.courierNetwork.arrivedCouriers) {
      let courier = op.courierNetwork.arrivedCouriers[courierId];

      fill('cyan');
      circle(courier.x, courier.y, 10);
      fill('black');
      textAlign(CENTER);
      text(courier.id, courier.x, courier.y - 2);
    }
  }

  showCenterLine() {
    line(width/2, 10, width/2, height - 10)
  }

  _runFifo() {
    this.strategy = 'FIFO';
    op.strategy = 0;
    op.ingestOrders();
    this._hideRunButtons();
  }

  _runMatching() {
    this.strategy = 'MATCHING'
    op.strategy = 1;
    op.ingestOrders();
    this._hideRunButtons();
  }

  _hideRunButtons() {
    for (let i = 0; i < this.runButtons.length; i++) {
      let button = this.runButtons[i];
      button.remove();
    }
  }

  _toggleLogs() {
    this.showLogs = !this.showLogs;

    let buttonText = this.showLogs ? 'HIDE LOGS' : 'SHOW LOGS';
    this.logsButton.html(buttonText);
  }

  _toggleAnalytics() {
    this.showAnalytics = !this.showAnalytics;

    let buttonText = this.showAnalytics ? 'HIDE ANALYTICS' : 'SHOW ANALYTICS';
    this.analyticsButton.html(buttonText);
  }
}
