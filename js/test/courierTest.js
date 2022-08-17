describe('Courier', function () {
  describe('#dispatch()', function () {
    it('sets Courier to be en route', function () {
      let courier = new Courier();
      courier.dispatch();

      assert.equal(courier.state, 0);
    });
  });

  describe('#arrived()', function() {
    it('sets the correct state', function() {
      let courier = new Courier();
      courier.arrived();

      assert.equal(courier.state, 1);
    });

    it('sets arrivedAt', function() {
      let courier = new Courier();
      courier.arrived();

      assert.notEqual(courier.arrivedAt, null);
    });
  });

  describe('#outForDelivery()', function() {
    it('sets the correct state', function() {
      let courier = new Courier();
      courier.outForDelivery();

      assert.equal(courier.state, 2);
    })

    it('sets pickedUpAt', function() {
      let courier = new Courier();
      courier.outForDelivery();

      assert.notEqual(courier.pickedUpAt, null);
    });
  });
});
