import React, { useState, useEffect, useRef } from "react";
import { userRecords, searchableFields } from "../data/sampleDatabase";
import useFuzzySearch from "../hooks/useFuzzySearch";
import useLevenshtein from "../hooks/useLevenshtein";

/**
 * FuzzySearch component that implements a practical application of Levenshtein distance
 * for finding records that match user input, even with typos or spelling variations
 */
function FuzzySearch() {
  // State for search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("name");
  const [distanceThreshold, setDistanceThreshold] = useState(2);
  const [infoTooltipVisible, setInfoTooltipVisible] = useState(false);
  
  // Ref for tooltip positioning and click outside detection
  const tooltipRef = useRef(null);
  const infoButtonRef = useRef(null);
  
  // Get Levenshtein calculation function from the hook
  const { calculateStandard } = useLevenshtein();
  
  // Use the fuzzy search hook with our data and Levenshtein function
  const { 
    searchResults, 
    highlightedMatches, 
    performSearch, 
    isSearching 
  } = useFuzzySearch(userRecords, calculateStandard);
  
  // Effect to trigger search when parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery, selectedField, distanceThreshold);
      }
    }, 300); // Debounce search for better performance
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedField, distanceThreshold, performSearch]);
  
  // Handle clicks outside of tooltip to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          infoButtonRef.current && !infoButtonRef.current.contains(event.target)) {
        setInfoTooltipVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Reset search when changing search field
  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
    // Keep search query but rerun search
  };
  
  // Clear search results
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  
  // Toggle info tooltip
  const toggleInfoTooltip = () => {
    setInfoTooltipVisible(!infoTooltipVisible);
  };
  
  return (
    <div className="fuzzy-search-container">
      <div className="mb-8">
        <div className="text-slate-700 mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-medium mb-2">Database Record Fuzzy Search</h2>
              {/* Info button */}
              <div className="relative ml-2">
                <button 
                  ref={infoButtonRef}
                  className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover:bg-teal-200 focus:outline-none transition-colors"
                  onClick={toggleInfoTooltip}
                  aria-label="Real-world application information"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Info tooltip */}
                {infoTooltipVisible && (
                  <div 
                    ref={tooltipRef}
                    className="absolute z-10 w-72 md:w-80 right-0 md:left-0 top-8 p-4 bg-white rounded-lg shadow-lg border border-slate-200 text-sm text-slate-700"
                  >
                    <div className="font-medium mb-2 text-teal-700">Real-World Application</div>
                    <p className="mb-2">
                      This tab demonstrates how the Levenshtein distance algorithm is applied in practical scenarios beyond academic examples.
                    </p>
                    <p className="mb-2">
                      Companies like Google, Amazon, and Spotify use similar fuzzy matching techniques to:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Improve search results despite typos</li>
                      <li>Suggest corrections in search engines</li>
                      <li>Match customer records across databases</li>
                      <li>Enhance autocomplete features</li>
                      <li>Power "Did you mean?" suggestions</li>
                    </ul>
                    <div className="mt-3 text-xs text-slate-500">Click anywhere outside to close</div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Demonstrates a practical application of Levenshtein distance for finding matching records 
              even with spelling variations or typos.
            </p>
          </div>
        </div>
        
        <div className="search-controls rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="p-5 flex flex-col gap-5">
            {/* Search Field Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Field
                </label>
                <select
                  value={selectedField}
                  onChange={handleFieldChange}
                  className="block w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-400/50 focus:outline-none"
                >
                  {searchableFields.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Distance Threshold
                  <span className="ml-2 text-xs text-teal-600 bg-teal-50 rounded-full px-2 py-0.5">
                    {distanceThreshold}
                  </span>
                </label>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={distanceThreshold}
                    onChange={(e) => setDistanceThreshold(parseInt(e.target.value))}
                    className="block w-full h-2 appearance-none bg-slate-200 rounded-full outline-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Exact (0)</span>
                    <span>Flexible (5)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by ${searchableFields.find(f => f.id === selectedField)?.label.toLowerCase()}...`}
                  className="block w-full p-3 pl-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-400/50 focus:outline-none bg-white"
                />
                <div className="absolute left-0 top-0 mt-3 ml-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    className="absolute right-0 top-0 mr-3 mt-3 text-slate-400 hover:text-slate-600"
                    onClick={handleClearSearch}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="results-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-slate-700">
            Results
            {searchResults.length > 0 && (
              <span className="ml-2 text-xs text-teal-600 bg-teal-50 rounded-full px-2 py-0.5">
                {searchResults.length} matches
              </span>
            )}
          </h3>
          
          {isSearching && (
            <div className="text-sm text-slate-500 flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          )}
        </div>
        
        {searchQuery.trim() === "" ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-4 text-slate-500">Enter a search query to find matching records</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-slate-500">No matching records found</p>
            <p className="text-slate-400 text-sm mt-2">Try increasing the distance threshold or changing your query</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {searchableFields.find(f => f.id === selectedField)?.label}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Edit Distance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Relevance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {searchResults.map((result) => {
                    const highlight = highlightedMatches[result.record.id];
                    
                    return (
                      <tr key={result.record.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {highlight ? (
                            <>
                              {highlight.before}
                              <span className="bg-teal-100 text-teal-800">
                                {highlight.match}
                              </span>
                              {highlight.after}
                            </>
                          ) : (
                            result.record[selectedField]
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {result.distance}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2.5 rounded-full" 
                              style={{ width: `${result.relevanceScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 inline-block">
                            {Math.round(result.relevanceScore)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="text-xs space-y-1">
                            {Object.entries(result.record)
                              .filter(([key]) => key !== selectedField && key !== "id")
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-slate-700">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                  </span>{" "}
                                  {value}
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-md font-medium mb-3 text-slate-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          How Fuzzy Search Works
        </h3>
        <div className="text-sm text-slate-600 space-y-3">
          <p>
            This fuzzy search uses Levenshtein distance to find database records that approximately match your query.
            The algorithm calculates the minimum number of operations (insertions, deletions, substitutions) needed to transform one string into another.
          </p>
          <p>
            The distance threshold controls how "fuzzy" the matching should be. A higher threshold will find more results with greater differences from your query.
            The results are sorted by relevance, with the closest matches appearing first.
          </p>
          <p>
            <span className="font-medium text-slate-700">Real-world applications:</span> Fuzzy search is used in autocomplete systems, 
            spell checkers, record linking in databases, and search engines to provide better results even when users make typos or use variant spellings.
          </p>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-medium text-slate-700 mb-1">Example Query</div>
            <div className="text-sm text-slate-600">
              "Jonson" → Matches "Johnson" (1 distance)
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-medium text-slate-700 mb-1">Name Variants</div>
            <div className="text-sm text-slate-600">
              "Sara" → Matches "Sarah" (1 distance)
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-medium text-slate-700 mb-1">Typo Tolerance</div>
            <div className="text-sm text-slate-600">
              "Smth" → Matches "Smith" (1 distance)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuzzySearch;