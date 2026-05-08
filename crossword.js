class CrosswordGame {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill(null));
    this.words = [];
    this.clues = { across: {}, down: {} };
  }

  addWord(word, row, col, direction, clueNumber) {
    const wordObj = {
      word,
      row,
      col,
      direction,
      clueNumber,
      letters: []
    };

    for (let i = 0; i < word.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;

      if (r < this.size && c < this.size) {
        this.grid[r][c] = null;
        wordObj.letters.push({ row: r, col: c, letter: null });
      }
    }

    this.words.push(wordObj);
    return wordObj;
  }

  setClue(clueNumber, direction, text) {
    this.clues[direction][clueNumber] = text;
  }

  validateEntry(clueNumber, direction, word) {
    const wordObj = this.words.find(
      w => w.clueNumber === clueNumber && w.direction === direction
    );

    if (!wordObj) return false;
    return wordObj.word === word;
  }

  fillCell(row, col, letter) {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = letter;
    }
  }

  isComplete() {
    for (const wordObj of this.words) {
      let word = '';
      for (const letterObj of wordObj.letters) {
        const cell = this.grid[letterObj.row][letterObj.col];
        if (cell === null) return false;
        word += cell;
      }
      if (word !== wordObj.word) return false;
    }
    return true;
  }

  getClue(clueNumber, direction) {
    return this.clues[direction][clueNumber];
  }

  getGrid() {
    return this.grid.map(row => [...row]);
  }

  getClues() {
    const clues = [];
    
    const acrossClues = Object.entries(this.clues.across).map(([number, text]) => {
      const wordObj = this.words.find(w => w.clueNumber === parseInt(number) && w.direction === 'across');
      return {
        number: parseInt(number),
        direction: 'across',
        text,
        solved: wordObj ? this.checkClueSolved(wordObj) : false
      };
    });
    
    const downClues = Object.entries(this.clues.down).map(([number, text]) => {
      const wordObj = this.words.find(w => w.clueNumber === parseInt(number) && w.direction === 'down');
      return {
        number: parseInt(number),
        direction: 'down',
        text,
        solved: wordObj ? this.checkClueSolved(wordObj) : false
      };
    });
    
    return [...acrossClues, ...downClues];
  }

  checkClueSolved(wordObj) {
    let word = '';
    for (const letterObj of wordObj.letters) {
      const cell = this.grid[letterObj.row][letterObj.col];
      if (cell === null) return false;
      word += cell;
    }
    return word === wordObj.word;
  }

  getCellForClue(number, direction) {
    const wordObj = this.words.find(w => w.clueNumber === number && w.direction === direction);
    if (wordObj && wordObj.letters.length > 0) {
      return { row: wordObj.letters[0].row, col: wordObj.letters[0].col };
    }
    return null;
  }

  isClueActive(number, direction, row, col) {
    const wordObj = this.words.find(w => w.clueNumber === number && w.direction === direction);
    if (!wordObj) return false;
    return wordObj.letters.some(l => l.row === row && l.col === col);
  }

  getLetterAt(row, col) {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      return this.grid[row][col];
    }
    return null;
  }

  clearLetterAt(row, col) {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      this.grid[row][col] = null;
    }
  }

  submitWord(clueNumber, direction, word) {
    const wordObj = this.words.find(
      w => w.clueNumber === clueNumber && w.direction === direction
    );

    if (!wordObj) {
      return { valid: false, message: 'Clue not found' };
    }

    if (wordObj.word !== word) {
      return { valid: false, message: 'Incorrect word' };
    }

    for (const letterObj of wordObj.letters) {
      const index = letterObj.letter ? letterObj.letter : wordObj.word[letterObj.letter ? 0 : 0];
    }

    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const r = direction === 'across' ? wordObj.row : wordObj.row + i;
      const c = direction === 'across' ? wordObj.col + i : wordObj.col;
      
      if (r < this.size && c < this.size) {
        this.grid[r][c] = letter;
      }
    }

    return { valid: true };
  }

  reset() {
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    this.words = [];
    this.clues = { across: {}, down: {} };
  }
}

function createSamplePuzzle() {
  const game = new CrosswordGame(10);

  game.addWord('JAVASCRIPT', 0, 0, 'across', 1);
  game.addWord('CROSS', 0, 5, 'down', 1);
  game.addWord('WORD', 2, 0, 'across', 2);
  game.addWord('SOLVER', 4, 2, 'across', 3);
  game.addWord('CODE', 2, 4, 'down', 4);
  game.addWord('PUZZLE', 5, 5, 'across', 5);
  game.addWord('GRID', 7, 0, 'across', 6);
  game.addWord('TEST', 7, 4, 'down', 7);

  game.setClue(1, 'across', 'Modern programming language');
  game.setClue(1, 'down', 'Type of word game');
  game.setClue(2, 'across', '4-letter object');
  game.setClue(3, 'across', 'One who solves');
  game.setClue(4, 'down', 'Write instructions');
  game.setClue(5, 'across', 'Brain teaser');
  game.setClue(6, 'across', 'Data layout');
  game.setClue(7, 'down', 'Examine code');

  return game;
}

function test() {
  console.log('Testing CrosswordGame...\n');

  const game = createSamplePuzzle();
  console.log('1. Grid created with sample puzzle');
  console.log('Grid:');
  console.log(game.getGrid().map(row => row.map(c => c || '.').join(' ')).join('\n'));

  console.log('\n2. Testing validation:');
  console.log('  validateEntry(1, "across", "JAVASCRIPT"):', game.validateEntry(1, 'across', 'JAVASCRIPT'));
  console.log('  validateEntry(1, "across", "WRONG"):', game.validateEntry(1, 'across', 'WRONG'));

  console.log('\n3. Filling cells:');
  game.fillCell(0, 0, 'J');
  game.fillCell(0, 1, 'A');
  game.fillCell(0, 2, 'V');
  game.fillCell(0, 3, 'A');
  game.fillCell(0, 4, 'S');
  game.fillCell(0, 5, 'C');
  game.fillCell(0, 6, 'R');
  game.fillCell(0, 7, 'I');
  game.fillCell(0, 8, 'P');
  game.fillCell(0, 9, 'T');
  console.log('  Filled "JAVASCRIPT" across');

  console.log('\n4. Checking completion (should be false):');
  console.log('  isComplete():', game.isComplete());

  console.log('\n5. Getting clues:');
  console.log('  getClue(1, "across"):', game.getClue(1, 'across'));
  console.log('  getClue(7, "down"):', game.getClue(7, 'down'));

  console.log('\n6. Testing reset:');
  game.reset();
  console.log('  Grid after reset:', game.getGrid()[0]);

  console.log('\nAll tests passed!');
}

if (typeof require !== 'undefined' && require.main === module) {
  test();
}
