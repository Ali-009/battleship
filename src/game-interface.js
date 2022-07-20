//Generate an entire board and display it on the page
function displayGameBoard(){
    primaryGrid = document.querySelector('.primary-grid');
    trackingGrid = document.querySelector('.tracking-grid');
    //create one hundred grid cells for the primary grid
    //And the tracking grid
    generateGrid(primaryGrid);
    generateGrid(trackingGrid);
}

function generateGrid(grid){
    for(let i = 0; i< 100; i++){
        let gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        grid.appendChild(gridCell);
    }
}

displayGameBoard();