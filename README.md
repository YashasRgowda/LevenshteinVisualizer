# Levenshtein Distance Visualizer

An interactive educational tool that demonstrates and visualizes the Levenshtein distance algorithm for measuring the similarity between strings.

## Overview

This project provides an intuitive, visual way to understand how the Levenshtein distance algorithm works. It's designed to serve as both an educational resource and a practical demonstration of string similarity measurement techniques.

## Features

- **Interactive Visualization**: Step-by-step visualization of the Levenshtein algorithm's execution
- **Multiple Modes**:
  - **Standard Algorithm**: Visualize the classic Levenshtein distance calculation
  - **Weighted Algorithm**: Customize costs for different edit operations
  - **Spell Checker**: Practical application showing correction suggestions
  - **Fuzzy Search**: Real-world application for database searching with typo tolerance
  - **Performance Analysis**: Benchmarking and complexity visualization

## Technologies Used

- React.js
- Tailwind CSS
- JavaScript ES6+
- HTML5 Canvas (for charts and visualizations)

## Demo

Try it out: [Live Demo](https://your-demo-url.com)

## Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/f1f5f9/0f766e?text=Standard+Algorithm" alt="Standard Algorithm" />
      <p align="center">Standard Algorithm View</p>
    </td>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/f1f5f9/0f766e?text=Fuzzy+Search" alt="Fuzzy Search" />
      <p align="center">Fuzzy Search Application</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/f1f5f9/0f766e?text=Performance+Analysis" alt="Performance Analysis" />
      <p align="center">Performance Analysis</p>
    </td>
    <td width="50%">
      <img src="https://via.placeholder.com/400x250/f1f5f9/0f766e?text=Spell+Checker" alt="Spell Checker" />
      <p align="center">Spell Checker</p>
    </td>
  </tr>
</table>

## Key Concepts Demonstrated

1. **Dynamic Programming**: The core algorithm uses a dynamic programming approach to find the minimum edit distance.
2. **Visualization Techniques**: Transforms complex algorithmic concepts into visual, interactive learning experiences.
3. **Real-world Applications**: Demonstrates practical uses of the algorithm in spell checking, fuzzy search, and more.
4. **Performance Analysis**: Provides insights into algorithmic complexity and performance characteristics.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/levenshtein-visualizer.git
   cd levenshtein-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
OneBanc/
└── Frontend/
    ├── eslint.config.js        # ESLint configuration
    ├── index.html              # Entry HTML file
    ├── package.json            # Project dependencies
    ├── README.md               # Project documentation
    ├── vite.config.js          # Vite configuration
    ├── src/
    │   ├── App.css             # Global styles
    │   ├── App.jsx             # Main application component
    │   ├── main.jsx            # Application entry point
    │   ├── components/
    │   │   ├── LandingPage.jsx             # Landing page component
    │   │   ├── LevenshteinVisualizer.jsx   # Main container component
    │   │   ├── visualizations/
    │   │   │   ├── LevenshteinMatrix.jsx    # Matrix visualization
    │   │   │   └── TransformationSteps.jsx  # Step-by-step visualization
    │   │   ├── utils/
    │   │   │   └── benchmarkUtils.js        # Performance testing utilities
    │   │   ├── tabs/
    │   │   │   ├── BenchmarkTool.jsx        # Performance analysis tab
    │   │   │   ├── FuzzySearch.jsx          # Fuzzy search application tab
    │   │   │   ├── SpellChecker.jsx         # Spell checker application tab
    │   │   │   ├── StandardLevenshtein.jsx  # Standard algorithm tab
    │   │   │   └── WeightedLevenshtein.jsx  # Weighted algorithm tab
    │   │   ├── hooks/
    │   │   │   ├── useAnimation.js          # Animation control hook
    │   │   │   ├── useFuzzySearch.js        # Fuzzy search logic hook
    │   │   │   ├── useLevenshtein.js        # Core algorithm implementation
    │   │   │   └── useSpellCheck.js         # Spell check logic hook
    │   │   └── data/
    │   │       └── sampleDatabase.js        # Sample data for fuzzy search
    │   └── assets/
    │       └── react.svg                    # React logo asset
    └── public/
        └── vite.svg                         # Public favicon
```

## The Algorithm

The Levenshtein distance measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another.

The algorithm uses a dynamic programming approach with a matrix where:
- Each cell (i,j) represents the minimum number of operations to transform the first i characters of string A into the first j characters of string B.
- The final value in the bottom-right cell represents the Levenshtein distance between the two strings.

## Use Cases

- **Text Similarity**: Measuring how similar two strings are
- **Spell Checking**: Finding the closest correct word to a misspelled one
- **DNA Sequence Analysis**: Comparing genetic sequences
- **Fuzzy Search**: Finding records that approximately match search terms
- **Plagiarism Detection**: Identifying similar text passages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the need for better educational tools for algorithm visualization
- Special thanks to all contributors who have helped improve this project

---

Made with passion by [Yashas R]
