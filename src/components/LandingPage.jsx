import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  // Animation for the example text transformation
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const sourceText = "algorithm";
  const targetText = "logarithm";
  
  // Example transformation steps
  const transformationSteps = [
    { operation: "insert", position: 0, char: "l", text: "lalgorithm" },
    { operation: "insert", position: 1, char: "o", text: "logarithm" },
    { operation: "delete", position: 2, char: "a", text: "loggorithm" },
    { operation: "delete", position: 3, char: "o", text: "loggrithm" },
    { operation: "delete", position: 3, char: "g", text: "logarithm" }
  ];
  
  useEffect(() => {
    if (!isAnimating) return;
    
    const timer = setTimeout(() => {
      setAnimationStep((prev) => (prev + 1) % (transformationSteps.length + 1));
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [animationStep, isAnimating]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-emerald-700 text-white overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 pattern-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -mb-20 -ml-20 blur-3xl"></div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 leading-tight">
              <span className="font-medium">Levenshtein</span> Distance Visualizer
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              An interactive educational tool for understanding string transformation algorithms
            </p>
            
            <Link to="/visualizer" className="px-8 py-3 bg-white text-teal-700 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-block">
              Launch Visualizer
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 py-16">
        {/* Visualization Preview */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-800 mb-4">
              <span className="font-medium">Visualize</span> Text Transformations
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Watch how strings transform step by step with optimal edit operations
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            
            <div className="relative">
              <div className="flex flex-col items-center mb-8">
                <div className="text-2xl font-mono mb-6 text-slate-700 relative">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-slate-500 mb-2">Original</span>
                      <span className="px-6 py-3 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
                        {sourceText}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-slate-500 mb-2">Target</span>
                      <span className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        {targetText}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full max-w-md p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-mono text-lg text-center relative h-12 flex items-center justify-center">
                    {animationStep === 0 ? (
                      <span className="text-slate-700">{sourceText}</span>
                    ) : (
                      <span className="text-slate-700">
                        {transformationSteps[animationStep - 1].text}
                      </span>
                    )}
                    
                    {animationStep > 0 && (
                      <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${transformationSteps[animationStep - 1].operation === 'insert' 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-rose-500 text-white'}`}
                        >
                          {transformationSteps[animationStep - 1].operation === 'insert' ? '+' : '-'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div className="text-sm text-slate-500">
                      Step: {animationStep}/{transformationSteps.length}
                    </div>
                    <button 
                      onClick={() => setIsAnimating(!isAnimating)}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      {isAnimating ? 'Pause' : 'Play'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  to="/visualizer" 
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Try It Yourself
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Standard Algorithm",
              description: "Explore the classic Levenshtein distance calculation with equal operation costs",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )
            },
            {
              title: "Weighted Operations",
              description: "Customize costs for insertions, deletions, and substitutions",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              )
            },
            {
              title: "Spell Checker",
              description: "See a practical application with dictionary-based spell checking",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              title: "Performance Analysis",
              description: "Analyze algorithm efficiency with interactive benchmarking tools",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Educational Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-800 mb-4">
              <span className="font-medium">Learn</span> Through Visualization
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Understanding edit distance algorithms through interactive exploration
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-medium text-slate-800 mb-4">What is Levenshtein Distance?</h3>
                <p className="text-slate-600 mb-4">
                  The Levenshtein distance is a string metric for measuring the difference between two sequences. It calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another.
                </p>
                <p className="text-slate-600 mb-4">
                  This algorithm is widely used in applications like spell checking, DNA sequence analysis, and natural language processing to measure string similarity.
                </p>
                <p className="text-slate-600">
                  Our visualizer helps you understand the underlying dynamic programming approach and see exactly how strings transform step by step.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-lg border border-teal-100">
                <h4 className="text-lg font-medium text-teal-800 mb-3">Applications</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Spell checking</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>DNA sequence alignment</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fuzzy string matching</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Plagiarism detection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-light mb-6">
            Ready to <span className="font-medium">explore</span>?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Dive into the interactive Levenshtein Distance Visualizer and enhance your understanding of string transformation algorithms.
          </p>
          <Link 
            to="/visualizer" 
            className="px-8 py-3 bg-white text-teal-700 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
          >
            Launch Visualizer
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-medium">Levenshtein</span> Distance Visualizer
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS */}
      <style jsx>{`
        .pattern-grid {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;