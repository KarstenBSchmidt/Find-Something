import React, { useState, useEffect } from "react";

import * as mobilenet from "@tensorflow-models/mobilenet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CompareImage = () => {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const analyzeImage = async () => {
    if (!model || !image) return;

    const imgElement = document.createElement("img");
    imgElement.src = image;
    await new Promise((resolve) => (imgElement.onload = resolve));
    
    const predictions = await model.classify(imgElement);
    setResults(predictions);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Image Comparator</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" className="w-64 h-64 object-cover" />}
      <Button onClick={analyzeImage} disabled={!model || !image}>
        Compare Image
      </Button>
      {results.length > 0 && (
        <Card className="mt-4 p-4">
          <CardContent>
            <h2 className="text-xl font-semibold">Results:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index} className="text-lg">
                  {result.className} - {Math.round(result.probability * 100)}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompareImage;