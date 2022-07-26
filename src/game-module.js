const gameBoardFactory = require("./gameboard-factory");

const columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function createMatch() {
  //The players are created within the context of a match
  //This allows player objects to interact with other player objects
  function createPlayer() {
    //Associating the Player with a gameBoard
    let gameBoard = gameBoardFactory.createGameboard();

    //Any player has the ability to place ships randomly on their board
    function placeRandomShips() {
      const shipLengths = [2, 3, 3, 4, 5];
      const shipNames = [
        "patrolboat",
        "submarine",
        "destroyer",
        "battleship",
        "carrier",
      ];
      let shipCounter = 0;
      let boardCells = generateBoardCells();
      while (gameBoard.shipsOnBoard.length < 5) {
        let currentRandomPoint = getRandomCoordinates(boardCells);
        let validShips = getValidBoardLines(
          currentRandomPoint,
          shipLengths[shipCounter]
        );
        while (validShips.length != 0) {
          let currentShipIndex = getRandomIntegerUpTo(validShips.length);
          try {
            //try to place at least one ship
            //If ship placement fails an error will be thrown
            //If it succeeds, we break from the loop
            gameBoard.placeShip(
              shipNames[shipCounter],
              validShips[currentShipIndex]
            );
            shipCounter++;
            break;
          } catch (err) {
            validShips.splice(currentShipIndex, 1);
            continue;
          }
        }
        //Remove the currentRandomPoint from the pool of boardCells
        //This makes sure we don't attempt to use invalid board positions more than once
        boardCells.splice(currentRandomPoint, 1);
      }
    }
    return { gameBoard, placeRandomShips };
  }

  let humanPlayer = createPlayer();
  let cpu = createPlayer();

  function attackFromAI() {
    let boardCells = generateBoardCells();
    //Filter out cells that have already been attacked or missed
    let potentialTargets = getValidTargets(boardCells);
    if (potentialTargets.length === 0) {
      return;
    }
    let randomTarget = getRandomCoordinates(potentialTargets);
    //Attack random target
    let hit = humanPlayer.gameBoard.receiveAttack(randomTarget);
    if (hit) {
      //Use randomTargets to get adjacent cells
      let validLines = getValidBoardLines(randomTarget, 2);
      let adjacentCells = [];
      for (let i = 0; i < validLines.length; i++) {
        adjacentCells.push(validLines[i][1]);
      }

      let potentialAdjacentTargets = getValidTargets(adjacentCells);
      //Sometimes the surrounding cells are all invalid
      if (potentialAdjacentTargets.length === 0) {
        attackFromAI();
        return;
      }

      //nextTarget is randomly chosen between cells adjacent to the first randomTarget
      let nextTarget = getRandomCoordinates(potentialAdjacentTargets);
      let successiveHit = humanPlayer.gameBoard.receiveAttack(nextTarget);
      if (successiveHit) {
        //Decide which direction forms a straight line
        //By comparing the initial randomTarget to nextTarget
        let x1 = randomTarget.charAt(0);
        let x2 = nextTarget.charAt(0);
        let y1 = +randomTarget.slice(1);
        let y2 = +nextTarget.slice(1);
        if (y1 === y2) {
          if (columnNotation.indexOf(x2) > columnNotation.indexOf(x1)) {
            do {
              let columnIndex =
                columnNotation.indexOf(nextTarget.charAt(0)) + 1;
              nextTarget = `${columnNotation[columnIndex] + y1}`;
              if (columnIndex > 9 || !isTargetValid(nextTarget)) {
                attackFromAI();
                return;
              }
            } while (humanPlayer.gameBoard.receiveAttack(nextTarget));
          } else {
            do {
              let columnIndex =
                columnNotation.indexOf(nextTarget.charAt(0)) - 1;
              nextTarget = `${columnNotation[columnIndex] + y1}`;
              if (columnIndex < 0 || !isTargetValid(nextTarget)) {
                attackFromAI();
                return;
              }
            } while (humanPlayer.gameBoard.receiveAttack(nextTarget));
          }
        } else if (x1 === x2) {
          if (y2 > y1) {
            do {
              let yNext = +nextTarget.slice(1) + 1;
              nextTarget = `${x1 + yNext}`;
              if (yNext > 10 || !isTargetValid(nextTarget)) {
                attackFromAI();
                return;
              }
            } while (humanPlayer.gameBoard.receiveAttack(nextTarget));
          } else {
            do {
              let yNext = +nextTarget.slice(1) - 1;
              nextTarget = `${x1 + yNext}`;
              if (yNext < 1 || !isTargetValid(nextTarget)) {
                attackFromAI();
                return;
              }
            } while (humanPlayer.gameBoard.receiveAttack(nextTarget));
          }
        }
      }
    }
  }

  function getValidTargets(boardCells) {
    let potentialTargets = [];
    for (let i = 0; i < boardCells.length; i++) {
      let alreadyAttacked = humanPlayer.gameBoard.successfulAttacks.includes(
        boardCells[i]
      );
      let alreadyMissedAttack = humanPlayer.gameBoard.missedAttacks.includes(
        boardCells[i]
      );
      if (!alreadyAttacked && !alreadyMissedAttack) {
        potentialTargets.push(boardCells[i]);
      }
    }

    return potentialTargets;
  }

  function isTargetValid(target) {
    let alreadyAttacked =
      humanPlayer.gameBoard.successfulAttacks.includes(target);
    let alreadyMissedAttack =
      humanPlayer.gameBoard.missedAttacks.includes(target);
    //A potential target is one that we didn't attack or miss before
    return !alreadyAttacked && !alreadyMissedAttack;
  }

  //If a player succeeds at attacking another, they get another chance to attack
  function playRound(targetCoordinates) {
    let humanPlayerAttackSuccess =
      cpu.gameBoard.receiveAttack(targetCoordinates);
    if (humanPlayerAttackSuccess) {
      //This will let the player go for another attack if their first attack
      //is successful
      return;
    } else {
      //The attack from AI handles successive attacks on its own
      //It will only stop attacking the humanPlayer once it has missed an attack
      attackFromAI();
    }
  }

  return { humanPlayer, cpu, createPlayer, playRound, attackFromAI };
}
//This can be used to avoid randomly guessing the same board cell twice
function generateBoardCells() {
  let boardCells = [];

  for (let i = 0; i < 100; i++) {
    boardCells[i] = `${columnNotation[i % 10] + (Math.floor(i / 10) + 1)}`;
  }

  return boardCells;
}

