import React from 'react';
import { Scissors, RotateCcw, Download, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';

export function ControlPanel({
  onSegment,
  onReset,
  onDownload,
  isProcessing,
  hasResult,
  iterations,
  onIterationsChange,
  threshold,
  onThresholdChange,
  onShowInfo,
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-purple-500/20 shadow-2xl lg:sticky lg:top-8">
      <CardHeader className="border-b border-purple-500/10 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Segmentation Controls
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-400">
          Adjust parameters and process your image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center gap-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-300">
              Monte Carlo Iterations
            </label>
            <span className="text-base sm:text-lg font-bold text-purple-400 bg-purple-500/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {iterations}
            </span>
          </div>
          <Slider
            min={1}
            max={50}
            step={1}
            value={iterations}
            onChange={onIterationsChange}
            disabled={isProcessing}
            className="cursor-pointer"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></span>
            <span>More iterations increase accuracy but take longer</span>
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center gap-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-300">
              Similarity Threshold
            </label>
            <span className="text-base sm:text-lg font-bold text-pink-400 bg-pink-500/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {threshold}
            </span>
          </div>
          <Slider
            min={60}
            max={100}
            step={5}
            value={threshold}
            onChange={onThresholdChange}
            disabled={isProcessing}
            className="cursor-pointer"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-pink-500 rounded-full flex-shrink-0"></span>
            <span>Lower values create more edges in the graph</span>
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
          <Button
            onClick={onSegment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all text-sm sm:text-base"
            size="lg"
          >
            <Scissors className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {isProcessing ? 'Processing...' : 'Segment Image'}
          </Button>

          {hasResult && (
            <>
              <Button
                onClick={onDownload}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 text-sm sm:text-base"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Download Result
              </Button>

              <Button
                onClick={onReset}
                variant="outline"
                className="w-full border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 text-gray-300 font-semibold text-sm sm:text-base"
              >
                <RotateCcw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Reset
              </Button>
            </>
          )}

          <Button
            onClick={onShowInfo}
            variant="ghost"
            className="w-full hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 font-semibold text-sm sm:text-base"
          >
            <Info className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            How It Works
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
