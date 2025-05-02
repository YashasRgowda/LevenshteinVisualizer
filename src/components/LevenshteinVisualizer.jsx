import { useState } from "react";
import StandardLevenshtein from "./tabs/StandardLevenshtein";
import WeightedLevenshtein from "./tabs/WeightedLevenshtein";
import SpellChecker from "./tabs/SpellChecker";
import BenchmarkTool from "./tabs/BenchmarkTool";
import FuzzySearch from "./tabs/FuzzySearch";

/**
 * Main container component for the Levenshtein Distance Visualizer application
 * Manages tab navigation and shared state between components
 */
function LevenshteinVisualizer() {
  // Manage active tab state
  const [activeTab, setActiveTab] = useState("standard");
  
  // Shared string state accessible by all algorithm tabs
  const [sourceString, setSourceString] = useState("kitten");
  const [targetString, setTargetString] = useState("sitting");
  
  // Dictionary for spell checking functionality
  const [dictionary, setDictionary] = useState([
    "cat", "bat", "rat", "drat", "dart", "kitten", "sitting",
    "kitchen", "written", "mitten", "fitting", "hitting"
  ]);

  // Tab definitions with icons
  const tabs = [
    {
      id: "standard",
      label: "Standard Algorithm",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "weighted",
      label: "Weighted Algorithm",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
      )
    },
    {
      id: "spellcheck",
      label: "Spell Checker",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "benchmark",
      label: "Performance Analysis",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "fuzzysearch",
      label: "Fuzzy Search",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-slate-50 max-w-7xl mx-auto min-h-screen">
      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-light text-center">
            <span className="font-medium">Levenshtein</span> Distance Visualizer
          </h1>
          <p className="text-center text-teal-100 text-sm mt-2">
            Interactive tool for exploring edit distance algorithms
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Application Container */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <TabButton 
                key={tab.id}
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)}
                label={tab.label}
                icon={tab.icon}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "standard" && (
              <StandardLevenshtein 
                sourceString={sourceString}
                setSourceString={setSourceString}
                targetString={targetString}
                setTargetString={setTargetString}
              />
            )}
            
            {activeTab === "weighted" && (
              <WeightedLevenshtein 
                sourceString={sourceString}
                setSourceString={setSourceString}
                targetString={targetString}
                setTargetString={setTargetString}
              />
            )}
            
            {activeTab === "spellcheck" && (
              <SpellChecker 
                dictionary={dictionary}
                setDictionary={setDictionary}
                setSourceString={setSourceString}
                setTargetString={setTargetString}
                setActiveTab={setActiveTab}
              />
            )}
            
            {activeTab === "benchmark" && (
              <BenchmarkTool />
            )}
            
            {activeTab === "fuzzysearch" && (
              <FuzzySearch />
            )}
          </div>
        </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <InfoCard 
            title="Algorithm Overview" 
            content="Levenshtein distance measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          />
          <InfoCard 
            title="Applications" 
            content="Used in spell checking, DNA sequence analysis, plagiarism detection, fuzzy search, and natural language processing to measure string similarity."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <InfoCard 
            title="Implementation" 
            content="Built using a dynamic programming approach with a matrix to track minimum operations required at each step of the transformation."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
        </div>
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-300 text-sm mb-4 md:mb-0">
              Levenshtein Distance Visualizer | A tool for understanding string transformation algorithms
            </p>
            <div className="flex space-x-6">
              <FooterLink label="About" />
              <FooterLink label="Documentation" />
              <FooterLink label="Algorithm" />
            </div>
          </div>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          height: 6px;
        }
        
        .scrollbar-hide::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.7);
        }
        
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background-color: rgba(20, 184, 166, 0.3);
          border-radius: 3px;
        }
        
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 184, 166, 0.5);
        }
      `}</style>
    </div>
  );
}

/**
 * Tab navigation button component
 */
function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      className={`py-3 px-4 sm:px-5 font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-200 border-b-2 flex items-center ${
        active 
          ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-teal-500" 
          : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-teal-600"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </button>
  );
}

/**
 * Information card component for the dashboard
 */
function InfoCard({ title, content, icon }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start">
        <div className="mr-4 p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors duration-300">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg mb-2 pb-2 border-b border-slate-100 text-slate-800">{title}</h3>
          <p className="text-slate-600">{content}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer link component
 */
function FooterLink({ label }) {
  return (
    <button className="text-slate-300 hover:text-white transition-colors text-sm relative group">
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300"></span>
    </button>
  );
}

export default LevenshteinVisualizer;