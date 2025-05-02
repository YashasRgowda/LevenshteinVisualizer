import { useState } from 'react';
import './App.css';
import LevenshteinVisualizer from './components/LevenshteinVisualizer';

function App() {
  return (
    <div className="App">
      <LevenshteinVisualizer />
    </div>
  );
}

export default App;