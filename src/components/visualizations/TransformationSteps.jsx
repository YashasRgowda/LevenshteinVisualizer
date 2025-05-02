import React from "react";

/**
 * Component for visualizing the step-by-step transformation process
 * Shows how the source string is transformed into the target string
 * with controls for navigation and animation
 */
function TransformationSteps({ 
  visualSteps, 
  currentStepIndex, 
  setCurrentStepIndex, 
  isAnimating,
  startAnimation,
  stopAnimation
}) {
  // Don't render if no steps are available
  if (!visualSteps || visualSteps.length === 0) return null;

  // Get the current step data
  const currentStep = visualSteps[currentStepIndex];

  // Navigate to previous step if available
  const moveToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Navigate to next step if available
  const moveToNextStep = () => {
    if (currentStepIndex < visualSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Custom operation icons with more elegant symbols
  const operationIcons = {
    match: "≡",     // Triple bar (equivalent)
    replace: "⟿",  // Long rightwards arrow from bar
    insert: "⊕",    // Circled plus
    delete: "⊖"     // Circled minus
  };

  // Map operations to descriptive labels and colors
  const operationStyles = {
    match: {
      label: "Match",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      lightBg: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    replace: {
      label: "Replace",
      bgColor: "bg-amber-500",
      textColor: "text-amber-700",
      lightBg: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    insert: {
      label: "Insert",
      bgColor: "bg-teal-500",
      textColor: "text-teal-700",
      lightBg: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    delete: {
      label: "Delete",
      bgColor: "bg-rose-500",
      textColor: "text-rose-700",
      lightBg: "bg-rose-50",
      borderColor: "border-rose-200"
    }
  };

  // Get current operation style
  const currentOpStyle = operationStyles[currentStep?.operation] || operationStyles.match;

  return (
    <div className="transformation-steps p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-50/30 -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-50/30 -ml-32 -mb-32 blur-3xl"></div>
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 pb-3 border-b border-slate-200">
          <h2 className="text-xl font-light text-slate-700 mb-3 sm:mb-0">
            <span className="font-medium">Transformation</span> Process
          </h2>
          
          <button
            onClick={isAnimating ? stopAnimation : startAnimation}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-sm hover:shadow-md ${
              isAnimating
                ? "bg-slate-700 hover:bg-slate-800 text-white"
                : "bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white"
            }`}
          >
            {isAnimating ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Stop Animation
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Auto-Play Steps
              </>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center space-x-2 sm:space-x-4 mb-6">
          <button
            onClick={moveToPreviousStep}
            disabled={currentStepIndex === 0 || isAnimating}
            className="bg-white border border-slate-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm text-sm flex-shrink-0"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </span>
          </button>
          
          <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-center text-sm">
            Step {currentStepIndex + 1} of {visualSteps.length}
          </div>
          
          <button
            onClick={moveToNextStep}
            disabled={currentStepIndex === visualSteps.length - 1 || isAnimating}
            className="bg-white border border-slate-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm text-sm flex-shrink-0"
          >
            <span className="flex items-center">
              <span className="hidden sm:inline">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>

        <div className="overflow-x-auto flex">
          <div className="flex space-x-1 sm:space-x-2 mb-3">
            {visualSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => !isAnimating && setCurrentStepIndex(idx)}
                disabled={isAnimating}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex 
                    ? `${currentOpStyle.bgColor} w-8` 
                    : idx < currentStepIndex 
                      ? 'bg-teal-300 w-3' 
                      : 'bg-slate-200 w-3'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {currentStep && (
          <div className={`step-visualization border rounded-lg p-5 ${currentOpStyle.lightBg} ${currentOpStyle.borderColor} transition-all duration-300 shadow-sm`}>
            <div className="mb-4 pb-3 border-b border-slate-200/70">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="text-sm font-medium text-slate-600 mb-2 sm:mb-0">
                  Operation Type
                </div>
                <div className={`${currentOpStyle.bgColor} text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm`}>
                  {currentOpStyle.label}
                </div>
              </div>
              <p className="mt-3 text-slate-700">
                {currentStep.description}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="transformation-before bg-white p-4 rounded-lg w-full text-center mb-5 border border-slate-200 font-mono text-slate-800 shadow-sm relative overflow-hidden">
                {currentStep.beforeString}
                <div className={`absolute bottom-0 left-0 h-0.5 w-full ${currentOpStyle.bgColor} opacity-70`}></div>
              </div>

              <div className={`operation-icon w-12 h-12 flex items-center justify-center rounded-full ${currentOpStyle.bgColor} text-white text-2xl mb-5 shadow-sm transform transition-transform hover:scale-110 duration-300`}>
                {operationIcons[currentStep.operation]}
              </div>

              <div className="transformation-after bg-white p-4 rounded-lg w-full text-center border border-slate-200 font-mono text-slate-800 shadow-sm relative overflow-hidden">
                {currentStep.afterString}
                <div className={`absolute bottom-0 left-0 h-0.5 w-full ${currentOpStyle.bgColor} opacity-70`}></div>
              </div>
              
              {/* Show cost information for weighted algorithm */}
              {currentStep.cost !== undefined && currentStep.cost > 0 && (
                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                  <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-700 text-sm shadow-sm">
                    <span className="font-medium">Operation Cost:</span> {currentStep.cost}
                  </span>
                  <span className={`${currentOpStyle.bgColor} px-3 py-1 rounded-full text-white text-sm shadow-sm`}>
                    <span className="font-medium">Total Cost:</span> {currentStep.totalCost}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-slate-500">
          {isAnimating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Animation running... Step transitions occur automatically
            </span>
          ) : (
            "Use the controls to navigate through transformation steps"
          )}
        </div>
      </div>
    </div>
  );
}

export default TransformationSteps;