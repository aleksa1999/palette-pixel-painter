
import React, { useState, useCallback } from 'react';
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
    // Allow typing hex values freely
    setHex(value);
  }, [setHex]);

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
            className="p-2 hover:bg-gray-100 flex-shrink-0"
            style={{ height: '60px' }}
          >
            <Pipette className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 space-y-2">
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
            
            {/* Opacity Spinner - Remove browser default spinners */}
            <div className="relative flex items-center">
              <Input
                value={Math.round(opacity)}
                onChange={handleOpacityInputChange}
                className="w-16 text-sm text-center pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="100"
                type="number"
                min="0"
                max="100"
              />
              <div className="absolute right-1 flex flex-col">
                <button
                  onClick={() => handleOpacitySpinnerChange(true)}
                  className="w-4 h-3 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center leading-none"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleOpacitySpinnerChange(false)}
                  className="w-4 h-3 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center leading-none"
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
