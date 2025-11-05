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
      // Focus on upper region for facial clarity
      const focusRatio = 0.65; // top 65%
      const cropHeight = img.height * focusRatio;

      // Increase character density using Braille (2x4 dots per cell)
      const cellsAcross = isHovered ? Math.floor(width * 1.6) : width;
      const pxWidth = cellsAcross * 2;
      const aspectRatio = cropHeight / img.width;
      let pxHeight = Math.max(4, Math.floor(pxWidth * aspectRatio));
      // Ensure multiple of 4 for Braille rows
      pxHeight = pxHeight - (pxHeight % 4);

      canvas.width = pxWidth;
      canvas.height = pxHeight;

      // Draw only the upper portion to the canvas at target resolution
      ctx.drawImage(
        img,
        0, 0, img.width, cropHeight,
        0, 0, pxWidth, pxHeight
      );

      const imageData = ctx.getImageData(0, 0, pxWidth, pxHeight);
      const data = imageData.data;

      // Compute luminance histogram for contrast normalization
      let minL = 1, maxL = 0;
      const luminances: number[] = new Array((pxWidth * pxHeight));
      for (let i = 0; i < pxWidth * pxHeight; i++) {
        const r = data[i * 4] / 255;
        const g = data[i * 4 + 1] / 255;
        const b = data[i * 4 + 2] / 255;
        // ITU-R BT.601 luma
        let y = 0.299 * r + 0.587 * g + 0.114 * b;
        // Slight gamma to boost midtones
        y = Math.pow(y, 0.9);
        luminances[i] = y;
        if (y < minL) minL = y;
        if (y > maxL) maxL = y;
      }
      const range = Math.max(1e-6, maxL - minL);

      const heightCells = Math.floor(pxHeight / 4);
      let ascii = "";
      const threshold = 0.58; // lower -> more dots (darker)

      // Braille dot bit positions
      const dotBits = [
        [1, 8],     // row 0: dots 1,4
        [2, 16],    // row 1: dots 2,5
        [4, 32],    // row 2: dots 3,6
        [64, 128],  // row 3: dots 7,8
      ];

      for (let cy = 0; cy < heightCells; cy++) {
        for (let cx = 0; cx < cellsAcross; cx++) {
          let code = 0;
          for (let dy = 0; dy < 4; dy++) {
            for (let dx = 0; dx < 2; dx++) {
              const px = cx * 2 + dx;
              const py = cy * 4 + dy;
              const idx = py * pxWidth + px;
              const yNorm = (luminances[idx] - minL) / range; // 0..1
              // Dark pixels -> set dot
              if (yNorm < threshold) {
                code |= dotBits[dy][dx];
              }
            }
          }
          ascii += String.fromCharCode(0x2800 + code);
        }
        ascii += "\n";
      }

      setAsciiText(ascii);
    };

    img.src = imageSrc;
  }, [imageSrc, width, isHovered]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <motion.pre
        className="font-mono text-primary/80 leading-none select-none overflow-hidden"
        style={{ fontSize: `${isHovered ? fontSize * 0.85 : fontSize}px`, lineHeight: 0.8, letterSpacing: '-0.5px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)'
        }}
        transition={{ duration: 0.3 }}
      >
        {asciiText.split('\n').map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.005, duration: 0.2 }}
            className={isHovered ? "text-accent" : ""}
            style={{ transition: 'color 0.3s ease' }}
          >
            {line}
          </motion.div>
        ))}
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