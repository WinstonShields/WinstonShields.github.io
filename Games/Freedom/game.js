// Initialize the state of the board.
const state = new State();

// Get the HTML elements.
const status = document.getElementById('status');
const displayResults = document.getElementById('results');

/**
 * The number of stones present on the board are counted.
 * 
 * @param {State} state current game state.
 */
function countStones(state) {
    var numberOfStones = 0;

    // Count the number of pieces on the board.
    for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[i].length; j++) {
            if (state.board[i][j] != null) {
                numberOfStones += 1;
            }
        }
    }

    return numberOfStones;
}

/**
 * If the game is in a terminal state, the game will end.
 * 
 * @param {State} state the game state.
 * @param {boolean} copy truth value for whether the state is a copy or the main state.
 */
function gameOver(state, copy) {

    if (!copy) {

        if (state.terminal) {
            // If the stones fill up all of the spots on the board, check
            // for the winner.
            if (state.blackStoneLives > state.whiteStoneLives) {
                console.log("Black Wins!")
                state.value = 1;

                displayResults.innerHTML = "Black Wins!";

            } else if (state.blackStoneLives < state.whiteStoneLives) {
                console.log("White Wins!")
                state.value = -1;

                displayResults.innerHTML = "White Wins!";
            } else {
                console.log("Draw")
                state.value = 0;

                displayResults.innerHTML = "Draw!";
            }

            console.log("Black", state.blackStoneLives);
            console.log("White", state.whiteStoneLives);
        }

    }
}

/**
 * This function counts the stones in a row and increments a life if there
 * are four in a row. It removes a life if there are more than four in a row.
 * 
 * @param {State} state current state of game.
 * @param {int} row Board row.
 * @param {int} col Board column.
 * @param {int} blackCount Current amount of counted black stones in a row.
 * @param {int} whiteCount Current amount of counted white stones in a row.
 * @param {boolean} stopSubBlack Boolean for stopping the removing of black stone lives, true if 
 * reductions needs to stop. False if count continues.
 * @param {boolean} stopSubWhite Boolean for stopping the removing of white stone lives, true if
 * reductions needs to stop. False if count continues.
 */
function counter(state, row, col, blackCount, whiteCount, stopSubBlack, stopSubWhite) {

    if (state.board[row][col] == null) {
        // If the board cell is empty (null), reset the counters and set the
        // stop booleans to false.
        blackCount = 0;
        whiteCount = 0;
        stopSubBlack = false;
        stopSubWhite = false;
    }

    if (state.board[row][col] == 1) {
        // Count horizontal black stones. Reset white
        // stone counter.
        blackCount += 1;
        whiteCount = 0;
        stopSubWhite = false;
    }

    if (state.board[row][col] == 0) {
        // Count horizontal white stones. Reset black
        // stone counter.
        whiteCount += 1;
        blackCount = 0;
        stopSubBlack = false;
    }

    if (blackCount == 4) {
        // If there are 4 horizontal black stones, add a black
        // stone life and reset black stone counter.
        state.blackStoneLives += 1;
    }

    if (blackCount > 4 && !stopSubBlack) {
        // Remove life it the row of stones is greater than 4.
        state.blackStoneLives = state.blackStoneLives - 1;
        stopSubBlack = true;
    }

    if (whiteCount == 4) {
        // If there are 4 horizontal white stones, add a white
        // stone life and reset white stone counter.
        state.whiteStoneLives += 1;
    }

    if (whiteCount > 4 && !stopSubWhite) {
        // Remove life it the row of stones is greater than 4.
        state.whiteStoneLives = state.whiteStoneLives - 1;
        stopSubWhite = true;
    }

    return [blackCount, whiteCount, stopSubBlack, stopSubWhite];
}

/**
 * This function is made for counting lives that are diagonally placed.
 * 
 * @param {State} state current game state.
 */
