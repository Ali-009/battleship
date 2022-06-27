const ShipFactory = require('../src/ship-factory');

/*The tests below check whether we can create a ship instance*/
/*We do this by instantiating a ship, and inspecting a value in the created ship object*/
/*The approach is less than ideal, but it lets us test createShip without tying us to a specific ship object sctructure*/
test('Test Ship Object Instantiation', () => {
    const carrier 
    = ShipFactory.createShip('Carrier', ['B2','B6']);
    expect(carrier.shipLength).toBe(5);
});

test('Test Ship Object Instantiation 2', () => {
    const patrolBoat = ShipFactory.createShip('Patrol Boat', ['A1','A2']);
    expect(patrolBoat.shipCoordinates).toEqual(['A1','A2']);
});

//We don't test the hit function
/*Testing for the hit function is redundant and over specific, as the function doesn't produce a direct public side-effect*/
//We also shouldn't test hitspots as it is a private property

//A submarine sinks after three hits
test('isSunk Function Test', () => {
    const submarine = ShipFactory.createShip('Submarine', ['F3','H3']);
    submarine.hit('F3');
    submarine.hit('G3');
    submarine.hit('H3');
    expect(submarine.isSunk()).toBe(true);
});

/*A carrier doesn't sinnk after three hits, as its length is equal to five*/
test('isSunk Function Test 2', () => {
    const carrier = ShipFactory.createShip('Carrier', ['F3', 'J3']);
    carrier.hit('F3');
    carrier.hit('G3');
    carrier.hit('H3');
    expect(carrier.isSunk()).toBe(false);
});

