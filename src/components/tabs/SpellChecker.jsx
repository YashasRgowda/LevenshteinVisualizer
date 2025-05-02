import React from "react";
import useSpellCheck from "../hooks/useSpellCheck";

function SpellChecker({ 
  dictionary, 
  setDictionary, 
  setSourceString, 
  setTargetString, 
  setActiveTab 
}) {
  // Utilize our custom spell checking functionality
  const {
    inputWord,
    setInputWord,
    dictionaryInput,
    setDictionaryInput,
    spellCheckResults,
    checkSpelling,
    addToDictionary
  } = useSpellCheck(dictionary);

  // Process dictionary word addition
  const handleWordAddition = (e) => {
    e.preventDefault();
    const wordToAdd = dictionaryInput.trim();
    if (wordToAdd !== "") {
      addToDictionary(wordToAdd);
      setDictionary([...dictionary, wordToAdd]);
      setDictionaryInput("");
    }
  };

  // Process spell check request
  const initiateSpellCheck = (e) => {
    e.preventDefault();
    checkSpelling(inputWord);
  };

  // Navigate to detailed comparison view
  const showDetailedComparison = (result) => {
    setSourceString(inputWord);
    setTargetString(result.word);
    setActiveTab("standard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dictionary Management Section */}
      <div className="p-6 rounded-xl border border-slate-200 shadow-sm order-2 lg:order-1 bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-50/30 -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <h2 className="text-xl font-light mb-5 text-slate-700 border-b pb-3 border-slate-200">
            <span className="font-medium">Dictionary</span> Management
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Available Words:
            </label>
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/80 max-h-48 overflow-y-auto transition-all duration-300 hover:border-teal-200">
              {dictionary.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dictionary.map((word, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 italic flex items-center justify-center h-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Dictionary is currently empty
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleWordAddition} className="mb-4">
            <div className="flex shadow-sm rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-400/50 transition-all duration-300">
              <input
                type="text"
                value={dictionaryInput}
                onChange={(e) => setDictionaryInput(e.target.value)}
                className="w-full p-3 border-y border-l border-slate-200 rounded-l-lg focus:outline-none bg-white"
                placeholder="Enter word to add"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white px-5 py-3 hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 disabled:opacity-70 flex items-center"
                disabled={!dictionaryInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Word
              </button>
            </div>
          </form>
          
          {dictionary.length > 0 && (
            <div className="text-slate-600 text-sm bg-teal-50 p-3 rounded-lg border border-teal-100 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                The Levenshtein algorithm will use this dictionary to find the closest matching words.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spell Check Section */}
      <div className="p-6 rounded-xl border border-slate-200 shadow-sm order-1 lg:order-2 bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-50/30 -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative">
          <h2 className="text-xl font-light mb-5 text-slate-700 border-b pb-3 border-slate-200">
            <span className="font-medium">Spell</span> Checker
          </h2>

          <form onSubmit={initiateSpellCheck} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Text to Verify:
              </label>
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-200 bg-white"
                placeholder="Type a word to check against dictionary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 text-white px-4 py-3 rounded-lg hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-px disabled:opacity-70"
              disabled={!inputWord.trim() || dictionary.length === 0}
            >
              Verify Spelling
            </button>
            
            {dictionary.length === 0 && (
              <div className="mt-4 flex items-start text-slate-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Please add words to the dictionary first to enable spell checking functionality.</p>
              </div>
            )}
          </form>

          {/* Results Section */}
          {spellCheckResults.length > 0 && (
            <div className="border-t border-slate-200 pt-5 animated-fade-in">
              <h3 className="font-medium text-lg mb-4 text-slate-700">Spelling Analysis</h3>
              
              <div className="mb-5 p-4 bg-teal-50/50 rounded-lg border border-teal-100 shadow-sm">
                <p className="font-medium text-slate-700">Input: <span className="font-normal text-slate-600">"{inputWord}"</span></p>
                <p className="text-slate-600 mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Levenshtein Distance: <span className="font-medium ml-1">{spellCheckResults[0].distance}</span>
                </p>
              </div>

              <div>
                <h4 className="text-md font-medium mb-3 text-slate-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  Similar Words:
                </h4>
                <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {spellCheckResults.map((result, idx) => (
                    <li 
                      key={idx} 
                      className="py-3 px-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div>
                        <span className="font-medium text-slate-700">{result.word}</span>
                        <span className="ml-2 text-slate-500 text-sm">
                          (Distance: {result.distance})
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 text-sm rounded-md transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-md transform hover:translate-y-px"
                        onClick={() => showDetailedComparison(result)}
                      >
                        Compare
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        .animated-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SpellChecker;