function countDiagonal(state) {

    var row = 0;
    var inverseRow = 0;

    var length = state.board.length;

    var stopSubBlack = false;
    var stopSubWhite = false;

    var inverseStopBlack = false;
    var inverseWhiteStop = false;

    // Set the number of diagonal lines in the board.
    diagonalLines = length + length - 1;

    for (let i = 0; i < diagonalLines; i++) {
        var blackCount = 0;
        var whiteCount = 0;
        var inverseBlackCount = 0;
        var inverseWhiteCount = 0;

        for (let col = 0; col <= i; col++) {
            // Set the row and inverted row.
            row = i - col;
            inverseRow = length - row;

            if (row < length && col < length) {
                // Count all digaonal lives from top left to bottom right.
                var diagonalCounts = counter(state, row, col, blackCount, whiteCount, stopSubBlack, stopSubWhite);
                blackCount = diagonalCounts[0];
                whiteCount = diagonalCounts[1];
                stopSubBlack = diagonalCounts[2];
                stopSubWhite = diagonalCounts[3];
            }

            if (inverseRow >= 0 && inverseRow < length && col < length) {
                // Count all diagonal lives from bottom left to top right.
                var inverseDiagonalCounts = counter(state, inverseRow, col, inverseBlackCount, inverseWhiteCount, inverseStopBlack, inverseWhiteStop);
                inverseBlackCount = inverseDiagonalCounts[0];
                inverseWhiteCount = inverseDiagonalCounts[1];
                inverseStopBlack = inverseDiagonalCounts[2];
                inverseWhiteStop = inverseDiagonalCounts[3];
            }
        }
    }
}

/**
 * This is the main function loop for counting lives.
 * 
 * @param {State} state the game state.
 * @param {boolean} copy truth value on whether the state is a copy or not.
 */
function countLives(state, copy) {

    state.blackStoneLives = 0;
    state.whiteStoneLives = 0;

    for (let i = 0; i < state.board.length; i++) {
        var horizontalBlackCount = 0;
        var horizontalWhiteCount = 0;

        var verticalBlackCount = 0;
        var verticalWhiteCount = 0;

        var horizontalBlackStop = false;
        var horizontalWhiteStop = false;

        var verticalBlackStop = false;
        var verticalWhiteStop = false;

        for (let j = 0; j < state.board[i].length; j++) {
            // Count the horizontal stones.
            var horizontalCounts = counter(state, i, j, horizontalBlackCount, horizontalWhiteCount, horizontalBlackStop, horizontalWhiteStop);
            horizontalBlackCount = horizontalCounts[0];
            horizontalWhiteCount = horizontalCounts[1];
            horizontalBlackStop = horizontalCounts[2];
            horizontalWhiteStop = horizontalCounts[3];

            // Count the vertical stones.
            var verticalCounts = counter(state, j, i, verticalBlackCount, verticalWhiteCount, verticalBlackStop, verticalWhiteStop);
            verticalBlackCount = verticalCounts[0];
            verticalWhiteCount = verticalCounts[1];
            verticalBlackStop = verticalCounts[2];
            verticalWhiteStop = verticalCounts[3];
        }
    }

    countDiagonal(state);

    if (!copy) {
        status.innerHTML = state.whiteStoneLives.toString() + " - " + state.blackStoneLives.toString();
    }
}

/**
 * To get a heuristic for the optimal move for the AI, subtract the total white stone
 * lives from the total black stone lives. This value will be used and evaluated in 
 * the minimax algorithm.
 * 
 * @param {State} state game state.
 */
function stoneDifference(state) {
    // Set the state's value to the total white stone lives minus the
    // black stone lives.
    state.value = state.blackStoneLives - state.whiteStoneLives;
}

/**
 * This function checks if the game board is empty.
 * 
 * @param {array} board game state board.
 */
function boardEmpty(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] != null) {
                // If board array has an element other than null inside
                // of it, return false.
                return false;
            }
        }
    }

    // If the array only contains null values, return true.
    return true;
}

/**
 * This function checks if there any spots adjacent to the previously
 * placed stone that are empty. If not, the freedom rule is enabled.
 * 
 * @param {State} state current game state.
 */
function freedom(state) {
    var adjacentSpots = [];

    var row = state.previousMove[0];
    var col = state.previousMove[1];

    if (row + 1 < state.board.length) {
        // If there is a stone one row under the previous placed stone,
        // add it to the adjacent spots array.

        adjacentSpots.push(state.board[row + 1][col]);
    }

    if (row - 1 >= 0) {
        // If there is a stone one row above the previous placed stone,
        // add it to the adjacent spots array.
        adjacentSpots.push(state.board[row - 1][col]);
    }

    if (col + 1 < state.board[0].length) {
        // If there is a stone one column to the right to the
        // previous placed stone, add it to the adjacent spots array.
        adjacentSpots.push(state.board[row][col + 1]);
    }

    if (col - 1 >= 0) {
        // If there is a stone one column to the left to the
        // previous placed stone, add it to the adjacent spots array.
        adjacentSpots.push(state.board[row][col - 1]);
    }


    for (let i = 0; i < adjacentSpots.length; i++) {
        if (adjacentSpots[i] == null) {
            // If any of the adjacent spots are null (free), the freedom
            // rule will not be in effect.
            return false;
        }
    }

    // If none of the adjacent spots were null, return true to enable
    // the freedom rule.
    return true;

}


