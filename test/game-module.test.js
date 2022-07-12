const GameModule = require('../src/game-module');

test('Match Creation', () => {
    let match = GameModule.createMatch('John');
    //Test if both players have been created
    expect(match.humanPlayer.gameBoard.playerName).toBe('John');
    expect(match.cpu.gameBoard.playerName).toBe('Computer');
});

test('Player Attacking Opponent', () => {

})