// List of emojis to use for the cards (8 pairs = 16 cards)
const emojis = [
  '🍕', '🐶', '🌈', '🚗', '🎈', '🍦', '⚽', '🌻'
];

// Store the deck of cards (each emoji appears twice)
let deck = [];

// Store the state of the game
let flippedCards = []; // Cards currently flipped
let matchedCards = []; // Indices of matched cards
let moves = 0; // Number of moves
let canFlip = true; // Control flipping during timeout

// Get DOM elements
const grid = document.querySelector('#game-grid');
const moveCounter = document.querySelector('#move-counter');
const winMessage = document.querySelector('#win-message');
const restartBtn = document.querySelector('#restart-btn');

// Function to shuffle an array
function shuffle(array) {
  // Loop through the array backwards
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index before i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Function to start or restart the game
function startGame() {
  // Create a deck with each emoji twice
  deck = [];
  for (let i = 0; i < emojis.length; i++) {
    deck.push(emojis[i]);
    deck.push(emojis[i]);
  }
  // Shuffle the deck
  shuffle(deck);

  // Reset game state
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  canFlip = true;
  moveCounter.textContent = moves;
  winMessage.classList.remove('show');

  // Render the cards
  renderGrid();
}

// Function to render the grid of cards
function renderGrid() {
  // Clear the grid
  grid.innerHTML = '';
  // Loop through the deck and create card elements
  for (let i = 0; i < deck.length; i++) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = i;

    // Create inner container for flipping
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    // Create front (hidden face)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = '?';

    // Create back (emoji)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = deck[i];

    // Add front and back to inner container
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    // Add inner container to card
    card.appendChild(cardInner);

    // Add click event to card
    card.addEventListener('click', function() {
      flipCard(card, i);
    });

    // Add card to grid
    grid.appendChild(card);
  }
}

// Function to handle card flipping
function flipCard(card, index) {
  // If card is already matched or flipped, do nothing
  if (!canFlip) {
    return;
  }
  if (matchedCards.indexOf(index) !== -1) {
    return;
  }
  if (flippedCards.length === 2) {
    return;
  }
  if (flippedCards.indexOf(index) !== -1) {
    return;
  }

  // Flip the card
  card.classList.add('flipped');
  flippedCards.push(index);

  // If two cards are flipped, check for match
  if (flippedCards.length === 2) {
    canFlip = false; // Disable further flips
    moves += 1;
    moveCounter.textContent = moves;

    // Get the two flipped cards
    const firstIndex = flippedCards[0];
    const secondIndex = flippedCards[1];

    // Check if emojis match
    if (deck[firstIndex] === deck[secondIndex]) {
      // Match found
      matchedCards.push(firstIndex);
      matchedCards.push(secondIndex);

      // Add matched style
      setTimeout(function() {
        const cards = document.querySelectorAll('.card');
        cards[firstIndex].classList.add('matched');
        cards[secondIndex].classList.add('matched');
        resetFlipped();
        checkWin();
      }, 600);
    } else {
      // No match, flip back after delay
      setTimeout(function() {
        const cards = document.querySelectorAll('.card');
        cards[firstIndex].classList.remove('flipped');
        cards[secondIndex].classList.remove('flipped');
        resetFlipped();
      }, 900);
    }
  }
}

// Function to reset flipped cards
function resetFlipped() {
  flippedCards = [];
  canFlip = true;
}

// Function to check win condition
function checkWin() {
  if (matchedCards.length === deck.length) {
    winMessage.classList.add('show');
  }
}

// Add event listener to restart button
restartBtn.addEventListener('click', function() {
  startGame();
});

// Start the game when the page loads
startGame();
