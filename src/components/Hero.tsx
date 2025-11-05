import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Terminal, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AsciiArt } from "./AsciiArt";
import headshot from "@/assets/headshot.jpg";

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const codeSnippets = [
    "const buildAI = () => intelligence;",
    "while(learning) { innovate(); }",
    "if (problem) solve();",
    "return impact++;",
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)' }} />
      
      {/* Floating orbs with parallax */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 60%) 0%, transparent 70%)',
          x: useTransform(scrollY, [0, 1000], [0, -100]),
          y: useTransform(scrollY, [0, 1000], [0, 100]),
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(187 85% 53%) 0%, transparent 70%)',
          x: useTransform(scrollY, [0, 1000], [0, 100]),
          y: useTransform(scrollY, [0, 1000], [0, -100]),
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Interactive cursor glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 60% / 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Floating code snippets */}
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20 font-mono text-sm hidden lg:block"
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [100, -100],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 10}%`,
          }}
        >
          <Code2 className="inline mr-2 h-4 w-4" />
          {snippet}
        </motion.div>
      ))}

      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Animated terminal-style header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-accent font-mono text-sm">
              <Terminal className="h-4 w-4 animate-pulse" />
              <span className="typing-animation">gabriel@portfolio:~$ ./introduce.sh</span>
            </div>
            
            {/* ASCII Art Terminal Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative p-8 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20 shadow-lg max-w-4xl w-full"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              
              <div className="mt-6 overflow-hidden flex justify-center">
                <AsciiArt imageSrc={headshot} width={100} fontSize={7} />
              </div>
              
              <motion.div
                className="mt-3 text-sm font-mono text-accent/70 text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &gt; Hover to enhance resolution_
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main title with staggered animation */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.05, color: "hsl(217 91% 60%)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Gabriel
            </motion.span>
            <br />
            <motion.span
              className="text-gradient inline-block"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Suarez
            </motion.span>
          </motion.h1>

          {/* Subtitle with typewriter effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-6"
          >
            <p className="text-xl md:text-3xl text-muted-foreground font-light mb-2">
              Full Stack Software Engineer
            </p>
            <div className="flex items-center justify-center gap-2 text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-lg md:text-xl">
                CS @ FIU • AI & Software Engineer • 3x Hackathon Winner
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Exploring the edge between AI, creativity, and code.
          </motion.p>


          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={scrollToProjects}
              className="group relative overflow-hidden text-lg px-8 py-6"
            >
              <span className="relative z-10 flex items-center">
                Explore My Work
                <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-2">
              <a href="mailto:gsuarez@fiu.edu">
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex gap-6 justify-center"
          >
            {[
              { icon: Github, href: "https://github.com/gabrielsuarezz", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/gabrielsuarezz", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full bg-secondary/50 backdrop-blur-sm border border-border hover:border-primary transition-colors"
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2 },
          y: { duration: 2, repeat: Infinity }
        }}
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Scroll</span>
        <ArrowDown className="h-5 w-5 text-accent" />
      </motion.div>
    </section>
  );
};
