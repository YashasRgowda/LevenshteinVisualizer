import { useState, useEffect } from "react";

/**
 * Custom hook for controlling step-by-step animation sequences
 * Provides functionality to start, stop, and track animation progress
 * 
 * @param {Array} visualSteps - Collection of steps to animate through
 * @param {Function} updateStepIndex - Function to update the current step index
 * @param {number} animationSpeed - Time between steps in milliseconds (default: 1000ms)
 * @returns {Object} Animation control functions and state variables
 */
function useAnimation(visualSteps, updateStepIndex, animationSpeed = 1000) {
  // Track animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Store reference to the interval timer
  const [timerRef, setTimerRef] = useState(null);
  
  // Clean up animation resources when component unmounts or dependencies change
  useEffect(() => {
    // Return cleanup function to prevent memory leaks
    return () => {
      if (timerRef) {
        clearInterval(timerRef);
      }
    };
  }, [timerRef]);
  
  /**
   * Begins the step-by-step animation sequence
   * Resets to the first step and advances at defined intervals
   */
  const initiateAnimation = () => {
    // Guard clause for empty steps array
    if (!visualSteps || visualSteps.length === 0) return;
    
    // Clear any existing animation timer
    if (timerRef) {
      clearInterval(timerRef);
    }
    
    // Reset to the beginning of the sequence
    updateStepIndex(0);
    setIsAnimating(true);
    
    // Create new animation timer
    const newTimer = setInterval(() => {
      updateStepIndex((currentIndex) => {
        // Check if we've reached the end of the steps
        const nextIndex = currentIndex + 1;
        if (nextIndex >= visualSteps.length) {
          // End animation when we reach the last step
          clearInterval(newTimer);
          setIsAnimating(false);
          setTimerRef(null);
          return currentIndex; // Return current index to prevent going past the end
        }
        return nextIndex; // Advance to next step
      });
    }, animationSpeed);
    
    // Store timer reference for later cleanup
    setTimerRef(newTimer);
  };
  
  /**
   * Halts the currently running animation sequence
   * Preserves the current step position
   */
  const terminateAnimation = () => {
    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
      setIsAnimating(false);
    }
  };
  
  // Return animation controls and state
  return {
    isAnimating,
    startAnimation: initiateAnimation,
    stopAnimation: terminateAnimation
  };
}

export default useAnimation;