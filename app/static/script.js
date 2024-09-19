let timer = 15;
setInterval(() => {
    if (timer > 0) {
        timer--;
        document.getElementById('timer').innerText = timer;
    } else {
        alert('Time up! Opponent wins.');
        // Handle timeout logic
    }
}, 1000);

// Implement the game logic here
