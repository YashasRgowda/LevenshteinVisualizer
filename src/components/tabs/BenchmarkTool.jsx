import React, { useState, useEffect } from "react";
import { runBenchmark, getComplexityAnalysis } from "../utils/benchmarkUtils";

function BenchmarkTool() {
  // Setting up state variables for benchmark results and loading status
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const complexityInfo = getComplexityAnalysis();

  // Initialize benchmark tests when component mounts
  useEffect(() => {
    executePerformanceTests();
  }, []);

  // Function to handle running the performance tests
  const executePerformanceTests = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const testResults = runBenchmark();
      setBenchmarkResults(testResults);
      setIsLoading(false);
    }, 150);
  };

  return (
    <div className="benchmark-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extralight tracking-tight text-slate-700">
          <span className="font-medium text-slate-700">Algorithm</span> Performance
        </h2>
        
        <button
          onClick={executePerformanceTests}
          className="px-5 py-2.5 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:from-teal-500 hover:to-emerald-600 disabled:opacity-70 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Run Benchmark"}
        </button>
      </div>

      {isLoading ? (
        <div className="relative text-center py-16 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <div className="benchmark-loader">
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
            <div className="matrix-cell"></div>
          </div>
          <p className="text-slate-600 mt-4 font-light">Analyzing algorithm performance...</p>
        </div>
      ) : benchmarkResults ? (
        <>
          {/* Results Table with refined design */}
          <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50/30 to-emerald-50/30 opacity-50"></div>
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Test Case
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Source Text
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Target Text
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Edit Distance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Matrix Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Time (ms)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkResults.map((result, idx) => (
                    <tr 
                      key={idx} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50/20 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {result.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {result.str1.length > 10 
                          ? `${result.str1.substring(0, 10)}... (${result.str1.length} chars)`
                          : result.str1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {result.str2.length > 10 
                          ? `${result.str2.substring(0, 10)}... (${result.str2.length} chars)`
                          : result.str2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="font-medium">{result.distance}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {result.matrixSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`
                          inline-block rounded-full px-3 py-1 text-xs font-medium
                          ${parseFloat(result.executionTime) > 50
                            ? "bg-amber-100 text-amber-700"
                            : parseFloat(result.executionTime) > 10
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-teal-100 text-teal-700"}
                        `}>
                          {result.executionTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Algorithm Analysis with elegant design */}
          <div className="p-8 rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-50/50 -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-50/50 -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative">
              <h3 className="text-xl font-light mb-6 pb-3 border-b border-slate-200 text-slate-700">
                <span className="font-medium">Computational</span> Complexity Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h4 className="flex items-center text-slate-700 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Time Complexity
                  </h4>
                  <p className="text-slate-600">{complexityInfo.timeComplexity}</p>
                </div>
                
                <div className="p-6 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h4 className="flex items-center text-slate-700 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Space Requirements
                  </h4>
                  <p className="text-slate-600">{complexityInfo.spaceComplexity}</p>
                </div>
                
                <div className="p-6 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h4 className="flex items-center text-slate-700 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Optimization Paths
                  </h4>
                  <p className="text-slate-600">{complexityInfo.optimizationNote}</p>
                </div>
                
                <div className="p-6 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <h4 className="flex items-center text-slate-700 font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Practical Applications
                  </h4>
                  <p className="text-slate-600">{complexityInfo.practicalConsiderations}</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-px">
                <h4 className="font-medium mb-4 pb-2 border-b border-white/20 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Key Performance Insights
                </h4>
                <ul className="space-y-3">
                  {[
                    "Exceptional performance with strings under 20 characters in length",
                    "Matrix complexity increases quadratically with input string length",
                    "Memory usage scales significantly with the dynamic programming table",
                    "Consider specialized optimizations for processing lengthy text strings"
                  ].map((insight, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 border border-white/30">
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative text-center py-20 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
          
          <svg className="mx-auto h-16 w-16 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <p className="mt-4 text-slate-600 max-w-md mx-auto">No performance data available yet. Click "Run Benchmark" to analyze algorithm efficiency.</p>
          
          <button
            onClick={executePerformanceTests}
            className="mt-6 px-5 py-2.5 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px"
          >
            Start Analysis
          </button>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
      )}

      {/* CSS for custom loading animation and patterns */}
      <style jsx>{`
        .benchmark-loader {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 8px;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }
        
        .matrix-cell {
          background-color: rgba(20, 184, 166, 0.1);
          border-radius: 4px;
          animation: matrix-pulse 1.5s infinite;
        }
        
        .matrix-cell:nth-child(1) { animation-delay: 0s; }
        .matrix-cell:nth-child(2) { animation-delay: 0.1s; }
        .matrix-cell:nth-child(3) { animation-delay: 0.2s; }
        .matrix-cell:nth-child(4) { animation-delay: 0.3s; }
        .matrix-cell:nth-child(5) { animation-delay: 0.4s; }
        .matrix-cell:nth-child(6) { animation-delay: 0.5s; }
        .matrix-cell:nth-child(7) { animation-delay: 0.6s; }
        .matrix-cell:nth-child(8) { animation-delay: 0.7s; }
        .matrix-cell:nth-child(9) { animation-delay: 0.8s; }
        
        @keyframes matrix-pulse {
          0%, 100% {
            transform: scale(0.8);
            background-color: rgba(20, 184, 166, 0.1);
          }
          50% {
            transform: scale(1);
            background-color: rgba(20, 184, 166, 0.3);
          }
        }
        
        .bg-dot-pattern {
          background-image: radial-gradient(rgba(20, 184, 166, 0.4) 1px, transparent 1px);
          background-size: 16px 16px;
        }
      `}</style>
    </div>
  );
}

export default BenchmarkTool;