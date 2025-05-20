import React, { useState, useRef, useEffect } from 'react';

const patterns = {
  1: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
  2: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
  3: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
};

const cellSize = 20;
const gridSize = 4;

const transposeToRowWise = (pattern) => {
  const result = new Array(pattern.length);
  const size = Math.sqrt(pattern.length);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      result[row * size + col] = pattern[col * size + row];
    }
  }
  return result;
};

const drawPattern = (ctx, pattern) => {
  for (let i = 0; i < pattern.length; i++) {
    const x = (i % gridSize) * cellSize;
    const y = Math.floor(i / gridSize) * cellSize;
    ctx.fillStyle = pattern[i] === 1 ? '#3b82f6' : '#e5e7eb';
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x, y, cellSize, cellSize);
  }
};

const PatternCanvas = ({ pattern }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawPattern(ctx, pattern);
  }, [pattern]);

  return (
    <canvas
      ref={canvasRef}
      width={cellSize * gridSize}
      height={cellSize * gridSize}
      className="cursor-pointer border"
    />
  );
};

const StyledButton = ({ onClick, disabled, children, color }) => {
  const colorMap = {
    green: 'bg-green-500 hover:bg-green-600 shadow-green-400',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 shadow-yellow-200',
    red: 'bg-red-500 hover:bg-red-600 shadow-red-400',
  };

  const classes = colorMap[color] || colorMap.green;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded font-bold text-white transition-all ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : `${classes} shadow-md hover:shadow-xl`
      }`}
      style={{
        textShadow: '0 0 3px #fff, 0 0 6px #fff',
      }}
    >
      {children}
    </button>
  );
};

const GridPattern = () => {
  const [gridSequence, setGridSequence] = useState([]);
  const maxPatterns = 4;

  const handleAddPattern = (patternKey) => {
    if (gridSequence.length >= maxPatterns) {
      alert(`You can only select up to ${maxPatterns} patterns.`);
      return;
    }

    const transposed = transposeToRowWise(patterns[patternKey]);
    setGridSequence((prev) => [...prev, transposed]);
  };

  const handleUndo = () => {
    setGridSequence((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setGridSequence([]);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-8"
      style={{
        background: 'linear-gradient(to top, #4466ff, #66bbff)',
        fontFamily: 'monospace',
        color: '#0f0',
      }}
    >
      <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
        Compose Your Dance Grid
      </h1>

      <p className="text-green-300 mb-6 text-sm">
        {gridSequence.length} of {maxPatterns} patterns selected
      </p>

      {/* Pattern selector */}
      <div className="flex gap-6 mb-8 flex-wrap justify-center">
        {Object.keys(patterns).map((key) => {
          const disabled = gridSequence.length >= maxPatterns;
          return (
            <div
              key={key}
              onClick={() => !disabled && handleAddPattern(key)}
              className={`transition-transform transform hover:scale-105 ${
                disabled ? 'opacity-30 pointer-events-none' : 'cursor-pointer'
              }`}
              style={{
                border: '2px solid #00ffcc',
                boxShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#001f3f',
              }}
            >
              <PatternCanvas pattern={patterns[key]} />
              <p className="text-center text-xs text-cyan-200 mt-1">
                Pattern {key}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sequence preview */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-white drop-shadow">
          Sequence Preview
        </h2>

        {gridSequence.length === 0 ? (
          <p className="text-gray-200">
            Click a pattern to add to the sequence
          </p>
        ) : (
          <div className="flex flex-row gap-6 flex-wrap justify-center">
            {gridSequence.map((pattern, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <p className="text-xs text-white mb-1">Step {idx + 1}</p>
                <PatternCanvas pattern={pattern} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <StyledButton onClick={handleUndo} disabled={gridSequence.length === 0} color="yellow">
          Undo Last
        </StyledButton>
        <StyledButton onClick={handleClear} disabled={gridSequence.length === 0} color="red">
          Clear All
        </StyledButton>
        <StyledButton
          onClick={() => console.log('Saved Sequence:', gridSequence)}
          disabled={gridSequence.length === 0}
          color="green"
        >
          Save Sequence
        </StyledButton>
      </div>
    </div>
  );
};

export default GridPattern;
