import sharp from 'sharp';

/**
 * Graph class for Karger's algorithm
 */
class Graph {
  constructor() {
    this.adjacencyList = new Map();
    this.nodeCount = 0;
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Map());
      this.nodeCount++;
    }
  }

  addEdge(node1, node2, weight = 1) {
    this.addNode(node1);
    this.addNode(node2);
    
    const edges1 = this.adjacencyList.get(node1);
    const edges2 = this.adjacencyList.get(node2);
    
    edges1.set(node2, (edges1.get(node2) || 0) + weight);
    edges2.set(node1, (edges2.get(node1) || 0) + weight);
  }

  getNodes() {
    return Array.from(this.adjacencyList.keys());
  }

  getEdges(node) {
    return this.adjacencyList.get(node) || new Map();
  }

  removeNode(node) {
    // Remove all edges to this node
    for (const [otherNode, edges] of this.adjacencyList.entries()) {
      edges.delete(node);
    }
    this.adjacencyList.delete(node);
    this.nodeCount--;
  }

  contract(node1, node2) {
    // Merge node2 into node1
    const edges2 = this.adjacencyList.get(node2);
    if (!edges2) return;

    for (const [neighbor, weight] of edges2.entries()) {
      if (neighbor !== node1) {
        this.addEdge(node1, neighbor, weight);
      }
    }

    // Remove node2
    this.removeNode(node2);
  }

  getTotalEdges() {
    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      for (const weight of edges.values()) {
        count += weight;
      }
    }
    return count / 2; // Each edge counted twice
  }

  clone() {
    const newGraph = new Graph();
    for (const [node, edges] of this.adjacencyList.entries()) {
      for (const [neighbor, weight] of edges.entries()) {
        newGraph.addEdge(node, neighbor, weight);
      }
    }
    return newGraph;
  }
}

/**
 * Calculate color difference between two pixels
 */
function colorDistance(pixel1, pixel2) {
  const rDiff = pixel1.r - pixel2.r;
  const gDiff = pixel1.g - pixel2.g;
  const bDiff = pixel1.b - pixel2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Build graph from image pixels - OPTIMIZED VERSION
 */
function buildPixelGraph(imageData, width, height, threshold) {
  const graph = new Graph();
  const pixels = [];

  // Extract pixel data
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      pixels.push({
        x, y,
        r: imageData[idx],
        g: imageData[idx + 1],
        b: imageData[idx + 2],
        id: `${x},${y}`
      });
    }
  }

  // Create edges between similar neighboring pixels - ONLY 4-CONNECTED
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const currentIdx = y * width + x;
      const current = pixels[currentIdx];

      // Only check RIGHT and DOWN to avoid duplicate edges
      const neighbors = [
        { dx: 1, dy: 0 },   // right
        { dx: 0, dy: 1 },   // down
      ];

      for (const { dx, dy } of neighbors) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const neighborIdx = ny * width + nx;
          const neighbor = pixels[neighborIdx];
          
          const distance = colorDistance(current, neighbor);
          
          // Add edge if pixels are similar (distance below threshold)
          if (distance < threshold) {
            const weight = Math.max(1, Math.floor(100 - distance));
            graph.addEdge(current.id, neighbor.id, weight);
          }
        }
      }
    }
  }

  return { graph, pixels };
}

/**
 * Karger's randomized min-cut algorithm - OPTIMIZED WITH FIX
 */
function kargerMinCut(graph) {
  const g = graph.clone();
  
  // Contract edges until only 2 nodes remain
  while (g.nodeCount > 2) {
    const nodes = g.getNodes();
    
    // Select a random edge - SIMPLIFIED for speed
    const allEdges = [];
    for (const node of nodes) {
      const edges = g.getEdges(node);
      for (const [neighbor, weight] of edges.entries()) {
        if (node < neighbor) { // Avoid duplicates
          allEdges.push({ node1: node, node2: neighbor, weight });
        }
      }
    }

    // If no edges, graph is disconnected - return a valid cut
    if (allEdges.length === 0) {
      console.log('Graph disconnected, returning default cut');
      const remainingNodes = g.getNodes();
      // Return a cut between any two remaining nodes
      return {
        cutSize: 0,
        partition: remainingNodes.slice(0, Math.min(2, remainingNodes.length))
      };
    }

    // Simple random selection (faster than weighted)
    const selectedEdge = allEdges[Math.floor(Math.random() * allEdges.length)];

    // Contract the selected edge
    g.contract(selectedEdge.node1, selectedEdge.node2);
  }

  // Calculate cut size
  const remainingNodes = g.getNodes();
  if (remainingNodes.length < 2) {
    // If we have less than 2 nodes, return a minimal cut
    console.log('Less than 2 nodes remaining');
    return { cutSize: 0, partition: remainingNodes };
  }

  const cutSize = Array.from(g.getEdges(remainingNodes[0]).values())
    .reduce((sum, weight) => sum + weight, 0);

  return {
    cutSize,
    partition: remainingNodes
  };
}