/**
 * The human player and the AI player place a stone on the board.
 * 
 * @param {State} state the game state.
 * @param {int} index the index of the board.
 * @param {boolean} human boolean representation of who placed the stone.
 * True represents the human player, and false represents the AI.
 */
function placeStone(state, index, human, copy) {

    if (countStones(state) == state.numberOfSpots - 1 && index == "") {
        // If board is completely filled except for one spot, and index
        // is set to empty string (user doesn't place a stone), set the
        // game to terminal.
        state.terminal = true;
    } else {

        // Get the row and column from the index.
        var row = parseInt(index.split('-')[0]);
        var col = parseInt(index.split('-')[1]);

        var prevRow = state.previousMove[0];
        var prevCol = state.previousMove[1];

        var placed = false;

        // Cell must be empty and game must not be in terminal state
        // in order to place stone.
        if (!state.terminal && state.board[row][col] == null) {

            // If the board is empty, or if the freedom function returns true,
            // a stone can be placed on any empty spot of the board.
            if (boardEmpty(state.board) || freedom(state)) {
                var stone = 0;

                // If the current player is human, set the stone to 1, otherwise,
                // set it to 0.
                if (human) {
                    stone = 0;
                } else {
                    stone = 1;
                }

                if (!copy) {
                    // If this is the real board and not a copy, call the 
                    // display stone function.
                    displayStone(index, human, state);
                }

                // Set the position of the board array to the stone placed.
                state.board[row][col] = stone;

                // Count the lives of the black and white stones.
                countLives(state, copy);

                // Get the difference of the stone lives for the AI function.
                stoneDifference(state);

                state.previousMove = [row, col];

                placed = true;

            } else {
                // If the board isn't empty, a stone can only be placed on empty spots
                // adjacent to the previously placed stone.
                if ((prevRow == row + 1 && prevCol == col) ||
                    (prevRow == row - 1 && prevCol == col) ||
                    (prevRow == row && prevCol == col + 1) ||
                    (prevRow == row && prevCol == col - 1)) {

                    var stone = 0;

                    // If the current player is human, set the stone to 1, otherwise,
                    // set it to 0.
                    if (human) {
                        stone = 0;
                    } else {
                        stone = 1;
                    }

                    if (!copy) {
                        // If this is the real board and not a copy, call the 
                        // display stone function.
                        displayStone(index, human, state);
                    }

                    // Set the position of the board array to the stone placed.
                    state.board[row][col] = stone;

                    // Count the lives of the black and white stones.
                    countLives(state, copy);

                    // Get the difference of the stone lives for the AI function.
                    stoneDifference(state);

                    state.previousMove = [row, col];

                    placed = true;
                }
            }
        }

        if (placed) {
            if (human && !copy) {
                // If the player was human and the board is not a copy, retrieve the
                // optimal move for the AI player with minimax.
                results = minimax(state, 3, -Infinity, Infinity, true);
                var move = results[1];

                // Call place stone function for the AI player with the optimal move.
                placeStone(state, move, false, false);
            }
        }


        if (countStones(state) == state.numberOfSpots) {
            // If the number of stones is equal to the number of spots on the board,
            // set the terminal state to true.
            state.terminal = true;
        }
    }

    // Check if the game is over.
    gameOver(state, copy);

    return placed;
}

/**
 * This function is for displaying the stones on GUI.
 * 
 * @param {int} index the index of the board.
 * @param {boolean} human boolean representation of who placed the stone.
 * True represents the human player, and false represents the AI.
 */
function displayStone(index, human, state) {
    var img = document.getElementById(index + '-img');

    var stoneImg = new Image;

    stoneImg.onload = function() {
        img.src = this.src;
    }

    var prevRow = state.previousMove[0];
    var prevCol = state.previousMove[1];

    var previousMoveStr = prevRow.toString() + "-" + prevCol.toString();

    var img2 = document.getElementById(previousMoveStr + '-img');

    var prevStoneImg = new Image;

    prevStoneImg.onload = function() {
        img2.src = this.src;
    }

    // If the current player is human, load the black stone, otherwise,
    // load the white stone.
    if (human) {
        stoneImg.src = "images/white_stone.jpg";

    } else {
        stoneImg.src = "images/black_stone_previous.jpg";
    }

    if (state.board[prevRow][prevCol] == 1) {
        prevStoneImg.src = "images/black_stone.jpg";
    }

}