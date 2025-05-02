import React, { useState, useEffect } from "react";
import LevenshteinMatrix from "../visualizations/LevenshteinMatrix";
import TransformationSteps from "../visualizations/TransformationSteps";
import useLevenshtein from "../hooks/useLevenshtein";
import useAnimation from "../hooks/useAnimation";

function WeightedLevenshtein({ 
  sourceString, 
  setSourceString, 
  targetString, 
  setTargetString 
}) {
  // Define operation costs with state management
  const [insertCost, setInsertCost] = useState(1);
  const [deleteCost, setDeleteCost] = useState(2);
  const [substituteCost, setSubstituteCost] = useState(3);

  // Incorporate algorithm logic with our custom hooks
  const {
    matrix,
    operationPath,
    visualSteps,
    currentStepIndex,
    setCurrentStepIndex,
    calculateWeighted,
  } = useLevenshtein();

  // Setup animation controller for visual transformation
  const {
    isAnimating,
    startAnimation,
    stopAnimation
  } = useAnimation(visualSteps, setCurrentStepIndex);

  // Initialize calculation on component mount
  useEffect(() => {
    runWeightedCalculation();
  }, []);

  // Access current visualization step
  const currentStep = visualSteps[currentStepIndex] || null;

  // Process form submission and trigger calculation
  const runWeightedCalculation = (e) => {
    if (e) e.preventDefault();
    
    // Ensure valid numerical costs by parsing input values
    const insertWeight = Math.max(1, parseInt(insertCost) || 1);
    const deleteWeight = Math.max(1, parseInt(deleteCost) || 1);
    const substituteWeight = Math.max(1, parseInt(substituteCost) || 1);
    
    // Update state with sanitized values
    setInsertCost(insertWeight);
    setDeleteCost(deleteWeight);
    setSubstituteCost(substituteWeight);
    
    // Execute weighted algorithm calculation
    calculateWeighted(sourceString, targetString, insertWeight, deleteWeight, substituteWeight);
  };

  return (
    <div className="weighted-levenshtein-container">
      <form onSubmit={runWeightedCalculation} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="input-group relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source Text:
            </label>
            <div className="relative shadow-sm rounded-lg focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-200">
              <input
                type="text"
                value={sourceString}
                onChange={(e) => setSourceString(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none bg-white"
                placeholder="Enter original string"
                required
              />
              {sourceString && (
                <div className="absolute top-0 right-0 mt-3 mr-3">
                  <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded">
                    {sourceString.length} chars
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="input-group relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Text:
            </label>
            <div className="relative shadow-sm rounded-lg focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-200">
              <input
                type="text"
                value={targetString}
                onChange={(e) => setTargetString(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none bg-white"
                placeholder="Enter destination string"
                required
              />
              {targetString && (
                <div className="absolute top-0 right-0 mt-3 mr-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded">
                    {targetString.length} chars
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="operation-costs p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 mb-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          
          <h3 className="text-md font-medium mb-5 text-slate-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Operation Costs
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="cost-input-group">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Insertion Cost:
              </label>
              <div className="flex shadow-sm rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-300">
                <span className="inline-flex items-center px-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm rounded-l-lg">
                  Ci
                </span>
                <input
                  type="number"
                  value={insertCost}
                  onChange={(e) => setInsertCost(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-r-lg focus:outline-none bg-white"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="cost-input-group">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Deletion Cost:
              </label>
              <div className="flex shadow-sm rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-300">
                <span className="inline-flex items-center px-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm rounded-l-lg">
                  Cd
                </span>
                <input
                  type="number"
                  value={deleteCost}
                  onChange={(e) => setDeleteCost(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-r-lg focus:outline-none bg-white"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="cost-input-group">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Substitution Cost:
              </label>
              <div className="flex shadow-sm rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-300">
                <span className="inline-flex items-center px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm rounded-l-lg">
                  Cs
                </span>
                <input
                  type="number"
                  value={substituteCost}
                  onChange={(e) => setSubstituteCost(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-r-lg focus:outline-none bg-white"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-200/70">
            <div className="flex items-center text-sm text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Higher costs make operations less preferable in the optimal edit path.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Compute Weighted Distance
          </button>
        </div>
      </form>

      {/* Results visualization section */}
      {matrix.length > 0 ? (
        <div className="results-visualization space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-50/30 -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-50/30 -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative">
            <div className="results-summary mb-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-100 shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-slate-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Weighted Levenshtein Results
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-slate-700 mb-4">
                <div className="mb-2 sm:mb-0">
                  <span className="text-sm">
                    Weighted distance between 
                    <span className="font-medium mx-1 text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">"{sourceString}"</span> 
                    and 
                    <span className="font-medium mx-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">"{targetString}"</span>:
                  </span>
                </div>
                <div className="text-3xl font-light text-slate-800">
                  <span className="font-semibold text-teal-600">
                    {matrix[matrix.length - 1]?.[matrix[0]?.length - 1] || 0}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Insert: {insertCost}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete: {deleteCost}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Substitute: {substituteCost}
                </span>
              </div>
            </div>

            {/* Matrix visualization component */}
            <LevenshteinMatrix
              matrix={matrix}
              sourceString={sourceString}
              targetString={targetString}
              operationPath={operationPath}
              currentStep={currentStep}
            />

            {/* Transformation steps visualization */}
            <TransformationSteps
              visualSteps={visualSteps}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              isAnimating={isAnimating}
              startAnimation={startAnimation}
              stopAnimation={stopAnimation}
            />
            
            <div className="algorithm-explanation mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-md font-medium mb-3 text-slate-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About Weighted Levenshtein
              </h3>
              <p className="text-slate-600">
                This extended algorithm allows different costs for each operation type (insertion, deletion, substitution).
                Adjusting the weights affects which operations are preferred in the optimal transformation path.
              </p>
              
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <h4 className="font-medium text-teal-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Insertion
                  </h4>
                  <p className="text-sm text-slate-600">
                    Adding a character to the source text. Higher cost reduces insertions in the transformation.
                  </p>
                </div>
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                  <h4 className="font-medium text-rose-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Deletion
                  </h4>
                  <p className="text-sm text-slate-600">
                    Removing a character from the source text. Higher cost reduces deletions in the transformation.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="font-medium text-amber-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Substitution
                  </h4>
                  <p className="text-sm text-slate-600">
                    Replacing a character in the source text. Higher cost reduces substitutions in the transformation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state text-center py-16 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
          
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          
          <p className="mt-5 text-slate-600 max-w-md mx-auto">
            Enter source and target strings and adjust operation costs to see how they affect the optimal edit path.
          </p>
          
          <div className="mt-8">
            <button
              onClick={runWeightedCalculation}
              className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white px-5 py-2.5 rounded-lg hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px"
            >
              Start Visualization
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
      )}
      
      {/* CSS for patterns */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(15, 118, 110, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(15, 118, 110, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-dot-pattern {
          background-image: radial-gradient(rgba(20, 184, 166, 0.4) 1px, transparent 1px);
          background-size: 16px 16px;
        }
      `}</style>
    </div>
  );
}

export default WeightedLevenshtein;