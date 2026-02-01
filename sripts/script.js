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

        if(gameBoard.placeMarker(currentPlayer.getMarker(), index)){
            const winningCells = checkWin();
            if (winningCells){
                gameOver(true, winningCells);
                return;
            } 
            if (gameBoard.getBoard().filter((item) => item === "").length === 0){
                gameOver(false);
                return;
            }

            if (currentPlayer === playerX){
                currentPlayer = playerO;
            } else {
                currentPlayer = playerX;
            }
    }};

    function getCurrentPlayerMarker(){
        return currentPlayer.getMarker();
    }

    function checkWin(){
        const board = gameBoard.getBoard();
        let marker = currentPlayer.getMarker();
        for (let i = 0; i != winCondition.length; i++){
            let condition = winCondition[i];
            if (board[condition[0]] === marker && board[condition[1]] === marker && board[condition[2]] === marker){
                return condition;
            }
        }
        return null;
    };

    function gameOver(gameResult, winningCells = null){
        if (gameResult){
            if (currentPlayer.getMarker()==="X"){
                displayController.declareResult(1, winningCells);
            } else if (currentPlayer.getMarker()==="O"){
                displayController.declareResult(2, winningCells);
            }
            gameFinished = true;
        }
        else if (!gameResult){
            displayController.declareResult(0);
            gameFinished = true;
        }
    };

    function isGameFinished(){
        return gameFinished;
    }

    function resetGame(){
        gameFinished = false;
        gameBoard.resetBoard();
    }

    return {makeMove, checkWin, resetGame, getCurrentPlayerMarker, isGameFinished};
})();

const displayController = (() => {
    function startGame(){
        const startButton = document.querySelector('.start-button');
        startButton.addEventListener("click", () => {
            createGrid();
            startButton.remove();
        });
    }
    let startFlag = false;

    function createGrid(){
        // to prevent the function from creating multipe playing boards.
        if (startFlag){
            return;
        }
        const gameContainer = document.querySelector(".game-container");
        const gameGrid = document.createElement("div");
        gameGrid.classList.add("game-grid");
        gameContainer.append(gameGrid);
        for (let i = 1; i < 10; i++){
            const cell = document.createElement("div");
            cell.classList.add('cell');
            gameGrid.append(cell);
        }
        startFlag = true;

        markMove();
        updateTurnIndicator();
    }

    function markMove(){
        const gameGrid = document.querySelector('.game-grid');
        const cells = gameGrid.children;
        [...cells].forEach((cell, index) => {
            cell.addEventListener("click", () => {
                gameController.makeMove(index)
                showBoard();
                updateTurnIndicator();
            });
        });
    }

    function createX() {
        const svgNS = "http://www.w3.org/2000/svg";

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 25 25");
        svg.classList.add("mark-svg");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute(
            "d",
            "M18.5 6.5 L6.5 18.5 M6.5 6.5 L18.5 18.5"
        );
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "2.5");
        path.setAttribute("stroke-linecap", "round");

        svg.appendChild(path);
        return svg;
    }

    function createO() {
        const svgNS = "http://www.w3.org/2000/svg";

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.classList.add("mark-svg");

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "9");
        circle.setAttribute("stroke", "currentColor");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("fill", "none");

        svg.appendChild(circle);
        return svg;
    }


    function showBoard(){
        const gameGrid = document.querySelector('.game-grid');
        const cells = [...gameGrid.children];        
        const board = gameBoard.getBoard();
        board.forEach((mark, index) => {
            if (mark === ''){
                return;
            } 
            if (cells[index].hasChildNodes()){
                return;
            }
            if (mark === 'X'){
                cells[index].appendChild(createX());
            } else if (mark === 'O'){
                cells[index].appendChild(createO());
            }
        })
    }

    // 0 -> draw, 1 -> player1 wins, 2-> player2
    function declareResult(number, winningCells = null){
        const gameContainer = document.querySelector('.game-container');
        const winnerDeclaration = document.createElement("p");
        if (number === 0){
            winnerDeclaration.textContent = "It's a draw!!"
        } else if (number === 1){
            winnerDeclaration.textContent = "Player 1 WON!!"
        } else if (number === 2){
            winnerDeclaration.textContent = "Player 2 WON !!"
        }
        gameContainer.appendChild(winnerDeclaration);
        if (winningCells){
            highlightWinningCells(winningCells);
        }
        createReplayButton(gameContainer);
    }

    function highlightWinningCells(winningCells){
        const gameGrid = document.querySelector(".game-grid");
        const cells = [...gameGrid.children];
        winningCells.forEach((index) => {
            cells[index].classList.add("highlight");
        })

    }

    function createReplayButton(gameContainer){
        const replayButton = document.createElement('button');
        replayButton.classList.add('play-again-button');
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add("play-again-svg");
        svg.setAttribute("viewBox", "0 -2 32 32");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute("d", "M445.67,635 L443.841,635 C442.868,628.218 437.051,623 430,623 C424.551,623 419.841,626.12 417.527,630.664 L421.282,632.108 C422.996,629.062 426.255,627 430,627 C434.838,627 438.873,630.436 439.799,635 L437.389,635 C437.079,635.301 436.783,635.486 437.227,636.007 L440.957,639.801 C441.267,640.101 441.768,640.101 442.076,639.801 L445.832,636.007 C446.141,635.706 445.979,635.301 445.67,635 Z M430,647 C425.522,647 421.733,644.057 420.459,640 L422.647,640 C422.957,639.7 423.118,639.294 422.81,638.994 L419.054,635.199 C418.745,634.899 418.244,634.899 417.935,635.199 L414.204,638.994 C413.761,639.515 414.057,639.7 414.366,640 L416.199,640 C417.284,645.933 423.041,651 430,651 C435.093,651 439.537,648.271 441.987,644.205 L438.202,642.711 C436.396,645.302 433.397,647 430,647 Z");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("transform", "translate(-414 -623)");
        svg.appendChild(path)
        const playButtonText = document.createElement("p");
        playButtonText.textContent = "Play Again?";
        replayButton.append(svg, playButtonText);
        gameContainer.appendChild(replayButton);

        replayButton.addEventListener("click", () => {
            gameController.resetGame();
            displayBoardReset();
        });
    }
    
    function displayBoardReset(){
        const gameGrid = document.querySelector(".game-grid");
        const cells = [...gameGrid.children];
        cells.forEach((cell) => {
            cell.innerHTML = "";
            cell.classList.remove("highlight");
        });
        const gameContainer = document.querySelector('.game-container');
        gameContainer.removeChild(gameContainer.children[2]);
        gameContainer.removeChild(gameContainer.children[1]);
        updateTurnIndicator();
    }

    function updateTurnIndicator(){
        const player1Indicator = document.querySelector(".player-1-turn");
        const player2Indicator = document.querySelector(".player-2-turn");
        if (gameController.isGameFinished()){
            player1Indicator.classList.remove("active");
            player2Indicator.classList.remove("active");
            return;
        }
        const currentTurn = gameController.getCurrentPlayerMarker();
        if (currentTurn === "X"){
            player1Indicator.classList.add("active");
            player2Indicator.classList.remove("active");
        } else if (currentTurn === "O"){
            player2Indicator.classList.add("active");
            player1Indicator.classList.remove("active");
        }
    }

    return {startGame, declareResult};
})();

displayController.startGame();