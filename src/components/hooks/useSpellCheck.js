import { useState } from "react";

/**
 * Custom hook for dictionary-based spell checking functionality
 * Provides word checking, suggestions, and dictionary management
 * 
 * @param {Array} wordCollection - Initial dictionary of correctly spelled words
 * @returns {Object} Spell check functions and state variables
 */
function useSpellCheck(wordCollection = []) {
  // State management for spell checking functionality
  const [wordDictionary, setWordDictionary] = useState(wordCollection);
  const [textToCheck, setTextToCheck] = useState("");
  const [newDictionaryEntry, setNewDictionaryEntry] = useState("");
  const [suggestionResults, setSuggestionResults] = useState([]);
  
  /**
   * Calculates edit distance between two words using dynamic programming
   * Implementation of Levenshtein distance algorithm optimized for spell checking
   * 
   * @param {string} source - Word to check
   * @param {string} target - Dictionary word to compare against
   * @returns {number} Minimum edit distance between words
   */
  const measureEditDistance = (source, target) => {
    const sourceLength = source.length;
    const targetLength = target.length;
    
    // Initialize distance matrix
    const distanceMatrix = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(0));
    
    // Base cases: transforming to/from empty string
    for (let i = 0; i <= sourceLength; i++) distanceMatrix[i][0] = i;
    for (let j = 0; j <= targetLength; j++) distanceMatrix[0][j] = j;
    
    // Fill matrix using dynamic programming approach
    for (let i = 1; i <= sourceLength; i++) {
      for (let j = 1; j <= targetLength; j++) {
        if (source[i - 1] === target[j - 1]) {
          // Characters match - no operation needed
          distanceMatrix[i][j] = distanceMatrix[i - 1][j - 1];
        } else {
          // Find minimum cost operation
          distanceMatrix[i][j] = Math.min(
            distanceMatrix[i - 1][j - 1] + 1, // Replace operation
            distanceMatrix[i][j - 1] + 1,     // Insert operation
            distanceMatrix[i - 1][j] + 1      // Delete operation
          );
        }
      }
    }
    
    // Return final distance (bottom-right cell)
    return distanceMatrix[sourceLength][targetLength];
  };
  
  /**
   * Generates detailed transformation steps for visualization
   * Creates a step-by-step representation of operations needed to transform source to target
   * 
   * @param {string} source - Original word
   * @param {string} target - Target word
   * @returns {Array} Sequence of transformation steps
   */
  const createTransformationSteps = (source, target) => {
    const sourceLength = source.length;
    const targetLength = target.length;
    
    // Initialize distance tracking matrix
    const distanceMatrix = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(0));
    
    // Initialize operation tracking matrix
    const operationTracker = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(null));
    
    // Setup base cases
    for (let i = 0; i <= sourceLength; i++) {
      distanceMatrix[i][0] = i;
      if (i > 0) operationTracker[i][0] = { type: "delete", cost: 1 };
    }
    
    for (let j = 0; j <= targetLength; j++) {
      distanceMatrix[0][j] = j;
      if (j > 0) operationTracker[0][j] = { type: "insert", cost: 1 };
    }
    
    // Fill the matrices
    for (let i = 1; i <= sourceLength; i++) {
      for (let j = 1; j <= targetLength; j++) {
        if (source[i - 1] === target[j - 1]) {
          // Characters match
          distanceMatrix[i][j] = distanceMatrix[i - 1][j - 1];
          operationTracker[i][j] = { type: "match", cost: 0 };
        } else {
          // Calculate costs for each operation
          const replaceCost = distanceMatrix[i - 1][j - 1] + 1;
          const insertCost = distanceMatrix[i][j - 1] + 1;
          const deleteCost = distanceMatrix[i - 1][j] + 1;
          
          // Choose minimum cost operation
          distanceMatrix[i][j] = Math.min(replaceCost, insertCost, deleteCost);
          
          // Record the operation type
          if (distanceMatrix[i][j] === replaceCost) {
            operationTracker[i][j] = { type: "replace", cost: 1 };
          } else if (distanceMatrix[i][j] === insertCost) {
            operationTracker[i][j] = { type: "insert", cost: 1 };
          } else {
            operationTracker[i][j] = { type: "delete", cost: 1 };
          }
        }
      }
    }
    
    // Trace optimal path through the matrix
    const transformationPath = [];
    let i = sourceLength, j = targetLength;
    
    while (i > 0 || j > 0) {
      transformationPath.unshift({
        row: i,
        col: j,
        operation: operationTracker[i][j],
      });
      
      // Move to previous cell based on operation type
      if (
        operationTracker[i][j].type === "match" ||
        operationTracker[i][j].type === "replace"
      ) {
        i--;
        j--;
      } else if (operationTracker[i][j].type === "insert") {
        j--;
      } else {
        i--;
      }
    }
    
    // Generate visual representation of steps
    const transformationSequence = [];
    let currentText = source;
    
    transformationPath.forEach((step) => {
      const i = step.row;
      const j = step.col;
      
      // Skip origin point
      if (i === 0 && j === 0) return;
      
      let stepDescription = "";
      let transformedText = currentText;
      
      // Create description and apply transformation
      if (operationTracker[i][j].type === "match") {
        stepDescription = `Keep '${source[i - 1]}' (matches '${target[j - 1]}')`;
      } else if (operationTracker[i][j].type === "replace") {
        stepDescription = `Replace '${source[i - 1]}' with '${target[j - 1]}'`;
        transformedText = transformedText.substring(0, i - 1) + target[j - 1] + transformedText.substring(i);
      } else if (operationTracker[i][j].type === "insert") {
        stepDescription = `Insert '${target[j - 1]}'`;
        transformedText = transformedText.substring(0, i) + target[j - 1] + transformedText.substring(i);
      } else {
        stepDescription = `Delete '${source[i - 1]}'`;
        transformedText = transformedText.substring(0, i - 1) + transformedText.substring(i);
      }
      
      // Add step to sequence
      transformationSequence.push({
        description: stepDescription,
        beforeString: currentText,
        afterString: transformedText,
        position: operationTracker[i][j].type === "insert" ? i : i - 1,
        operation: operationTracker[i][j].type,
      });
      
      // Update for next step
      currentText = transformedText;
    });
    
    return transformationSequence;
  };
  
  /**
   * Checks input word against dictionary and suggests closest matches
   * Finds words with minimum edit distance from input
   * 
   * @param {string} wordToCheck - Word to spell check
   * @returns {Array} Suggestions sorted by edit distance
   */
  const analyzeSpelling = (wordToCheck) => {
    // Validate input
    if (!wordToCheck || wordToCheck.trim() === "" || wordDictionary.length === 0) {
      setSuggestionResults([]);
      return [];
    }
    
    let minimumDistance = Infinity;
    let candidateSuggestions = [];
    
    // Compare against each dictionary word
    for (const dictionaryWord of wordDictionary) {
      const distance = measureEditDistance(wordToCheck, dictionaryWord);
      
      // Track words with minimum distance
      if (distance < minimumDistance) {
        minimumDistance = distance;
        candidateSuggestions = [{ 
          word: dictionaryWord, 
          distance,
          operations: createTransformationSteps(wordToCheck, dictionaryWord) 
        }];
      } else if (distance === minimumDistance) {
        // Add equally close matches
        candidateSuggestions.push({ 
          word: dictionaryWord, 
          distance,
          operations: createTransformationSteps(wordToCheck, dictionaryWord) 
        });
      }
    }
    
    // Update state and return results
    setSuggestionResults(candidateSuggestions);
    return candidateSuggestions;
  };
  
  /**
   * Adds a new word to the dictionary if valid
   * 
   * @param {string} wordToAdd - Word to add to dictionary
   * @returns {boolean} Success status
   */
  const expandDictionary = (wordToAdd) => {
    // Validate word
    const cleanWord = wordToAdd.trim();
    if (!cleanWord || wordDictionary.includes(cleanWord)) {
      return false;
    }
    
    // Add to dictionary
    const updatedDictionary = [...wordDictionary, cleanWord];
    setWordDictionary(updatedDictionary);
    setNewDictionaryEntry("");
    return true;
  };
  
  // Return all necessary functions and state
  return {
    dictionary: wordDictionary,
    setDictionary: setWordDictionary,
    inputWord: textToCheck,
    setInputWord: setTextToCheck,
    dictionaryInput: newDictionaryEntry,
    setDictionaryInput: setNewDictionaryEntry,
    spellCheckResults: suggestionResults,
    setSpellCheckResults: setSuggestionResults,
    checkSpelling: analyzeSpelling,
    addToDictionary: expandDictionary
  };
}

export default useSpellCheck;