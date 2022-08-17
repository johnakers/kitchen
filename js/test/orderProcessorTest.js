describe('OrderProcessor', function () {
  let mockOrderData = [
    {
      id: '1',
      name: 'apples',
      prepTime: 1
    },
    {
      id: '2',
      name: 'bananas',
      prepTime: 2
    }
  ];

  describe('#runStates', function() {
    it('returns the potential states', function() {
      let processor = new OrderProcessor({
        orderData: mockOrderData,
        kitchen: new Kitchen(),
        courierNetwork: new CourierNetwork(),
        strategy: 0,
      });

      let expectedStates = {
        0: 'idle',
        1: 'running',
        2: 'complete'
      };

      for (let i = 0; i < 3; i++) {
        assert.equal(processor.runStates[i], expectedStates[i]);
      }
    });
  });

  describe('#runComplete', function () {
    context('when state is complete', function() {
      it('returns true', function() {
        let processor = new OrderProcessor({
          orderData: mockOrderData,
          kitchen: new Kitchen(),
          courierNetwork: new CourierNetwork(),
          strategy: 0,
        });

        processor.state = 2;

        assert.equal(processor.runComplete, true);
      });
    });

    context('when state is not complete', function () {
      it('returns false', function () {
        let processor = new OrderProcessor({
          orderData: mockOrderData,
          kitchen: new Kitchen(),
          courierNetwork: new CourierNetwork(),
          strategy: 0
        });

        processor.state = 1;

        assert.equal(processor.runComplete, false);
      });
    });
  });

  describe('#ingestOrders()', function() {
    it('sets #startedAt', function() {
      let processor = new OrderProcessor({
        orderData: mockOrderData,
        kitchen: new Kitchen(),
        courierNetwork: new CourierNetwork(),
        strategy: 0
      });

      assert.equal(processor.startedAt, null);

      processor.ingestOrders()

      assert.notEqual(processor.startedAt, null);
    });

    it('sets the state to RUNNING', function() {
      let processor = new OrderProcessor({
        orderData: mockOrderData,
        kitchen: new Kitchen(),
        courierNetwork: new CourierNetwork(),
        strategy: 0
      });

      assert.equal(processor.currentState, 'idle');

      processor.ingestOrders()

      assert.equal(processor.currentState, 'running');
    });
  });

  describe('#processOrder(orderData)', function() {
    it('adds an Order to Kitchen', function() {
      let processor = new OrderProcessor({
        orderData: mockOrderData,
        kitchen: new Kitchen(),
        courierNetwork: new CourierNetwork(),
        strategy: 0
      });

      let initialLength = Object.keys(processor.kitchen.orders).length;

      assert.equal(initialLength, 0);

      processor.processOrder(mockOrderData[0]);

      assert.notEqual(processor.kitchen.orders['1'], null);
      assert.equal(Object.keys(processor.kitchen.orders).length, 1);
    });

    it('fetches a Courier', function() {
      let processor = new OrderProcessor({
        orderData: mockOrderData,
        kitchen: new Kitchen(),
        courierNetwork: new CourierNetwork(),
        strategy: 0
      });

      assert.equal(processor.courierNetwork.inTransitCouriers.length, 0)

      processor.processOrder(mockOrderData[0]);

      assert.equal(processor.courierNetwork.inTransitCouriers.length, 1)
    });

    context('when strategy is set to MATCHING', function() {
      it('assigns a Courier to the associated Order', function() {
        let processor = new OrderProcessor({
          orderData: mockOrderData,
          kitchen: new Kitchen(),
          courierNetwork: new CourierNetwork(),
          strategy: 1
        });

        processor.processOrder(mockOrderData[0]);

        let courier = processor.courierNetwork.inTransitCouriers[0];

        assert.equal(courier.orderId, mockOrderData[0].id);
      });
    });

    context('when strategy is set to FIFO', function() {
      it('assigns a Courier to the associated Order', function () {
        let processor = new OrderProcessor({
          orderData: mockOrderData,
          kitchen: new Kitchen(),
          courierNetwork: new CourierNetwork(),
          strategy: 0
        });

        processor.processOrder(mockOrderData[0]);

        let courier = processor.courierNetwork.inTransitCouriers[0];

        assert.equal(courier.orderId, null);
      });
    });
  });
});
