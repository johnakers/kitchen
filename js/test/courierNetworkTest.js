describe('Courier', function () {
  describe('#createCourier()', function () {
    context('when there are no idle Couriers', function() {
      it('creates a new Courier', function () {
        let network = new CourierNetwork();

        assert.equal(network.idleCouriers.length, 0);
        assert.equal(network.inTransitCouriers.length, 0);

        let courier = network.createCourier();

        assert.equal(network.idleCouriers.length, 0);
        assert.equal(network.inTransitCouriers.length, 1);
        assert.equal(courier.constructor.name, 'Courier');
      });
    });

    context('when there is an idle Courier', function() {
      it('transitions an idle Courier to inTransit', function() {
        let network = new CourierNetwork();
        network.idleCouriers.push(new Courier());

        assert.equal(network.idleCouriers.length, 1);
        assert.equal(network.inTransitCouriers.length, 0);

        network.createCourier();

        assert.equal(network.idleCouriers.length, 0);
        assert.equal(network.inTransitCouriers.length, 1);
      });
    });
  });
});
