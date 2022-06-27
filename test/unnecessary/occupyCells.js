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
    const weirdShip = ShipFactory.createShip(5, ['D4','J2']);
    expect(() => weirdShip.occupiedCells).toThrow(new Error ('Invalid Ship Coordinates'));
})