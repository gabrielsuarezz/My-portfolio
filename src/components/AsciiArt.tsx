import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AsciiArtProps {
  imageSrc: string;
  width?: number;
  fontSize?: number;
}

// Optimized character ramps for better portrait rendering
const ASCII_CHARS = " .'-:;=+*#%@";
const ASCII_CHARS_DETAILED = " .'`-:;!=+<>*^~?|/\\(){}[]#%&@$";

const LETTERS: Record<string, string[]> = {
  'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██', '██   ██', '██   ██'],
  'I': ['███████', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '███████'],
  'R': ['██████ ', '██   ██', '██   ██', '██████ ', '██  ██ ', '██   ██', '██   ██'],
  'E': ['███████', '██     ', '██     ', '█████  ', '██     ', '██     ', '███████'],
  'M': ['██   ██', '███ ███', '███████', '██ █ ██', '██   ██', '██   ██', '██   ██'],
  ' ': ['   ', '   ', '   ', '   ', '   ', '   ', '   ']
};

// Enhanced contrast and edge detection for clearer portraits
const enhanceImageData = (ctx: CanvasRenderingContext2D, width: number, height: number): ImageData => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Calculate histogram for auto-levels
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const brightness = Math.floor(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[brightness]++;
  }
  
  // Find 5th and 95th percentile for contrast stretching
  const totalPixels = width * height;
  let lowThreshold = 0, highThreshold = 255;
  let cumulative = 0;
  
  for (let i = 0; i < 256; i++) {
    cumulative += histogram[i];
    if (cumulative / totalPixels <= 0.05) lowThreshold = i;
    if (cumulative / totalPixels <= 0.95) highThreshold = i;
  }
  
  const range = highThreshold - lowThreshold || 1;
  
  // Apply contrast enhancement and slight sharpening
  for (let i = 0; i < data.length; i += 4) {
    // Contrast stretch
    for (let c = 0; c < 3; c++) {
      let val = data[i + c];
      val = ((val - lowThreshold) / range) * 255;
      val = Math.max(0, Math.min(255, val));
      // Boost contrast slightly
      val = ((val / 255 - 0.5) * 1.3 + 0.5) * 255;
      data[i + c] = Math.max(0, Math.min(255, val));
    }
  }
  
  return imageData;
};

export const AsciiArt = memo(({ imageSrc, width = 150, fontSize = 6 }: AsciiArtProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiText, setAsciiText] = useState<string>("");
  const [detailedAsciiText, setDetailedAsciiText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Generate ASCII from image data with improved algorithm - optimized with array join
  const generateAscii = useCallback((imageData: ImageData, imgWidth: number, imgHeight: number, detailed: boolean) => {
    const lines: string[] = [];
    const chars = detailed ? ASCII_CHARS_DETAILED : ASCII_CHARS;
    const data = imageData.data;

    for (let y = 0; y < imgHeight; y++) {
      const lineChars: string[] = [];
      for (let x = 0; x < imgWidth; x++) {
        const offset = (y * imgWidth + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];

        // Use luminance formula for more accurate brightness
        const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b);

        // Non-linear mapping for better detail in midtones
        const normalizedBrightness = Math.pow(brightness / 255, 0.8);
        const charIndex = Math.floor(normalizedBrightness * (chars.length - 1));
        lineChars.push(chars[charIndex]);
      }
      lines.push(lineChars.join(''));
    }
    return lines.join('\n');
  }, []);

  // Load image once and pre-compute BOTH ASCII versions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const aspectRatio = img.height / img.width;
      // Adjust for character aspect ratio (characters are taller than wide)
      const height = Math.floor(width * aspectRatio * 0.45);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // Process image ONCE and cache enhanced data
      const enhancedData = enhanceImageData(ctx, width, height);

      // Pre-compute BOTH versions - do expensive work upfront, not on hover
      setAsciiText(generateAscii(enhancedData, width, height, false));
      setDetailedAsciiText(generateAscii(enhancedData, width, height, true));
      setIsLoaded(true);
    };

    img.src = imageSrc;
  }, [imageSrc, width, generateAscii]);

  const generateBlockText = useCallback(() => {
    const text = 'HIRE ME';
    const letterArrays = text.split('').map(char => LETTERS[char] || LETTERS[' ']);
    
    const combinedLines: string[] = [];
    for (let row = 0; row < 7; row++) {
      combinedLines.push(letterArrays.map(letter => letter[row]).join(' '));
    }
    return combinedLines;
  }, []);

  const insertTextIntoAscii = useCallback((ascii: string) => {
    const lines = ascii.split('\n');
    const blockText = generateBlockText();
    const startLine = 2;
    
    blockText.forEach((textLine, i) => {
      const lineIndex = startLine + i;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const originalLine = lines[lineIndex];
        const startPos = Math.floor((originalLine.length - textLine.length) / 2);
        if (startPos >= 0 && startPos + textLine.length <= originalLine.length) {
          lines[lineIndex] = 
            originalLine.substring(0, startPos) + 
            textLine + 
            originalLine.substring(startPos + textLine.length);
        }
      }
    });
    
    return lines;
  }, [generateBlockText]);

  // Use pre-computed version based on hover state - no expensive recalculation!
  const currentAscii = isHovered ? detailedAsciiText : asciiText;
  const lines = useMemo(() =>
    isHovered ? insertTextIntoAscii(currentAscii) : currentAscii.split('\n'),
    [isHovered, currentAscii, insertTextIntoAscii]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <pre
        className={`font-mono text-primary/80 leading-none select-none overflow-hidden cursor-pointer transition-all duration-200 ${isHovered ? 'brightness-125' : ''}`}
        style={{ 
          fontSize: `${fontSize}px`,
          transform: 'translateZ(0)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {lines.map((line, i) => {
          const isMessageLine = isHovered && i >= 2 && i <= 8;
          return (
            <div
              key={i}
              className={`transition-colors duration-150 ${isMessageLine ? "text-accent font-bold" : isHovered ? "text-accent/70" : ""}`}
            >
              {line}
            </div>
          );
        })}
      </pre>

      {/* Static scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(217 91% 60% / 0.02) 2px, hsl(217 91% 60% / 0.02) 4px)',
        }}
      />
    </div>
  );
});

AsciiArt.displayName = 'AsciiArt';
