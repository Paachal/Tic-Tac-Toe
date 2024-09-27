document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const winLine = document.getElementById('win-line');
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    const isSinglePlayer = window.location.search.includes('difficulty');

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWinner = () => {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return { winner: boardState[a], combination };
            }
        }
        return boardState.includes(null) ? null : { winner: 'Tie' };
    };

    const drawWinLine = (combination) => {
        const lineCoords = {
            0: [15, 50, 285, 50],
            1: [15, 150, 285, 150],
            2: [15, 250, 285, 250],
            3: [50, 15, 50, 285],
            4: [150, 15, 150, 285],
            5: [250, 15, 250, 285],
            6: [15, 15, 285, 285],
            7: [15, 285, 285, 15]
        };

        const index = winningCombinations.findIndex(combo => combo.toString() === combination.toString());
        if (index !== -1) {
            const ctx = winLine.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(lineCoords[index][0], lineCoords[index][1]);
            ctx.lineTo(lineCoords[index][2], lineCoords[index][3]);
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    };

    const handleClick = (e) => {
        const index = e.target.dataset.index;
        if (!boardState[index]) {
            boardState[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            const result = checkWinner();
            if (result) {
                if (result.winner !== 'Tie') {
                    drawWinLine(result.combination);
                }
                alert(`Winner: ${result.winner}`);
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (isSinglePlayer && currentPlayer === 'O') {
                    makeComputerMove();
                }
            }
        }
    };

    const resetGame = () => {
        boardState = Array(9).fill(null);
        cells.forEach(cell => cell.textContent = '');
        const ctx = winLine.getContext('2d');
        ctx.clearRect(0, 0, winLine.width, winLine.height);
        currentPlayer = 'X';
    };

    const makeComputerMove = () => {
        const emptyIndices = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        boardState[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        const result = checkWinner();
        if (result) {
            if (result.winner !== 'Tie') {
                drawWinLine(result.combination);
            }
            alert(`Winner: ${result.winner}`);
            resetGame();
        } else {
            currentPlayer = 'X';
        }
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
});
