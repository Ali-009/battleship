//Below are some redundant tests to ensure that the complex occupyCells method works

/*In order to make those tests work, ensure to return occupiedCells from the ship objects, as the property is private in the current implementation*/
//Because occupiedCells is private property, it should need not be tested
//Having those tests in our final test suite proves nothing
test("Getting occupied cells given only shipCoordinates", () => {
  const destroyer = ShipFactory.createShip("Submarine", ["A1", "A3"]);
  expect(destroyer.occupiedCells).toEqual(["A1", "A3", "A2"]);
});

test("occupyCells test 2", () => {
  const carrier = ShipFactory.createShip("Carrier", ["D4", "D8"]);
  expect(carrier.occupiedCells).toEqual(["D4", "D8", "D5", "D6", "D7"]);
});

test("occupyCells vertical test 1", () => {
  const carrier = ShipFactory.createShip("Carrier", ["B6", "F6"]);
  expect(carrier.occupiedCells).toEqual(["B6", "F6", "C6", "D6", "E6"]);
});

test("occupyCells vertical test2", () => {
  const patrolBoat = ShipFactory.createShip("Patrol Boat", ["D1", "E1"]);
  expect(patrolBoat.occupiedCells).toEqual(["D1", "E1"]);
});

test("Invalid Ship Coordinates Test", () => {
  expect(() => ShipFactory.createShip("Carrier", ["D4", "J2"])).toThrow(
    new Error("Invalid Ship Coordinates")
  );
});