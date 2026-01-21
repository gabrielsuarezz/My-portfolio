import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AsciiArtProps {
  imageSrc: string;
  width?: number;
  fontSize?: number;
}

export const AsciiArt = memo(({ imageSrc, width = 120, fontSize = 8 }: AsciiArtProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiText, setAsciiText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Memoize ASCII characters
  const ASCII_CHARS = useMemo(() => " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvcz*#%@", []);
  const ASCII_CHARS_DETAILED = useMemo(() => " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$", []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const height = Math.floor(width * aspectRatio * 0.5);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);

      let ascii = "";
      const chars = isHovered ? ASCII_CHARS_DETAILED : ASCII_CHARS;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = imageData.data[offset];
          const g = imageData.data[offset + 1];
          const b = imageData.data[offset + 2];

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
          
          ascii += chars[charIndex];
        }
        ascii += "\n";
      }

      setAsciiText(ascii);
    };

    img.src = imageSrc;
  }, [imageSrc, width, isHovered, ASCII_CHARS, ASCII_CHARS_DETAILED]);

  // Memoize block letters
  const letters = useMemo(() => ({
    'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██', '██   ██', '██   ██'],
    'I': ['███████', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '   ██  ', '███████'],
    'R': ['██████ ', '██   ██', '██   ██', '██████ ', '██  ██ ', '██   ██', '██   ██'],
    'E': ['███████', '██     ', '██     ', '█████  ', '██     ', '██     ', '███████'],
    'M': ['██   ██', '███ ███', '███████', '██ █ ██', '██   ██', '██   ██', '██   ██'],
    ' ': ['   ', '   ', '   ', '   ', '   ', '   ', '   ']
  }), []);

  const generateAsciiBlockText = useCallback(() => {
    const text = 'HIRE ME';
    const letterArrays = text.split('').map(char => letters[char as keyof typeof letters] || letters[' ']);
    
    const combinedLines: string[] = [];
    for (let row = 0; row < 7; row++) {
      const line = letterArrays.map(letter => letter[row]).join(' ');
      combinedLines.push(line);
    }
    
    return combinedLines;
  }, [letters]);

  const insertTextIntoAscii = useCallback((ascii: string) => {
    const lines = ascii.split('\n');
    const blockText = generateAsciiBlockText();
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
  }, [generateAsciiBlockText]);

  const lines = useMemo(() => 
    isHovered ? insertTextIntoAscii(asciiText) : asciiText.split('\n'),
    [isHovered, asciiText, insertTextIntoAscii]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <motion.pre
        className="font-mono text-primary/80 leading-none select-none overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)'
        }}
        transition={{ duration: 0.3 }}
      >
        {lines.map((line, i) => {
          const isMessageLine = isHovered && i >= 2 && i <= 8;
          
          // Skip animation for reduced motion
          if (prefersReducedMotion) {
            return (
              <div
                key={i}
                className={isMessageLine ? "text-accent font-extrabold" : isHovered ? "text-accent/70" : ""}
                style={{ 
                  fontSize: isMessageLine ? `${fontSize * 1.1}px` : `${fontSize}px`,
                  letterSpacing: isMessageLine ? '0.05em' : 'normal'
                }}
              >
                {line}
              </div>
            );
          }
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.005, duration: 0.2 }}
              className={isMessageLine ? "text-accent font-extrabold" : isHovered ? "text-accent/70" : ""}
              style={{ 
                fontSize: isMessageLine ? `${fontSize * 1.1}px` : `${fontSize}px`,
                letterSpacing: isMessageLine ? '0.05em' : 'normal',
                willChange: 'transform, opacity',
              }}
            >
              {line}
            </motion.div>
          );
        })}
      </motion.pre>

      {/* Scanline effect - simplified for performance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(217 91% 60% / 0.03) 2px, hsl(217 91% 60% / 0.03) 4px)',
        }}
      />

      {/* Glitch effect on hover - only when not reduced motion */}
      {isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: [0, -2, 2, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            textShadow: '2px 0 hsl(187 85% 53%), -2px 0 hsl(217 91% 60%)',
          }}
        />
      )}
    </div>
  );
});

AsciiArt.displayName = 'AsciiArt';
