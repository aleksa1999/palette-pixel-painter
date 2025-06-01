
import React from 'react';

interface ThemeColorsProps {
  onColorSelect: (color: string) => void;
}

const themeColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EF4444', // Red
];

export const ThemeColors: React.FC<ThemeColorsProps> = ({ onColorSelect }) => {
  return (
    <div className="flex gap-2 justify-center">
      {themeColors.map((color, index) => (
        <button
          key={index}
          onClick={() => onColorSelect(color)}
          className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          style={{ backgroundColor: color }}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
};
