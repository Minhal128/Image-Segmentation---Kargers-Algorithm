# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 5173)                │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  App.jsx                                        │  │  │
│  │  │  ├── ImageUploader                              │  │  │
│  │  │  ├── ControlPanel                               │  │  │
│  │  │  ├── ResultDisplay                              │  │  │
│  │  │  └── InfoModal                                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js Backend (Port 3000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Express Server (index.js)                           │  │
│  │  ├── POST /api/segment                               │  │
│  │  └── GET  /api/health                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Karger's Algorithm (karger.js)                      │  │
│  │  ├── Graph Class                                     │  │
│  │  ├── buildPixelGraph()                               │  │
│  │  ├── kargerMinCut()                                  │  │
│  │  ├── monteCarloMinCut()                              │  │
│  │  └── segmentImage()                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Sharp (Image Processing)                            │  │
│  │  ├── Load image                                      │  │
│  │  ├── Resize                                          │  │
│  │  ├── Extract pixels                                  │  │
│  │  └── Create output                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Image Segmentation Flow

```
User Upload Image
      │
      ▼
┌─────────────────┐
│ ImageUploader   │ ──► File selected
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ App.jsx         │ ──► Store file & preview
└─────────────────┘
      │
      │ User clicks "Segment"
      ▼
┌─────────────────┐
│ ControlPanel    │ ──► Get parameters
└─────────────────┘     (iterations, threshold)
      │
      ▼
┌─────────────────┐
│ Axios POST      │ ──► Send to backend
└─────────────────┘     /api/segment
      │
      ▼
┌─────────────────────────────────────────────┐
│ Backend: index.js                           │
│ ┌─────────────────────────────────────────┐ │
│ │ 1. Receive multipart/form-data          │ │
│ │ 2. Extract image buffer                 │ │
│ │ 3. Parse parameters                     │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│ Backend: karger.js - segmentImage()         │
│ ┌─────────────────────────────────────────┐ │
│ │ Step 1: Load & Resize Image             │ │
│ │   ├── Sharp.resize(200x200)             │ │
│ │   └── Extract raw pixel data            │ │
│ │                                         │ │
│ │ Step 2: Build Pixel Graph               │ │
│ │   ├── Create node for each pixel        │ │
│ │   ├── Calculate color distances         │ │
│ │   └── Add weighted edges                │ │
│ │                                         │ │
│ │ Step 3: Run Monte Carlo                 │ │
│ │   ├── For i = 1 to iterations:          │ │
│ │   │   ├── Clone graph                   │ │
│ │   │   ├── Run Karger's algorithm        │ │
│ │   │   └── Track best cut                │ │
│ │   └── Return best partition             │ │
│ │                                         │ │
│ │ Step 4: Create Segmented Image          │ │
│ │   ├── Separate pixels by partition      │ │
│ │   ├── Apply foreground/background style │ │
│ │   └── Generate PNG buffer               │ │
│ │                                         │ │
│ │ Step 5: Return Results                  │ │
│ │   ├── Base64 encoded image              │ │
│ │   └── Statistics                        │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────┐
│ App.jsx         │ ──► Receive response
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ ResultDisplay   │ ──► Show segmented image
└─────────────────┘     & statistics
      │
      ▼
┌─────────────────┐
│ User Downloads  │ ──► Save result
└─────────────────┘
```

---

## 🧮 Algorithm Flow

### Karger's Algorithm Detailed Flow

```
Input: Graph G = (V, E)
       Iterations k
       
┌──────────────────────────────────────────┐
│ monteCarloMinCut(graph, k)               │
│                                          │
│ bestCut = ∞                              │
│                                          │
│ FOR i = 1 TO k:                          │
│   │                                      │
│   ├─► Clone Graph                        │
│   │                                      │
│   ├─► kargerMinCut(clonedGraph)          │
│   │   │                                  │
│   │   ├─► WHILE nodeCount > 2:           │
│   │   │   │                              │
│   │   │   ├─► Get all edges              │
│   │   │   │   [e1, e2, ..., en]          │
│   │   │   │                              │
│   │   │   ├─► Weighted Random Selection  │
│   │   │   │   totalWeight = Σ weights    │
│   │   │   │   random = rand() * total    │
│   │   │   │   select edge where:         │
│   │   │   │   Σ(w[0..i]) ≥ random        │
│   │   │   │                              │
│   │   │   ├─► Contract Selected Edge     │
│   │   │   │   merge(node1, node2)        │
│   │   │   │   ├─► Transfer edges         │
│   │   │   │   ├─► Update weights         │
│   │   │   │   └─► Remove node2           │
│   │   │   │                              │
│   │   │   └─► nodeCount--                │
│   │   │                                  │
│   │   ├─► Calculate Cut Size             │
│   │   │   cutSize = Σ edge weights       │
│   │   │   between final 2 nodes          │
│   │   │                                  │
│   │   └─► Return {cutSize, partition}    │
│   │                                      │
│   └─► IF cutSize < bestCut.cutSize:      │
│       bestCut = current result           │
│                                          │
│ RETURN bestCut                           │
└──────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App
├── ToastContainer (react-toastify)
│
├── Header
│   ├── Title
│   └── Description
│
├── Main Grid (3 columns)
│   │
│   ├── Left Column (2 cols)
│   │   │
│   │   ├── ImageUploader
│   │   │   ├── Drop Zone
│   │   │   ├── File Input
│   │   │   ├── Preview Image
│   │   │   └── Clear Button
│   │   │
│   │   └── ResultDisplay
│   │       ├── Loading Spinner
│   │       ├── Result Image
│   │       └── Statistics Grid
│   │           ├── Processing Time
│   │           ├── Min Cut Size
│   │           ├── Graph Nodes
│   │           └── Graph Edges
│   │
│   └── Right Column (1 col)
│       │
│       └── ControlPanel
│           ├── Iterations Slider
│           ├── Threshold Slider
│           ├── Segment Button
│           ├── Download Button
│           ├── Reset Button
│           └── Info Button
│
└── InfoModal (conditional)
    ├── Modal Overlay
    └── Modal Content
        ├── Algorithm Explanation
        ├── How It Works
        ├── Complexity Analysis
        ├── Parameters Guide
        └── Applications
```

---

## 📦 Module Dependencies

### Frontend Dependencies

```
client/
├── react (UI framework)
├── react-dom (DOM rendering)
├── vite (build tool)
├── tailwindcss (styling)
│   ├── autoprefixer
│   └── postcss
├── react-toastify (notifications)
├── axios (HTTP client)
├── lucide-react (icons)
├── class-variance-authority (component variants)
├── clsx (class names)
└── tailwind-merge (merge classes)
```

### Backend Dependencies

```
server/
├── express (web framework)
├── cors (cross-origin)
├── multer (file upload)
└── sharp (image processing)
    ├── libvips (native library)
    └── image codecs
```

---

## 🔌 API Endpoints

### POST /api/segment

**Request**:
```
Content-Type: multipart/form-data

Fields:
- image: File (required)
- iterations: Number (default: 15)
- threshold: Number (default: 50)
```

**Response**:
```json
{
  "image": "base64_encoded_png_data",
  "stats": {
    "processingTime": 2543,
    "minCutSize": 1234,
    "nodes": 40000,
    "edges": 120000,
    "iterations": 15
  }
}
```

**Error Response**:
```json
{
  "error": "Error message"
}
```

### GET /api/health

**Response**:
```json
{
  "status": "ok"
}
```

---

## 💾 Data Structures

### Graph Structure

```javascript
Graph {
  adjacencyList: Map {
    "0,0" => Map {
      "0,1" => 95,  // weight
      "1,0" => 98
    },
    "0,1" => Map {
      "0,0" => 95,
      "0,2" => 87,
      "1,1" => 92
    },
    ...
  },
  nodeCount: 40000
}
```

### Pixel Structure

```javascript
Pixel {
  id: "x,y",
  x: 10,
  y: 15,
  r: 255,
  g: 128,
  b: 64
}
```

### Result Structure

```javascript
Result {
  cutSize: 1234,
  partition: ["0,0", "199,199"]
}
```

---

## 🔄 State Management

### Frontend State (React useState)

```javascript
App State:
├── selectedFile: File | null
├── selectedImage: string | null (base64)
├── resultImage: string | null (base64)
├── isProcessing: boolean
├── iterations: number (1-50)
├── threshold: number (10-100)
├── stats: Object | null
└── showInfo: boolean
```

---

## 🎯 Performance Considerations

### Frontend Optimizations

1. **Image Preview**: Use FileReader for instant preview
2. **Debouncing**: Prevent rapid parameter changes
3. **Loading States**: Show progress during processing
4. **Error Boundaries**: Catch and display errors gracefully

### Backend Optimizations

1. **Image Resizing**: Limit to 200×200 for speed
2. **Graph Cloning**: Efficient deep copy
3. **Weighted Selection**: O(n) random selection
4. **Memory Management**: Clear buffers after use
5. **Streaming**: Use Sharp's streaming API

### Algorithm Optimizations

1. **Sparse Graphs**: Only create edges for similar pixels
2. **Weighted Edges**: Prioritize similar pixel connections
3. **Early Termination**: Stop if perfect cut found
4. **Efficient Contraction**: O(degree) per contraction

---

## 🔒 Security Considerations

1. **File Upload**:
   - Validate file type (images only)
   - Limit file size
   - Use memory storage (no disk writes)

2. **Input Validation**:
   - Sanitize parameters
   - Enforce ranges (iterations: 1-50, threshold: 10-100)

3. **CORS**:
   - Configured for development
   - Should be restricted in production

4. **Error Handling**:
   - Catch all errors
   - Don't expose internal details
   - Return user-friendly messages

---

## 📊 Monitoring & Logging

### Backend Logging

```javascript
Console Logs:
├── Server startup: "Server running on port 3000"
├── Image processing: "Processing image with X iterations"
├── Graph stats: "Graph built: X nodes, Y edges"
├── Results: "Min cut found: X"
└── Errors: Full error stack traces
```

### Frontend Logging

```javascript
Toast Notifications:
├── Success: "Image segmented successfully!"
├── Download: "Image downloaded!"
├── Errors: Specific error messages
└── Warnings: Parameter adjustments
```

---

## 🚀 Deployment Architecture

### Development

```
localhost:5173 (Frontend)
      │
      ├─► Vite Dev Server
      └─► Proxy to localhost:3000

localhost:3000 (Backend)
      │
      └─► Node.js Express Server
```

### Production (Recommended)

```
CDN/Static Hosting (Frontend)
      │
      └─► Built React App

Cloud Server (Backend)
      │
      ├─► Node.js Process
      ├─► Load Balancer
      └─► Auto-scaling
```

---

## 📈 Scalability

### Current Limitations

- Single-threaded processing
- In-memory graph storage
- Synchronous algorithm execution

### Scaling Options

1. **Horizontal Scaling**:
   - Multiple backend instances
   - Load balancer
   - Shared storage

2. **Vertical Scaling**:
   - More CPU cores
   - More RAM
   - GPU acceleration

3. **Optimization**:
   - Web Workers (frontend)
   - Worker threads (backend)
   - Caching results
   - Queue system for batch processing

---

This architecture provides a solid foundation for understanding how all components work together to deliver the image segmentation functionality.