function getRandomIntegerUpTo(max) {
  return Math.floor(Math.random() * max);
}

function getRandomCoordinates(boardCellsPool) {
  return boardCellsPool[getRandomIntegerUpTo(boardCellsPool.length)];
}
//The goal of the function is to find valid lines in all directions
//Given a starting point and a lineLength between starting and ending points
function getValidBoardLines(startPoint, lineLength) {
  //The goal of the function is to find valid sets of coordinates on a board assumed to be empty.
  //Starting points coordinates
  let xStart = startPoint.charAt(0);
  let yStart = +startPoint.slice(1);
  let validLines = [];
  let yEnd1 = yStart + (lineLength - 1);
  //Creating ships in all directions if possible
  //Downwards from the startPoint
  if (yEnd1 > yStart && yEnd1 <= 10) {
    validLines.push([startPoint, `${xStart + yEnd1}`]);
  }
  //Upwards From the startPoint
  let yEnd2 = yStart - (lineLength - 1);
  if (yStart > yEnd2 && yEnd2 >= 1) {
    validLines.push([startPoint, `${xStart + yEnd2}`]);
  }
  //Horizontally to the left of startPoint
  let xEnd1 = columnNotation.indexOf(xStart) + (lineLength - 1);
  if (xEnd1 > columnNotation.indexOf(xStart) && xEnd1 < columnNotation.length) {
    validLines.push([startPoint, `${columnNotation[xEnd1] + yStart}`]);
  }
  //Horizontally to the right of startPoint
  let xEnd2 = columnNotation.indexOf(xStart) - (lineLength - 1);
  if (columnNotation.indexOf(xStart) > xEnd2 && xEnd2 >= 0) {
    validLines.push([startPoint, `${columnNotation[xEnd2] + yStart}`]);
  }
  return validLines;
}

module.exports = { createMatch, getValidBoardLines, generateBoardCells };
