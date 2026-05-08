# Crossword Solver Architecture

## Overview
A web-based crossword puzzle application where users fill in words by clue number and direction, with validation and completion confirmation.

## Modules

### 1. Core Game Logic (`crossword.js`)
**Responsibility:** Manages game state, grid, clues, and validation rules.

**Key Functions:**
- `createGrid(rows, cols)` - Initialize empty grid
- `addWord(word, row, col, direction, clueNumber)` - Add words to the puzzle
- `validateEntry(clueNumber, direction, word)` - Check if entry is correct
- `isComplete()` - Check if all words are filled correctly
- `getClue(clueNumber, direction)` - Get clue text by number and direction

**Exports:**
- `CrosswordGame` class with all game methods

### 2. User Interface (`index.html`, `styles.css`, `ui.js`)
**Responsibility:** Renders the game board and handles user interactions.

**Components:**
- Grid display (20x20 HTML table with styled cells)
- Clue sections (Across and Down lists)
- Input form for clue number and direction
- Word input field
- Validation feedback display

**Key Functions:**
- `renderGrid()` - Draw the puzzle grid
- `renderClues()` - Display clue lists
- `handleInput()` - Process user word entry
- `showValidationResult()` - Show success/failure feedback

### 3. Tests (`tests/test-crossword.js`)
**Responsibility:** Verify game logic correctness.

**Test Scenarios:**
- Valid word entry
- Invalid word entry
- Partial fills
- Completion detection
- Edge cases (empty grid, boundary conditions)

## Data Structures

### Grid Cell
```javascript
{
  row: number,
  col: number,
  letter: string | null,
  filled: boolean,
  belongsTo: number[] // clue numbers this cell belongs to
}
```

### Word Entry
```javascript
{
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down',
  clueNumber: number,
  length: number
}
```

## File Ownership
- `ARCHITECTURE.md` - Team lead
- `crossword.js` - Core module (teammate 1)
- `index.html`, `styles.css`, `ui.js` - UI module (teammate 2)
- `tests/test-crossword.js` - Tests (teammate 3)
- `README.md` - README (team lead)
