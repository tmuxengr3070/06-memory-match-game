// Array of emojis for the cards
const emojis = ['🍕', '🍕', '🍎', '🍎', '🎸', '🎸', '🚀', '🚀', '🐱', '🐱', '⚽', '⚽', '🎩', '🎩', '🎃', '🎃'];

// Variables to keep track of the game state
let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let boardLocked = false; // Flag to prevent clicking during check

// Function to shuffle the cards using Fisher-Yates algorithm
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Function to create the game board
function createBoard() {
    const gameBoard = document.querySelector('#gameBoard');
    gameBoard.innerHTML = '';
    const shuffledEmojis = shuffle([...emojis]);
    shuffledEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Function to flip a card
function flipCard() {
    // Prevent clicking the same card twice, clicking already matched cards, or clicking during check
    if (this === firstCard || this.classList.contains('flipped') || this.classList.contains('matched') || boardLocked) {
        return;
    }
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;

    if (!firstCard) {
        // If no card is flipped, set this card as the first card
        firstCard = this;
    } else {
        // If one card is already flipped, set this card as the second card
        secondCard = this;
        moves += 1;
        document.querySelector('#moveCounter').textContent = moves;
        checkForMatch();
    }
}

// Function to check if two flipped cards match
function checkForMatch() {
    if (firstCard && secondCard) {
        boardLocked = true; // Lock the board
        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
            // If the cards match, keep them flipped and add 'matched' class
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs += 1;
            resetCards();
            // Check if all pairs are matched
            if (matchedPairs === emojis.length / 2) {
                setTimeout(function() {
                    alert('You won!');
                }, 500);
            }
        } else {
            // If the cards do not match, flip them back after a short delay
            setTimeout(function() {
                if (firstCard && secondCard) {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard.textContent = '';
                    secondCard.textContent = '';
                    resetCards();
                }
            }, 1000);
        }
    }
}

// Function to reset the selected cards
function resetCards() {
    firstCard = null;
    secondCard = null;
    boardLocked = false; // Unlock the board
}

// Function to reset the game
function resetGame() {
    moves = 0;
    matchedPairs = 0;
    document.querySelector('#moveCounter').textContent = moves;
    createBoard();
}

// Add event listener to the reset button
document.querySelector('#resetButton').addEventListener('click', resetGame);

// Initialize the game board on page load
createBoard();
