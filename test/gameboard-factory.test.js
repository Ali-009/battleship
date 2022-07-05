const GameboardFactory = require('../src/gameboard-factory');
/*The gameboard is an object that mostly contains functions dictating the rules of the game. It doesn't need much data to instantiate it beyond basic data such as player name*/

/*The player name computer should be reserved for single player against a very basic AI*/

//Testing gameboard object creatinon
test('Gameboard Object Instantiation Test 1', () => {
    const gameBoard = GameboardFactory.createGameboard('Charles');
    expect(gameBoard.playerName).toBe('Charles');
});

test('Test for placing a ship', () => {
    const gameBoard = GameboardFactory.createGameboard('James');
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);
    /*Testing for the direct public side effect of running placeShip*/
    expect(gameBoard.shipArray.length).toBe(3);
});

/*Testing the methods of gameBoard objects will require the use of mocks, as those objects are coupled to ship objects*/

//Before testing the public interface of gameBoard, I should start working on private methods that describe the actual board

//Testing private methods is redundant and unnecessary, but this is a case where it needs to be done because it can save us time
//Such tests should be removable if anyone wants to refactor the code

