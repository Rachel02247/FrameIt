import React, { useRef, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

interface Prediction {
  className: string;
  probability: number;
}

interface ImageAnalyzerWrapperProps {
  onAnalyzeComplete?: (predictions: Prediction[]) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerWrapperProps> = ({ onAnalyzeComplete }) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      setPredictions([]);
    }
  };

  const analyze = async () => {
    if (!imageRef.current) return;
    setIsLoading(true);
    const model = await mobilenet.load();
    const results = await model.classify(imageRef.current);
    setPredictions(results);
    setIsLoading(false);
    if (onAnalyzeComplete) {
      onAnalyzeComplete(results);
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-xl border bg-gradient-to-br from-white via-gray-50 to-gray-100 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🔍 Analyze Your Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full mb-4 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />

      {imageURL && (
        <>
          <img
            src={imageURL}
            alt="To analyze"
            ref={imageRef}
            onLoad={analyze}
            loading="lazy"
            onError={e => { e.currentTarget.src = "/fallback-image.png"; }}
            className="rounded-xl shadow-lg mb-4 w-full object-cover max-h-64"
          />
          <div className="bg-white rounded-xl p-4 shadow-inner">
            <h3 className="text-lg font-medium mb-2">📋 Predictions:</h3>
            {isLoading ? (
              <p className="text-purple-500 animate-pulse">Analyzing image...</p>
            ) : predictions.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-700">
                {predictions.map((pred, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="mr-2">🔸</span>
                    {pred.className} — {(pred.probability * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No predictions yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageAnalyzer;