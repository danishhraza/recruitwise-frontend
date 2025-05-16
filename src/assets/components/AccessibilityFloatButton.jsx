// src/components/ui/AccessibilityFloatButton.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Accessibility, Eye, Type } from "lucide-react";
import { useTheme } from "@/assets/components/theme-provider";

// Create a context for accessibility settings
export const AccessibilityContext = React.createContext({
  fontSize: 16,
  setFontSize: () => {},
  colorBlindMode: "normal",
  setColorBlindMode: () => {},
});

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [colorBlindMode, setColorBlindMode] = useState("normal");

  // Apply font size to the document root element
  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply color blind filters to the document root element
  React.useEffect(() => {
    // Remove any existing filters
    document.documentElement.style.filter = "none";

    // Apply the selected color blind mode
    switch (colorBlindMode) {
      case "protanopia":
        document.documentElement.style.filter = "url('#protanopia-filter')";
        break;
      case "deuteranopia":
        document.documentElement.style.filter = "url('#deuteranopia-filter')";
        break;
      case "tritanopia":
        document.documentElement.style.filter = "url('#tritanopia-filter')";
        break;
      case "achromatopsia":
        document.documentElement.style.filter = "url('#achromatopsia-filter')";
        break;
      default:
        // Normal vision, no filter
        break;
    }
  }, [colorBlindMode]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        colorBlindMode,
        setColorBlindMode,
      }}
    >
      {/* SVG Filters for color blindness simulation */}
      <svg className="absolute w-0 h-0">
        {/* Protanopia (red-blind) */}
        <filter id="protanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>
        {/* Deuteranopia (green-blind) */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.7,   0.3,   0,   0, 0
                    0,     0.3,   0.7, 0, 0
                    0,     0,     0,   1, 0"
          />
        </filter>
        {/* Tritanopia (blue-blind) */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"
          />
        </filter>
        {/* Achromatopsia (monochromacy) */}
        <filter id="achromatopsia-filter">
          <feColorMatrix
            type="matrix"
            values="0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>
      </svg>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook for using accessibility settings
export const useAccessibility = () => {
  return React.useContext(AccessibilityContext);
};

const AccessibilityFloatButton = () => {
  const { fontSize, setFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();
  const { setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="rounded-full w-14 h-14 flex items-center justify-center">
            <Accessibility className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Accessibility Options</h3>
            
            <Tabs defaultValue="vision">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="vision">
                  <Eye className="mr-2 h-4 w-4" />
                  Vision
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="vision" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Color Blind Mode</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={colorBlindMode === "normal" ? "default" : "outline"}
                      onClick={() => setColorBlindMode("normal")}
                      className="w-full"
                    >
                      Normal
                    </Button>
                    <Button
                      variant={colorBlindMode === "protanopia" ? "default" : "outline"}
                      onClick={() => setColorBlindMode("protanopia")}
                      className="w-full"
                    >
                      Protanopia
                    </Button>
                    <Button
                      variant={colorBlindMode === "deuteranopia" ? "default" : "outline"}
                      onClick={() => setColorBlindMode("deuteranopia")}
                      className="w-full"
                    >
                      Deuteranopia
                    </Button>
                    <Button
                      variant={colorBlindMode === "tritanopia" ? "default" : "outline"}
                      onClick={() => setColorBlindMode("tritanopia")}
                      className="w-full"
                    >
                      Tritanopia
                    </Button>
                  </div>
                </div>
                              </TabsContent>
              
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Font Size</h4>
                    <span className="text-sm">{fontSize}px</span>
                  </div>
                  <Slider
                    defaultValue={[fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setFontSize(14)}
                      className="w-full"
                    >
                      Small
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFontSize(16)}
                      className="w-full"
                    >
                      Normal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFontSize(20)}
                      className="w-full"
                    >
                      Large
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setFontSize(16);
                setColorBlindMode("normal");
              }}
            >
              Reset All
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccessibilityFloatButton;