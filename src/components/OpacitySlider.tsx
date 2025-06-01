
import React, { useRef, useCallback } from 'react';

interface OpacitySliderProps {
  opacity: number;
  color: string;
  onChange: (opacity: number) => void;
}

export const OpacitySlider: React.FC<OpacitySliderProps> = ({ opacity, color, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handleMouseMove(e);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging.current && e.type !== 'mousedown') return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newOpacity = Math.max(0, Math.min(100, (x / rect.width) * 100));

    onChange(newOpacity);
  }, [onChange]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  React.useEffect(() => {
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
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="w-full h-6 rounded-full cursor-pointer border border-gray-200"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${color} 100%), 
                      url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='8' height='8'%3e%3crect fill='%23f3f4f6' width='4' height='4'/%3e%3crect fill='%23e5e7eb' x='4' y='4' width='4' height='4'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`
        }}
      />
      {/* Slider Handle */}
      <div
        className="absolute w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-lg transform -translate-x-3 -translate-y-0 pointer-events-none"
        style={{
          left: `${opacity}%`,
          top: '0px',
        }}
      />
    </div>
  );
};
