
import React, { useRef, useCallback, useEffect } from 'react';

interface OpacitySliderProps {
  opacity: number;
  color: string;
  onChange: (opacity: number) => void;
}

export const OpacitySlider: React.FC<OpacitySliderProps> = ({ opacity, color, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!isDragging.current) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newOpacity = (x / rect.width) * 100;

    onChange(newOpacity);
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

  // Calculate the current selected color with current opacity
  const currentColor = (() => {
    if (color.startsWith('#') && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }
    return color;
  })();

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="w-full h-3 rounded-full cursor-pointer border border-gray-200"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${color} 100%)`
        }}
      />
      {/* Slider Handle with current opacity color */}
      <div
        className="absolute w-5 h-5 border-2 border-gray-300 rounded-full shadow-lg transform -translate-x-2.5 -translate-y-1 pointer-events-none"
        style={{
          left: `${opacity}%`,
          top: '0px',
          backgroundColor: currentColor,
        }}
      />
    </div>
  );
};
