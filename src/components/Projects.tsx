import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useLongPress } from "@/hooks/useLongPress";
import { toast } from "sonner";
import { useState } from "react";
import trophyIcon from "@/assets/awards/trophy.png";
import shieldIcon from "@/assets/awards/shield.png";
import creativeIcon from "@/assets/awards/creative.png";
import hardwareIcon from "@/assets/awards/hardware.png";
import butterflyIcon from "@/assets/awards/butterfly.png";

const awardIcons: Record<string, string> = {
  trophy: trophyIcon,
  shield: shieldIcon,
  creative: creativeIcon,
  hardware: hardwareIcon,
  butterfly: butterflyIcon,
};

const getAwardIcon = (award: string): string => {
  if (award.includes("1st Place")) return awardIcons.trophy;
  if (award.includes("SharkByte")) return awardIcons.shield;
  if (award.includes("Creative")) return awardIcons.creative;
  if (award.includes("ARM")) return awardIcons.hardware;
  if (award.includes("INIT")) return awardIcons.butterfly;
  return awardIcons.trophy;
};

const stripEmoji = (text: string): string => {
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
};

const projects = [
  {
    title: "Voxtant",
    description: "AI-powered interview preparation platform that won 1st Place at PlutoHacks 2025. Fetches live job listings and generates custom, realistic mock interviews using LLMs and speech recognition.",
    tags: ["LLMs", "Whisper", "FastAPI", "NLP", "Next.js", "Agent SDK"],
    award: "🏆 1st Place - PlutoHacks 2025",
    links: {
      demo: "https://voxtant-web-gabrielsuarezzs-projects.vercel.app/",
      github: "https://github.com/gabrielsuarezz/Voxtant",
      devpost: "https://devpost.com/software/voxtant"
    }
  },
  {
    title: "ViewGuard",
    description: "End-to-end intelligent surveillance platform built for SharkByte 2025. Integrates YOLOv8, Gemini VLM, and ElevenLabs into a real-time command center with conversational voice AI and instant threat detection.",
    tags: ["YOLOv8", "Gemini VLM", "ElevenLabs", "Next.js", "TensorFlow.js", "Supabase"],
    award: "🔒 SharkByte 2025",
    links: {
      github: "https://github.com/gabrielsuarezz/ViewGuard",
      devpost: "https://devpost.com/software/viewguard"
    }
  },
  {
    title: "Shadow Vision",
    description: "Real-time AI system that translates hand gestures into animated shadow puppets for ShellHacks 2025. Built custom dataset from scratch, improving model accuracy from 14% to 93% using point cloud modeling.",
    tags: ["Python", "TouchDesigner", "OpenCV", "MediaPipe", "TensorFlow", "Flask"],
    award: "🎨 Best Creative Hack - ShellHacks 2025",
    links: {
      github: "https://github.com/gabrielsuarezz/Shadow-Vision",
      devpost: "https://devpost.com/software/shadow-vision"
    }
  },
  {
    title: "HeliosAI",
    description: "Intelligent solar-tracking system using sensors and AI to track and learn from sunlight in real time. Won Best Use of ARM at KnightHacks VIII 2025 for seamlessly blending hardware control and AI reasoning.",
    tags: ["Arduino", "Flask", "Gemini API", "Agent SDK", "OpenWeather API", "IoT"],
    award: "🔧 Best Use of ARM - KnightHacks VIII 2025",
    links: {
      demo: "http://www.helios.study/",
      github: "https://github.com/pablomoli/helios",
      devpost: "https://devpost.com/software/heliosai"
    }
  },
  {
    title: "Butterfly Detector",
    description: "Led AI/ML Advanced Team in INIT Build Program to develop computer vision model identifying butterfly species from webcam input. Created robust detection system for citizen science and biodiversity monitoring.",
    tags: ["TensorFlow", "Flask", "Python", "OpenCV", "Computer Vision"],
    award: "🦋 INIT Build Program - Advanced Track",
    links: {
      demo: "https://butterfly-web-app.vercel.app/",
      github: "https://github.com/gabrielsuarezz"
    }
  }
];

export const Projects = () => {
  const [revealedNotes, setRevealedNotes] = useState<Set<string>>(new Set());

  const handleLongPress = (projectTitle: string) => {
    setRevealedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectTitle)) {
        newSet.delete(projectTitle);
        toast.info('🔒 Dev Notes Hidden', {
          description: 'Long-press again to reveal',
        });
      } else {
        newSet.add(projectTitle);
        toast.success('🔓 Dev Notes Unlocked!', {
          description: `Secret development notes revealed for ${projectTitle}`,
        });
      }
      return newSet;
    });
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Award-winning projects spanning AI, computer vision, and IoT — built at Florida's top hackathons
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const longPressHandlers = useLongPress(() => handleLongPress(project.title));
            const isRevealed = revealedNotes.has(project.title);
            
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.8, type: "spring" }}
                whileHover={{ y: -10 }}
                {...longPressHandlers}
              >
                <Card className="p-8 h-full border-border/50 backdrop-blur-sm bg-card/30 relative overflow-hidden group select-none">
                {/* Animated background gradient on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.1) 0%, transparent 70%)',
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.h3 
                      className="text-2xl font-bold group-hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {project.title}
                    </motion.h3>
                    {project.award && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <img 
                          src={getAwardIcon(project.award)} 
                          alt="Award badge"
                          className="h-8 w-8 flex-shrink-0 ml-2 object-contain"
                        />
                      </motion.div>
                    )}
                  </div>

                  {project.award && (
                    <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-accent/30">
                      {stripEmoji(project.award)}
                    </Badge>
                  )}

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded text-sm text-accent"
                    >
                      <strong>Dev Note:</strong> {
                        project.title === "Voxtant" ? "Built the entire backend in 8 hours with zero sleep. The LLM integration was a nightmare but so worth it." :
                        project.title === "Shadow Vision" ? "Creating the dataset was tedious - I spent 6 hours making hand gestures in front of a camera. My hand was sore for days!" :
                        project.title === "HeliosAI" ? "The servo motor kept breaking. We went through 3 different motors before finding one that could handle the solar panel weight." :
                        "Leading a team remotely while building ML models was challenging but incredibly rewarding. We had late-night debugging sessions that turned into great learning moments."
                      }
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + tagIndex * 0.05 }}
                      >
                        <Badge variant="outline" className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-all">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.links.demo && (
                      <Button variant="default" size="sm" asChild className="group/btn">
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button variant="outline" size="sm" asChild className="group/btn">
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.links.devpost && (
                      <Button variant="outline" size="sm" asChild className="group/btn">
                        <a href={project.links.devpost} target="_blank" rel="noopener noreferrer">
                          Devpost
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
