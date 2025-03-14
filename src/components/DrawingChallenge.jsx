import React, { useState } from "react";
import Routing from "./Routing"; // Import Routing component


// List of random shapes or objects to draw
const drawingPrompts = [
  "heart",
  "smiley face",
  "star",
  "tree",
  "house",
  "cat",
  "dog",
  "dinosaur",
  "rocket",
  "duck", 
  "spiral"
];

const DrawingChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Generate a new random drawing challenge
  const generateChallenge = () => {
    const randomIndex = Math.floor(Math.random() * drawingPrompts.length);
    setChallenge(drawingPrompts[randomIndex]);
    setIsNavigating(false); // Reset navigation if new challenge is chosen
  };

  return (
    <div className="drawing-container">
      <h2>GPS Drawing Challenge</h2>

      {/* Show the challenge or generate a new one */}
      {challenge ? (
        <h2>Try to draw a <span className="highlight-text">{challenge}</span> using your walking path</h2>
      ) : (
        <button onClick={generateChallenge}>Get a Random Drawing Challenge</button>
      )}

      {/* Start Navigation Button */}
      {challenge && !isNavigating && (
        <button onClick={() => setIsNavigating(true)}>Start Navigation</button>
      )}

      {/* Show Routing component only when navigation starts */}
      {isNavigating && (
        <div id="routingContainer">
            <Routing />
        </div>
      )}
    </div>
  );
};

export default DrawingChallenge;