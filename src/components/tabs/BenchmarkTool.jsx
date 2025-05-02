import React, { useState, useEffect, useRef } from "react";
import { runBenchmark, getComplexityAnalysis } from "../utils/benchmarkUtils";

function BenchmarkTool() {
  // Enhanced state variables for benchmark functionality
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customTestCases, setCustomTestCases] = useState([]);
  const [customSource, setCustomSource] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeChart, setActiveChart] = useState("execution");
  const chartRef = useRef(null);
  
  // State for comparison runs
  const [runHistory, setRunHistory] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // Initialize with predefined test cases
  useEffect(() => {
    executePerformanceTests();
  }, []);
  
  // Function to generate chart after results are available
  useEffect(() => {
    if (benchmarkResults && benchmarkResults.length > 0) {
      generateChart(activeChart);
    }
  }, [benchmarkResults, activeChart]);

  // Function to run benchmark tests
  const executePerformanceTests = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate benchmark results including custom test cases
      const testResults = runBenchmark([...customTestCases]);
      setBenchmarkResults(testResults);
      
      // Add results to history for comparison
      const timestamp = new Date().toLocaleTimeString();
      setRunHistory(prev => [...prev, { 
        id: Date.now(),
        timestamp, 
        results: testResults,
        label: `Run at ${timestamp}`
      }]);
      
      setIsLoading(false);
    }, 150);
  };
  
  // Add custom test case
  const addCustomTestCase = (e) => {
    e.preventDefault();
    if (customSource.trim() && customTarget.trim()) {
      const newCase = {
        description: `Custom: "${customSource}" → "${customTarget}"`,
        str1: customSource,
        str2: customTarget
      };
      
      setCustomTestCases([...customTestCases, newCase]);
      setCustomSource("");
      setCustomTarget("");
      setShowAddForm(false);
    }
  };
  
  // Remove custom test case
  const removeCustomTestCase = (index) => {
    const updatedCases = [...customTestCases];
    updatedCases.splice(index, 1);
    setCustomTestCases(updatedCases);
  };
  
  // Function to generate a chart
  const generateChart = (chartType) => {
    if (!chartRef.current || !benchmarkResults) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Clear previous chart
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Chart dimensions
    const padding = 40;
    const width = chartRef.current.width - padding * 2;
    const height = chartRef.current.height - padding * 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + height);
    ctx.lineTo(padding + width, padding + height);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Title and labels
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#0f766e";
    let title;
    if (chartType === "execution") {
      title = "Execution Time by Matrix Size";
    } else if (chartType === "complexity") {
      title = "Matrix Size vs. Edit Distance";
    }
    ctx.fillText(title, padding, 20);
    
    // X and Y labels
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Matrix Size", padding + width / 2 - 30, padding + height + 30);
    
    ctx.save();
    ctx.translate(15, padding + height / 2);
    ctx.rotate(-Math.PI / 2);
    if (chartType === "execution") {
      ctx.fillText("Execution Time (ms)", 0, 0);
    } else if (chartType === "complexity") {
      ctx.fillText("Edit Distance", 0, 0);
    }
    ctx.restore();
    
    // Plot data
    if (benchmarkResults.length > 0) {
      // Find max values for scaling
      let maxMatrixSize = 0;
      let maxValue = 0;
      
      benchmarkResults.forEach(result => {
        const matrixSize = parseInt(result.matrixSize.split('x')[0]) * parseInt(result.matrixSize.split('x')[1]);
        maxMatrixSize = Math.max(maxMatrixSize, matrixSize);
        
        if (chartType === "execution") {
          maxValue = Math.max(maxValue, parseFloat(result.executionTime));
        } else if (chartType === "complexity") {
          maxValue = Math.max(maxValue, result.distance);
        }
      });
      
      // Add 10% padding to max values
      maxMatrixSize *= 1.1;
      maxValue *= 1.1;
      
      // Plot points
      benchmarkResults.forEach((result, index) => {
        const matrixSize = parseInt(result.matrixSize.split('x')[0]) * parseInt(result.matrixSize.split('x')[1]);
        const value = chartType === "execution" ? parseFloat(result.executionTime) : result.distance;
        
        const x = padding + (matrixSize / maxMatrixSize) * width;
        const y = padding + height - (value / maxValue) * height;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        
        // Gradient fill based on value
        let gradient;
        if (chartType === "execution") {
          if (value > 50) {
            gradient = ctx.createLinearGradient(x-5, y-5, x+5, y+5);
            gradient.addColorStop(0, "rgba(220, 38, 38, 0.7)");
            gradient.addColorStop(1, "rgba(248, 113, 113, 0.7)");
          } else if (value > 10) {
            gradient = ctx.createLinearGradient(x-5, y-5, x+5, y+5);
            gradient.addColorStop(0, "rgba(217, 119, 6, 0.7)");
            gradient.addColorStop(1, "rgba(245, 158, 11, 0.7)");
          } else {
            gradient = ctx.createLinearGradient(x-5, y-5, x+5, y+5);
            gradient.addColorStop(0, "rgba(5, 150, 105, 0.7)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 0.7)");
          }
        } else {
          gradient = ctx.createLinearGradient(x-5, y-5, x+5, y+5);
          gradient.addColorStop(0, "rgba(14, 165, 233, 0.7)");
          gradient.addColorStop(1, "rgba(56, 189, 248, 0.7)");
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Add tooltip label
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#334155";
        ctx.fillText(`${result.description.substring(0, 12)}...`, x + 8, y - 5);
        ctx.fillText(`${chartType === "execution" ? value + "ms" : "dist: " + value}`, x + 8, y + 8);
      });
      
      // Draw best fit line for execution times
      if (chartType === "execution" && benchmarkResults.length > 1) {
        // Calculate best fit line (simple linear regression)
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        let n = benchmarkResults.length;
        
        benchmarkResults.forEach(result => {
          const matrixSize = parseInt(result.matrixSize.split('x')[0]) * parseInt(result.matrixSize.split('x')[1]);
          const value = parseFloat(result.executionTime);
          
          sumX += matrixSize;
          sumY += value;
          sumXY += matrixSize * value;
          sumXX += matrixSize * matrixSize;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Draw trend line
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        
        // Start point
        const x1 = padding;
        const y1 = padding + height - ((intercept + slope * 0) / maxValue) * height;
        ctx.moveTo(x1, Math.max(padding, Math.min(y1, padding + height)));
        
        // End point
        const x2 = padding + width;
        const y2 = padding + height - ((intercept + slope * maxMatrixSize) / maxValue) * height;
        ctx.lineTo(x2, Math.max(padding, Math.min(y2, padding + height)));
        
        ctx.strokeStyle = "rgba(5, 150, 105, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add trend line label
        ctx.font = "italic 11px sans-serif";
        ctx.fillStyle = "rgba(5, 150, 105, 0.9)";
        ctx.fillText("Time Complexity Trend", padding + width - 140, padding + 20);
      }
    }
  };
  
  // Mock implementation of the benchmark functionality
  // In a real app, this would be your actual algorithm measurement code
  const runBenchmark = (additionalCases = []) => {
    // Default test cases
    const defaultCases = [
      {
        description: "Simple Case",
        str1: "cat",
        str2: "bat",
        distance: 1,
        matrixSize: "4x4",
        executionTime: "0.4"
      },
      {
        description: "Medium Case",
        str1: "kitten",
        str2: "sitting",
        distance: 3,
        matrixSize: "7x8",
        executionTime: "2.8"
      },
      {
        description: "Medium-Large Case",
        str1: "algorithms",
        str2: "logarithms",
        distance: 3,
        matrixSize: "10x11",
        executionTime: "9.3"
      },
      {
        description: "Large Case",
        str1: "levenshtein",
        str2: "meilenstein",
        distance: 4,
        matrixSize: "11x12",
        executionTime: "12.7"
      },
      {
        description: "Very Large Case",
        str1: "visualization",
        str2: "initialization",
        distance: 7,
        matrixSize: "13x14",
        executionTime: "27.9"
      },
      {
        description: "Complex Case",
        str1: "computational",
        str2: "combinatorial",
        distance: 5,
        matrixSize: "13x13",
        executionTime: "19.8"
      }
    ];
    
    // Process additional custom test cases
    const processedCustomCases = additionalCases.map(customCase => {
      // Simulate algorithm execution
      const matrixSize = `${customCase.str1.length+1}x${customCase.str2.length+1}`;
      const cellCount = (customCase.str1.length+1) * (customCase.str2.length+1);
      
      // Simulate Levenshtein distance (simplified)
      let distance = 0;
      const minLength = Math.min(customCase.str1.length, customCase.str2.length);
      
      for (let i = 0; i < minLength; i++) {
        if (customCase.str1[i] !== customCase.str2[i]) {
          distance++;
        }
      }
      
      distance += Math.abs(customCase.str1.length - customCase.str2.length);
      
      // Simulate execution time based on matrix size with some randomness
      const baseTime = cellCount * 0.18;
      const variability = baseTime * 0.3;
      const executionTime = (baseTime + (Math.random() * variability - variability/2)).toFixed(1);
      
      return {
        ...customCase,
        distance,
        matrixSize,
        executionTime
      };
    });
    
    return [...defaultCases, ...processedCustomCases];
  };
  
  // Simplified complexity analysis data
  const complexityInfo = {
    timeComplexity: "O(m×n) where m and n are the lengths of the two strings. The algorithm builds a matrix of size (m+1)×(n+1) and fills each cell exactly once.",
    spaceComplexity: "O(m×n) due to the dynamic programming matrix required to store intermediate results during computation.",
    optimizationNote: "For long strings, memory usage can be optimized to O(min(m,n)) by only storing the current and previous rows of the matrix, as each cell only depends on its neighbors.",
    practicalConsiderations: "Performance degrades quadratically with string length. Consider specialized algorithms for very long strings (e.g., DNA sequences) or approximate methods for fuzzy matching at scale."
  };

  return (
    <div className="benchmark-container relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-light tracking-tight text-slate-700">
          <span className="font-medium">Algorithm</span> Performance Analysis
        </h2>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 text-sm"
          >
            {showAddForm ? "Cancel" : "Add Custom Test"}
          </button>
          
          <button
            onClick={executePerformanceTests}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:from-teal-500 hover:to-emerald-600 disabled:opacity-70 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px"
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
      </div>
      
      {/* Custom test case form */}
      {showAddForm && (
        <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 animated-fade-in">
          <h3 className="text-md font-medium mb-3 text-slate-700">Add Custom Test Case</h3>
          <form onSubmit={addCustomTestCase} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source String:</label>
              <input
                type="text"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder="Enter source string"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target String:</label>
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder="Enter target string"
                required
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-white rounded-lg hover:from-teal-500 hover:to-emerald-600 transition-all duration-200"
              >
                Add Test Case
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Custom test cases list */}
      {customTestCases.length > 0 && (
        <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-md font-medium mb-3 text-slate-700">Your Custom Test Cases</h3>
          <div className="space-y-2">
            {customTestCases.map((testCase, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-slate-700">
                  <span className="font-medium">{testCase.str1}</span> → <span className="font-medium">{testCase.str2}</span>
                </div>
                <button
                  onClick={() => removeCustomTestCase(idx)}
                  className="text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="relative text-center py-16 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl overflow-hidden">
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
          <p className="text-slate-700 mt-4 font-light">Analyzing algorithm performance...</p>
        </div>
      ) : benchmarkResults ? (
        <>
          {/* Chart Tabs */}
          <div className="mb-4 flex border-b border-slate-200">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeChart === 'execution' ? 'text-teal-600 border-b-2 border-teal-500' : 'text-slate-600 hover:text-teal-600'}`}
              onClick={() => setActiveChart('execution')}
            >
              Execution Time Chart
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeChart === 'complexity' ? 'text-teal-600 border-b-2 border-teal-500' : 'text-slate-600 hover:text-teal-600'}`}
              onClick={() => setActiveChart('complexity')}
            >
              Edit Distance Chart
            </button>
          </div>
          
          {/* Results Chart */}
          <div className="mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <canvas 
              ref={chartRef} 
              width="700" 
              height="350" 
              className="mx-auto"
            ></canvas>
          </div>
          
          {/* Results Table */}
          <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 opacity-50"></div>
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Test Case
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Source Text
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Target Text
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Edit Distance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Matrix Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Time (ms)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkResults.map((result, idx) => (
                    <tr 
                      key={idx} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50/30 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
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
                          ${parseFloat(result.executionTime) > 20
                            ? "bg-rose-100 text-rose-800"
                            : parseFloat(result.executionTime) > 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"}
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
          
          {/* Run History Comparison */}
          {runHistory.length > 1 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-700">Performance History</h3>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                >
                  {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showComparison ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {showComparison && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 bg-slate-50">Run</th>
                          {benchmarkResults.slice(0, 3).map((result, idx) => (
                            <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-slate-700 bg-slate-50">
                              {result.description}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 bg-slate-50">
                            Average Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {runHistory.slice(-3).map((run, runIdx) => (
                          <tr key={run.id} className={runIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-4 py-3 text-sm text-slate-700">{run.timestamp}</td>
                            {run.results.slice(0, 3).map((result, resultIdx) => (
                              <td key={resultIdx} className="px-4 py-3 text-sm text-slate-700">
                                <span className={`
                                  inline-block rounded-full px-2 py-0.5 text-xs font-medium
                                  ${parseFloat(result.executionTime) > 20
                                    ? "bg-rose-100 text-rose-800"
                                    : parseFloat(result.executionTime) > 5
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-emerald-800"}
                                `}>
                                  {result.executionTime} ms
                                </span>
                              </td>
                            ))}
                            <td className="px-4 py-3 text-sm font-medium text-slate-700">
                              {(run.results.reduce((acc, curr) => acc + parseFloat(curr.executionTime), 0) / run.results.length).toFixed(1)} ms
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Algorithm Analysis with elegant design */}
          <div className="p-8 rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-50/30 -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-50/30 -ml-32 -mb-32 blur-3xl"></div>
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
          
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <p className="mt-5 text-slate-600 max-w-md mx-auto">No performance data available yet. Click "Run Benchmark" to analyze algorithm efficiency.</p>
          
          <div className="mt-8">
            <button
              onClick={executePerformanceTests}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px"
            >
              Start Analysis
            </button>
          </div>
          
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
        
        .animated-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default BenchmarkTool;