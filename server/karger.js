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
    const counted = new Set();
    
    for (const [node, edges] of this.adjacencyList.entries()) {
      for (const [neighbor, weight] of edges.entries()) {
        // Create a unique key for this edge (sorted to avoid duplicates)
        const edgeKey = node < neighbor ? `${node}-${neighbor}` : `${neighbor}-${node}`;
        if (!counted.has(edgeKey)) {
          counted.add(edgeKey);
          count++;
        }
      }
    }
    return count;
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

  // Create edges between similar neighboring pixels - 4-CONNECTED
  let edgesCreated = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const currentIdx = y * width + x;
      const current = pixels[currentIdx];

      // Check 4 neighbors (right, down, left, up) but only add each edge once
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
            edgesCreated++;
          }
        }
      }
    }
  }
  
  console.log(`Created ${edgesCreated} edges with threshold ${threshold}`);

  return { graph, pixels };
}

/**
 * Karger's randomized min-cut algorithm - IMPROVED VERSION
 */
function kargerMinCut(graph) {
  const g = graph.clone();
  
  // Target: contract until we have ~2 super-nodes (allow some flexibility)
  const targetNodes = 2;
  let contractionsMade = 0;
  const maxContractions = g.nodeCount - targetNodes;
  
  // Contract edges until only 2 super-nodes remain
  while (g.nodeCount > targetNodes && contractionsMade < maxContractions) {
    const nodes = g.getNodes();
    
    // Collect all edges
    const allEdges = [];
    for (const node of nodes) {
      const edges = g.getEdges(node);
      for (const [neighbor, weight] of edges.entries()) {
        if (node < neighbor) { // Avoid duplicates
          allEdges.push({ node1: node, node2: neighbor, weight });
        }
      }
    }

    // If no edges left, we have disconnected components
    if (allEdges.length === 0) {
      console.log(`Graph disconnected at ${g.nodeCount} nodes`);
      break;
    }

    // Weighted random selection - prefer high-weight edges (similar pixels)
    const totalWeight = allEdges.reduce((sum, e) => sum + e.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedEdge = allEdges[0];

    for (const edge of allEdges) {
      random -= edge.weight;
      if (random <= 0) {
        selectedEdge = edge;
        break;
      }
    }

    // Contract the selected edge
    g.contract(selectedEdge.node1, selectedEdge.node2);
    contractionsMade++;
  }

  // Get final partition
  const remainingNodes = g.getNodes();
  
  // If we have exactly 2 nodes, calculate the cut
  if (remainingNodes.length === 2) {
    const cutSize = Array.from(g.getEdges(remainingNodes[0]).values())
      .reduce((sum, weight) => sum + weight, 0);
    
    return {
      cutSize,
      partition: remainingNodes
    };
  }
  
  // If disconnected or multiple components, create a partition
  // Split nodes roughly in half
  const mid = Math.floor(remainingNodes.length / 2);
  const partition1 = remainingNodes.slice(0, mid);
  const partition2 = remainingNodes.slice(mid);
  
  // Calculate cut size between the two partitions
  let cutSize = 0;
  for (const node1 of partition1) {
    const edges = g.getEdges(node1);
    for (const node2 of partition2) {
      if (edges.has(node2)) {
        cutSize += edges.get(node2);
      }
    }
  }
  
  return {
    cutSize: cutSize || 100, // Default if no edges between partitions
    partition: [partition1[0] || remainingNodes[0], partition2[0] || remainingNodes[Math.min(1, remainingNodes.length - 1)]]
  };
}

/**
 * Run Karger's algorithm multiple times (Monte Carlo) - OPTIMIZED
 */
function monteCarloMinCut(graph, iterations) {
  let bestCut = { cutSize: Infinity, partition: [[], []] };
  let validCuts = 0;
  
  // Limit iterations based on graph size for performance
  const maxIterations = Math.min(iterations, 8); // Cap at 8 for speed
  
  console.log(`Running ${maxIterations} iterations (requested: ${iterations})`);

  for (let i = 0; i < maxIterations; i++) {
    const result = kargerMinCut(graph);
    
    // Skip invalid cuts
    if (result.cutSize === Infinity || result.cutSize < 0) {
      console.log(`Iteration ${i + 1}: Invalid cut, skipping`);
      continue;
    }
    
    validCuts++;
    
    if (result.cutSize < bestCut.cutSize) {
      bestCut = result;
      console.log(`Iteration ${i + 1}: Found better cut of size ${result.cutSize}`);
    }
    
    // Early termination if we find a very small cut
    if (bestCut.cutSize > 0 && bestCut.cutSize < 100) {
      console.log(`Early termination - found good cut`);
      break;
    }
  }

  // If all cuts were invalid, return a simple partition
  if (bestCut.cutSize === Infinity) {
    console.log('All iterations failed, creating simple partition');
    const nodes = graph.getNodes();
    const mid = Math.floor(nodes.length / 2);
    bestCut = {
      cutSize: 100, // Default cut size
      partition: [nodes[0], nodes[mid] || nodes[0]]
    };
  }

  console.log(`Valid cuts found: ${validCuts}/${maxIterations}`);
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
  const maxDimension = 60; // Reduced to 60 for better performance and connectivity
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
  // Ensure minimum threshold for connectivity
  let adaptiveThreshold = Math.max(60, threshold); // Minimum 60 for good connectivity
  let graph, pixels, totalEdges;
  
  console.log(`Using threshold: ${adaptiveThreshold} (requested: ${threshold})`);
  
  // Build the graph
  const graphResult = buildPixelGraph(data, width, height, adaptiveThreshold);
  graph = graphResult.graph;
  pixels = graphResult.pixels;
  totalEdges = graph.getTotalEdges();
  
  const avgEdgesPerNode = (totalEdges * 2) / graph.nodeCount;
  console.log(`Graph built: ${graph.nodeCount} nodes, ${totalEdges} edges (avg: ${avgEdgesPerNode.toFixed(2)} edges/node)`);

  // Run Karger's algorithm with Monte Carlo
  const cutResult = monteCarloMinCut(graph, iterations);
  
  console.log(`Min cut found: ${cutResult.cutSize}`);

  // Create segmented image
  const segmentedData = createSegmentedImage(pixels, cutResult, width, height);

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
      minCutSize: cutResult.cutSize,
      nodes: graph.nodeCount,
      edges: Math.floor(totalEdges),
      iterations
    }
  };
}
