let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = [];
let player1Name = "";
let player2Name = "";
let player1Score = 0;
let player2Score = 0;
let roundCount = 0;
const roundsToWin = 3;

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const wrongDisplay = document.getElementById("wrong-letters");
const message = document.getElementById("message");
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");
const wordInputSection = document.getElementById("word-input");
const nameInputSection = document.getElementById("name-input");
const playAgainBtn = document.getElementById("play-again");

// Function to set the secret word and start the game
function setSecretWord() {
    // Validate player names (only ask for them once at the start)
    if (!player1Name || !player2Name) {
        player1Name = document.getElementById("player1-name").value.trim();
        player2Name = document.getElementById("player2-name").value.trim();

        if (!player1Name || !player2Name) {
            alert("Please enter both player names.");
            return;
        }

        nameInputSection.style.display = "none"; // Hide name input section after names are set
    }

    const input = document.getElementById("secret-word");
    const word = input.value.trim().toLowerCase();

    // Updated validation: Allow letters, spaces, and dashes
    if (!word || /[^a-z\s-]/.test(word)) {
        alert("Please enter a valid word with only letters, spaces, and dashes.");
        return;
    }

    selectedWord = word;
    guessedLetters = [];
    wrongGuesses = [];
    wordInputSection.style.display = "none"; // Hide word input after the word is set
    message.textContent = "";

    roundCount++;

    // Update word display after the word is set
    updateWordDisplay();
    updateKeyboard();
    updateWrongGuesses();
}




// Show the word with guessed letters
function updateWordDisplay() {
    wordDisplay.textContent = selectedWord
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
    checkWin();
}

// Create on-screen keyboard
function updateKeyboard() {
    keyboard.innerHTML = "";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (let char of alphabet) {
        const button = document.createElement("button");
        button.textContent = char;
        button.disabled = guessedLetters.includes(char) || wrongGuesses.includes(char);
        button.addEventListener("click", () => handleGuess(char));
        keyboard.appendChild(button);
    }
}

// Handle guesses
function handleGuess(letter) {
    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        if (!wrongGuesses.includes(letter)) {
            wrongGuesses.push(letter);
        }
    }
    updateWordDisplay();
    updateKeyboard();
    updateWrongGuesses();
    checkLose();
}

// Show wrong guesses and draw hangman
function updateWrongGuesses() {
    wrongDisplay.textContent = "Wrong guesses: " + wrongGuesses.join(", ");
    drawHangman(wrongGuesses.length);
}

// Check for win
function checkWin() {
    if (selectedWord.split("").every(letter => guessedLetters.includes(letter))) {
        message.textContent = `${player2Name} Wins Round ${roundCount}! 🎉`;
        player2Score++;
        disableAllButtons();
        updateScoreDisplay();
        if (player2Score >= roundsToWin) {
            declareWinner(player2Name);
        } else {
            playAgainBtn.style.display = "inline-block"; // Show the "Play Again" button
        }
    }
}

// Check for lose
function checkLose() {
    if (wrongGuesses.length >= 6) {
        message.textContent = `${player1Name} Wins Round ${roundCount}! 💀 The word was: ${selectedWord}`;
        player1Score++;
        disableAllButtons();
        updateScoreDisplay();
        if (player1Score >= roundsToWin) {
            declareWinner(player1Name);
        } else {
            playAgainBtn.style.display = "inline-block"; // Show the "Play Again" button
        }
    }
}

// Update scores
function updateScoreDisplay() {
    message.innerHTML += `<br>Score: <br>${player1Name}: ${player1Score} <br>${player2Name}: ${player2Score}`;
}

// Declare the winner (game ends)
function declareWinner(winnerName) {
    message.textContent = `${winnerName} is the Ultimate Winner! 🏆`;
    playAgainBtn.textContent = "Restart Game";
    playAgainBtn.style.display = "inline-block";
}

// Disable all buttons
function disableAllButtons() {
    const buttons = keyboard.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
}

// Restart the game (but keep the player names and scores)
function resetGame() {
    // Check if a player reached the required score (3 points)
    if (player1Score >= roundsToWin || player2Score >= roundsToWin) {
        // Show name input fields and allow changing names only if the game is over
        nameInputSection.style.display = "block"; // Show name input section
        document.getElementById("player1-name").value = "";
        document.getElementById("player2-name").value = "";
        player1Name = "";
        player2Name = "";

        // Reset player scores when the game ends
        player1Score = 0;
        player2Score = 0;

        // Update score display to show reset scores
        updateScoreDisplay();
    }

    // Reset game variables (round count, word, guesses, etc.)
    roundCount = 0;
    selectedWord = "";
    guessedLetters = [];
    wrongGuesses = [];
    wordDisplay.textContent = "";
    wrongDisplay.textContent = "Wrong guesses: ";
    message.textContent = "";

    // Hide "Play Again" button and reset UI for next game
    playAgainBtn.style.display = "none";
    wordInputSection.style.display = "block"; // Show word input again

    // Reset keyboard and canvas for new round
    updateKeyboard();
    updateWrongGuesses();
    canvas.width = canvas.width; // Clear canvas (hangman drawing)
}


// Keyboard support
document.addEventListener("keydown", (e) => {
    const letter = e.key.toLowerCase();
    if (/^[a-z]$/.test(letter) && selectedWord && !guessedLetters.includes(letter) && !wrongGuesses.includes(letter)) {
        handleGuess(letter);
    }
});

// Draw gallows
function drawGallows() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(10, 240); ctx.lineTo(190, 240); // base
    ctx.moveTo(50, 240); ctx.lineTo(50, 20);   // pole
    ctx.lineTo(150, 20);                      // top bar
    ctx.lineTo(150, 40);                      // rope
    ctx.stroke();
}

// Draw each part of the hangman
function drawHangman(wrongCount) {
    drawGallows();

    if (wrongCount > 0) {
        ctx.beginPath(); ctx.arc(150, 60, 20, 0, Math.PI * 2); ctx.stroke(); // head
    }
    if (wrongCount > 1) {
        ctx.beginPath(); ctx.moveTo(150, 80); ctx.lineTo(150, 140); ctx.stroke(); // body
    }
    if (wrongCount > 2) {
        ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(130, 120); ctx.stroke(); // left arm
    }
    if (wrongCount > 3) {
        ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(170, 120); ctx.stroke(); // right arm
    }
    if (wrongCount > 4) {
        ctx.beginPath(); ctx.moveTo(150, 140); ctx.lineTo(130, 170); ctx.stroke(); // left leg
    }
    if (wrongCount > 5) {
        ctx.beginPath(); ctx.moveTo(150, 140); ctx.lineTo(170, 170); ctx.stroke(); // right leg
    }
}
