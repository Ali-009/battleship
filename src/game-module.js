const gameBoardFactory = require('./gameboard-factory');

const columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function createMatch(humanPlayerName){
    //The players are created within the context of a match
    //This allows player objects to interact with other player objects
    function createPlayer(name){
        //Associating the Player with a gameBoard
        let gameBoard = gameBoardFactory.createGameboard();

        function placeRandomShips(){
            const shipLengths = [2, 3, 3, 4, 5];
            const shipNames = ['Patrol Boat', 'Submarine', 'Destroyer', 'Battleship', 'Carrier'];
            let shipCounter = 0;
            while(gameBoard.shipsOnBoard.length < 5){
                //Find a random coordinate on the x-axis
                let xIndex = getRandomIntegerUpTo(10);
                let xStart = columnNotation[xIndex];
                //Find a random coordinate on the y-axis
                let yStart = getRandomIntegerUpTo(10) + 1;
                let startPoint = `${xStart + yStart.toString()}`;
                let validShips 
                = getPossibleShipCoordinates(startPoint, shipLengths[shipCounter]);
                for(let j = 0; j < validShips.length; j++){
                    try{
                        //try to place at least one ship
                        //If ship placement fails an error will be thrown
                        //If it succeeds, we break from the loop
                        gameBoard.placeShip(shipNames[shipCounter], validShips[getRandomIntegerUpTo(validShips.length)]);
                        shipCounter++;
                        break;
                    } catch (err){
                        continue;
                    }
                }
            }
            console.log(gameBoard.shipsOnBoard);
            return gameBoard.shipsOnBoard.length;
        }

        return{name, gameBoard, placeRandomShips};
    }

    let humanPlayer = createPlayer(humanPlayerName);
    let cpu = createPlayer('Computer');
    /* Work in progress
    function humanPlayerTurn(inputCoordinates){
        cpu.gameBoard.receiveAttack(inputCoordinates);
    }*/

    return {humanPlayer, cpu, createPlayer};

}

function getRandomIntegerUpTo(max){
    return Math.floor(Math.random() * max);
}

function getPossibleShipCoordinates(startPoint, shipLength){
    //The goal of the function is to find valid sets of coordinates on a board assumed to be empty.
    //Starting points coordinates
    let xStart = startPoint.charAt(0);
    let yStart = +startPoint.slice(1);
    let validShips = [];
    let validShipCount = 0;
    let yEnd1 = yStart + (shipLength - 1);
    //Creating ships in all directions if possible
    //Downwards from the startPoint
    if(yEnd1 > yStart && yEnd1 <= 10){
        validShips[validShipCount] 
        = [startPoint, `${xStart + yEnd1.toString()}`];
        validShipCount++; 
    }
    //Upwards From the startPoint
    let yEnd2 = yStart - (shipLength - 1);
    if(yStart > yEnd2 && yEnd2 >= 1){
        validShips[validShipCount]
        = [startPoint, `${xStart + yEnd2.toString()}`];
        validShipCount++;
    }
    //Horizontally to the left of startPoint
    let xEnd1 = columnNotation.indexOf(xStart) + (shipLength - 1);
    if(xEnd1 > columnNotation.indexOf(xStart) && xEnd1 < columnNotation.length){
        validShips[validShipCount]
        = [startPoint, `${columnNotation[xEnd1] + yStart}`];
        validShipCount++;
    }
    //Horizontally to the right of startPoint
    let xEnd2 = columnNotation.indexOf(xStart) - (shipLength - 1);
    if(columnNotation.indexOf(xStart) > xEnd2 && xEnd2 >= 0){
        validShips[validShipCount]
        = [startPoint, `${columnNotation[xEnd2] +yStart}`];
        validShipCount++;
    }
    return validShips;
}

module.exports = {createMatch, getPossibleShipCoordinates};