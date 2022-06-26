
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
    return {shipLength, shipCoordinates, hitSpots, hit, isSunk};
}

module.exports = {createShip}