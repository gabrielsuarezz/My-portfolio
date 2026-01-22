import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "Voxtant",
    description: "AI interview prep platform that pulls live job postings, generates role-specific mock interviews, and provides real-time AI scoring with structured feedback. Features agent-based orchestration for seamless interview flow.",
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
    description: "AI security command center that transforms CCTV into proactive monitoring. Detects theft, vandalism, fights, and medical emergencies in real-time with parallel vision models and conversational AI alerts.",
    tags: ["YOLOv8", "Gemini VLM", "ElevenLabs", "Next.js", "TensorFlow.js", "Supabase"],
    award: "🔒 SharkByte 2025",
    links: {
      github: "https://github.com/gabrielsuarezz/ViewGuard",
      devpost: "https://devpost.com/software/viewguard"
    }
  },
  {
    title: "Shadow Vision",
    description: "Real-time computer vision system that detects hand gestures and projects them as interactive digital shadow puppets. Built custom dataset from scratch, achieving 90%+ gesture detection accuracy.",
    tags: ["Python", "TouchDesigner", "OpenCV", "MediaPipe", "TensorFlow", "Flask"],
    award: "🎨 Best Creative Hack - ShellHacks 2025",
    links: {
      github: "https://github.com/gabrielsuarezz/Shadow-Vision",
      devpost: "https://devpost.com/software/shadow-vision"
    }
  },
  {
    title: "HeliosAI",
    description: "AI-powered educational platform that analyzes learning behavior and adapts feedback in real-time. Combines intelligent backend processing with context-aware responses for personalized study support.",
    tags: ["Arduino", "Flask", "Gemini API", "Agent SDK", "OpenWeather API", "IoT"],
    award: "🏆 Knight Hacks + MLH Winner",
    links: {
      demo: "http://www.helios.study/",
      github: "https://github.com/pablomoli/helios",
      devpost: "https://devpost.com/software/heliosai"
    }
  },
  {
    title: "Butterfly Detector",
    description: "Computer vision system for ecological monitoring using Raspberry Pi. Led hardware team to achieve 92% species identification accuracy with real-time camera feed processing for biodiversity research.",
    tags: ["TensorFlow", "Flask", "Python", "OpenCV", "Raspberry Pi", "Edge ML"],
    award: "🦋 INIT Build - Hardware Lead",
    links: {
      demo: "https://butterfly-web-app.vercel.app/",
      github: "https://github.com/gabrielsuarezz"
    }
  },
  {
    title: "FrontalFriend",
    description: "Cross-platform mental health companion with GPT-4 powered chat, curated relaxation media, push notification reminders, and cloud-synced wellness tracking. Built with React Native, Firebase Auth, and Supabase.",
    tags: ["React Native", "Expo", "GPT-4", "Firebase", "Supabase", "TypeScript"],
    award: "📱 INIT Build - Mobile Fall 2025",
    links: {
      demo: "https://gabrielsuarezz.github.io/FrontalFriend/",
      github: "https://github.com/gabrielsuarezz/FrontalFriend"
    }
  },
  {
    title: "SHE<Codes/>",
    description: "Interactive educational game teaching Python through historical quests featuring pioneering women and LGBTQ+ figures in computing. Uses block-based coding that generates real Python, with 8 levels covering variables, loops, and functions.",
    tags: ["React 19", "Vite", "Blockly", "Skulpt", "Python", "Education"],
    award: "🎓 FIU Senior Design Showcase",
    links: {
      demo: "https://gabrielsuarezz.github.io/SHE-Code/",
      github: "https://github.com/gabrielsuarezz/SHE-Code"
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
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
