# Image Segmentation using Karger's Min-Cut Algorithm

A modern web application for image foreground extraction using Karger's randomized min-cut algorithm with Monte Carlo optimization. Built with React (Vite), Node.js, and modern UI components.

## 🌟 Features

- **Advanced Image Segmentation**: Uses Karger's algorithm to find minimum cuts in pixel graphs
- **Monte Carlo Optimization**: Multiple iterations to improve success probability
- **Real-time Processing**: Fast image processing with visual feedback
- **Modern UI**: Beautiful interface built with React, TailwindCSS, and shadcn/ui
- **Interactive Controls**: Adjust parameters and see results instantly
- **Download Results**: Export segmented images
- **Educational**: Built-in documentation explaining the algorithm

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd H:\Development\DAA
```

2. Install all dependencies:
```bash
npm run install:all
```

### Running the Application

Start both frontend and backend:
```bash
npm run dev
```

Or run them separately:

**Frontend** (http://localhost:5173):
```bash
npm run dev:client
```

**Backend** (http://localhost:3000):
```bash
npm run dev:server
```

## 📁 Project Structure

```
DAA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── ResultDisplay.jsx
│   │   │   └── InfoModal.jsx
│   │   ├── lib/          # Utilities
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── karger.js         # Algorithm implementation
│   └── package.json
├── DOCUMENTATION.md       # Detailed algorithm documentation
└── package.json          # Root package file
```

## 🎯 How to Use

1. **Upload Image**: Drag and drop or click to select an image
2. **Adjust Parameters**:
   - **Monte Carlo Iterations**: Higher values = better accuracy (10-30 recommended)
   - **Similarity Threshold**: Controls edge creation in the graph (30-70 recommended)
3. **Segment**: Click "Segment Image" to process
4. **Download**: Save the segmented result

## 🔬 Algorithm Overview

### Karger's Min-Cut Algorithm

Karger's algorithm is a randomized algorithm for finding minimum cuts in undirected graphs:

1. **Graph Construction**: Each pixel becomes a node, edges connect similar neighbors
2. **Random Contraction**: Repeatedly contract random edges
3. **Min-Cut Discovery**: Continue until two super-nodes remain
4. **Monte Carlo Boost**: Run multiple times to find the best cut

### Complexity Analysis

- **Time Complexity**: O(n² log n) per iteration
- **Space Complexity**: O(n + m) where n = nodes, m = edges
- **Success Probability**: 
  - Single run: ≥ 1/n²
  - With k iterations: 1 - (1 - 1/n²)^k

### Image Segmentation Application

For image segmentation:
- **Nodes**: Individual pixels
- **Edges**: Connections between similar neighboring pixels
- **Edge Weights**: Based on color similarity
- **Min-Cut**: Separates foreground from background

## 🛠️ Technologies Used

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **react-toastify**: Toast notifications
- **Lucide React**: Icon library
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Sharp**: High-performance image processing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## 📊 Parameters Guide

### Monte Carlo Iterations
- **Range**: 1-50
- **Default**: 15
- **Effect**: More iterations increase the probability of finding the true minimum cut
- **Recommendation**: 
  - Quick preview: 5-10
  - Good results: 15-25
  - Best quality: 30-50

### Similarity Threshold
- **Range**: 10-100
- **Default**: 50
- **Effect**: Controls how similar pixels must be to create an edge
- **Recommendation**:
  - High contrast images: 30-50
  - Similar colors: 60-80
  - Fine details: 20-40

## 🎨 Real-World Applications

- **Photo Editing**: Background removal, object isolation
- **Graphic Design**: Quick selection tools (like Photoshop's Magic Wand)
- **Medical Imaging**: Organ and tissue segmentation
- **Computer Vision**: Object detection and recognition
- **E-commerce**: Product image processing
- **Social Media**: Automatic background blur/replacement

## 📈 Performance Optimization

The application includes several optimizations:

1. **Image Resizing**: Large images are resized to 200x200 for faster processing
2. **Weighted Edge Selection**: Edges are selected based on weights for better results
3. **Graph Cloning**: Efficient graph copying for multiple iterations
4. **Async Processing**: Non-blocking image processing
5. **Memory Management**: Efficient buffer handling with Sharp

## 🧪 Testing

To test the application:

1. Use images with clear foreground/background separation
2. Start with default parameters
3. Adjust threshold based on image characteristics
4. Increase iterations for better results
5. Compare processing time vs. quality

## 🤝 Contributing

This is an educational project demonstrating Karger's algorithm. Feel free to:
- Experiment with different graph construction methods
- Optimize the algorithm implementation
- Add new features (e.g., manual seed selection)
- Improve the UI/UX

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🔗 References

- Karger, D. R. (1993). "Global min-cuts in RNC, and other ramifications of a simple min-cut algorithm"
- Graph Theory and Image Segmentation
- Monte Carlo Methods in Algorithm Design

## 📧 Support

For questions or issues, please refer to the DOCUMENTATION.md file for detailed algorithm explanations.

---

**Built with ❤️ for learning Design and Analysis of Algorithms**