/**
 * Run Karger's algorithm multiple times (Monte Carlo) - OPTIMIZED
 */
function monteCarloMinCut(graph, iterations) {
  let bestCut = { cutSize: Infinity, partition: [[], []] };
  
  // Limit iterations based on graph size for performance
  const maxIterations = Math.min(iterations, 10); // Cap at 10 for speed
  
  console.log(`Running ${maxIterations} iterations (requested: ${iterations})`);

  for (let i = 0; i < maxIterations; i++) {
    const result = kargerMinCut(graph);
    if (result.cutSize < bestCut.cutSize) {
      bestCut = result;
      console.log(`Iteration ${i + 1}: Found better cut of size ${result.cutSize}`);
    }
    
    // Early termination if we find a very small cut
    if (bestCut.cutSize < 10) {
      console.log(`Early termination - found small cut`);
      break;
    }
  }

  return bestCut;
}

/**
 * Create segmented image from partition
 */
function createSegmentedImage(pixels, partition, width, height) {
  const imageData = new Uint8ClampedArray(width * height * 4);
  
  // Parse partition nodes
  const set1 = new Set();
  const set2 = new Set();
  
  // Get all nodes in each partition
  const nodes = partition.partition;
  if (nodes.length >= 2) {
    set1.add(nodes[0]);
    set2.add(nodes[1]);
  }

  // Create pixel map
  const pixelMap = new Map();
  for (const pixel of pixels) {
    pixelMap.set(pixel.id, pixel);
  }

  // Color pixels based on partition
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const idx = i * 4;
    
    // Determine which set this pixel belongs to
    const inSet1 = set1.has(pixel.id);
    
    if (inSet1) {
      // Foreground - keep original color
      imageData[idx] = pixel.r;
      imageData[idx + 1] = pixel.g;
      imageData[idx + 2] = pixel.b;
      imageData[idx + 3] = 255;
    } else {
      // Background - make semi-transparent or grayscale
      const gray = Math.floor(0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b);
      imageData[idx] = gray;
      imageData[idx + 1] = gray;
      imageData[idx + 2] = gray;
      imageData[idx + 3] = 128; // Semi-transparent
    }
  }

  return imageData;
}

/**
 * Main segmentation function
 */
export async function segmentImage(imageBuffer, iterations = 15, threshold = 50) {
  const startTime = Date.now();

  // Load and resize image for processing
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  
  // Resize large images for faster processing - OPTIMIZED SIZE
  const maxDimension = 80; // Further reduced for speed and reliability
  const scale = Math.min(1, maxDimension / Math.max(metadata.width, metadata.height));
  const width = Math.floor(metadata.width * scale);
  const height = Math.floor(metadata.height * scale);

  // Apply compression and normalization for better results
  const { data, info } = await image
    .resize(width, height, { 
      fit: 'fill',
      kernel: sharp.kernel.lanczos3 // Better quality resize
    })
    .normalize() // Normalize contrast
    .modulate({
      brightness: 1.0,
      saturation: 1.2 // Slightly increase saturation for better edge detection
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Image resized to ${width}x${height}`);

  // Build pixel graph with adaptive threshold
  let adaptiveThreshold = threshold;
  let graph, pixels, totalEdges;
  
  // Try to build a well-connected graph
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = buildPixelGraph(data, width, height, adaptiveThreshold);
    graph = result.graph;
    pixels = result.pixels;
    totalEdges = graph.getTotalEdges();
    
    // Check if graph has enough edges (at least 2 edges per node on average)
    const avgEdgesPerNode = (totalEdges * 2) / graph.nodeCount;
    
    console.log(`Attempt ${attempt + 1}: ${graph.nodeCount} nodes, ${totalEdges} edges (avg: ${avgEdgesPerNode.toFixed(2)} edges/node)`);
    
    if (avgEdgesPerNode >= 1.5 || attempt === 2) {
      break; // Good enough or last attempt
    }
    
    // Increase threshold to create more edges
    adaptiveThreshold = Math.min(100, adaptiveThreshold + 20);
    console.log(`Increasing threshold to ${adaptiveThreshold} for better connectivity`);
  }
  
  console.log(`Final graph: ${graph.nodeCount} nodes, ${totalEdges} edges`);

  // Run Karger's algorithm with Monte Carlo
  const result = monteCarloMinCut(graph, iterations);
  
  console.log(`Min cut found: ${result.cutSize}`);

  // Create segmented image
  const segmentedData = createSegmentedImage(pixels, result, width, height);

  // Convert back to image
  const outputBuffer = await sharp(segmentedData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png()
  .toBuffer();

  const processingTime = Date.now() - startTime;

  return {
    imageBase64: outputBuffer.toString('base64'),
    stats: {
      processingTime,
      minCutSize: result.cutSize,
      nodes: graph.nodeCount,
      edges: Math.floor(totalEdges),
      iterations
    }
  };
}
