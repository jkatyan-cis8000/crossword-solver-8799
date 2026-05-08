class CrosswordUI {
    constructor(game) {
        this.game = game;
        this.gridElement = document.getElementById('crossword-grid');
        this.acrossCluesElement = document.getElementById('across-clues');
        this.downCluesElement = document.getElementById('down-clues');
        this.inputForm = document.getElementById('word-input-form');
        this.clueNumberInput = document.getElementById('clue-number');
        this.directionInput = document.getElementById('direction');
        this.wordInput = document.getElementById('word');
        this.validationFeedback = document.getElementById('validation-feedback');
        this.completionMessage = document.getElementById('completion-message');
        this.resetButton = document.getElementById('reset-puzzle');
        
        this.activeCell = null;
        
        this.init();
    }
    
    init() {
        this.renderGrid();
        this.renderClues();
        this.attachEventListeners();
    }
    
    renderGrid() {
        const grid = this.game.getGrid();
        const tbody = this.gridElement.querySelector('tbody');
        tbody.innerHTML = '';
        
        for (let row = 0; row < grid.length; row++) {
            const tr = document.createElement('tr');
            
            for (let col = 0; col < grid[row].length; col++) {
                const cell = document.createElement('td');
                const cellData = grid[row][col];
                
                if (cellData === null || cellData === '') {
                    cell.classList.add('black-square');
                } else {
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    
                    if (this.activeCell && 
                        this.activeCell.row === row && 
                        this.activeCell.col === col) {
                        cell.classList.add('active-cell');
                    }
                    
                    const cellObj = this.game.getGridCellData(row, col);
                    if (cellObj && cellObj.number) {
                        const numberSpan = document.createElement('span');
                        numberSpan.className = 'cell-number';
                        numberSpan.textContent = cellObj.number;
                        cell.appendChild(numberSpan);
                    }
                    
                    if (cellData && cellData !== null) {
                        cell.textContent = cellData;
                        cell.classList.add('filled');
                    } else {
                        cell.classList.add('empty');
                    }
                }
                
                tr.appendChild(cell);
            }
            
            tbody.appendChild(tr);
        }
    }
    
    renderClues() {
        const clues = this.game.getClues();
        
        this.acrossCluesElement.innerHTML = '';
        this.downCluesElement.innerHTML = '';
        
        clues.forEach(clue => {
            const li = document.createElement('li');
            li.dataset.number = clue.number;
            li.dataset.direction = clue.direction;
            
            li.innerHTML = `<span class="clue-number">${clue.number}</span> ${clue.text}`;
            
            if (clue.solved) {
                li.classList.add('solved');
            }
            
            li.addEventListener('click', () => {
                this.selectClue(clue.number, clue.direction);
            });
            
            if (clue.direction === 'across') {
                this.acrossCluesElement.appendChild(li);
            } else {
                this.downCluesElement.appendChild(li);
            }
        });
    }
    
    attachEventListeners() {
        this.inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWordSubmit();
        });
        
        this.gridElement.addEventListener('click', (e) => {
            const cell = e.target.closest('td');
            if (cell && !cell.classList.contains('black-square')) {
                this.selectCell(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
            }
        });
        
        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });
        
        document.addEventListener('keydown', (e) => {
            if (!this.activeCell) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    this.moveSelection(0, -1);
                    break;
                case 'ArrowDown':
                    this.moveSelection(0, 1);
                    break;
                case 'ArrowLeft':
                    this.moveSelection(-1, 0);
                    break;
                case 'ArrowRight':
                    this.moveSelection(1, 0);
                    break;
                case 'Backspace':
                    this.handleBackspace();
                    break;
            }
        });
        
        this.wordInput.addEventListener('input', (e) => {
            this.validateWordInput(e.target.value);
        });
    }
    
    selectCell(row, col) {
        this.activeCell = { row, col };
        this.renderGrid();
        this.highlightClueForCell(row, col);
    }
    
    selectClue(number, direction) {
        const cell = this.game.getCellForClue(number, direction);
        if (cell) {
            this.selectCell(cell.row, cell.col);
        }
    }
    
    highlightClueForCell(row, col) {
        const clues = this.game.getClues();
        const activeLetter = this.game.getLetterAt(row, col);
        
        clues.forEach(clue => {
            const element = Array.from(document.querySelectorAll('.clue-list li')).find(
                li => parseInt(li.dataset.number) === clue.number &&
                      li.dataset.direction === clue.direction
            );
            
            if (element) {
                if (this.game.isClueActive(clue.number, clue.direction, row, col)) {
                    element.style.backgroundColor = '#e3f2fd';
                } else {
                    element.style.backgroundColor = '';
                }
            }
        });
    }
    
    moveSelection(deltaCol, deltaRow) {
        if (!this.activeCell) return;
        
        const newRow = this.activeCell.row + deltaRow;
        const newCol = this.activeCell.col + deltaCol;
        
        if (this.isValidPosition(newRow, newCol)) {
            this.selectCell(newRow, newCol);
        }
    }
    
    isValidPosition(row, col) {
        const grid = this.game.getGrid();
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
            return false;
        }
        return grid[row][col] !== null && grid[row][col] !== '';
    }
    
    handleBackspace() {
        if (!this.activeCell) return;
        
        this.game.clearLetterAt(this.activeCell.row, this.activeCell.col);
        this.renderGrid();
        this.clearValidationFeedback();
    }
    
    handleWordSubmit() {
        const clueNumber = parseInt(this.clueNumberInput.value);
        const direction = this.directionInput.value;
        const word = this.wordInput.value.trim().toUpperCase();
        
        if (!word) {
            this.showValidationFeedback('Please enter a word.', 'warning');
            return;
        }
        
        const result = this.game.submitWord(clueNumber, direction, word);
        
        if (result.valid) {
            this.showValidationFeedback('Word accepted!', 'success');
            this.wordInput.value = '';
            this.clueNumberInput.value = '';
            this.renderGrid();
            this.renderClues();
            this.clearValidationFeedback();
            
            if (this.game.isComplete()) {
                this.showCompletionMessage();
            }
        } else {
            this.showValidationFeedback(result.message || 'Invalid word.', 'error');
        }
    }
    
    validateWordInput(word) {
        if (word.length > 0) {
            this.showValidationFeedback('Checking...', 'warning');
        } else {
            this.clearValidationFeedback();
        }
    }
    
    showValidationFeedback(message, type) {
        this.validationFeedback.textContent = message;
        this.validationFeedback.className = `validation-feedback ${type}`;
        
        setTimeout(() => {
            this.clearValidationFeedback();
        }, 3000);
    }
    
    clearValidationFeedback() {
        this.validationFeedback.textContent = '';
        this.validationFeedback.className = 'validation-feedback';
    }
    
    showCompletionMessage() {
        this.completionMessage.classList.remove('hidden');
    }
    
    hideCompletionMessage() {
        this.completionMessage.classList.add('hidden');
    }
    
    resetGame() {
        this.hideCompletionMessage();
        this.game.reset();
        this.renderGrid();
        this.renderClues();
        this.clearValidationFeedback();
    }
}

let crosswordUI;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CrosswordGame !== 'undefined') {
        const game = new CrosswordGame();
        crosswordUI = new CrosswordUI(game);
    }
});
