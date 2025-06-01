
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradientCanvas } from './GradientCanvas';
import { ColorSlider } from './ColorSlider';
import { ThemeColors } from './ThemeColors';
import { useColorState } from '../hooks/useColorState';

export const ColorPicker = () => {
  const {
    hsb,
    setHsb,
    hex,
    setHex,
    opacity,
    setOpacity
  } = useColorState();

  const [isOpen, setIsOpen] = useState(false);

  const handleSaturationBrightnessChange = useCallback((saturation: number, brightness: number) => {
    setHsb(prev => ({ ...prev, s: saturation, b: brightness }));
  }, [setHsb]);

  const handleHueChange = useCallback((hue: number) => {
    setHsb(prev => ({ ...prev, h: hue }));
  }, [setHsb]);

  const handleThemeColorSelect = useCallback((color: string) => {
    setHex(color);
  }, [setHex]);

  const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setHex(value);
    }
  }, [setHex]);

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700"
        >
          Open Color Picker
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        {/* Color Preview Circle */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: hex }}
          />
        </div>

        {/* Gradient Canvas */}
        <div className="mb-6">
          <GradientCanvas
            hue={hsb.h}
            saturation={hsb.s}
            brightness={hsb.b}
            onChange={handleSaturationBrightnessChange}
          />
        </div>

        {/* Color Slider */}
        <div className="mb-6">
          <ColorSlider
            hue={hsb.h}
            onChange={handleHueChange}
          />
        </div>

        {/* Custom Color Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Custom Color</h3>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: hex }}
            />
            <Input
              value={hex}
              onChange={handleHexChange}
              className="flex-1 font-mono text-sm"
              placeholder="#D28E9E"
            />
            <span className="text-sm font-medium text-gray-600 w-12 text-right">
              {Math.round(opacity)}%
            </span>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Theme Colors</h3>
          <ThemeColors onColorSelect={handleThemeColorSelect} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              console.log('Selected color:', hex);
              setIsOpen(false);
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};
