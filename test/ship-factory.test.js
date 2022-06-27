const ShipFactory = require('../src/ship-factory');

/*The tests below check whether we can create a ship instance*/
/*We do this by instantiating a ship, and inspecting a value in the created ship object*/
/*The approach is less than ideal, but it lets us test createShip without tying us to a specific ship object sctructure*/
test('Test Ship Object Instantiation', () => {
    const carrier 
    = ShipFactory.createShip(5, ['B2','B6']);
    expect(carrier.shipLength).toBe(5);
});

test('Test Ship Object Instantiation 2', () => {
    const patrolBoat = ShipFactory.createShip(2, ['A1','A2']);
    expect(patrolBoat.shipCoordinates).toEqual(['A1','A2']);
});

/*Testing for the hit function is redundant and over specific, as the function doesn't produce a direct public side-effect*/
//Keep in mind that hitSpots shouldn't be a publicly accessible property

//A submarine sinks after three hits
test('isSunk Function Test', () => {
    const submarine = ShipFactory.createShip(3, ['F3','H3']);
    submarine.hit('F3');
    submarine.hit('G3');
    submarine.hit('H3');
    expect(submarine.isSunk()).toBe(true);
});
/*A carrier doesn't sinnk after three hits, as its length is equal to five*/
test('isSunk Function Test 2', () => {
    const carrier = ShipFactory.createShip(5, ['F3', 'J3']);
    carrier.hit('F3');
    carrier.hit('G3');
    carrier.hit('H3');
    expect(carrier.isSunk()).toBe(false);
});

//Below are some redundant tests to ensure that the complex occupyCells method works
test('Getting occupied cells given only shipCoordinates',
() => {
    const destroyer = ShipFactory.createShip(3, ['A1', 'A3']);
    expect(destroyer.occupiedCells).toEqual(['A1','A3','A2']);
});

test('occupyCells test 2', () =>{
    const carrier = ShipFactory.createShip(5, ['D4','D8']);
    expect(carrier.occupiedCells).toEqual(['D4','D8','D5','D6','D7']);
});

test('occupyCells vertical test 1', () => {
    const carrier = ShipFactory.createShip(5, ['B6','F6']);
    expect(carrier.occupiedCells).toEqual(['B6','F6','C6','D6','E6']);
});

test('occupyCells vertical test2', () => {
    const patrolBoat = ShipFactory.createShip(2, ['D1','E1']);
    expect(patrolBoat.occupiedCells).toEqual(['D1','E1']);
});

test('Invalid Ship Coordinates Test', () => {
    expect(() => ShipFactory.createShip(5, ['D4','J2']))
    .toThrow(new Error ('Invalid Ship Coordinates'));
})