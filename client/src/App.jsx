import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { InfoModal } from './components/InfoModal';
import { Sparkles } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [iterations, setIterations] = useState(5); // Reduced from 15 to 5 for faster processing
  const [threshold, setThreshold] = useState(60); // Set to 60 for good connectivity
  const [stats, setStats] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleImageSelect = useCallback((file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
    setResultImage(null);
    setStats(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setSelectedImage(null);
    setResultImage(null);
    setStats(null);
  }, []);

  const handleSegment = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('iterations', iterations);
    formData.append('threshold', threshold);

    try {
      const response = await axios.post('/api/segment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResultImage(`data:image/png;base64,${response.data.image}`);
      setStats(response.data.stats);
      toast.success('Image segmented successfully!');
    } catch (error) {
      console.error('Segmentation error:', error);
      toast.error(error.response?.data?.error || 'Failed to segment image');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, iterations, threshold]);

  const handleDownload = useCallback(() => {
    if (!resultImage) return;

    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'segmented-image.png';
    link.click();
    toast.success('Image downloaded!');
  }, [resultImage]);

  const handleReset = useCallback(() => {
    setResultImage(null);
    setStats(null);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastClassName="bg-card border border-border"
      />
      
      <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center justify-center gap-3 md:gap-4 animate-float">
              <div className="relative">
                <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-purple-500 animate-pulse-glow" />
                <div className="absolute inset-0 blur-xl bg-purple-500/50"></div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black gradient-text">
                Image Segmentation
              </h1>
            </div>
          </div>
          
          <p className="text-sm sm:text-base md:text-xl text-gray-300 font-medium px-4">
            Powered by <span className="text-purple-400 font-bold">Karger's Min-Cut Algorithm</span> with Monte Carlo Optimization
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
          </div>

          {/* Team Names - Below header on mobile, centered */}
          <div className="mt-6 inline-block bg-card/90 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl shadow-purple-500/20">
            <h3 className="text-sm md:text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 text-center">
              Team 3ntr0py
            </h3>
            <div className="space-y-2 text-xs md:text-sm text-gray-300">
              <p className="font-medium">Mufaddal Huzaifa <span className="text-purple-400">(CR-23044)</span></p>
              <p className="font-medium">Syed Shuja uddin Hashmi <span className="text-purple-400">(CR-23045)</span></p>
              <p className="font-medium">Syed Muhammad Minhal Rizvi <span className="text-purple-400">(CR-23017)</span></p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
            <div className="card-hover">
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClear}
              />
            </div>
            <div className="card-hover">
              <ResultDisplay
                result={resultImage}
                isProcessing={isProcessing}
                stats={stats}
              />
            </div>
          </div>

          <div className="card-hover">
            <ControlPanel
              onSegment={handleSegment}
              onReset={handleReset}
              onDownload={handleDownload}
              isProcessing={isProcessing}
              hasResult={!!resultImage}
              iterations={iterations}
              onIterationsChange={setIterations}
              threshold={threshold}
              onThresholdChange={setThreshold}
              onShowInfo={() => setShowInfo(true)}
            />
          </div>
        </div>
      </div>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}

export default App;
