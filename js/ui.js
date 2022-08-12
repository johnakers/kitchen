// this is kinda hacky code... but its really just to allow some inputs
class Ui {
  constructor() {
    this.showLogs = true;
    this.logs = [];
    this.strategy = null;
    this.frameRate = 30;
  }

  log(message) {
    let date = new Date()
    let text = `${message} [${date}]`;

    this.logs.unshift(text);
  }

  setup() {
    this.logsButton = createButton('HIDE LOGS');
    this.logsButton.position(5, 5);
    this.logsButton.mousePressed(this._toggleLogs.bind(this));

    this.fifoButton = createButton('RUN FIFO');
    this.fifoButton.position(5, 30);
    this.fifoButton.mousePressed(this._runFifo.bind(this));

    this.matchingButton = createButton('RUN MATCHING');
    this.matchingButton.position(5, 55);
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
    // this.showCouriers();

    textAlign(LEFT);
    let strategyText = this.strategy ? `Running ${this.strategy} strategy...` : 'Idle';
    text(strategyText, 5, height - 5);
  }

  showOrders() {
    let yIncrement = 10;
    let startingX = 10;
    let finishingX = width/2;

    // 10 - 50
    // 4
    // 20

    // making an nice iterable object would be cool, if one in JS doesn't already exist
    // looked at Map, should investigate more
    for (let i = 0; i < Object.keys(op.kitchen.orders).length; i++) {
      let orderId = Object.keys(op.kitchen.orders)[i];
      let order = op.kitchen.orders[orderId];
      let xIncrement = 0;

      if (order.state < 1) {
        // debugger
        // 40
        // /
        //
        // debugger
        xIncrement = (finishingX - startingX) / (order.prepTime);
      }

      fill('orange');
      circle(order.x += xIncrement, order.y + (i * yIncrement), 10);
      fill('black');
      textAlign(CENTER);
      text(order.name, order.x, order.y - 2);
    }
  }

  showCenterLine() {
    line(width/2, 10, width/2, height - 10)
  }

  showAnalytics() {
    debugger
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
}
