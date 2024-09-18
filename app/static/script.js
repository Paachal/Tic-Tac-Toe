const cells = document.querySelectorAll('[data-cell]');
const websocket = new WebSocket('ws://localhost:8000/ws');

let currentPlayer = 'X';
let board = Array(9).fill(null);
let isGameActive = true;
let turnTimeout;

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (board[index] || !isGameActive) return;

    makeMove(cell, index);
}

function makeMove(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    websocket.send(JSON.stringify({ index, player: currentPlayer }));

    if (checkWin(currentPlayer)) {
        alert(`${currentPlayer} wins!`);
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        alert('Draw!');
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Reset turn timeout
    clearTimeout(turnTimeout);
    turnTimeout = setTimeout(() => {
        alert(`${currentPlayer === 'X' ? 'O' : 'X'} wins due to timeout!`);
        isGameActive = false;
    }, 15000); // 15 seconds
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === player;
        });
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

websocket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    const cell = cells[message.index];

    if (board[message.index] || !isGameActive) return;

    board[message.index] = message.player;
    cell.textContent = message.player;

    if (checkWin(message.player)) {
        alert(`${message.player} wins!`);
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        alert('Draw!');
        isGameActive = false;
        return;
    }

    currentPlayer = message.player === 'X' ? 'O' : 'X';

    // Reset turn timeout
    clearTimeout(turnTimeout);
    turnTimeout = setTimeout(() => {
        alert(`${currentPlayer === 'X' ? 'O' : 'X'} wins due to timeout!`);
        isGameActive = false;
    }, 15000); // 15 seconds
};
