const GameModule = require('./game-module');

//Generate an entire board and display it on the page
function displayGameBoard(){
    let primaryGrid = document.querySelector('.primary-grid');
    let trackingGrid = document.querySelector('.tracking-grid');
    //create one hundred grid cells for the primary grid
    //And the tracking grid
    generateGrid(primaryGrid);
    generateGrid(trackingGrid);

    //Working on the start button
    let startButton = document.querySelector('.start-button');
    let messageBox = document.querySelector('.message-box');
    startButton.addEventListener('click', () => {
        startButton.remove();

        messageBox.textContent = 'Choose the Coordinates for Your Carrier: ';

        let coordinateInput = document.createElement('div');
        coordinateInput.classList.add('coordinate-input-container');
        messageBox.appendChild(coordinateInput);

        let startPointField = document.createElement('input');
        let endPointField = document.createElement('input');
        let coordinateSubmit = document.createElement('button');

        startPointField.setAttribute('placeholder', 'Start Point');
        endPointField.setAttribute('placeholder', 'End Point');
        coordinateSubmit.textContent = 'Enter';

        coordinateSubmit.addEventListener('click', () => {
            
        })


        coordinateInput.appendChild(startPointField);
        coordinateInput.appendChild(endPointField);
        coordinateInput.appendChild(coordinateSubmit);
    })
}

function checkCoordinatesValidity([startPoint, endPoint], lineLength){
    //Try to get valid board lines from startPoint
    let validLines = GameModule.getValidBoardLines(startPoint, lineLength);
    //Check if the user's input lines are valid
    if(!validLines.includes([startPoint,endPoint])){
        return false;
    } else {
        return true;
    }

}

function submitPlayerShip(shipName, startPoint, endPoint, shipLength){
    let messageBox = document.querySelector('.message-box');
    let shipValidity = checkCoordinatesValidity([startPoint, endPoint], shipLength);

    if(!shipValidity){
        document.querySelector('.message-box').textContent = "Wrong Ship Size";
        return;
    }
    try{
        match.humanPlayer.gameBoard.placeShip(shipName, [startPoint, endPoint]);
        refreshBoardState();
    } catch(err){
        messageBox.textContent = err;
    }
}


const columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function generateGrid(grid){
    for(let i = 0; i< 100; i++){
        let gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        gridCell.setAttribute('data-cell', `${columnNotation[i%10] + (Math.floor(i/10)+1)}`);
        grid.appendChild(gridCell);
    }
}

function refreshBoardState(){
    //display player ships on board
    let playerShips = match.humanPlayer.gameBoard.shipsOnBoard;
    for(let i = 0; i < playerShips.length; i++){
        displayShip(playerShips[i]);
    }
}

function displayShip(ship){
    if(ship.occupiedCells.length > 0){
        for(let i = 0; i < ship.occupiedCells.length; i++){
            let currentCell = document.querySelector(
                `[data-cell="${ship.occupiedCells[i]}"]`
            );
            currentCell.classList.add(ship.name);
        }
    }
}

function findShip(shipName){
    //fetching occupied cells
    let requestedShip = match.humanPlayer.gameBoard.shipsOnBoard
        .find((ship) => ship.name === shipName);
    return requestedShip;
}

//Starting the match
//The match object also encapsulates the humanPlayer and the AI player
//As such we can use player objects in this module without the need to create them
let match = GameModule.createMatch();
displayGameBoard();