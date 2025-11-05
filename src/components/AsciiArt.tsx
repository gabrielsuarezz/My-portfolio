import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AsciiArtProps {
  imageSrc: string;
  width?: number;
  fontSize?: number;
}

export const AsciiArt = ({ imageSrc, width = 120, fontSize = 8 }: AsciiArtProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiText, setAsciiText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  // ASCII characters from darkest to lightest
  const ASCII_CHARS = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvcz*#%@";
  const ASCII_CHARS_DETAILED = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const height = Math.floor(width * aspectRatio * 0.5); // 0.5 to account for character aspect ratio

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

          // Convert to grayscale using luminosity method
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
          
          ascii += chars[charIndex];
        }
        ascii += "\n";
      }

      setAsciiText(ascii);
    };

    img.src = imageSrc;
  }, [imageSrc, width, isHovered]);

  const generateAsciiBlockText = () => {
    // Carefully designed ASCII block letters
    const letters: { [key: string]: string[] } = {
      'H': [
        '██   ██',
        '██   ██',
        '███████',
        '██   ██',
        '██   ██',
        '██   ██',
        '██   ██'
      ],
      'I': [
        '███████',
        '   ██  ',
        '   ██  ',
        '   ██  ',
        '   ██  ',
        '   ██  ',
        '███████'
      ],
      'R': [
        '██████ ',
        '██   ██',
        '██   ██',
        '██████ ',
        '██  ██ ',
        '██   ██',
        '██   ██'
      ],
      'E': [
        '███████',
        '██     ',
        '██     ',
        '█████  ',
        '██     ',
        '██     ',
        '███████'
      ],
      'M': [
        '██   ██',
        '███ ███',
        '███████',
        '██ █ ██',
        '██   ██',
        '██   ██',
        '██   ██'
      ],
      ' ': [
        '   ',
        '   ',
        '   ',
        '   ',
        '   ',
        '   ',
        '   '
      ]
    };

    const text = 'HIRE ME';
    const letterArrays = text.split('').map(char => letters[char] || letters[' ']);
    
    // Combine all letters horizontally
    const combinedLines: string[] = [];
    for (let row = 0; row < 7; row++) {
      const line = letterArrays.map(letter => letter[row]).join(' ');
      combinedLines.push(line);
    }
    
    return combinedLines;
  };

  const insertTextIntoAscii = (ascii: string) => {
    const lines = ascii.split('\n');
    const blockText = generateAsciiBlockText();
    
    // Position at the top (starting from line 2 to leave a small margin)
    const startLine = 2;
    
    // Replace lines with the block text
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
  };

  const lines = isHovered ? insertTextIntoAscii(asciiText) : asciiText.split('\n');

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <motion.pre
        className="font-mono text-primary/80 leading-none select-none overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)'
        }}
        transition={{ duration: 0.3 }}
      >
        {lines.map((line, i) => {
          // Message lines are now at the top (lines 2-8)
          const isMessageLine = isHovered && i >= 2 && i <= 8;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.005, duration: 0.2 }}
              className={isMessageLine ? "text-accent font-extrabold" : isHovered ? "text-accent/70" : ""}
              style={{ 
                transition: 'all 0.3s ease',
                fontSize: isMessageLine ? `${fontSize * 1.1}px` : `${fontSize}px`,
                letterSpacing: isMessageLine ? '0.05em' : 'normal'
              }}
            >
              {line}
            </motion.div>
          );
        })}
      </motion.pre>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(217 91% 60% / 0.03) 2px, hsl(217 91% 60% / 0.03) 4px)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glitch effect on hover */}
      {isHovered && (
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
};