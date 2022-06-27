
function createShip(shipLength, shipCoordinates){
    
    let hitSpots = [];
    const hit = function(position){
        return hitSpots.push(position);
    }
    const isSunk = function(){
        return hitSpots.length === shipLength
        ? true
        : false;
    }
    const occupyCells = function(){
        let occupiedCells = this.shipCoordinates;
        const rowNotation = ['A','B','C','D','E','F','G'
            ,'H','I','J'];
        //Initial values for start and end points
        let startPoint = this.shipCoordinates[0];
        let endPoint = this.shipCoordinates[1];
        //check the orientation of the ship (horizontal or vertical)
        if(this.shipCoordinates[0].charAt(0)
        === this.shipCoordinates[1].charAt(0)){
            //See which of the coordinates is larger than the other
            if(+this.shipCoordinates[0].charAt(1)
                > +this.shipCoordinates[1].charAt(1)){
                    startPoint = this.shipCoordinates[1];
                    endPoint = this.shipCoordinates[0];
                }
            const columnStart = +startPoint.charAt(1);
            const columnEnd = +endPoint.charAt(1);
            for(let i = columnStart + 1; i < columnEnd; i++){
                occupiedCells.push(`${this.shipCoordinates[0].charAt(0)}${i}`);
            }
            return occupiedCells;
        } else if(this.shipCoordinates[0].charAt(1)
            === this.shipCoordinates[1].charAt(1)){
                //The ship is vertical
                //The logic here is similar to the above code block
                if(rowNotation.indexOf(this.shipCoordinates[0].charAt(0)) > rowNotation.indexOf(this.shipCoordinates[1].charAt(0))){
                    startPoint = this.shipCoordinates[1];
                    endPoint = this.shipCoordinates[0];
                }
                //The code below changes the alphabetic notation into a numerical one that we can iterate over
                const rowStart = rowNotation.indexOf(startPoint.charAt(0));
                const rowEnd = rowNotation.indexOf(endPoint.charAt(0));
                for(let i = rowStart + 1; i < rowEnd; i++){
                    occupiedCells.push(`${rowNotation[i]}${this.shipCoordinates[0].charAt(1)}`);
                }
                return occupiedCells;
            } else {
                throw new Error('Invalid Ship Coordinates');
            }
    }
    return {shipLength, shipCoordinates, hit, isSunk, occupyCells};
}

module.exports = {createShip}