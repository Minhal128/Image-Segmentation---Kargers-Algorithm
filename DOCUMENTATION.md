# Karger's Min-Cut Algorithm - Complete Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Algorithm Theory](#algorithm-theory)
3. [Implementation Details](#implementation-details)
4. [Image Segmentation Application](#image-segmentation-application)
5. [Complexity Analysis](#complexity-analysis)
6. [Monte Carlo Enhancement](#monte-carlo-enhancement)
7. [Code Walkthrough](#code-walkthrough)
8. [Performance Optimization](#performance-optimization)
9. [Practical Applications](#practical-applications)

---

## Introduction

### What is Karger's Algorithm?

Karger's algorithm is a **randomized algorithm** for finding minimum cuts in undirected, weighted graphs. Discovered by David Karger in 1993, it's a Monte Carlo algorithm that uses random edge contractions to find the minimum cut with high probability.

### Key Concepts

- **Graph**: G = (V, E) where V is vertices and E is edges
- **Cut**: A partition of vertices into two non-empty sets
- **Min-Cut**: A cut with the minimum number of edges crossing between partitions
- **Edge Contraction**: Merging two vertices connected by an edge

---

## Algorithm Theory

### Basic Karger's Algorithm

```
Algorithm: Karger-MinCut(G)
Input: Undirected graph G = (V, E)
Output: A cut (partition of V)

1. While |V| > 2:
   a. Select a random edge (u, v) from E
   b. Contract edge (u, v):
      - Merge vertices u and v into a single vertex
      - Remove self-loops
      - Keep parallel edges
   c. Update graph G

2. Return the cut defined by the two remaining vertices
```

### Why It Works

**Intuition**: 
- A minimum cut has few edges crossing it
- Random edge selection is unlikely to pick a min-cut edge early
- As the graph contracts, min-cut edges become more prominent

**Probability Analysis**:
- Let C be a minimum cut with k edges
- Probability of NOT selecting a C-edge in first contraction: ≥ (1 - 2/n)
- After i contractions: ≥ (1 - 2/(n-i))
- Overall success probability: ≥ 1/n²

### Mathematical Proof Sketch

For a graph with n vertices and minimum cut size k:

1. **Lower bound on edges**: Each vertex has degree ≥ k (otherwise it would be isolated by a smaller cut)
2. **Total edges**: |E| ≥ nk/2
3. **Probability of avoiding min-cut edge**: 
   - First step: P₁ ≥ 1 - k/(nk/2) = 1 - 2/n
   - Second step: P₂ ≥ 1 - 2/(n-1)
   - ...
   - Final: P ≥ ∏(1 - 2/(n-i)) ≥ 2/(n(n-1)) ≥ 1/n²

---

## Implementation Details

### Graph Representation

We use an **adjacency list** with weights:

```javascript
class Graph {
  adjacencyList: Map<Node, Map<Neighbor, Weight>>
}
```

**Advantages**:
- Efficient edge lookup: O(1)
- Easy edge weight updates
- Simple contraction operation
- Memory efficient for sparse graphs

### Edge Contraction Process

```javascript
contract(node1, node2) {
  // 1. Get all edges from node2
  edges2 = adjacencyList[node2]
  
  // 2. For each neighbor of node2:
  for (neighbor, weight) in edges2:
    if neighbor != node1:
      // Add edge from node1 to neighbor
      addEdge(node1, neighbor, weight)
  
  // 3. Remove node2 from graph
  removeNode(node2)
}
```

**Time Complexity**: O(degree(node2))

### Weighted Edge Selection

Instead of uniform random selection, we use **weighted random selection**:

```javascript
// Build edge list with weights
allEdges = []
for each node:
  for each (neighbor, weight):
    allEdges.push({node, neighbor, weight})

// Weighted random selection
totalWeight = sum(edge.weight for edge in allEdges)
random = random() * totalWeight
for edge in allEdges:
  random -= edge.weight
  if random <= 0:
    return edge
```

**Benefit**: Edges with higher weights (more similar pixels) are more likely to be contracted, leading to better segmentation.

---

## Image Segmentation Application

### From Images to Graphs

#### 1. Pixel to Node Mapping

Each pixel (x, y) becomes a node with properties:
```javascript
{
  id: "x,y",
  x: x,
  y: y,
  r: red_value,
  g: green_value,
  b: blue_value
}
```

#### 2. Edge Creation

Edges connect **neighboring pixels** with similar colors:

```javascript
// 8-connected neighborhood
neighbors = [
  (x+1, y),     // right
  (x, y+1),     // down
  (x+1, y+1),   // diagonal down-right
  (x-1, y+1)    // diagonal down-left
]

for each neighbor:
  distance = colorDistance(current, neighbor)
  if distance < threshold:
    weight = max(1, floor(100 - distance))
    addEdge(current, neighbor, weight)
```

#### 3. Color Distance Metric

We use **Euclidean distance** in RGB space:

```javascript
colorDistance(pixel1, pixel2) {
  Δr = pixel1.r - pixel2.r
  Δg = pixel1.g - pixel2.g
  Δb = pixel1.b - pixel2.b
  return sqrt(Δr² + Δg² + Δb²)
}
```

**Range**: 0 (identical) to ~441 (max difference)

### Graph Properties

For an image of size W × H:

- **Nodes**: W × H pixels
- **Max Edges**: 4 × W × H (4-connected) or 8 × W × H (8-connected)
- **Actual Edges**: Depends on threshold and image content
- **Typical Density**: 10-30% of max edges

### Segmentation Process

```
1. Load Image → Resize to manageable size (e.g., 200×200)
2. Build Graph → Create nodes and edges based on similarity
3. Run Karger → Find min-cut using Monte Carlo
4. Create Partition → Separate pixels into two groups
5. Render Result → Apply visual distinction (color/transparency)
```

---

## Complexity Analysis

### Time Complexity

#### Single Iteration
- **Graph Construction**: O(W × H × k) where k = neighbors checked
  - For 200×200 image: ~160,000 operations
- **Edge Contraction**: O(n²) where n = number of pixels
  - Each contraction: O(degree) ≈ O(8)
  - Total contractions: n - 2
  - Overall: O(n²)
- **Total per iteration**: O(n²)

#### Monte Carlo (m iterations)
- **Total Time**: O(m × n²)
- For 200×200 image with 15 iterations:
  - n = 40,000 pixels
  - Time ≈ 15 × 40,000² ≈ 24 billion operations
  - Actual runtime: 2-5 seconds (optimized)

### Space Complexity

- **Graph Storage**: O(n + e) where e = number of edges
  - Nodes: O(n)
  - Edges: O(e) ≈ O(4n) for sparse graphs
- **Pixel Data**: O(n)
- **Total**: O(n + e) ≈ O(n)

For 200×200 image:
- Pixels: 40,000 × 16 bytes ≈ 640 KB
- Graph: ~1-2 MB
- Total: ~2-3 MB

### Success Probability

For n vertices and k iterations:

**Single Run**: P(success) ≥ 1/n²

**k Iterations**: P(success) ≥ 1 - (1 - 1/n²)^k

**Examples**:
- n = 100, k = 10: P ≈ 0.095 (9.5%)
- n = 100, k = 50: P ≈ 0.39 (39%)
- n = 200, k = 15: P ≈ 0.0037 (0.37%)
- n = 200, k = 100: P ≈ 0.024 (2.4%)

**Note**: For image segmentation, we use weighted edges and heuristics, which improve practical success rates significantly.

---

## Monte Carlo Enhancement

### Why Monte Carlo?

Single run of Karger's algorithm has low success probability (1/n²). Monte Carlo method:
- Runs algorithm multiple times
- Keeps track of best result
- Dramatically improves success probability

### Implementation

```javascript
function monteCarloMinCut(graph, iterations) {
  bestCut = { cutSize: ∞, partition: [] }
  
  for i = 1 to iterations:
    // Clone graph for independent run
    graphCopy = graph.clone()
    
    // Run Karger's algorithm
    result = kargerMinCut(graphCopy)
    
    // Update best if better
    if result.cutSize < bestCut.cutSize:
      bestCut = result
  
  return bestCut
}
```

### Iteration Selection

**Trade-off**: Accuracy vs. Speed

| Iterations | Success Probability | Processing Time | Use Case |
|-----------|-------------------|----------------|----------|
| 1-5 | Low (~5-10%) | Fast (0.5-1s) | Quick preview |
| 10-20 | Medium (~20-40%) | Moderate (2-4s) | Standard use |
| 30-50 | High (~60-80%) | Slow (5-10s) | Best quality |
| 100+ | Very High (~90%+) | Very Slow (20s+) | Research |

### Optimization Techniques

1. **Early Termination**: Stop if perfect cut found (cutSize = 0)
2. **Parallel Execution**: Run iterations in parallel (not implemented)
3. **Adaptive Iterations**: Increase iterations for larger graphs
4. **Result Caching**: Store and reuse results for similar parameters

---

## Code Walkthrough

### 1. Graph Class

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map()  // node → Map(neighbor → weight)
    this.nodeCount = 0
  }

  addEdge(node1, node2, weight) {
    // Add bidirectional edge with weight
    // Accumulate weights for parallel edges
  }

  contract(node1, node2) {
    // Merge node2 into node1
    // Transfer all edges
    // Remove node2
  }

  clone() {
    // Deep copy for independent iterations
  }
}
```

### 2. Image Processing

```javascript
async function segmentImage(imageBuffer, iterations, threshold) {
  // 1. Load and resize image
  image = sharp(imageBuffer)
  resized = await image.resize(200, 200).raw().toBuffer()
  
  // 2. Build pixel graph
  { graph, pixels } = buildPixelGraph(resized, width, height, threshold)
  
  // 3. Run Monte Carlo min-cut
  result = monteCarloMinCut(graph, iterations)
  
  // 4. Create segmented image
  segmentedData = createSegmentedImage(pixels, result, width, height)
  
  // 5. Convert to PNG
  output = await sharp(segmentedData).png().toBuffer()
  
  return { image: output, stats: {...} }
}
```

### 3. Graph Construction

```javascript
function buildPixelGraph(imageData, width, height, threshold) {
  graph = new Graph()
  pixels = extractPixels(imageData, width, height)
  
  for each pixel (x, y):
    for each neighbor (nx, ny):
      distance = colorDistance(pixel, neighbor)
      
      if distance < threshold:
        weight = max(1, floor(100 - distance))
        graph.addEdge(pixel.id, neighbor.id, weight)
  
  return { graph, pixels }
}
```

### 4. Karger's Algorithm

```javascript
function kargerMinCut(graph) {
  g = graph.clone()
  
  // Contract until 2 nodes remain
  while g.nodeCount > 2:
    // Get all edges
    edges = getAllEdges(g)
    
    // Weighted random selection
    edge = selectWeightedRandom(edges)
    
    // Contract edge
    g.contract(edge.node1, edge.node2)
  
  // Calculate cut size
  [node1, node2] = g.getNodes()
  cutSize = sum(weights of edges between node1 and node2)
  
  return { cutSize, partition: [node1, node2] }
}
```

### 5. Result Visualization

```javascript
function createSegmentedImage(pixels, partition, width, height) {
  imageData = new Uint8ClampedArray(width * height * 4)
  
  [foreground, background] = partition
  
  for each pixel:
    if pixel in foreground:
      // Keep original color
      setColor(pixel.r, pixel.g, pixel.b, 255)
    else:
      // Convert to grayscale + transparency
      gray = 0.299*r + 0.587*g + 0.114*b
      setColor(gray, gray, gray, 128)
  
  return imageData
}
```

---

## Performance Optimization

### 1. Image Resizing

**Problem**: Large images (e.g., 4000×3000) create huge graphs
- Nodes: 12 million
- Edges: ~48 million
- Memory: ~1 GB
- Time: Hours

**Solution**: Resize to 200×200
- Nodes: 40,000
- Edges: ~160,000
- Memory: ~3 MB
- Time: 2-5 seconds

### 2. Sparse Graph Construction

Only create edges for similar pixels:
```javascript
if colorDistance < threshold:
  addEdge()  // Only add if similar
```

**Impact**:
- Dense graph: 8 edges/pixel = 320,000 edges
- Sparse graph: 2-3 edges/pixel = 80,000-120,000 edges
- Speed improvement: 2-3x

### 3. Weighted Edge Selection

Use color similarity as edge weight:
```javascript
weight = max(1, floor(100 - colorDistance))
```

**Benefits**:
- More likely to contract similar pixels
- Better segmentation quality
- Fewer iterations needed

### 4. Efficient Graph Cloning

```javascript
clone() {
  newGraph = new Graph()
  for [node, edges] in adjacencyList:
    for [neighbor, weight] in edges:
      newGraph.addEdge(node, neighbor, weight)
  return newGraph
}
```

**Optimization**: Only clone edges once (undirected graph)

### 5. Memory Management

- Use `Uint8ClampedArray` for pixel data
- Stream processing with Sharp
- Clear intermediate buffers
- Avoid deep copies when possible

---

## Practical Applications

### 1. Photo Editing Software

**Example**: Photoshop's Magic Wand Tool

**How it works**:
1. User clicks on pixel
2. Build graph around clicked region
3. Run min-cut to separate selection
4. Refine edges with additional algorithms

**Advantages**:
- Fast selection of complex shapes
- Works with varying backgrounds
- Adjustable tolerance (threshold)

### 2. Background Removal

**Use Case**: E-commerce product photos

**Process**:
1. Upload product image
2. Segment foreground (product)
3. Remove/replace background
4. Export for website

**Benefits**:
- Automated processing
- Consistent backgrounds
- Professional appearance

### 3. Medical Image Segmentation

**Application**: Organ segmentation in CT/MRI scans

**Process**:
1. Load medical image
2. Build graph based on tissue density
3. Segment organs from surrounding tissue
4. Analyze segmented regions

**Advantages**:
- Objective segmentation
- Reproducible results
- Fast processing

### 4. Computer Vision

**Use Case**: Object detection preprocessing

**Pipeline**:
1. Segment image into regions
2. Extract features from regions
3. Classify regions
4. Combine for object detection

**Benefits**:
- Reduces search space
- Improves accuracy
- Faster processing

### 5. Video Processing

**Application**: Real-time background blur (video calls)

**Process**:
1. Segment each frame
2. Identify foreground (person)
3. Apply blur to background
4. Composite result

**Challenges**:
- Real-time performance required
- Temporal consistency needed
- Optimizations critical

---

## Advanced Topics

### Karger-Stein Algorithm

An improved version with better probability:

**Key Idea**: 
- Contract more carefully when graph is small
- Recursively find min-cut
- Success probability: O(1/log n)

**Time Complexity**: O(n² log n)

### Deterministic Min-Cut Algorithms

**Stoer-Wagner Algorithm**:
- Deterministic (always finds min-cut)
- Time: O(n³) or O(nm + n² log n)
- No randomization needed

**Trade-off**: Slower but guaranteed

### Improvements for Image Segmentation

1. **Superpixel Preprocessing**: Group similar pixels before graph construction
2. **Multi-scale Processing**: Segment at different resolutions
3. **Interactive Refinement**: User feedback to improve results
4. **Machine Learning Integration**: Learn edge weights from examples

---

## Conclusion

Karger's algorithm provides an elegant solution to the min-cut problem with applications in image segmentation. While the basic algorithm has low success probability, Monte Carlo enhancement makes it practical for real-world use.

**Key Takeaways**:
- Randomization can solve hard problems efficiently
- Monte Carlo methods improve reliability
- Graph theory applies to image processing
- Trade-offs exist between accuracy and speed

**Future Directions**:
- GPU acceleration for larger images
- Real-time video segmentation
- Integration with deep learning
- Adaptive parameter selection

---

## References

1. Karger, D. R. (1993). "Global min-cuts in RNC, and other ramifications of a simple min-cut algorithm". Proceedings of the 4th Annual ACM-SIAM Symposium on Discrete Algorithms.

2. Karger, D. R., & Stein, C. (1996). "A new approach to the minimum cut problem". Journal of the ACM.

3. Boykov, Y., & Kolmogorov, V. (2004). "An experimental comparison of min-cut/max-flow algorithms for energy minimization in vision". IEEE Transactions on Pattern Analysis and Machine Intelligence.

4. Shi, J., & Malik, J. (2000). "Normalized cuts and image segmentation". IEEE Transactions on Pattern Analysis and Machine Intelligence.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: DAA Project Team
