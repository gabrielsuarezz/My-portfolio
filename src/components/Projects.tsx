import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

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
  },
  {
    title: "FrontalFriend",
    description: "Mobile app designed to improve mental health through AI chat, calming videos, medication reminders, daily steps/sleep tracking, easy access to helplines, and secure document cloud storage.",
    tags: ["React Native", "AI Chat", "Mobile", "Health Tracking", "Cloud Storage"],
    award: "🎓 University Project",
    links: {
      github: "https://github.com/flamemik/FrontalFriend"
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
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isRevealed={revealedNotes.has(project.title)}
              onLongPress={handleLongPress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
