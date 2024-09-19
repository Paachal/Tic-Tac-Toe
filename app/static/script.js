document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const mode = document.querySelector('h1').textContent.split(' ')[2].toLowerCase();

    if (mode === 'local' || mode === 'nearby') {
        const player1 = prompt('Enter Player 1 name:');
        const player2 = prompt('Enter Player 2 name:');
        startGame(player1, player2, mode);
    }

    board.addEventListener('click', event => {
        if (event.target.tagName === 'DIV') {
            makeMove(event.target.dataset.row, event.target.dataset.col);
        }
    });
});

async function startGame(player1, player2, mode) {
    const response = await fetch('/game/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ player1, player2, mode })
    });

    const data = await response.json();
    renderBoard(data.board);
}

function renderBoard(board) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            cellElement.textContent = cell;
            gameBoard.appendChild(cellElement);
        });
    });
}

async function makeMove(row, col) {
    const game_id = localStorage.getItem('game_id');
    const player = localStorage.getItem('player');
    const response = await fetch('/game/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ game_id, row, col, player })
    });

    const data = await response.json();
    renderBoard(data.board);
}
