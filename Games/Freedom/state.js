class State {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.blackStoneLives = 0;
        this.whiteStoneLives = 0;
        this.terminal = false;
        this.value = 0;
        this.move = "";
        this.previousMove = [0, 0];
        this.numberOfSpots = this.board.length * this.board[0].length;
    }
}