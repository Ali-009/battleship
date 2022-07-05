/*Mocking the functionality of ShipFactory in our tests will only increase our work time for no reason.*/
/*ShipFactory is a local module and not something like an external API, so there is no reason to mock it duirng testing.*/
const ShipFactory = require('./ship-factory');

function createGameboard(playerName){
    let shipArray = [];
    const placeShip = function(shipName, shipCoordinates){
        const ship = ShipFactory.createShip(shipName, shipCoordinates);
        shipArray.push(ship);
    }
    return{playerName, shipArray, placeShip};
}

module.exports = {createGameboard};