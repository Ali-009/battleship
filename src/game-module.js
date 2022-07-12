const gameBoardFactory = require('./gameboard-factory');

function createMatch(humanPlayerName){
    //The players are created within the context of a match
    //This allows player objects to interact with other player objects
    function createPlayer(name){
        //Associating the Player with a gameBoard
        let gameBoard = gameBoardFactory.createGameboard(name);
        return{name, gameBoard};
    }

    let humanPlayer = createPlayer(humanPlayerName);
    let cpu = createPlayer('Computer');

    function humanPlayerTurn(inputCoordinates){
        cpu.gameBoard.receiveAttack(inputCoordinates);
        
    }

    return {humanPlayer, cpu, createPlayer, humanPlayerTurn};

}

module.exports = {createMatch};