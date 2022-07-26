//Below are redundant tests for game-module.js
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
    //To satisfy the requirement of using receiveAttack() as a function for both players
    //I decided to make the match object manage the attacks of both players
    //The attacks come from the UI, and are then handled by the match object
    //The match object belongs to neither players and simply executes the rules of the game
    //While having access to the information of both players
    console.log(match.humanPlayer.gameBoard.shipsOnBoard);
    for(let i = 0; i < 50; i++){
        match.attackFromAI();
    }
    //The succesful attacks are expected to be on adjacent cells
    //This shows that the cpu is making somewhat educated guesses on ship positions
    console.log(match.humanPlayer.gameBoard.successfulAttacks);
    //expect an attack from AI to have either been a successful attack on the humanPlayer gameBoard
    //or a missedAttack on the humanPlayer gameBoard 
    expect(match.humanPlayer.gameBoard.successfulAttacks.length > 0 || match.humanPlayer.gameBoard.missedAttacks.length > 0)
    .toBeTruthy();
})
