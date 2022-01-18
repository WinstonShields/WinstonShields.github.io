/**
 * 
 * @param {State} state current state of the game.
 * @param {boolean} human truth value for whether player is human (true) or AI (false).
 */
function getPossibleStates(state, human) {

    var possibleStates = [];

    for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[i].length; j++) {
            if (state.board[i][j] == null) {
                // If the state's cell is empty, create a deepcopy
                // of the state.
                var possibleState = JSON.parse(JSON.stringify(state));
                var possibleState2 = JSON.parse(JSON.stringify(state));

                // Create a string out of the current index.
                var index = i.toString() + '-' + j.toString();

                var placed = false;

                if (human) {
                    // Place a black stone in the empty index.
                    placed = placeStone(possibleState, index, true, true);
                } else {
                    // Place a white stone in the empty index.
                    placed = placeStone(possibleState, index, false, true);


                    if (countStones(possibleState2) == possibleState2.numberOfSpots - 1) {
                        // If all the spots are filled in except for one, one of the 
                        // possible states are to leave the last spot open. Create that
                        // state and push it to the array of possible states.

                        var index = "";

                        placeStone(possibleState2, index, false, true);

                        possibleStates.push(possibleState2);
                    }
                }

                if (placed) {

                    // If the stone was successfully placed, push it to the 
                    // array of possible states.
                    possibleState.move = i.toString() + "-" + j.toString();

                    // Push the possible state in the list of possible states.
                    possibleStates.push(possibleState);
                }

            }
        }
    }

    return possibleStates;
}

/**
 * 
 * @param {State} state current game state.
 * @param {int} depth the number of turns that the minimax algorithm will look into.
 * @param {int} alpha best value that the maximizer can guarantee at that level.
 * @param {int} beta best value that the minimizer can guarantee at that level.
 * @param {boolean} maximizingPlayer the player that is trying to get the highest score.
 * True for AI and false for human.
 */
function minimax(state, depth, alpha, beta, maximizingPlayer) {

    if (depth == 0 || state.terminal) {
        // If the depth becomes 0, or the state is terminal, return the 
        // raw value of that state and the move.
        return [state.value, state.move];
    }

    if (maximizingPlayer) {

        // Set the maximum value to -infinity.
        var maxEval = -Infinity;

        // Get all the possible states for the AI.
        let possibleStates = getPossibleStates(state, false);

        var move = "";

        for (let i = 0; i < possibleStates.length; i++) {

            // Call the minimax algorithm for the minimizing player (human) and retrieve the
            // results.
            var results = minimax(possibleStates[i], depth - 1, alpha, beta, false);

            // Set the value retrieved from the minimax call.
            var eval = results[0];

            if (maxEval < eval) {
                // If the value is higher than the max evaulation, set the max evaluation
                // as the value. Also, set move to the state that has the higher value.
                maxEval = eval;
                move = possibleStates[i].move
            }

            // Set alpha to the value retrieved from minimax if it is higher than the current
            // alpha value.
            alpha = Math.max(alpha, eval);

            // If beta is less than or equal to alpha, break the recursion.
            if (beta <= alpha) {
                break;
            }
        }
        return [maxEval, move];

    } else {

        // Set the minimum value to infinity.
        var minEval = Infinity;

        // Get all the possible states for the human.
        let possibleStates = getPossibleStates(state, true);

        var move = "";

        for (let i = 0; i < possibleStates.length; i++) {

            // Call the minimax algorithm for the maximizing player (AI) and retrieve the
            // results.
            var results = minimax(possibleStates[i], depth - 1, alpha, beta, true);

            // Set the value retrieved from the minimax call.
            var eval = results[0];

            if (minEval > eval) {
                // If the value is lower than the minimum evaulation, set the minimum evaluation
                // as the value. Also, set move to the state that has the minimum value.
                minEval = eval;
                move = possibleStates[i].move;
            }

            // Set beta to the value retrieved from minimax if it is lower than the current
            // beta value.
            beta = Math.min(beta, eval);

            // If beta is less than or equal to alpha, break the recursion.
            if (beta <= alpha) {
                break;
            }
        }

        return [minEval, move];
    }
}