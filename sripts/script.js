"use strict";
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    function placeMarker(marker, index){
        if (board[index] === ""){
            board[index] = marker;
            return true;
        }
        return false;
    };

    function resetBoard(){
        board = ["", "", "", "", "", "", "", "", ""];
    };

    function getBoard(){
        return board.slice();
    };

    return {placeMarker, resetBoard, getBoard};
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return {getName, getMarker};
};

const gameController = (() => {
    const winCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    const playerX = Player("playerX", "X");
    const playerO = Player("playerO", "O");

    let currentPlayer = playerX;
    let gameFinished = false;

    function makeMove(index){
        if (gameFinished){
            return;
        }
        let gameResult = false;

        if(gameBoard.placeMarker(currentPlayer.getMarker(), index)){
            gameResult = checkWin();
            if (gameResult){
                gameOver(gameResult);
                return;
            }

            if (currentPlayer === playerX){
                currentPlayer = playerO;
            } else {
                currentPlayer = playerX;
            }
        }
    }

    function checkWin(){
        const board = gameBoard.getBoard();
        for (let i = 0; i != winCondition.length; i++){
            let condition = winCondition[i];

            let marker = currentPlayer.getMarker();
            if (board[condition[0]] === marker && board[condition[1]] === marker && board[condition[2]] === marker){
                return true;
            }
        }
        return false;
    };

    function gameOver(gameResult){
        if (gameResult){
            console.log(`${currentPlayer.getName()} won!!`);
            gameFinished = true;
        }
        else if (!gameResult && (gameBoard.getBoard().filter((item) => item === "")).length === 0){
            console.log(`It's a draw!!`);
            gameFinished = true;
        }
    };

    return {makeMove, checkWin};
})();

const displayController = (() => {
    
})();