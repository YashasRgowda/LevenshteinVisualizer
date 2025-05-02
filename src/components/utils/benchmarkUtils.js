/**
 * Utility functions for benchmarking Levenshtein algorithm performance
 */

// Run performance tests on the Levenshtein algorithm with various inputs
export function runBenchmark() {
  // Define test cases with varying complexity levels
  const testCases = [
    {
      description: "Simple Case",
      str1: "cat",
      str2: "bat",
    },
    {
      description: "Medium Case",
      str1: "kitten",
      str2: "sitting",
    },
    {
      description: "Medium-Large Case",
      str1: "algorithms",
      str2: "logarithms",
    },
    {
      description: "Large Case",
      str1: "levenshtein",
      str2: "meilenstein",
    },
    {
      description: "Very Large Case",
      str1: "visualization",
      str2: "initialization",
    },
    {
      description: "Complex Case",
      str1: "computational",
      str2: "combinatorial",
    }
  ];

  // Execute and time the algorithm for each test case
  const results = testCases.map(testCase => {
    const { str1, str2, description } = testCase;
    
    // Measure execution time
    const startTime = performance.now();
    const { distance, matrix } = calculateLevenshteinDistance(str1, str2);
    const endTime = performance.now();
    
    // Format execution time with one decimal place
    const executionTime = (endTime - startTime).toFixed(1);
    
    // Calculate matrix dimensions for complexity analysis
    const matrixSize = `${str1.length + 1}x${str2.length + 1}`;
    
    return {
      description,
      str1,
      str2,
      distance,
      matrixSize,
      executionTime
    };
  });

  return results;
}

// Get complexity analysis information for educational display
export function getComplexityAnalysis() {
  return {
    timeComplexity: "O(m×n) where m and n are the lengths of the two strings. The algorithm builds a matrix of size (m+1)×(n+1) and fills each cell exactly once.",
    spaceComplexity: "O(m×n) due to the dynamic programming matrix required to store intermediate results during computation.",
    optimizationNote: "For long strings, memory usage can be optimized to O(min(m,n)) by only storing the current and previous rows of the matrix, as each cell only depends on its neighbors.",
    practicalConsiderations: "Performance degrades quadratically with string length. Consider specialized algorithms for very long strings (e.g., DNA sequences) or approximate methods for fuzzy matching at scale."
  };
}

// Implementation of the Levenshtein distance algorithm for benchmarking
function calculateLevenshteinDistance(source, target) {
  // Create matrix of dimensions (source.length + 1) x (target.length + 1)
  const matrix = Array(source.length + 1).fill().map(() => Array(target.length + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= source.length; i++) {
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= target.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= source.length; i++) {
    for (let j = 1; j <= target.length; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,        // deletion
        matrix[i][j - 1] + 1,        // insertion
        matrix[i - 1][j - 1] + cost  // substitution
      );
    }
  }
  
  // Return the final distance and the complete matrix
  return {
    distance: matrix[source.length][target.length],
    matrix
  };
}