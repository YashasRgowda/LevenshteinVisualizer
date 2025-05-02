/**
 * Benchmark utility functions for Levenshtein distance algorithm analysis
 * Provides performance testing and complexity information
 */

/**
 * Executes comprehensive performance tests on the Levenshtein algorithm
 * Measures execution time, matrix size, and operation counts for various test cases
 * 
 * @returns {Array} Collection of benchmark results with detailed metrics
 */
export const runBenchmark = () => {
  // Diverse test scenarios with varying complexity levels
  const benchmarkScenarios = [
    { 
      sourceText: "a", 
      targetText: "b", 
      description: "Single Character - Basic substitution" 
    },
    { 
      sourceText: "kitten", 
      targetText: "sitting", 
      description: "Classic Example - Short words" 
    },
    { 
      sourceText: "algorithm", 
      targetText: "logarithm", 
      description: "Anagram-like - Medium complexity" 
    },
    { 
      sourceText: "levenshtein", 
      targetText: "meilenstein", 
      description: "Similar Length - Different characters" 
    },
    { 
      sourceText: "pneumonoultramicroscopicsilicovolcanoconiosis", 
      targetText: "supercalifragilisticexpialidocious",
      description: "Extreme Case - Very long words" 
    },
  ];

  const performanceResults = [];

  // Execute each test case and measure performance
  benchmarkScenarios.forEach((scenario) => {
    // Capture precise timing data
    const startTimestamp = performance.now();
    const algorithmResult = executeOptimizedLevenshtein(scenario.sourceText, scenario.targetText);
    const endTimestamp = performance.now();
    const processingTime = endTimestamp - startTimestamp;

    // Record comprehensive performance metrics
    performanceResults.push({
      str1: scenario.sourceText,
      str2: scenario.targetText,
      description: scenario.description,
      distance: algorithmResult.distance,
      executionTime: processingTime.toFixed(2),
      matrixSize: (scenario.sourceText.length + 1) * (scenario.targetText.length + 1),
      operationsCount: algorithmResult.operationsCount
    });
  });

  return performanceResults;
};

/**
 * Performance-optimized implementation of Levenshtein distance calculation
 * Streamlined version without path tracing for maximum speed
 * 
 * @param {string} sourceText - Original string
 * @param {string} targetText - Target string
 * @returns {Object} Distance value and operation count metrics
 */
const executeOptimizedLevenshtein = (sourceText, targetText) => {
  const sourceLength = sourceText.length;
  const targetLength = targetText.length;
  let operationCounter = 0;

  // Initialize distance matrix
  const distanceMatrix = Array(sourceLength + 1)
    .fill()
    .map(() => Array(targetLength + 1).fill(0));

  // Setup base cases (transformation to/from empty string)
  for (let i = 0; i <= sourceLength; i++) {
    distanceMatrix[i][0] = i;
    operationCounter++;
  }

  for (let j = 0; j <= targetLength; j++) {
    distanceMatrix[0][j] = j;
    operationCounter++;
  }

  // Fill matrix using dynamic programming approach
  for (let i = 1; i <= sourceLength; i++) {
    for (let j = 1; j <= targetLength; j++) {
      operationCounter++;
      
      if (sourceText[i - 1] === targetText[j - 1]) {
        // Characters match - no operation needed
        distanceMatrix[i][j] = distanceMatrix[i - 1][j - 1];
      } else {
        // Choose minimum cost operation
        distanceMatrix[i][j] = Math.min(
          distanceMatrix[i - 1][j - 1] + 1, // Replace operation
          distanceMatrix[i][j - 1] + 1,     // Insert operation
          distanceMatrix[i - 1][j] + 1      // Delete operation
        );
      }
    }
  }

  return {
    distance: distanceMatrix[sourceLength][targetLength],
    operationsCount: operationCounter
  };
};

/**
 * Provides detailed algorithmic complexity analysis and optimization insights
 * Includes theoretical complexity bounds and practical performance considerations
 * 
 * @returns {Object} Comprehensive complexity information
 */
export const getComplexityAnalysis = () => {
  return {
    timeComplexity: "O(n×m) where n and m represent the lengths of the two input strings",
    spaceComplexity: "O(n×m) for the standard implementation using a complete matrix",
    optimizationNote: "Space complexity can be reduced to O(min(n,m)) by only storing the current and previous rows of the matrix",
    asymptotic: "For strings of similar length n, the worst-case time complexity approaches O(n²)",
    practicalConsiderations: "Performance degrades quadratically for longer inputs. Consider approximation algorithms for strings exceeding several hundred characters."
  };
};

/**
 * Provides statistics about algorithm scaling for visualization
 * Shows how performance changes with increasing input sizes
 * 
 * @returns {Object} Scaling metrics for visualization
 */
export const getScalingMetrics = () => {
  return {
    inputSizeProgression: [5, 10, 20, 50, 100, 200, 500],
    theoreticalTimeScaling: [25, 100, 400, 2500, 10000, 40000, 250000],
    theoreticalSpaceScaling: [25, 100, 400, 2500, 10000, 40000, 250000],
    optimizedSpaceScaling: [5, 10, 20, 50, 100, 200, 500],
    notes: "Values represent approximate operation counts for strings of equal length"
  };
};

export default { runBenchmark, getComplexityAnalysis, getScalingMetrics };