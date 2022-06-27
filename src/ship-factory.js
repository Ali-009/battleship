
function createShip(shipName, shipCoordinates){
    
    let hitSpots = [];
    //A function to create an array of occupiedCells
    const occupyCells = function (shipCoordinates){
        let occupiedCells = shipCoordinates;
        const columnNotation = ['A','B','C','D','E','F','G'
            ,'H','I','J'];
        let startPoint;
        let endPoint;
        //The coordinates on the x-axis
        let x1 = shipCoordinates[0].charAt(0);
        let x2 = shipCoordinates[1].charAt(0);

        //The coordinates on the y-axis
        let y1 = +shipCoordinates[0].charAt(1);
        let y2 = +shipCoordinates[1].charAt(1);

        //If the ship has a vertical orientation
        if(x1 === x2){
            if(y2 > y1){
                startPoint = y1;
                endPoint = y2;
            } else {
                startPoint = y2;
                endPoint = y1;
            }
            for(let i = startPoint + 1; i < endPoint; i++){
                occupiedCells.push(`${x1 + i.toString()}`);
            }
            return occupiedCells;
        } else if(y1 === y2){
            //The ship has a horizontal orientation
            //The logic here is similar to the above code block
            //The code below changes the alphabetic notation into a numerical one that we can iterate over
            if(columnNotation.indexOf(x2) > columnNotation.indexOf(x1)){
                startPoint = columnNotation.indexOf(x1)
                endPoint = columnNotation.indexOf(x2);
            } else {
                startPoint = columnNotation.indexOf(x2);
                endPoint = columnNotation.indexOf(x1);
            }
            for(let i = startPoint + 1; i < endPoint; i++){
                occupiedCells.push(`${columnNotation[i] + y1}`);
            }
                return occupiedCells;
            } else {
                throw new Error('Invalid Ship Coordinates');
            }
    }

    const occupiedCells = occupyCells(shipCoordinates);
    const shipLength = occupiedCells.length;
    const hit = function(position){
        return hitSpots.push(position);
    }
    const isSunk = function(){
        return hitSpots.length === shipLength
        ? true
        : false;
    }

    return {shipName, shipCoordinates, shipLength, hit, isSunk};
}

module.exports = {createShip}