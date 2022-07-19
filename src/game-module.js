const gameBoardFactory = require('./gameboard-factory');

const columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function createMatch(){
    //The players are created within the context of a match
    //This allows player objects to interact with other player objects
    function createPlayer(){
        //Associating the Player with a gameBoard
        let gameBoard = gameBoardFactory.createGameboard();

        //Any player has the ability to place ships randomly on their board
        function placeRandomShips(){
            const shipLengths = [2, 3, 3, 4, 5];
            const shipNames = ['Patrol Boat', 'Submarine', 'Destroyer', 'Battleship', 'Carrier'];
            let shipCounter = 0;
            let boardCells = generateBoardCells();
            while(gameBoard.shipsOnBoard.length < 5){
                let currentRandomPoint = getRandomCoordinates(boardCells);
                let validShips 
                = getValidBoardLines(currentRandomPoint, shipLengths[shipCounter]);
                while(validShips.length != 0){
                    let currentShipIndex = getRandomIntegerUpTo(validShips.length);
                    try{
                        //try to place at least one ship
                        //If ship placement fails an error will be thrown
                        //If it succeeds, we break from the loop
                        gameBoard.placeShip(shipNames[shipCounter], validShips[currentShipIndex]);
                        shipCounter++;
                        break;
                    } catch (err){
                        validShips.splice(currentShipIndex, 1);
                        continue;
                    }
                }
                //Remove the currentRandomPoint from the pool of boardCells
                //This makes sure we don't attempt to use invalid board positions more than once
                boardCells.splice(currentRandomPoint, 1);
            }
        }
        return{gameBoard, placeRandomShips};
    }

    let humanPlayer = createPlayer();
    let cpu = createPlayer();

    function attackFromAI(){
        let randomCoordinates = getRandomCoordinates();

    }

    return {humanPlayer, cpu, createPlayer, attackFromAI};

}

//This can be used to avoid randomly guessing the same board cell twice
function generateBoardCells(){
    let boardCells = [];

    for(let i = 0; i < columnNotation.length; i++){
        for(let j = i*10; j < (i+1)*10; j++){
            boardCells[j] = `${columnNotation[i] + (j-i*10+1)}`;
        }
    }

    return boardCells;
}

function getRandomIntegerUpTo(max){
    return Math.floor(Math.random() * max);
}

function getRandomCoordinates(boardCellsPool){
    return boardCellsPool[getRandomIntegerUpTo(boardCellsPool.length)];
}
//The goal of the function is to find valid lines in all directions
//Given a starting point and a distance between starting and ending points
function getValidBoardLines(startPoint, distance){
    //The goal of the function is to find valid sets of coordinates on a board assumed to be empty.
    //Starting points coordinates
    let xStart = startPoint.charAt(0);
    let yStart = +startPoint.slice(1);
    let validLines = [];
    let yEnd1 = yStart + (distance - 1);
    //Creating ships in all directions if possible
    //Downwards from the startPoint
    if(yEnd1 > yStart && yEnd1 <= 10){
        validLines.push([startPoint, `${xStart + yEnd1}`]);
    }
    //Upwards From the startPoint
    let yEnd2 = yStart - (distance - 1);
    if(yStart > yEnd2 && yEnd2 >= 1){
        validLines.push([startPoint, `${xStart + yEnd2}`]);
    }
    //Horizontally to the left of startPoint
    let xEnd1 = columnNotation.indexOf(xStart) + (distance - 1);
    if(xEnd1 > columnNotation.indexOf(xStart) && xEnd1 < columnNotation.length){
        validLines.push([startPoint, `${columnNotation[xEnd1] + yStart}`]);
    }
    //Horizontally to the right of startPoint
    let xEnd2 = columnNotation.indexOf(xStart) - (distance - 1);
    if(columnNotation.indexOf(xStart) > xEnd2 && xEnd2 >= 0){
        validLines.push([startPoint, `${columnNotation[xEnd2] +yStart}`]);
    }
    return validLines;
}

module.exports = {createMatch, getValidBoardLines, generateBoardCells};