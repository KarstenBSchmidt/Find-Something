import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs"; 
import * as mobilenet from "@tensorflow-models/mobilenet";

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
  "bottle", 
  "car", 
  "truck",
  "bus",
  "traffic light",
  "fire hydrant",
  "parking meter",
  "bench", 
  "tree"
];

const CompareImage = () => {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [results, setResults] = useState([]);
  const [target, setTarget] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  // Set TensorFlow backend and load the model
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
  
  // Generate a random target from the list
  // Reference: https://www.tensorflow.org/js/models
  // Look up the full list of objects that the TensorFlow model can recognize and update in CompareImage.jsx
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

  // Analyze the uploaded image and compare it to the target using MobileNet
  // Reference: https://www.tensorflow.org/js/models
  //            https://www.tensorflow.org/js/tutorials/transfer/image_classification
  const analyzeImage = async () => {
    if (!model) {
      console.log("Model is not loaded yet.");
      setMessage("Model is still loading. Please wait.");
      return;
    }
    if (!image) {
      console.log("No image selected.");
      setMessage("Take a picture first.");
      return;
    }

    try {
      // Create a temporary image element from the uploaded image
      // - Used to decode the image before passing it to MobileNet
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
      const imgElement = document.createElement("img");
      imgElement.src = image;
      console.log("Starting to decode the image...");
      await imgElement.decode();
      console.log("Image decoded and loaded for analysis.");

      // Get predictions from MobileNet
      const predictions = await model.classify(imgElement);
      console.log("Predictions received:", predictions);
      setResults(predictions);

      // Check if any prediction matches the target (not worried about case sensitivity)
      const isMatch = predictions.some((prediction) =>
        prediction.className.toLowerCase().includes(target.toLowerCase())
      );

      if (isMatch) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          setMessage(`Yep, that's a ${target}!`);
          return newScore;
        });
      } else {
        setMessage(`Thats not a ${target}`);
      }
    } catch (error) {
      console.error("Error anaylzing image:", error);
      setMessage("An error occurred during analysis.");
    }
  };

  return (
    <div >
      {target && (
        <>
            <h2>
                Find some
            </h2>
            <h2>
                <span className="highlight-text">{target}s</span>
            </h2>
        </>
        
      )}
      <div className="container-column">
      <div className="button-container">
        <button onClick={generateTarget}>New Target</button>
        <button onClick={analyzeImage} disabled={!model || !image}>
          Analyze
        </button>
      </div>
      
      {image && (
        <img
          src={image}
          alt="Uploaded"
        />
      )}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        style={{justifySelf: "center"}} 
        />
      </div>
      {message && (
        <div>
          <p >{message}</p>
        </div>
      )}
      {results.length > 0 && (
        <div className="sub-section">
            <h2 className="sub-section-header">That looks like a:</h2>
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



