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

        //submits player information 
        const submitPlayerShip = function(shipName, shipLength){
            let message = document.querySelector('.message');
            let shipValidity = checkCoordinatesValidity([startPointField.value, endPointField.value], shipLength);

            let reminderText = `Please provide valid coordinates for a ${shipNamesUI[shipCount]}`;
        
            if(!shipValidity){
                message.textContent = 'Invalid ship coordinates. ' + reminderText;
                return false;
            }
            try{
                match.humanPlayer.gameBoard.placeShip(shipName, [startPointField.value, endPointField.value]);
                displayPlayerShips(match.humanPlayer, '.primary-grid');
            } catch(err){
                message.textContent = err.message + ' ' + reminderText;
                return false;
            }
            
            return true;
        }

        function coordinateSubmitListener(){
            if(shipCount < 5){
                let submittedShip = submitPlayerShip(shipNames[shipCount],shipLengths[shipCount]);
                if(submittedShip){
                    shipCount++;
                    if(shipCount < 5){
                        message.textContent = `Choose the Coordinates for Your ${shipNamesUI[shipCount]}: `
                    }
                    coordinateSubmit.removeEventListener('click', coordinateSubmitListener);
                    coordinateSubmit.addEventListener('click',coordinateSubmitListener);
                }
            }
            
            if(shipCount === 5){
                //Remove Coordinate Input
                coordinateInput.remove();
                message.textContent = 'You can now attack the AI\'s ships on the trakcing gird. Note that a player geting a hit gives them an additional turn.';
                //Setup the AI ships
                match.cpu.placeRandomShips();
                //Set up the tracking grid events
                let trackingGridCells = trackingGrid.querySelectorAll('.grid-cell');

                trackingGridCells.forEach((cell) => {
                    cell.addEventListener('click', function playerAttackHandler(e){
                        let attackedCell = e.target.getAttribute('data-cell'); 

                        //Play a round then remove the event listener on this cell
                        //This is done to avoid registering the same attack twice
                        match.playRound(attackedCell);
                        if(match.humanPlayer.gameBoard.isGameOver()){
                            message.textContent = 'Game Over. You Lost.';
                            displayPlayerShips(match.cpu, '.tracking-grid');
                        } else if (match.cpu.gameBoard.isGameOver()){
                            message.textContent = 'Congrats! You Won.';
                            displayPlayerShips(match.cpu, '.tracking-grid');
                        }
                        displayBoardState();
                        cell.removeEventListener('click', playerAttackHandler);
                    })
                })

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

function displayPlayerShips(playerObject, targetGrid){
    let playerShips = playerObject.gameBoard.shipsOnBoard;
    for(let i = 0; i < playerShips.length; i++){
        for(let j = 0; j < playerShips[i].occupiedCells.length; j++){
            let currentCell = document.querySelector(
                `${targetGrid} [data-cell="${playerShips[i].occupiedCells[j]}"]`
            );
            currentCell.classList.add(playerShips[i].name);            
        }
    }
}

function displayBoardState(){
    //Human player results being displayed
    let playerSuccessfulAttacks = match.cpu.gameBoard.successfulAttacks;
    let playerMissedAttacks = match.cpu.gameBoard.missedAttacks;
    updateCells('.tracking-grid', playerSuccessfulAttacks, 'attacked');
    updateCells('.tracking-grid', playerMissedAttacks, 'missed');

    //AI results being displayed
    let cpuSuccessfulAttacks = match.humanPlayer.gameBoard.successfulAttacks;
    let cpuMiseedAttacks = match.humanPlayer.gameBoard.missedAttacks;
    updateCells('.primary-grid', cpuSuccessfulAttacks, 'attacked');
    updateCells('.primary-grid', cpuMiseedAttacks, 'missed');


}
//Displays whether a cell received a successful attack or a miss
//And which targetGrid should we display the result on
function updateCells(targetGrid, cells, state){
    for(let i =0; i < cells.length; i++){
        let currentCell = document.querySelector(
            `${targetGrid} [data-cell="${cells[i]}"]`
        );
        currentCell.classList.add(state);
    }
}

//Starting the match
//The match object also encapsulates the humanPlayer and the AI player
//As such we can use player objects in this module without the need to create them
let match = GameModule.createMatch();
displayGameBoard();