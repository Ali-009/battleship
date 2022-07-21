(()=>{var __webpack_modules__={171:(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{eval("const GameModule = __webpack_require__(218);\n\n//Generate an entire board and display it on the page\nfunction displayGameBoard(){\n    let primaryGrid = document.querySelector('.primary-grid');\n    let trackingGrid = document.querySelector('.tracking-grid');\n    //create one hundred grid cells for the primary grid\n    //And the tracking grid\n    generateGrid(primaryGrid);\n    generateGrid(trackingGrid);\n\n    //Working on the start button\n    let startButton = document.querySelector('.start-button');\n    let messageBox = document.querySelector('.message-box');\n    startButton.addEventListener('click', () => {\n        startButton.remove();\n\n        messageBox.textContent = 'Choose the Coordinates for Your Carrier: ';\n\n        let coordinateInput = document.createElement('div');\n        coordinateInput.classList.add('coordinate-input-container');\n        messageBox.appendChild(coordinateInput);\n\n        let startPointField = document.createElement('input');\n        let endPointField = document.createElement('input');\n        let coordinateSubmit = document.createElement('button');\n\n        startPointField.setAttribute('placeholder', 'Start Point');\n        endPointField.setAttribute('placeholder', 'End Point');\n        coordinateSubmit.textContent = 'Enter';\n\n        coordinateSubmit.addEventListener('click', () => {\n            \n        })\n\n\n        coordinateInput.appendChild(startPointField);\n        coordinateInput.appendChild(endPointField);\n        coordinateInput.appendChild(coordinateSubmit);\n    })\n}\n\nfunction checkCoordinatesValidity([startPoint, endPoint], lineLength){\n    //Try to get valid board lines from startPoint\n    let validLines = GameModule.getValidBoardLines(startPoint, lineLength);\n    //Check if the user's input lines are valid\n    if(!validLines.includes([startPoint,endPoint])){\n        return false;\n    } else {\n        return true;\n    }\n\n}\n\nfunction submitPlayerShip(shipName, startPoint, endPoint, shipLength){\n    let messageBox = document.querySelector('.message-box');\n    let shipValidity = checkCoordinatesValidity([startPoint, endPoint], shipLength);\n\n    if(!shipValidity){\n        document.querySelector('.message-box').textContent = \"Wrong Ship Size\";\n        return;\n    }\n    try{\n        match.humanPlayer.gameBoard.placeShip(shipName, [startPoint, endPoint]);\n        refreshBoardState();\n    } catch(err){\n        messageBox.textContent = err;\n    }\n}\n\n\nconst columnNotation = [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\", \"H\", \"I\", \"J\"];\n\nfunction generateGrid(grid){\n    for(let i = 0; i< 100; i++){\n        let gridCell = document.createElement('div');\n        gridCell.classList.add('grid-cell');\n        gridCell.setAttribute('data-cell', `${columnNotation[i%10] + (Math.floor(i/10)+1)}`);\n        grid.appendChild(gridCell);\n    }\n}\n\nfunction refreshBoardState(){\n    //display player ships on board\n    let playerShips = match.humanPlayer.gameBoard.shipsOnBoard;\n    for(let i = 0; i < playerShips.length; i++){\n        displayShip(playerShips[i]);\n    }\n}\n\nfunction displayShip(ship){\n    if(ship.occupiedCells.length > 0){\n        for(let i = 0; i < ship.occupiedCells.length; i++){\n            let currentCell = document.querySelector(\n                `[data-cell=\"${ship.occupiedCells[i]}\"]`\n            );\n            currentCell.classList.add(ship.name);\n        }\n    }\n}\n\nfunction findShip(shipName){\n    //fetching occupied cells\n    let requestedShip = match.humanPlayer.gameBoard.shipsOnBoard\n        .find((ship) => ship.name === shipName);\n    return requestedShip;\n}\n\n//Starting the match\n//The match object also encapsulates the humanPlayer and the AI player\n//As such we can use player objects in this module without the need to create them\nlet match = GameModule.createMatch();\ndisplayGameBoard();\n\n//# sourceURL=webpack://battleship/./src/game-interface.js?")},218:(module,__unused_webpack_exports,__webpack_require__)=>{eval('const gameBoardFactory = __webpack_require__(301);\n\nconst columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];\n\nfunction createMatch(){\n    //The players are created within the context of a match\n    //This allows player objects to interact with other player objects\n    function createPlayer(){\n        //Associating the Player with a gameBoard\n        let gameBoard = gameBoardFactory.createGameboard();\n\n        //Any player has the ability to place ships randomly on their board\n        function placeRandomShips(){\n            const shipLengths = [2, 3, 3, 4, 5];\n            const shipNames = [\'patrolboat\', \'submarine\', \'destroyer\', \'battleship\', \'carrier\'];\n            let shipCounter = 0;\n            let boardCells = generateBoardCells();\n            while(gameBoard.shipsOnBoard.length < 5){\n                let currentRandomPoint = getRandomCoordinates(boardCells);\n                let validShips \n                = getValidBoardLines(currentRandomPoint, shipLengths[shipCounter]);\n                while(validShips.length != 0){\n                    let currentShipIndex = getRandomIntegerUpTo(validShips.length);\n                    try{\n                        //try to place at least one ship\n                        //If ship placement fails an error will be thrown\n                        //If it succeeds, we break from the loop\n                        gameBoard.placeShip(shipNames[shipCounter], validShips[currentShipIndex]);\n                        shipCounter++;\n                        break;\n                    } catch (err){\n                        validShips.splice(currentShipIndex, 1);\n                        continue;\n                    }\n                }\n                //Remove the currentRandomPoint from the pool of boardCells\n                //This makes sure we don\'t attempt to use invalid board positions more than once\n                boardCells.splice(currentRandomPoint, 1);\n            }\n        }\n        return{gameBoard, placeRandomShips};\n    }\n\n    let humanPlayer = createPlayer();\n    let cpu = createPlayer();\n    \n    function attackFromAI(){\n        let boardCells = generateBoardCells();\n        //Filter out cells that have already been attacked or missed\n        let potentialTargets = getValidTargets(boardCells);\n\n        let randomTarget = getRandomCoordinates(potentialTargets);\n        //Attack random target\n        let hit = humanPlayer.gameBoard.receiveAttack(randomTarget);\n        if(hit){\n            //Use randomTargets to get adjacent cells\n            let validLines = getValidBoardLines(randomTarget, 2);\n            let adjacentCells = []\n            for(let i = 0; i < validLines.length; i ++){\n                adjacentCells.push(validLines[i][1]);\n            }\n            \n            let potentialAdjacentTargets = getValidTargets(adjacentCells);\n            //nextTarget is randomly chosen between cells adjacent to the first randomTarget\n            let nextTarget = getRandomCoordinates(potentialAdjacentTargets);\n            let successiveHit = humanPlayer.gameBoard.receiveAttack(nextTarget);\n            if(successiveHit){\n                //Decide which direction forms a straight line\n                //By comparing the initial randomTarget to nextTarget\n                let x1 = randomTarget.charAt(0);\n                let x2 = nextTarget.charAt(0);\n                let y1 = +randomTarget.slice(1);\n                let y2 = +nextTarget.slice(1);\n                if(y1 === y2){\n                    if(columnNotation.indexOf(x2) > columnNotation.indexOf(x1)){\n                        do{\n                            nextTarget = `${columnNotation[columnNotation.indexOf(nextTarget.charAt(0)) + 1] + y1}`;\n                            if(x2 === \'J\' || !isTargetValid(nextTarget)){\n                                attackFromAI();\n                                break;\n                            }\n                        } while(humanPlayer.gameBoard.receiveAttack(nextTarget));\n                    } else {\n                        do{\n                            nextTarget = `${columnNotation[columnNotation.indexOf(nextTarget.charAt(0)) - 1] + y1}`;\n                            if(x1 === \'A\' || !isTargetValid(nextTarget)){\n                                attackFromAI();\n                                break;\n                            }\n                        } while(humanPlayer.gameBoard.receiveAttack(nextTarget));\n                    }\n                } else if(x1 === x2){\n                    if(y2 > y1){\n                        do{\n                            nextTarget = `${x1 + (+nextTarget.slice(1) + 1)}`;\n                            if(y2 === 10 || !isTargetValid(nextTarget)){\n                                attackFromAI();\n                                break;\n                            }\n                        } while(humanPlayer.gameBoard.receiveAttack(nextTarget));\n                    } else {\n                        do{\n                            nextTarget = `${x1 + (+nextTarget.slice(1) - 1)}`;\n                            if(y1 === 1 || !isTargetValid(nextTarget)){\n                                attackFromAI();\n                                break;\n                            }\n                        } while(humanPlayer.gameBoard.receiveAttack(nextTarget));\n                    }\n                }\n            }\n        }\n\n    }\n\n    function getValidTargets(boardCells){\n        let potentialTargets = boardCells.filter((cell) => {\n            return isTargetValid(cell);    \n        });\n\n        return potentialTargets;\n    }\n\n    function isTargetValid(target){\n        let alreadyAttacked = humanPlayer.gameBoard.successfulAttacks.includes(target);\n        let alreadyMissedAttack = humanPlayer.gameBoard.missedAttacks.includes(target);\n        //A potential target is one that we didn\'t attack or miss before\n        return !alreadyAttacked && !alreadyMissedAttack;\n    }\n\n    //If a player succeeds at attacking another, they get another chance to attack\n    function playRound(targetCoordinates){\n        let humanPlayerAttackSuccess = cpu.gameBoard.receiveAttack(targetCoordinates);\n        if(humanPlayerAttackSuccess){\n            //This will let the player go for another attack if their first attack\n            //is successful\n            return;\n        } else {\n            //The attack from AI handles successive attacks on its own\n            //It will only stop attacking the humanPlayer once it has missed an attack\n            attackFromAI();\n        }\n    }\n\n    return {humanPlayer, cpu, createPlayer, playRound, attackFromAI};\n\n}\n//This can be used to avoid randomly guessing the same board cell twice\nfunction generateBoardCells(){\n    let boardCells = [];\n\n    for(let i = 0; i < 100; i++){\n        boardCells[i] = `${columnNotation[i%10]+(Math.floor(i/10)+1)}`;\n    }\n\n    return boardCells;\n}\n\nfunction getRandomIntegerUpTo(max){\n    return Math.floor(Math.random() * max);\n}\n\nfunction getRandomCoordinates(boardCellsPool){\n    return boardCellsPool[getRandomIntegerUpTo(boardCellsPool.length)];\n}\n//The goal of the function is to find valid lines in all directions\n//Given a starting point and a lineLength between starting and ending points\nfunction getValidBoardLines(startPoint, lineLength){\n    //The goal of the function is to find valid sets of coordinates on a board assumed to be empty.\n    //Starting points coordinates\n    let xStart = startPoint.charAt(0);\n    let yStart = +startPoint.slice(1);\n    let validLines = [];\n    let yEnd1 = yStart + (lineLength - 1);\n    //Creating ships in all directions if possible\n    //Downwards from the startPoint\n    if(yEnd1 > yStart && yEnd1 <= 10){\n        validLines.push([startPoint, `${xStart + yEnd1}`]);\n    }\n    //Upwards From the startPoint\n    let yEnd2 = yStart - (lineLength - 1);\n    if(yStart > yEnd2 && yEnd2 >= 1){\n        validLines.push([startPoint, `${xStart + yEnd2}`]);\n    }\n    //Horizontally to the left of startPoint\n    let xEnd1 = columnNotation.indexOf(xStart) + (lineLength - 1);\n    if(xEnd1 > columnNotation.indexOf(xStart) && xEnd1 < columnNotation.length){\n        validLines.push([startPoint, `${columnNotation[xEnd1] + yStart}`]);\n    }\n    //Horizontally to the right of startPoint\n    let xEnd2 = columnNotation.indexOf(xStart) - (lineLength - 1);\n    if(columnNotation.indexOf(xStart) > xEnd2 && xEnd2 >= 0){\n        validLines.push([startPoint, `${columnNotation[xEnd2] +yStart}`]);\n    }\n    return validLines;\n}\n\nmodule.exports = {createMatch, getValidBoardLines, generateBoardCells};\n\n//# sourceURL=webpack://battleship/./src/game-module.js?')},301:(module,__unused_webpack_exports,__webpack_require__)=>{eval('/*Mocking the functionality of ShipFactory in our tests will only increase our work time for no reason.*/\n/*ShipFactory is a local module and not something like an external API, so there is no reason to mock it during testing.*/\nconst ShipFactory = __webpack_require__(680);\n\nfunction createGameboard() {\n  let shipsOnBoard = [];\n  let successfulAttacks = [];\n  let missedAttacks = [];\n  const placeShip = function (shipName, shipCoordinates) {\n    const shipToBePlaced = ShipFactory.createShip(shipName, shipCoordinates);\n    /*Check if the starting or ending coordinates are already occupied by a ship*/\n    let occupied = shipsOnBoard.find((ship) => {\n      for (let i = 0; i < shipToBePlaced.occupiedCells.length; i++) {\n        /*Check whether a ship on the board overlaps with a shipToBePlaced*/\n        if (ship.isOccupying(shipToBePlaced.occupiedCells[i])) {\n          return true;\n        }\n      }\n    });\n    if (!occupied) {\n      shipsOnBoard.push(shipToBePlaced);\n    } else {\n      throw new Error("Cannot place ships in overlapping positions");\n    }\n  };\n  const receiveAttack = function (attackedCoordinates) {\n    //lookup if a ship has been hit by the attack\n    let attackedShip = shipsOnBoard.find((ship) =>\n      ship.isOccupying(attackedCoordinates)\n    );\n\n    if (attackedShip) {\n      //Attack is successful\n      attackedShip.hit(attackedCoordinates);\n      successfulAttacks.push(attackedCoordinates);\n      return true;\n    } else {\n      //Attack is unsuccessful\n      missedAttacks.push(attackedCoordinates);\n      return false;\n    }\n  };\n  const isGameOver = function () {\n    let sunkShips = shipsOnBoard.filter((ship) => ship.isSunk());\n    if (sunkShips.length === shipsOnBoard.length) {\n      return true;\n    } else {\n      return false;\n    }\n  };\n  return {\n    shipsOnBoard,\n    successfulAttacks,\n    missedAttacks,\n    placeShip,\n    receiveAttack,\n    isGameOver,\n  };\n}\n\nmodule.exports = { createGameboard };\n\n\n//# sourceURL=webpack://battleship/./src/gameboard-factory.js?')},680:module=>{eval('function createShip(name, shipCoordinates) {\n  let hitSpots = [];\n  //A function to create an array of occupiedCells\n  const occupyCells = function (shipCoordinates) {\n    let occupiedCells = [];\n    /*The two lines below should make occupiedCells a deep copy of shipCoordinates*/\n    occupiedCells[0] = shipCoordinates[0];\n    occupiedCells[1] = shipCoordinates[1];\n    const columnNotation = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];\n    let startPoint;\n    let endPoint;\n    //The coordinates on the x-axis\n    let x1 = shipCoordinates[0].charAt(0);\n    let x2 = shipCoordinates[1].charAt(0);\n\n    //The coordinates on the y-axis\n    let y1 = +shipCoordinates[0].slice(1);\n    let y2 = +shipCoordinates[1].slice(1);\n\n    //If the ship has a vertical orientation\n    if (x1 === x2) {\n      if (y2 > y1) {\n        startPoint = y1;\n        endPoint = y2;\n      } else {\n        startPoint = y2;\n        endPoint = y1;\n      }\n      for (let i = startPoint + 1; i < endPoint; i++) {\n        occupiedCells.push(`${x1 + i}`);\n      }\n      return occupiedCells;\n    } else if (y1 === y2) {\n      //The ship has a horizontal orientation\n      //The logic here is similar to the above code block\n      //The code below changes the alphabetic notation into a numerical one that we can iterate over\n      if (columnNotation.indexOf(x2) > columnNotation.indexOf(x1)) {\n        startPoint = columnNotation.indexOf(x1);\n        endPoint = columnNotation.indexOf(x2);\n      } else {\n        startPoint = columnNotation.indexOf(x2);\n        endPoint = columnNotation.indexOf(x1);\n      }\n      for (let i = startPoint + 1; i < endPoint; i++) {\n        occupiedCells.push(`${columnNotation[i] + y1}`);\n      }\n      return occupiedCells;\n    } else {\n      throw new Error("Invalid Ship Coordinates");\n    }\n  };\n\n  const occupiedCells = occupyCells(shipCoordinates);\n  const shipLength = occupiedCells.length;\n  const hit = function (position) {\n    return hitSpots.push(position);\n  };\n  const isOccupying = function (coordinates) {\n    return occupiedCells.includes(coordinates);\n  };\n  const isSunk = function () {\n    return hitSpots.length === shipLength ? true : false;\n  };\n\n  return {\n    name,\n    shipCoordinates,\n    shipLength,\n    occupiedCells,\n    hit,\n    isSunk,\n    isOccupying,\n  };\n}\n\nmodule.exports = { createShip };\n\n\n//# sourceURL=webpack://battleship/./src/ship-factory.js?')}},__webpack_module_cache__={};function __webpack_require__(n){var e=__webpack_module_cache__[n];if(void 0!==e)return e.exports;var t=__webpack_module_cache__[n]={exports:{}};return __webpack_modules__[n](t,t.exports,__webpack_require__),t.exports}var __webpack_exports__=__webpack_require__(171)})();