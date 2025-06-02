
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradientCanvas } from './GradientCanvas';
import { ColorSlider } from './ColorSlider';
import { OpacitySlider } from './OpacitySlider';
import { ThemeColors } from './ThemeColors';
import { useColorState } from '../hooks/useColorState';
import { Pipette } from 'lucide-react';

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
    setHex(value);
  }, [setHex]);

  const handleHueInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 360) {
      setHsb(prev => ({ ...prev, h: value }));
    }
  }, [setHsb]);

  const handleOpacityInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setOpacity(value);
    }
  }, [setOpacity]);

  const handleOpacitySpinnerChange = useCallback((increment: boolean) => {
    const newOpacity = increment ? 
      Math.min(100, Math.round(opacity) + 1) : 
      Math.max(0, Math.round(opacity) - 1);
    setOpacity(newOpacity);
  }, [opacity, setOpacity]);

  const handleEyedropper = useCallback(() => {
    if ('EyeDropper' in window) {
      // @ts-ignore - EyeDropper API is not yet in TypeScript types
      const eyeDropper = new EyeDropper();
      eyeDropper.open().then((result: any) => {
        setHex(result.sRGBHex);
      }).catch((error: any) => {
        console.log('User cancelled the eyedropper');
      });
    } else {
      console.log('EyeDropper API not supported');
    }
  }, [setHex]);

  // Calculate color with opacity for preview
  const colorWithOpacity = useMemo(() => {
    // Convert hex to rgba with opacity
    if (hex.startsWith('#') && hex.length === 7) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }
    return hex;
  }, [hex, opacity]);

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
        {/* Gradient Canvas */}
        <div className="mb-6">
          <GradientCanvas
            hue={hsb.h}
            saturation={hsb.s}
            brightness={hsb.b}
            onChange={handleSaturationBrightnessChange}
          />
        </div>

        {/* Eyedropper and Sliders Section */}
        <div className="mb-6 flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEyedropper}
            className="p-2 hover:bg-gray-100 flex-shrink-0 border-2 border-gray-300 w-10 h-10"
            style={{ height: '48px' }}
          >
            <Pipette className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 space-y-1">
            {/* Hue Slider */}
            <div>
              <ColorSlider
                hue={hsb.h}
                onChange={handleHueChange}
              />
            </div>
            
            {/* Opacity Slider */}
            <div>
              <OpacitySlider
                opacity={opacity}
                color={hex}
                onChange={setOpacity}
              />
            </div>
          </div>
        </div>

        {/* Custom Color Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Custom Color</h3>
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: colorWithOpacity }}
            />
            <Input
              value={hex}
              onChange={handleHexChange}
              className="flex-1 font-mono text-sm"
              placeholder="#D28E9E"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 w-8">H:</span>
            <Input
              value={Math.round(hsb.h)}
              onChange={handleHueInputChange}
              className="flex-1 text-sm"
              placeholder="0"
              type="number"
              min="0"
              max="360"
            />
            
            <span className="text-sm font-medium text-gray-600 w-8">A:</span>
            {/* Opacity Spinner */}
            <div className="relative flex items-center">
              <Input
                value={Math.round(opacity)}
                onChange={handleOpacityInputChange}
                className="w-16 text-sm text-center pr-6"
                placeholder="100"
                type="number"
                min="0"
                max="100"
              />
              <div className="absolute right-1 flex flex-col">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOpacitySpinnerChange(true);
                  }}
                  className="w-3 h-2 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center leading-none"
                >
                  ▲
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOpacitySpinnerChange(false);
                  }}
                  className="w-3 h-2 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center leading-none"
                >
                  ▼
                </button>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">%</span>
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
              console.log('Selected color:', hex, 'Opacity:', opacity);
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
