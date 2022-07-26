const GameModule = require('../src/game-module');

//The below test should be enough for the entire module
test('Play Round', () => {
    let match = GameModule.createMatch();
    match.cpu.placeRandomShips();
    //For simplicity, the humanPlayer ships are also placed randomly
    match.humanPlayer.placeRandomShips();

    match.playRound('F5');
    let playerSuccesfulAttacks = match.cpu.gameBoard.successfulAttacks;
    let playerMissedAttacks = match.cpu.gameBoard.missedAttacks;
    //After playing a turn, the player has either made a successful attack or missed
    expect(playerSuccesfulAttacks.length > 0 || playerMissedAttacks.length > 0);

    //If the player missed an attack, expect the AI to have taken its turn
    //right afterwards
    let cpuSuccessfulAttacks = match.humanPlayer.gameBoard.successfulAttacks;
    let cpuMissedAttacks = match.humanPlayer.gameBoard.missedAttacks;
    if(playerMissedAttacks.length > 0){
        expect(cpuSuccessfulAttacks.length > 0 || cpuMissedAttacks.length > 0);
    }
})