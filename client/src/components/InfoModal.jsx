import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <CardHeader className="border-b border-purple-500/20 sticky top-0 bg-card/95 backdrop-blur-xl z-10 p-4 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Karger's Min-Cut Algorithm
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
                Understanding image segmentation through graph theory
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-purple-500/20 hover:text-purple-300 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 p-3 sm:p-4 md:p-6">
          <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-purple-500/20">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 text-purple-300">What is Karger's Algorithm?</h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Karger's algorithm is a randomized algorithm for finding minimum cuts in undirected graphs.
              It works by repeatedly contracting random edges until only two super-nodes remain, with the
              edges between them representing a potential minimum cut.
            </p>
          </section>

          <section className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-500/20">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-blue-300">How It Works for Images</h3>
            <ol className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs sm:text-sm">1</span>
                <div>
                  <strong className="text-purple-300">Graph Construction:</strong> Each pixel becomes a node, and edges connect
                  similar neighboring pixels based on color similarity.
                </div>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold text-xs sm:text-sm">2</span>
                <div>
                  <strong className="text-pink-300">Edge Contraction:</strong> Random edges are contracted, merging nodes while
                  preserving the graph structure.
                </div>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xs sm:text-sm">3</span>
                <div>
                  <strong className="text-blue-300">Min-Cut Discovery:</strong> The process continues until two clusters remain,
                  representing foreground and background.
                </div>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-xs sm:text-sm">4</span>
                <div>
                  <strong className="text-green-300">Monte Carlo Boost:</strong> Multiple iterations run to find the best cut,
                  improving success probability.
                </div>
              </li>
            </ol>
          </section>

          <section className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-pink-500/20">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-pink-300">Algorithm Complexity</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span><strong>Time Complexity:</strong> O(n² log n) per iteration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span><strong>Success Probability:</strong> ≥ 1/n² for single run</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>With k iterations:</strong> 1 - (1 - 1/n²)^k</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>Space Complexity:</strong> O(n + m) where n=nodes, m=edges</span>
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-500/20">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-green-300">Parameters</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-purple-500/10 p-3 sm:p-4 rounded-lg border border-purple-500/20">
                <strong className="text-purple-300 text-sm sm:text-base md:text-lg">Monte Carlo Iterations:</strong>
                <p className="text-gray-300 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">
                  Higher values increase the probability of finding the true minimum cut.
                  Recommended: 10-30 for good results.
                </p>
              </div>
              <div className="bg-pink-500/10 p-3 sm:p-4 rounded-lg border border-pink-500/20">
                <strong className="text-pink-300 text-sm sm:text-base md:text-lg">Similarity Threshold:</strong>
                <p className="text-gray-300 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">
                  Controls edge creation. Lower values create more edges (denser graph),
                  higher values create fewer edges (sparser graph).
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-orange-500/5 to-red-500/5 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-orange-500/20">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-orange-300">Real-World Applications</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✦</span>
                <span>Photo editing software (e.g., Photoshop's Magic Wand)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">✦</span>
                <span>Object isolation in graphic design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✦</span>
                <span>Medical image segmentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✦</span>
                <span>Computer vision and image analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">✦</span>
                <span>Background removal tools</span>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
