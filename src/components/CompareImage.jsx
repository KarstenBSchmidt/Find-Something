import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";  // <-- Add this import
import * as mobilenet from "@tensorflow-models/mobilenet";

// Define simple Card component


const targetObjects = [
  "cat",
  "dog",
  "bike",
  "stop sign",
  "drinking fountain",
  "crosswalk",
  "cup",
  "clock",
  "chair",
  "table",
  "bottle"
];

const CompareImage = () => {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [results, setResults] = useState([]);
  const [target, setTarget] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  // Set the TensorFlow backend and load the model
  useEffect(() => {
    const setupModel = async () => {
      try {
        await tf.setBackend("cpu");
        console.log("Using CPU backend");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("Model loaded successfully.");
      } catch (error) {
        console.error("Error loading model:", error);
        setMessage("Error loading model. Please refresh the page.");
      }
    };

    setupModel();
  }, []);
  
  // Generate a random target from our list
  const generateTarget = () => {
    const randomTarget =
      targetObjects[Math.floor(Math.random() * targetObjects.length)];
    setTarget(randomTarget);
    setMessage("");
    setResults([]);
    setImage(null);
    console.log("New target generated:", randomTarget);
  };

  // Generate initial target on component mount
  useEffect(() => {
    generateTarget();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log("Image uploaded:", imageUrl);
      setImage(imageUrl);
      setMessage("");
      setResults([]);
    }
  };

  const analyzeImage = async () => {
    if (!model) {
      console.log("Model is not loaded yet.");
      setMessage("Model is still loading. Please wait.");
      return;
    }
    if (!image) {
      console.log("No image selected.");
      setMessage("Please upload an image first.");
      return;
    }

    try {
      // Create a temporary image element for analysis
      const imgElement = document.createElement("img");
      imgElement.src = image;
      console.log("Starting to decode the image...");
      await imgElement.decode();
      console.log("Image decoded and loaded for analysis.");

      // Get predictions from MobileNet
      const predictions = await model.classify(imgElement);
      console.log("Predictions received:", predictions);
      setResults(predictions);

      // Check if any prediction matches the target (case-insensitive)
      const isMatch = predictions.some((prediction) =>
        prediction.className.toLowerCase().includes(target.toLowerCase())
      );

      if (isMatch) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          setMessage(`Correct! You captured a ${target}. Score: ${newScore}`);
          return newScore;
        });
      } else {
        setMessage(`Incorrect. That doesn't seem to be a ${target}. Try again.`);
      }
    } catch (error) {
      console.error("Error during image analysis:", error);
      setMessage("An error occurred during analysis.");
    }
  };

  return (
    <div >
      <h1 className>Find Stuff To Take Pictures Of</h1>
      {target && (
        <h2 className="text-xl">
          Find some <span className="font-semibold">{target}s</span>
        </h2>
      )}
      <div className="flex gap-4">
        <button onClick={generateTarget}>New Target</button>
        <button onClick={analyzeImage} disabled={!model || !image}>
          Compare Image
        </button>
      </div>
      <div className="container-column">
      {image && (
        <img
          src={image}
          alt="Uploaded"
        />
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {message && (
        <div>
          <p >{message}</p>
        </div>
      )}
      {results.length > 0 && (
        <div className="section">
            <h2>That looks like a:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  {result.className} - {Math.round(result.probability * 100)}%
                </li>
              ))}
            </ul>
        </div>
      )}
      <div className="mt-4">
        <p className="text-xl">Score: {score}</p>
      </div>
    </div>
  );
};

export default CompareImage;



