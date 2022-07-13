const GameModule = require('../src/game-module');

test('Match Creation', () => {
    let match = GameModule.createMatch('John');
    //Test if both players have been created
    expect(match.humanPlayer.name).toBe('John');
    expect(match.cpu.name).toBe('Computer');
});

test('Get Ship Coordinates on Empty Board', () => {
    //Expecting a list of ships that start from the center of the grid
    expect(GameModule.getPossibleShipCoordinates('E5', 5))
    .toEqual([['E5','E9'],['E5','E1'],['E5','I5'],['E5','A5']]);

    //Testing for when a ship has only two valid placements on an empty board
    expect(GameModule.getPossibleShipCoordinates('A1', 3))
    .toEqual([['A1','A3'],['A1', 'C1']]);

    //Only three valid placements on an empty board
    expect(GameModule.getPossibleShipCoordinates('B8', 3))
    .toEqual([['B8','B10'],['B8','B6'],['B8','D8']]);
})

test('Place Random Ships', () => {
    let match = GameModule.createMatch('Jane');
    expect(match.cpu.placeRandomShips()).toBe(5);
})