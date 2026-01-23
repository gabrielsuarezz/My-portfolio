import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AsciiArtProps {
  imageSrc: string;
  width?: number;
  fontSize?: number;
}

const ASCII_CHARS = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvcz*#%@";
const ASCII_CHARS_DETAILED = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const LETTERS: Record<string, string[]> = {
  'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██', '██   ██', '██   ██'],
  'I': ['███████', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '███████'],
  'R': ['██████ ', '██   ██', '██   ██', '██████ ', '██  ██ ', '██   ██', '██   ██'],
  'E': ['███████', '██     ', '██     ', '█████  ', '██     ', '██     ', '███████'],
  'M': ['██   ██', '███ ███', '███████', '██ █ ██', '██   ██', '██   ██', '██   ██'],
  ' ': ['   ', '   ', '   ', '   ', '   ', '   ', '   ']
};

export const AsciiArt = memo(({ imageSrc, width = 120, fontSize = 8 }: AsciiArtProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiText, setAsciiText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Generate ASCII from image data
  const generateAscii = useCallback((imageData: ImageData, imgWidth: number, imgHeight: number, detailed: boolean) => {
    let ascii = "";
    const chars = detailed ? ASCII_CHARS_DETAILED : ASCII_CHARS;

    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
        const offset = (y * imgWidth + x) * 4;
        const r = imageData.data[offset];
        const g = imageData.data[offset + 1];
        const b = imageData.data[offset + 2];
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
        ascii += chars[charIndex];
      }
      ascii += "\n";
    }
    return ascii;
  }, []);

  // Load image once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      imgRef.current = img;
      const aspectRatio = img.height / img.width;
      const height = Math.floor(width * aspectRatio * 0.5);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      
      setAsciiText(generateAscii(imageData, width, height, false));
      setIsLoaded(true);
    };

    img.src = imageSrc;
  }, [imageSrc, width, generateAscii]);

  // Regenerate ASCII when hover state changes (only if loaded)
  useEffect(() => {
    if (!isLoaded || !imgRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const aspectRatio = imgRef.current.height / imgRef.current.width;
    const height = Math.floor(width * aspectRatio * 0.5);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    setAsciiText(generateAscii(imageData, width, height, isHovered));
  }, [isHovered, isLoaded, width, generateAscii]);

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

  const lines = useMemo(() => 
    isHovered ? insertTextIntoAscii(asciiText) : asciiText.split('\n'),
    [isHovered, asciiText, insertTextIntoAscii]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Simplified rendering for performance
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <motion.pre
        className="font-mono text-primary/80 leading-none select-none overflow-hidden cursor-pointer"
        style={{ fontSize: `${fontSize}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ 
          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
        }}
        transition={{ duration: 0.2 }}
      >
        {prefersReducedMotion ? (
          // Static rendering for reduced motion
          lines.map((line, i) => {
            const isMessageLine = isHovered && i >= 2 && i <= 8;
            return (
              <div
                key={i}
                className={isMessageLine ? "text-accent font-bold" : isHovered ? "text-accent/70" : ""}
              >
                {line}
              </div>
            );
          })
        ) : (
          // Animated rendering - simplified
          lines.map((line, i) => {
            const isMessageLine = isHovered && i >= 2 && i <= 8;
            return (
              <div
                key={i}
                className={`transition-colors duration-200 ${isMessageLine ? "text-accent font-bold" : isHovered ? "text-accent/70" : ""}`}
              >
                {line}
              </div>
            );
          })
        )}
      </motion.pre>

      {/* Static scanline overlay - no animation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(217 91% 60% / 0.02) 2px, hsl(217 91% 60% / 0.02) 4px)',
        }}
      />
    </div>
  );
});

AsciiArt.displayName = 'AsciiArt';
