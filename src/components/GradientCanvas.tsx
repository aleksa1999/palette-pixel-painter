
import React, { useRef, useEffect, useCallback } from 'react';

interface GradientCanvasProps {
  hue: number;
  saturation: number;
  brightness: number;
  onChange: (saturation: number, brightness: number) => void;
}

export const GradientCanvas: React.FC<GradientCanvasProps> = ({
  hue,
  saturation,
  brightness,
  onChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create the gradient from white to the pure hue
    const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
    saturationGradient.addColorStop(0, 'white');
    saturationGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

    ctx.fillStyle = saturationGradient;
    ctx.fillRect(0, 0, width, height);

    // Create the brightness gradient (black overlay)
    const brightnessGradient = ctx.createLinearGradient(0, 0, 0, height);
    brightnessGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    brightnessGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = brightnessGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handleMouseMove(e);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging.current && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const brightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));

    onChange(saturation, brightness);
  }, [onChange]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging.current) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={280}
        height={200}
        onMouseDown={handleMouseDown}
        className="w-full h-48 rounded-lg cursor-crosshair border border-gray-200"
        style={{ maxWidth: '100%', height: '192px' }}
      />
      {/* Selector Circle */}
      <div
        className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-2 -translate-y-2"
        style={{
          left: `${saturation}%`,
          top: `${100 - brightness}%`,
        }}
      />
    </div>
  );
};
