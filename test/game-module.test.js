const GameModule = require('../src/game-module');

test('Match Creation', () => {
    let match = GameModule.createMatch('John');
    //Test if both players have been created
    expect(match.humanPlayer.name).toBe('John');
    expect(match.cpu.name).toBe('Computer');
});

test('Player Attacking Opponent', () => {

})