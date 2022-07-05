/*Mocking the functionality of ShipFactory in our tests will only increase our work time for no reason.*/
/*ShipFactory is a local module and not something like an external API, so there is no reason to mock it during testing.*/
const ShipFactory = require("./ship-factory");

function createGameboard(playerName) {
  let shipArray = [];
  let missedAttacks = [];
  const placeShip = function (shipName, shipCoordinates) {
    const shipToBePlaced = ShipFactory.createShip(shipName, shipCoordinates);
    /*Check if the starting or ending coordinates are already occupied by a ship*/
    let occupied = shipArray.find((ship) => {
      for (let i = 0; i < shipToBePlaced.occupiedCells.length; i++) {
        /*Check whether a ship on the board overlaps with a shipToBePlaced*/
        if (ship.isOccupying(shipToBePlaced.occupiedCells[i])) {
          return true;
        }
      }
    });
    if (!occupied) {
      shipArray.push(shipToBePlaced);
    } else {
      throw new Error("Cannot place ships in overlapping positions");
    }
  };
  const receiveAttack = function (attackedCoordinates) {
    //lookup if a ship has been hit by the attack
    let attackedShip = shipArray.find((ship) =>
      ship.isOccupying(attackedCoordinates)
    );

    if (attackedShip) {
      attackedShip.hit(attackedCoordinates);
    } else {
      missedAttacks.push(attackedCoordinates);
    }
  };
  const isGameOver = function () {
    let sunkShips = shipArray.filter((ship) => ship.isSunk());
    if (sunkShips.length === shipArray.length) {
      return true;
    } else {
      return false;
    }
  };
  return {
    playerName,
    shipArray,
    missedAttacks,
    placeShip,
    receiveAttack,
    isGameOver,
  };
}

module.exports = { createGameboard };
