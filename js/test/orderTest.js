describe('Order', function() {
  describe('#states', function() {
    it('returns the states of an Order', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 4,
        kitchen: null      });

      let expectedStates = {
        0: 'being prepared',
        1: 'ready for pickup',
        2: 'out for delivery',
      }

      for (let i = 0; i < 3; i++) {
        assert.equal(order.states[i], expectedStates[i]);
      }
    });
  })

  describe('#currentState', function() {
    it('returns the current state, in text, of an Order', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 4,
        kitchen: null
      });

      let expectedStates = {
        0: 'being prepared',
        1: 'ready for pickup',
        2: 'out for delivery',
      }

      for (let i = 0; i < 3; i++) {
        order.state = i;
        assert.equal(order.currentState, expectedStates[i])
      }
    });
  });

  describe('#outForDelivery()', function() {
    it('sets #state to "out for delivery" state', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 4,
        kitchen: null
      });

      assert.equal(order.state, 0);

      order.outForDelivery();

      assert.equal(order.state, 2);
    });

    it('sets #pickedUpAt', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 4,
        kitchen: null
      });

      assert.equal(order.pickedUpAt, null)

      order.outForDelivery();

      assert.notEqual(order.pickedUpAt, null);
    });
  });

  describe('#prepped()', function() {
    it('sets #state to equal 1', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 4,
        kitchen: null
      });

      assert.equal(order.state, 0);

      order.prepped();

      assert.equal(order.state, 1);
    });

    it('sets #readyAt', function() {
      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 1,
        kitchen: null
      });

      assert.equal(order.readyAt, null)

      order.prepped();

      assert.notEqual(order.readyAt, null);
    });
  });
});
