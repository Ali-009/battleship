const GameboardFactory = require('../src/gameboard-factory');
/*The gameboard is an object that mostly contains functions dictating the rules of the game. It doesn't need much data to instantiate it beyond basic data such as player name*/

/*The player name computer should be reserved for single player against a very basic AI*/

//Testing gameboard object creatinon
test('Gameboard Object Instantiation Test 1', () => {
    const gameBoard = GameboardFactory.createGameboard('Charles');
    expect(gameBoard.playerName).toBe('Charles');
});

test('Placing a ship', () => {
    const gameBoard = GameboardFactory.createGameboard('James');
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);
    /*Testing for the direct public side effect of running placeShip*/
    expect(gameBoard.shipArray.length).toBe(3);
});

test('Prevent ship overlap', () => {
    const gameBoard = GameboardFactory.createGameboard('noob');
    gameBoard.placeShip('Carrier',['A1','A5']);
    expect(() => {
        gameBoard.placeShip('BattleShip',['A3','D3'])
    }).toThrow('Cannot place ships in overlapping positions');
})

test('Prevent ship overlap 2', () => {
    const gameBoard = GameboardFactory.createGameboard('noob');
    gameBoard.placeShip('Carrier',['C5','G5']);
    expect(() => {
        gameBoard.placeShip('BattleShip',['E3','E7'])
    }).toThrow('Cannot place ships in overlapping positions');
})

test('Receive successful attacks', () => {
    const gameBoard = GameboardFactory.createGameboard('John');
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);

    gameBoard.receiveAttack('A4');
    gameBoard.receiveAttack('A1');
    gameBoard.receiveAttack('A3');
    gameBoard.receiveAttack('A2');
    gameBoard.receiveAttack('A5');
    /*If all the attacks above are recorded correctly, we expect that the carrier has sunk*/
    expect(gameBoard.shipArray[2].isSunk()).toBe(true);
});

test('Receive successful attacks 2', () => {
    const gameBoard = GameboardFactory.createGameboard('John');
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);

    gameBoard.receiveAttack('C5');
    gameBoard.receiveAttack('E5');
    /*The attacks above are not enough to sink the submarine that occupies the above space*/
    expect(gameBoard.shipArray[1].isSunk()).toBe(false);
});

test('Missing an attack', () => {
    const gameBoard = GameboardFactory.createGameboard('John');
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);

    gameBoard.receiveAttack('J10');
    gameBoard.receiveAttack('J01');
    expect(gameBoard.missedAttacks).toEqual(['J10','J01']);
})

test('Game Is Over', () => {
    const gameBoard = GameboardFactory.createGameboard('Jack');
    //For the sake of simplicity, the board will only have three ships
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);

    //sinking patrol boat
    gameBoard.receiveAttack('B2');
    gameBoard.receiveAttack('B3');
    //sinking submarine
    gameBoard.receiveAttack('C5');
    gameBoard.receiveAttack('D5');
    gameBoard.receiveAttack('E5');
    //sinking the carrier
    gameBoard.receiveAttack('A4');
    gameBoard.receiveAttack('A1');
    gameBoard.receiveAttack('A3');
    gameBoard.receiveAttack('A2');
    gameBoard.receiveAttack('A5');

    expect(gameBoard.isGameOver()).toBe(true);
})

test('Game Is Not Over', () => {
    const gameBoard = GameboardFactory.createGameboard('Jack');
    //To avoid repetition, the board will only have three ships
    gameBoard.placeShip('Patrol Boat',['B2','B3']);
    gameBoard.placeShip('Submarine',['C5','E5']);
    gameBoard.placeShip('Carrier', ['A1','A5']);

    //sinking submarine
    gameBoard.receiveAttack('C5');
    gameBoard.receiveAttack('D5');
    gameBoard.receiveAttack('E5');

    expect(gameBoard.isGameOver()).toBe(false);
})
/*Testing the methods of gameBoard objects will require the use of mocks, as those objects are coupled to ship objects*/

//Before testing the public interface of gameBoard, I should start working on private methods that describe the actual board

//Testing private methods is redundant and unnecessary, but this is a case where it needs to be done because it can save us time
//Such tests should be removable if anyone wants to refactor the code

