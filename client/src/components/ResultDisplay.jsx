import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';

export function ResultDisplay({ result, isProcessing, stats }) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-purple-500/20 shadow-2xl">
      <CardHeader className="border-b border-purple-500/10 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Segmentation Result
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-400">
          {isProcessing ? 'Processing your image...' : 'Foreground extracted using Karger\'s algorithm'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4 md:p-6">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="relative">
              <Loader2 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 animate-spin text-purple-500" />
              <div className="absolute inset-0 blur-xl bg-purple-500/50 animate-pulse"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mt-4 sm:mt-6 font-medium px-4 text-center">
              Running Karger's min-cut algorithm...
            </p>
            <div className="flex gap-2 mt-3 sm:mt-4">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-xl"></div>
              <img
                src={result}
                alt="Segmented result"
                className="relative w-full h-auto rounded-xl border border-purple-500/30 shadow-2xl"
              />
            </div>
            {stats && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-1">Processing Time</p>
                  <p className="font-bold text-lg sm:text-xl md:text-2xl text-purple-400">{stats.processingTime}ms</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-1">Best Cut Size</p>
                  <p className="font-bold text-lg sm:text-xl md:text-2xl text-pink-400">{stats.minCutSize}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-1">Graph Nodes</p>
                  <p className="font-bold text-lg sm:text-xl md:text-2xl text-blue-400">{stats.nodes.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-1">Graph Edges</p>
                  <p className="font-bold text-lg sm:text-xl md:text-2xl text-green-400">{stats.edges.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <div className="relative inline-block mb-3 sm:mb-4">
              <Loader2 className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 text-gray-600" />
              <div className="absolute inset-0 blur-xl bg-gray-600/20"></div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Upload an image and click "Segment Image" to see results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
