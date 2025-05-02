import { useState } from "react";

/**
 * Custom hook for Levenshtein distance algorithm implementation and visualization
 * Provides functionality for both standard and weighted edit distance calculations
 * with step-by-step transformation visualization
 */
export function useLevenshtein() {
  // State management for algorithm data and visualization
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [optimalPath, setOptimalPath] = useState([]);
  const [transformationSteps, setTransformationSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  /**
   * Computes standard Levenshtein distance with uniform operation costs (cost = 1)
   * @param {string} sourceText - Original string to transform
   * @param {string} targetText - Target string to transform into
   * @returns {Object} Calculation results including matrix, path, and transformation steps
   */
  const computeStandardDistance = (sourceText, targetText) => {
    const sourceLength = sourceText.length;
    const targetLength = targetText.length;

    // Initialize distance matrix for dynamic programming
    const distanceTable = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(0));
      
    // Track operations for path reconstruction and visualization
    const operationTracker = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(null));

    // Set up base cases: transforming to/from empty string
    for (let i = 0; i <= sourceLength; i++) {
      distanceTable[i][0] = i;
      if (i > 0) operationTracker[i][0] = { type: "delete", cost: 1 };
    }

    for (let j = 0; j <= targetLength; j++) {
      distanceTable[0][j] = j;
      if (j > 0) operationTracker[0][j] = { type: "insert", cost: 1 };
    }

    // Fill the matrix using dynamic programming approach
    for (let i = 1; i <= sourceLength; i++) {
      for (let j = 1; j <= targetLength; j++) {
        if (sourceText[i - 1] === targetText[j - 1]) {
          // Characters match - no operation needed
          distanceTable[i][j] = distanceTable[i - 1][j - 1];
          operationTracker[i][j] = { type: "match", cost: 0 };
        } else {
          // Calculate costs for possible operations
          const substitutionCost = distanceTable[i - 1][j - 1] + 1;
          const insertionCost = distanceTable[i][j - 1] + 1;
          const deletionCost = distanceTable[i - 1][j] + 1;

          // Choose the minimum cost operation
          distanceTable[i][j] = Math.min(substitutionCost, insertionCost, deletionCost);

          if (distanceTable[i][j] === substitutionCost) {
            operationTracker[i][j] = { type: "replace", cost: 1 };
          } else if (distanceTable[i][j] === insertionCost) {
            operationTracker[i][j] = { type: "insert", cost: 1 };
          } else {
            operationTracker[i][j] = { type: "delete", cost: 1 };
          }
        }
      }
    }

    // Determine the optimal edit sequence
    const editPath = reconstructOptimalPath(operationTracker, sourceLength, targetLength);
    
    // Generate visual representation of the transformation steps
    const visualSteps = buildTransformationSequence(sourceText, targetText, operationTracker, editPath);

    // Update component state
    setDistanceMatrix(distanceTable);
    setOptimalPath(editPath);
    setTransformationSteps(visualSteps);
    setActiveStepIndex(0);

    return {
      distance: distanceTable[sourceLength][targetLength],
      matrix: distanceTable,
      operations: operationTracker,
      path: editPath,
      visualSteps: visualSteps,
    };
  };

  /**
   * Computes weighted Levenshtein distance with customizable operation costs
   * @param {string} sourceText - Original string to transform
   * @param {string} targetText - Target string to transform into
   * @param {number} insertionWeight - Cost for insertion operations
   * @param {number} deletionWeight - Cost for deletion operations
   * @param {number} substitutionWeight - Cost for substitution operations
   * @returns {Object} Calculation results including matrix, path, and transformation steps
   */
  const computeWeightedDistance = (sourceText, targetText, insertionWeight, deletionWeight, substitutionWeight) => {
    const sourceLength = sourceText.length;
    const targetLength = targetText.length;

    // Initialize distance matrix for dynamic programming
    const distanceTable = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(0));
      
    // Track operations for path reconstruction and visualization
    const operationTracker = Array(sourceLength + 1)
      .fill()
      .map(() => Array(targetLength + 1).fill(null));

    // Set up base cases with weighted costs
    for (let i = 0; i <= sourceLength; i++) {
      distanceTable[i][0] = i * deletionWeight;
      if (i > 0) operationTracker[i][0] = { type: "delete", cost: deletionWeight };
    }

    for (let j = 0; j <= targetLength; j++) {
      distanceTable[0][j] = j * insertionWeight;
      if (j > 0) operationTracker[0][j] = { type: "insert", cost: insertionWeight };
    }

    // Fill the matrix using dynamic programming with weighted costs
    for (let i = 1; i <= sourceLength; i++) {
      for (let j = 1; j <= targetLength; j++) {
        if (sourceText[i - 1] === targetText[j - 1]) {
          // Characters match - no operation needed
          distanceTable[i][j] = distanceTable[i - 1][j - 1];
          operationTracker[i][j] = { type: "match", cost: 0 };
        } else {
          // Calculate costs for possible operations with weights
          const substitutionCost = distanceTable[i - 1][j - 1] + substitutionWeight;
          const insertionCost = distanceTable[i][j - 1] + insertionWeight;
          const deletionCost = distanceTable[i - 1][j] + deletionWeight;

          // Choose the minimum cost operation
          distanceTable[i][j] = Math.min(substitutionCost, insertionCost, deletionCost);

          // Record the operation type and cost
          if (distanceTable[i][j] === substitutionCost) {
            operationTracker[i][j] = { type: "replace", cost: substitutionWeight };
          } else if (distanceTable[i][j] === insertionCost) {
            operationTracker[i][j] = { type: "insert", cost: insertionWeight };
          } else {
            operationTracker[i][j] = { type: "delete", cost: deletionWeight };
          }
        }
      }
    }

    // Determine the optimal edit sequence
    const editPath = reconstructOptimalPath(operationTracker, sourceLength, targetLength);
    
    // Generate visual representation with cost information
    const visualSteps = buildWeightedTransformationSequence(sourceText, targetText, operationTracker, editPath);

    // Update component state
    setDistanceMatrix(distanceTable);
    setOptimalPath(editPath);
    setTransformationSteps(visualSteps);
    setActiveStepIndex(0);

    return {
      distance: distanceTable[sourceLength][targetLength],
      matrix: distanceTable,
      operations: operationTracker,
      path: editPath,
      visualSteps: visualSteps,
    };
  };

  /**
   * Reconstructs the optimal edit path through the operations matrix
   * Traces backward from the final position to find the sequence of operations
   */
  const reconstructOptimalPath = (operations, sourceLength, targetLength) => {
    const path = [];
    let i = sourceLength, j = targetLength;

    // Trace backward from bottom-right to top-left
    while (i > 0 || j > 0) {
      path.unshift({
        row: i,
        col: j,
        operation: operations[i][j],
      });

      // Move to previous cell based on operation type
      if (
        operations[i][j].type === "match" ||
        operations[i][j].type === "replace"
      ) {
        i--;
        j--;
      } else if (operations[i][j].type === "insert") {
        j--;
      } else {
        i--;
      }
    }

    return path;
  };

  /**
   * Builds a visual step-by-step representation of the string transformation process
   */
  const buildTransformationSequence = (sourceText, targetText, operations, path) => {
    const transformationSequence = [];
    let currentText = sourceText;

    // Process each step in the optimal path
    path.forEach((step) => {
      const i = step.row;
      const j = step.col;

      // Skip the origin cell
      if (i === 0 && j === 0) return;

      let stepDescription = "";
      let transformedText = currentText;

      // Create description and apply the operation to the current string
      if (operations[i][j].type === "match") {
        stepDescription = `Keep '${sourceText[i - 1]}' (matches '${targetText[j - 1]}')`;
      } else if (operations[i][j].type === "replace") {
        stepDescription = `Replace '${sourceText[i - 1]}' with '${targetText[j - 1]}'`;
        transformedText = transformedText.substring(0, i - 1) + targetText[j - 1] + transformedText.substring(i);
      } else if (operations[i][j].type === "insert") {
        stepDescription = `Insert '${targetText[j - 1]}'`;
        transformedText = transformedText.substring(0, i) + targetText[j - 1] + transformedText.substring(i);
      } else {
        stepDescription = `Delete '${sourceText[i - 1]}'`;
        transformedText = transformedText.substring(0, i - 1) + transformedText.substring(i);
      }

      // Add this step to the sequence
      transformationSequence.push({
        description: stepDescription,
        beforeString: currentText,
        afterString: transformedText,
        position: operations[i][j].type === "insert" ? i : i - 1,
        operation: operations[i][j].type,
      });

      // Update current string for next step
      currentText = transformedText;
    });

    return transformationSequence;
  };

  /**
   * Builds weighted transformation steps with cost information
   */
  const buildWeightedTransformationSequence = (sourceText, targetText, operations, path) => {
    const transformationSequence = [];
    let currentText = sourceText;
    let accumulatedCost = 0;

    // Process each step in the optimal path
    path.forEach((step) => {
      const i = step.row;
      const j = step.col;

      // Skip the origin cell
      if (i === 0 && j === 0) return;

      let stepDescription = "";
      let transformedText = currentText;
      let operationCost = 0;

      // Create description with cost information and apply the operation
      if (operations[i][j].type === "match") {
        stepDescription = `Keep '${sourceText[i - 1]}' (matches '${targetText[j - 1]}')`;
      } else if (operations[i][j].type === "replace") {
        stepDescription = `Replace '${sourceText[i - 1]}' with '${targetText[j - 1]}' (Cost: ${operations[i][j].cost})`;
        operationCost = operations[i][j].cost;
        accumulatedCost += operationCost;
        transformedText = transformedText.substring(0, i - 1) + targetText[j - 1] + transformedText.substring(i);
      } else if (operations[i][j].type === "insert") {
        stepDescription = `Insert '${targetText[j - 1]}' (Cost: ${operations[i][j].cost})`;
        operationCost = operations[i][j].cost;
        accumulatedCost += operationCost;
        transformedText = transformedText.substring(0, i) + targetText[j - 1] + transformedText.substring(i);
      } else {
        stepDescription = `Delete '${sourceText[i - 1]}' (Cost: ${operations[i][j].cost})`;
        operationCost = operations[i][j].cost;
        accumulatedCost += operationCost;
        transformedText = transformedText.substring(0, i - 1) + transformedText.substring(i);
      }

      // Add this step to the sequence with cost information
      transformationSequence.push({
        description: stepDescription,
        beforeString: currentText,
        afterString: transformedText,
        position: operations[i][j].type === "insert" ? i : i - 1,
        operation: operations[i][j].type,
        cost: operationCost,
        totalCost: accumulatedCost,
      });

      // Update current string for next step
      currentText = transformedText;
    });

    return transformationSequence;
  };

  // Navigation functions for step traversal
  const advanceToNextStep = () => {
    if (activeStepIndex < transformationSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const returnToPreviousStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  // Return all necessary functions and state
  return {
    matrix: distanceMatrix,
    operationPath: optimalPath,
    visualSteps: transformationSteps,
    currentStepIndex: activeStepIndex,
    setCurrentStepIndex: setActiveStepIndex,
    calculateStandard: computeStandardDistance,
    calculateWeighted: computeWeightedDistance,
    nextStep: advanceToNextStep,
    prevStep: returnToPreviousStep,
  };
}

export default useLevenshtein;