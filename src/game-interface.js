const GameModule = require('./game-module');

const shipNames = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolboat'];
const shipNamesUI = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'];
const shipLengths = [5,4,3,3,2];

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
    let message = document.querySelector('.message');
    startButton.addEventListener('click', () => {
        startButton.remove();
        let shipCount = 0;
        message.textContent = `Choose the Coordinates for Your ${shipNamesUI[shipCount]}: `;

        let coordinateInput = document.createElement('div');
        coordinateInput.classList.add('coordinate-input-container');
        messageBox.appendChild(coordinateInput);

        let startPointField = document.createElement('input');
        let endPointField = document.createElement('input');
        let coordinateSubmit = document.createElement('button');

        startPointField.setAttribute('placeholder', 'Start Point');
        endPointField.setAttribute('placeholder', 'End Point');
        coordinateSubmit.textContent = 'Enter';

        //submits player information and removes the 
        const submitPlayerShip = function(shipName, shipLength){
            let message = document.querySelector('.message');
            let shipValidity = checkCoordinatesValidity([startPointField.value, endPointField.value], shipLength);
        
            if(!shipValidity){
                message.textContent = "Wrong Ship Size";
                return false;
            }
            try{
                match.humanPlayer.gameBoard.placeShip(shipName, [startPointField.value, endPointField.value]);
                refreshBoardState();
            } catch(err){
                message.textContent = err;
                return false;
            }
            
            return true;
        }

        function coordinateSubmitListener(){
            if(shipCount < 5){
                let submittedShip = submitPlayerShip(shipNames[shipCount],shipLengths[shipCount]);
                if(submittedShip){
                    shipCount++;
                    coordinateSubmit.removeEventListener('click', coordinateSubmitListener);
                    coordinateSubmit.addEventListener('click',coordinateSubmitListener);
                }
                if(shipCount < 5){
                    message.textContent = `Choose the Coordinates for Your ${shipNamesUI[shipCount]}: `
                }
            }
        }

        coordinateSubmit.addEventListener('click',coordinateSubmitListener);

        coordinateInput.appendChild(startPointField);
        coordinateInput.appendChild(endPointField);
        coordinateInput.appendChild(coordinateSubmit);
    })
}

function checkCoordinatesValidity(coordinates, lineLength){
    //Try to get valid board lines from startPoint
    let validLines = GameModule.getValidBoardLines(coordinates[0], lineLength);
    let valid;

    //compare our end points, to valid start points
    for(let i = 0; i < validLines.length; i ++){
        if(validLines[i][1] === coordinates[1]){
            valid = true;
            break;
        }
    }

    return valid;

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