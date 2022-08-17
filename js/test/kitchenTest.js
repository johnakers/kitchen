describe('Kitchen', function () {
  describe('#addOrder(Order)', function() {
    it('adds an order to #orders', function() {
      let kitchen = new Kitchen();

      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 1,
        kitchen: null,
      });

      assert.equal(kitchen.orders[order.id], null);

      kitchen.addOrder(order);

      assert.equal(kitchen.orders[order.id], order);
    });

    it('sets "belongs_to" with Kitchen', function() {
      let kitchen = new Kitchen();

      let order = new Order({
        id: 'someId',
        name: 'orderName',
        prepTime: 1,
        kitchen: null,
      });

      assert.equal(order.kitchen, null);

      kitchen.addOrder(order);

      assert.equal(order.kitchen, kitchen);
    });
  });
});
