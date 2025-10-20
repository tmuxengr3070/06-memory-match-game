// Emoji Memory Match Game JavaScript

// Array of emojis to use in the game
const emojis = ['🐶', '🍕', '🎈', '🌟', '🚗', '🍦', '🐱', '⚽'];

// Variables for game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// Get DOM elements
const gameBoard = document.querySelector('#game-board');
const moveCounter = document.querySelector('#move-counter');
const timerDisplay = document.querySelector('#timer');
const winMessage = document.querySelector('#win-message');
const finalStats = document.querySelector('#final-stats');
const restartBtn = document.querySelector('#restart-btn');
const restartBtnInGame = document.querySelector('#restart-btn-in-game');

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Function to start or restart the game
function startGame() {
  // Reset game state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  gameStarted = false;
  clearInterval(timerInterval);
  moveCounter.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  winMessage.classList.add('hidden');
  gameBoard.innerHTML = '';

  // Duplicate emojis to create pairs and shuffle
  const emojiPairs = emojis.concat(emojis);
  shuffle(emojiPairs);

  // Create card objects
  for (let i = 0; i < emojiPairs.length; i++) {
    const card = {
      id: i,
      emoji: emojiPairs[i],
      matched: false
    };
    cards.push(card);
  }

  // Render the cards on the board
  for (let i = 0; i < cards.length; i++) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.index = i;

    // Card inner for flip animation
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    // Card front (hidden state)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = '?';

    // Card back (shows emoji)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = cards[i].emoji;

    // Build card structure
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);

    // Add click event listener
    cardElement.addEventListener('click', onCardClick);

    // Add card to the game board
    gameBoard.appendChild(cardElement);
  }
}

// Function to handle card clicks
function onCardClick(event) {
  const cardElement = event.currentTarget;
  const index = parseInt(cardElement.dataset.index);

  // Start timer on first move
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Ignore clicks if already matched or already flipped
  if (cards[index].matched || cardElement.classList.contains('flipped')) {
    return;
  }

  // Ignore clicks if two cards are already flipped
  if (flippedCards.length === 2) {
    return;
  }

  // Flip the card
  cardElement.classList.add('flipped');
  flippedCards.push({ index: index, element: cardElement });

  // If two cards are flipped, check for match
  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;

    const first = flippedCards[0];
    const second = flippedCards[1];

    if (cards[first.index].emoji === cards[second.index].emoji) {
      // It's a match!
      cards[first.index].matched = true;
      cards[second.index].matched = true;
      first.element.classList.add('matched');
      second.element.classList.add('matched');
      matchedPairs++;

      // Clear flipped cards
      flippedCards = [];

      // Check for win
      if (matchedPairs === emojis.length) {
        endGame();
      }
    } else {
      // Not a match: shake and flip back after delay
      first.element.classList.add('shake');
      second.element.classList.add('shake');
      // Disable further clicks until cards flip back
      gameBoard.classList.add('no-click');

      setTimeout(function() {
        first.element.classList.remove('flipped', 'shake');
        second.element.classList.remove('flipped', 'shake');
        flippedCards = [];
        gameBoard.classList.remove('no-click');
      }, 900);
    }
  }
}

// Function to update the timer
function updateTimer() {
  timer++;
  timerDisplay.textContent = `Time: ${timer}s`;
}

// Function to end the game and show win message
function endGame() {
  clearInterval(timerInterval);
  winMessage.classList.remove('hidden');
  finalStats.textContent = `Moves: ${moves} | Time: ${timer}s`;
}

// Event listeners for restart buttons
restartBtn.addEventListener('click', function() {
  startGame();
});

restartBtnInGame.addEventListener('click', function() {
  startGame();
});

// Start the game when the page loads
startGame();
