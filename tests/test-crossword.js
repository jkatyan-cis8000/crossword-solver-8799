/**
 * Crossword Game Tests
 * Validates core game logic and functionality
 */

const CrosswordGame = require('./crossword.js');

function testCrosswordGame() {
    console.log("Running Crossword Game Tests...\n");
    
    const game = new CrosswordGame();
    let testsPassed = 0;
    let testsFailed = 0;
    
    function assert(condition, testName) {
        if (condition) {
            console.log(`✓ ${testName}`);
            testsPassed++;
        } else {
            console.log(`✗ ${testName}`);
            testsFailed++;
        }
    }
    
    function assertEqual(actual, expected, testName) {
        const pass = JSON.stringify(actual) === JSON.stringify(expected);
        if (pass) {
            console.log(`✓ ${testName}`);
            testsPassed++;
        } else {
            console.log(`✗ ${testName}`);
            console.log(`  Expected: ${JSON.stringify(expected)}`);
            console.log(`  Actual: ${JSON.stringify(actual)}`);
            testsFailed++;
        }
    }
    
    // Test 1: Grid initialization
    console.log("=== Grid Initialization ===");
    assert(game.grid.length === 10, "Grid has 10 rows");
    assert(game.grid[0].length === 10, "Grid has 10 columns");
    assertEqual(game.grid[0][0].row, 0, "First cell row is 0");
    assertEqual(game.grid[0][0].col, 0, "First cell column is 0");
    
    // Test 2: Word entries
    console.log("\n=== Word Entries ===");
    assert(game.words.length > 0, "Game has word entries");
    assertEqual(game.words[0].direction, "across", "First word is across");
    
    // Test 3: Validation - correct word
    console.log("\n=== Validation (Correct Word) ===");
    const result1 = game.validateEntry(1, "across", "CROSSWORD");
    assert(result1.valid === true, "Valid word returns valid: true");
    assertEqual(result1.message, "Correct!", "Correct word message");
    
    // Test 4: Validation - incorrect word
    console.log("\n=== Validation (Incorrect Word) ===");
    const result2 = game.validateEntry(1, "across", "WRONG");
    assert(result2.valid === false, "Invalid word returns valid: false");
    
    // Test 5: Completion status
    console.log("\n=== Completion Status ===");
    game.reset();
    assert(game.isComplete() === false, "Empty grid is not complete");
    
    // Fill a word and check
    game.validateEntry(1, "across", "CROSSWORD");
    
    // Test 6: Clue retrieval
    console.log("\n=== Clue Retrieval ===");
    const clue = game.getClue(1, "across");
    assert(clue.length > 0, "Clue exists for word 1 across");
    
    // Test 7: Grid state after validation
    console.log("\n=== Grid State After Validation ===");
    game.reset();
    game.validateEntry(1, "across", "CROSSWORD");
    for (let i = 0; i < "CROSSWORD".length; i++) {
        assert(game.grid[0][i].filled === true, `Cell at row 0, col ${i} is filled`);
    }
    
    // Test 8: Reset functionality
    console.log("\n=== Reset Functionality ===");
    game.reset();
    assert(game.isComplete() === false, "Reset makes grid incomplete");
    assert(game.words.length > 0, "Reset preserves word list");
    
    // Test 9: Cell-to-word mapping
    console.log("\n=== Cell-to-Word Mapping ===");
    const cellKey = "0,0";
    assert(game.cellToWords[cellKey], "Cell 0,0 has word mapping");
    
    // Test 10: Multiple direction validation
    console.log("\n=== Direction Validation ===");
    game.reset();
    game.validateEntry(2, "down", "CROSS");
    assert(game.grid[0][0].filled, "Down word fills correct cells");
    
    // Summary
    console.log("\n=== Test Summary ===");
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    return testsFailed === 0;
}

// Run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const success = testCrosswordGame();
    process.exit(success ? 0 : 1);
}

module.exports = { testCrosswordGame };
