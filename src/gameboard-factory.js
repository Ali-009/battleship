/*Mocking the functionality of ShipFactory in our tests will only increase our work time for no reason.*/
/*ShipFactory is a local module and not something like an external API, so there is no reason to mock it duirng testing.*/
const ShipFactory = require('./ship-factory');

function createGameboard(playerName){
    let shipArray = [];
    let missedAttacks = [];
    const placeShip = function(shipName, shipCoordinates){
        const ship = ShipFactory.createShip(shipName, shipCoordinates);
        shipArray.push(ship);
    }
    const receiveAttack = function(attackedCoordinates){
        //lookup if a ship has been hit by the attack
        let attackedShip = shipArray.find(
            (ship) => ship.isOccupying(attackedCoordinates)
        );

        if(attackedShip){
            attackedShip.hit(attackedCoordinates);
        } else {
            missedAttacks.push(attackedCoordinates);
        }
    }
    return{playerName, shipArray, placeShip, receiveAttack, missedAttacks};
}

module.exports = {createGameboard};