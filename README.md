# Crossword Solver

A web-based crossword puzzle game where users fill in words by clue number and direction, with validation and completion confirmation.

## Features

- Interactive 10x10 crossword grid
- Clue display for across and down entries
- Word validation with visual feedback
- Completion detection with celebration message
- Sample puzzle included for immediate testing

## Files

- `index.html` - Main HTML structure
- `crossword.js` - Core game logic (grid, words, validation)
- `styles.css` - CSS styling for the application
- `ui.js` - User interface event handling
- `tests/test-crossword.js` - Test suite for game logic

## Running the Application

1. Open `index.html` in a web browser
2. Select a clue number and direction (Across or Down)
3. Enter the word in the input field
4. Click "Submit Word" to validate
5. Continue until the puzzle is complete

## Game Logic

The game validates each word entry against the correct answer. When a word is correct:
- The grid cells are filled with the word's letters
- The clue is marked as solved in the clues list
- The word can no longer be edited

## Architecture

### CrosswordGame Class

Manages the game state including:
- Grid management (10x10 cells)
- Word storage with clues
- Validation of word entries
- Completion detection

### UI Module

Handles user interface:
- Grid rendering
- Clue display and selection
- Form handling and validation feedback
- Completion message display

## Testing

Run the test suite with Node.js:

```bash
node tests/test-crossword.js
```

The tests validate:
- Grid initialization
- Word entry creation
- Validation of correct and incorrect words
- Grid state management
- Clue retrieval
- Reset functionality
