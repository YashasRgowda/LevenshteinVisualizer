import React from "react";

/**
 * Component for visualizing the dynamic programming matrix used in Levenshtein distance calculation
 * Displays the matrix with highlighted optimal path and current transformation step
 */
function LevenshteinMatrix({ 
  matrix, 
  sourceString, 
  targetString, 
  operationPath, 
  currentStep 
}) {
  // Don't render if matrix data is missing
  if (!matrix || matrix.length === 0) return null;

  // Get the final edit distance from the bottom-right cell
  const finalDistance = matrix[sourceString.length]?.[targetString.length] || 0;

  return (
    <div className="matrix-visualization bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="matrix-header flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b border-slate-200">
        <h2 className="text-xl font-light text-slate-700 mb-3 sm:mb-0">
          <span className="font-medium">Distance</span> Matrix
        </h2>
        <div className="matrix-legend flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center mr-1">
            <span className="inline-block w-4 h-4 bg-slate-100 border border-slate-200 rounded-sm mr-1.5"></span>
            <span className="text-slate-600">Matrix Cell</span>
          </div>
          <div className="flex items-center mr-1">
            <span className="inline-block w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-sm mr-1.5"></span>
            <span className="text-slate-600">Optimal Path</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-amber-500 rounded-sm mr-1.5"></span>
            <span className="text-slate-600">Current Step</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto matrix-container rounded-lg">
        <table className="min-w-full border-collapse matrix-table">
          <thead>
            <tr>
              <th className="p-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-normal text-center"></th>
              <th className="p-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-normal text-center"></th>
              {targetString.split("").map((char, idx) => (
                <th key={idx} className="p-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-normal text-center">
                  {char}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="border border-slate-200 p-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-normal text-center">
                  {i === 0 ? "" : sourceString[i - 1]}
                </td>
                {row.map((cell, j) => {
                  // Check if this cell is part of the optimal path
                  const isInPath = operationPath.some(
                    (p) => p.row === i && p.col === j
                  );
                  
                  // Check if this cell corresponds to the current step
                  const isCurrentStepCell = 
                    currentStep && 
                    ((currentStep.operation === "match" || currentStep.operation === "replace") && 
                      i === currentStep.position + 1 && j === currentStep.position + 1) ||
                    (currentStep.operation === "insert" && 
                      i === currentStep.position && j === currentStep.position + 1) ||
                    (currentStep.operation === "delete" && 
                      i === currentStep.position + 1 && j === currentStep.position);

                  // Determine cell styling based on its role
                  let cellClass = "border border-slate-200 p-2 sm:p-3 text-center transition-all duration-150";
                  
                  if (isCurrentStepCell) {
                    cellClass += " bg-amber-500 text-white font-medium";
                  } else if (isInPath) {
                    cellClass += " bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium";
                  } else {
                    cellClass += " bg-slate-50";
                  }

                  // Bottom-right cell (final result) gets special styling
                  if (i === sourceString.length && j === targetString.length) {
                    cellClass += " ring-2 ring-teal-500";
                  }

                  return (
                    <td key={j} className={cellClass}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="matrix-footer mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <div className="text-slate-700 flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
          <span className="font-medium">Source:</span> 
          <span className="ml-1.5 bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-sm">{sourceString}</span>
        </div>
        <div className="text-slate-700 flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
          <span className="font-medium">Target:</span> 
          <span className="ml-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-sm">{targetString}</span>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
          Final Distance: {finalDistance}
        </div>
      </div>
      
      {/* Responsive adjustments for the matrix on small screens */}
      <style jsx>{`
        .matrix-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(20, 184, 166, 0.3) rgba(241, 245, 249, 0.7);
        }
        
        .matrix-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        
        .matrix-container::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.7);
          border-radius: 4px;
        }
        
        .matrix-container::-webkit-scrollbar-thumb {
          background-color: rgba(20, 184, 166, 0.3);
          border-radius: 4px;
        }
        
        .matrix-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 184, 166, 0.5);
        }
        
        @media (max-width: 640px) {
          .matrix-table td, .matrix-table th {
            min-width: 36px;
            font-size: 0.875rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .matrix-table td, .matrix-table th {
            min-width: 44px;
          }
        }
        
        @media (min-width: 1025px) {
          .matrix-table td, .matrix-table th {
            min-width: 50px;
          }
        }
      `}</style>
    </div>
  );
}

export default LevenshteinMatrix;