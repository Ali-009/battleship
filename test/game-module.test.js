const GameModule = require('../src/game-module');

test('Get Ship Coordinates on Empty Board', () => {
    //Expecting a list of ships that start from the center of the grid
    expect(GameModule.getValidBoardLines('E5', 5))
    .toEqual([['E5','E9'],['E5','E1'],['E5','I5'],['E5','A5']]);

    //Testing for when a ship has only two valid placements on an empty board
    expect(GameModule.getValidBoardLines('A1', 3))
    .toEqual([['A1','A3'],['A1', 'C1']]);

    //Only three valid placements on an empty board
    expect(GameModule.getValidBoardLines('B8', 3))
    .toEqual([['B8','B10'],['B8','B6'],['B8','D8']]);
})

test('CPU Places Random Ships', () => {
    let match = GameModule.createMatch();
    match.cpu.placeRandomShips();
    expect(match.humanPlayer.gameBoard.shipsOnBoard.length)
    .toBe(0);
    //The randomly placed ships belong only to the player that placed them
    //In this case, the player is the cpu
    //console.log(match.cpu.gameBoard.shipsOnBoard);
    expect(match.cpu.gameBoard.shipsOnBoard.length).toBe(5);
})

test('AI Attack', () => {
    let match = GameModule.createMatch();
    match.cpu.placeRandomShips();
    match.humanPlayer.placeRandomShips();
    console.log(match.humanPlayer.gameBoard.shipsOnBoard);
    //test five attacks
    for(let i = 0; i < 50; i++){
        match.quickAttackFromAI();
    }
    console.log(match.humanPlayer.gameBoard.successfulAttacks);
})
