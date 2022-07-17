/*Mocking the functionality of ShipFactory in our tests will only increase our work time for no reason.*/
/*ShipFactory is a local module and not something like an external API, so there is no reason to mock it during testing.*/
const ShipFactory = require("./ship-factory");

function createGameboard() {
  let shipsOnBoard = [];
  let successfulAttacks = [];
  let missedAttacks = [];
  const placeShip = function (shipName, shipCoordinates) {
    const shipToBePlaced = ShipFactory.createShip(shipName, shipCoordinates);
    /*Check if the starting or ending coordinates are already occupied by a ship*/
    let occupied = shipsOnBoard.find((ship) => {
      for (let i = 0; i < shipToBePlaced.occupiedCells.length; i++) {
        /*Check whether a ship on the board overlaps with a shipToBePlaced*/
        if (ship.isOccupying(shipToBePlaced.occupiedCells[i])) {
          return true;
        }
      }
    });
    if (!occupied) {
      shipsOnBoard.push(shipToBePlaced);
    } else {
      throw new Error("Cannot place ships in overlapping positions");
    }
  };
  const receiveAttack = function (attackedCoordinates) {
    //lookup if a ship has been hit by the attack
    let attackedShip = shipsOnBoard.find((ship) =>
      ship.isOccupying(attackedCoordinates)
    );

    if (attackedShip) {
      //Attack is successful
      attackedShip.hit(attackedCoordinates);
      successfulAttacks.push(attackedCoordinates);
      return true;
    } else {
      //Attack is unsuccessful
      missedAttacks.push(attackedCoordinates);
      return false;
    }
  };
  const isGameOver = function () {
    let sunkShips = shipsOnBoard.filter((ship) => ship.isSunk());
    if (sunkShips.length === shipsOnBoard.length) {
      return true;
    } else {
      return false;
    }
  };
  return {
    shipsOnBoard,
    successfulAttacks,
    missedAttacks,
    placeShip,
    receiveAttack,
    isGameOver,
  };
}

module.exports = { createGameboard };
