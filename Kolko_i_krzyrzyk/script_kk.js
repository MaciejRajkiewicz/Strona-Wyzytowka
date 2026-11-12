let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let mode = "2players";
let playerSymbol = "X";
let botSymbol = "O";

const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function startGame() {
    mode = document.querySelector('input[name="mode"]:checked').value;
    playerSymbol = document.querySelector('input[name="symbol"]:checked').value;
    botSymbol = playerSymbol === "X" ? "O" : "X";

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    document.getElementById("settings").style.display = "none";
    document.getElementById("resetBtn").style.display = "inline";
    document.getElementById("status").innerHTML = "Kolej: " + currentPlayer;

    createBoard();

    if (mode === "bot" && playerSymbol === "O") {
        setTimeout(botMove, 400);
    }
}

function createBoard() {
    let html = "";
    for (let i = 0; i < 9; i++) {
        html += "<div onclick='cellClick(" + i + ")'>" + board[i] + "</div>";
    }
    document.getElementById("board").innerHTML = html;
}

function cellClick(index) {
    if (!gameActive || board[index] !== "") return;
    if (mode === "bot" && currentPlayer !== playerSymbol) return;

    board[index] = currentPlayer;
    createBoard();

    if (checkWin()) {
        document.getElementById("status").innerHTML = "Wygrywa: " + currentPlayer;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("status").innerHTML = "Remis";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").innerHTML = "Kolej: " + currentPlayer;

    if (mode === "bot" && currentPlayer === botSymbol) {
        setTimeout(botMove, 500);
    }
}

function botMove() {
    if (!gameActive) return;

    let move = findMove(botSymbol);
    if (move === -1) move = findMove(playerSymbol);
    if (move === -1) {
        let empty = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") empty.push(i);
        }
        move = empty[Math.floor(Math.random() * empty.length)];
    }

    board[move] = botSymbol;
    createBoard();

    if (checkWin()) {
        document.getElementById("status").innerHTML = "Wygrywa: " + botSymbol + " (bot)";
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("status").innerHTML = "Remis";
        gameActive = false;
        return;
    }

    currentPlayer = playerSymbol;
    document.getElementById("status").innerHTML = "Kolej: " + currentPlayer;
}

function findMove(symbol) {
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = symbol;
            if (checkWin()) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    return -1;
}

function checkWin() {
    for (let i = 0; i < wins.length; i++) {
        let a = wins[i][0];
        let b = wins[i][1];
        let c = wins[i][2];
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    document.getElementById("settings").style.display = "block";
    document.getElementById("resetBtn").style.display = "none";
    document.getElementById("board").innerHTML = "";
    document.getElementById("status").innerHTML = "";
    gameActive = false;
}