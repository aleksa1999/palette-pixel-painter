
import React, { useRef, useCallback, useEffect } from 'react';

interface ColorSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

export const ColorSlider: React.FC<ColorSliderProps> = ({ hue, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!isDragging.current) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newHue = (x / rect.width) * 360;

    onChange(newHue);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Calculate the current selected color
  const selectedColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="w-full h-2 rounded-full cursor-pointer border border-gray-200"
        style={{
          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
        }}
      />
      {/* Slider Handle with current hue color */}
      <div
        className="absolute w-4 h-4 border-2 border-gray-300 rounded-full shadow-lg transform -translate-x-2 -translate-y-1 pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          top: '0px',
          backgroundColor: selectedColor,
        }}
      />
    </div>
  );
};
