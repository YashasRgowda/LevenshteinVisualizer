import { useState, useCallback } from "react";

/**
 * Custom hook for fuzzy search functionality using Levenshtein distance
 * @param {Array} data - Array of objects to search through
 * @param {Function} levenshteinCalculator - Function to calculate Levenshtein distance
 * @returns {Object} Functions and state for fuzzy search
 */
export function useFuzzySearch(data, levenshteinCalculator) {
  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  // State for loading status during search
  const [isSearching, setIsSearching] = useState(false);
  // State for storing highlighted matches
  const [highlightedMatches, setHighlightedMatches] = useState({});

  /**
   * Performs a fuzzy search across the provided data
   * @param {string} query - Search query string
   * @param {string} field - Field to search within data objects
   * @param {number} threshold - Maximum allowed Levenshtein distance for matches
   * @returns {Array} Matched results sorted by relevance
   */
  const performSearch = useCallback((query, field, threshold) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHighlightedMatches({});
      return [];
    }

    setIsSearching(true);

    // Process each record in the data array
    const results = data.map(record => {
      const fieldValue = record[field]?.toLowerCase() || "";
      const queryLower = query.toLowerCase();
      
      // Calculate the Levenshtein distance
      const { distance } = levenshteinCalculator(queryLower, fieldValue);
      
      // Record is a match if the distance is less than or equal to the threshold
      const isMatch = distance <= threshold;
      
      // Calculate a relevance score (smaller distances = higher relevance)
      // Normalize by the max possible distance to get a percentage
      const maxDistance = Math.max(queryLower.length, fieldValue.length);
      const relevanceScore = maxDistance > 0 
        ? 100 * (1 - (distance / maxDistance))
        : 0;
      
      return {
        record,
        distance,
        relevanceScore,
        isMatch,
        field,
        queryValue: query
      };
    }).filter(result => result.isMatch);

    // Sort results by relevance score (highest first)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Create highlighted matches
    const highlights = {};
    
    results.forEach(result => {
      const recordId = result.record.id;
      highlights[recordId] = highlightMatchedParts(
        result.record[field],
        query,
        result.distance
      );
    });

    setSearchResults(results);
    setHighlightedMatches(highlights);
    setIsSearching(false);

    return results;
  }, [data, levenshteinCalculator]);

  /**
   * Highlights the matched parts in the text
   * This is a simplified approach - for a more precise highlighting,
   * you would need to analyze the specific operations from the Levenshtein path
   * @param {string} text - Original text
   * @param {string} query - Search query
   * @param {number} distance - Levenshtein distance
   * @returns {Object} Information about highlighted matches
   */
  const highlightMatchedParts = (text, query, distance) => {
    // Simple case: exact substring match
    if (text.toLowerCase().includes(query.toLowerCase())) {
      const regExp = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
      return {
        before: text.substring(0, matchIndex),
        match: text.substring(matchIndex, matchIndex + query.length),
        after: text.substring(matchIndex + query.length),
        exact: true
      };
    }
    
    // For fuzzy matches, we'll highlight the closest part based on length
    // This is a heuristic approach - a more precise approach would involve
    // tracking the actual operations from the Levenshtein algorithm
    const queryLen = query.length;
    const textLen = text.length;
    
    // Find a potential match window that's closest in length to the query
    let bestStart = 0;
    let bestLength = Math.min(queryLen + distance, textLen);
    
    // If the text is short, just highlight the whole thing
    if (textLen <= queryLen + distance) {
      return {
        before: '',
        match: text,
        after: '',
        exact: false
      };
    }
    
    // For longer texts, try to approximate where the match might be
    // Note: This is a heuristic and won't be perfect for all cases
    const words = text.split(/\s+/);
    let currentPosition = 0;
    let bestMatchDist = Infinity;
    
    for (let i = 0; i < words.length; i++) {
      for (let j = i; j < Math.min(i + 3, words.length); j++) {
        const slice = words.slice(i, j + 1).join(' ');
        if (Math.abs(slice.length - queryLen) < bestMatchDist) {
          bestMatchDist = Math.abs(slice.length - queryLen);
          bestStart = currentPosition;
          bestLength = slice.length;
        }
      }
      currentPosition += words[i].length + 1; // +1 for the space
    }
    
    return {
      before: text.substring(0, bestStart),
      match: text.substring(bestStart, bestStart + bestLength),
      after: text.substring(bestStart + bestLength),
      exact: false
    };
  };

  return {
    searchResults,
    highlightedMatches,
    performSearch,
    isSearching
  };
}

export default useFuzzySearch;