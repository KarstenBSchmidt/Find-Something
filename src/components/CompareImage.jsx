import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

const targetObjects = [
  "stop sign", "traffic light", "crosswalk", "streetlight", "fire hydrant", 
  "parking meter", "mailbox", "manhole cover",
  "storefront", "ATM machine", "bench", "trash can", "bus stop", 
  "subway entrance", "newspaper stand", "billboard", "fountain", "clock tower",
  "car", "bus", "truck", "bicycle", "motorcycle", "taxi", "scooter", "skateboard", 
  "pedestrian crossing signal",
  "coffee shop", "restaurant sign", "grocery cart", "shopping bag", 
  "street vendor cart", "outdoor seating",
  "jogger", "dog walker", "cyclist", "street performer", "construction worker", 
  "delivery person", "person with an umbrella",
  "tree", "bush", "flower bed", "pigeon", "park bench", "drinking fountain",
  "shopping cart", "public bicycle rack", "trash bin", "recycling bin", "electric scooter"
];

const CompareImage = () => {
  const [model, setModel] = useState(null);
  const [results, setResults] = useState([]);
  const [target, setTarget] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  // Load the TensorFlow model
  useEffect(() => {
    const setupModel = async () => {
      try {
        await tf.setBackend("cpu");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model:", error);
        setMessage("Error loading model. Please refresh the page.");
      }
    };
    setupModel();
    generateTarget(); // Generate a target when the component mounts
  }, []);

  // Generate a new target object
  const generateTarget = () => {
    const randomTarget = targetObjects[Math.floor(Math.random() * targetObjects.length)];
    setTarget(randomTarget);
    setMessage("");
    setResults([]);
    setImageURL(null);
  };

  // Start the camera
  // Ref: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  useEffect(() => {
    if (cameraOn) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setMessage("Cant find a camera.");
        }
      };
      startCamera();
    }
  }, [cameraOn]);

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  // Capture an image from the video feed
  const captureImage = () => {
    if (!cameraOn) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedImageURL = canvas.toDataURL("image/png");
    setImageURL(capturedImageURL);
    setMessage("");
    setResults([]);
    stopCamera(); // Stop camera after capturing image
  };

  // Analyze the captured image
  const analyzeImage = async () => {
    if (!model) {
      setMessage("Hold up, the model is still loading");
      return;
    }
    if (!imageURL) {
      setMessage("Take a picture first.");
      return;
    }

    // Analyze the image using the TensorFlow model
    // Ref: https://www.tensorflow.org/js/guide/tensors_operations
    try {
      const imgElement = document.createElement("img");
      imgElement.src = imageURL;
      await imgElement.decode();

      const predictions = await model.classify(imgElement);
      setResults(predictions);

      const isMatch = predictions.some((prediction) =>
        prediction.className.toLowerCase().includes(target?.toLowerCase())
      );

      setMessage(isMatch ? `Yep, that's a ${target}!` : `That's not a ${target}`);
      if (isMatch) setScore((prev) => prev + 1);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setMessage("An error occurred during analysis.");
    }
  };

  // Cleanup when the component unmounts or the window is closed
  // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  useEffect(() => {
    const handleUnload = () => {
      stopCamera();
      if (imageURL) URL.revokeObjectURL(imageURL);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [imageURL]);

  return (
    <div style={{ maxWidth: "75vw"}}>
      {target && (
        <>
          <h2>Find a</h2>
          <h2>
            <span className="highlight-text">{target}</span>
          </h2>
        </>
      )}

      <div className="button-container">
          <button onClick={generateTarget}>New Target</button>
          <button onClick={analyzeImage} disabled={!model || !imageURL}>
            Analyze
          </button>
      </div>

      {/* Video element*/}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: cameraOn ? "block" : "none" }} />

      {imageURL && (
          <div>
            <img src={imageURL} alt="Captured" id="userImage"/>
          </div>
      )}

      <div className="container-column">

        {!cameraOn && !imageURL && (
          <button onClick={() => setCameraOn(true)}>Open Camera</button>
        )}

        {cameraOn && <button onClick={captureImage}>Capture Photo</button>}

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      </div>

      {/* Message */}
      {message && <div><p>{message}</p></div>}

      {/* Predictions */}
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






