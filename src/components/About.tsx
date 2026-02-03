import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TerminalBackground } from "./TerminalBackground";
import headshot from "@/assets/headshot.jpg";
import { Code2, Sparkles, Rocket, Trophy } from "lucide-react";

const highlights = [
  {
    icon: Trophy,
    text: "3x Hackathon Winner",
    color: "text-yellow-400"
  },
  {
    icon: Code2,
    text: "Full-Stack Engineer",
    color: "text-cyan-400"
  },
  {
    icon: Sparkles,
    text: "AI/ML Enthusiast",
    color: "text-purple-400"
  },
  {
    icon: Rocket,
    text: "Build Lead @ INIT",
    color: "text-green-400"
  }
];

export const About = memo(() => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <TerminalBackground density="light" speed="slow" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Building at the intersection of AI, code, and creativity
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="p-6 sm:p-8 md:p-10 border-border/50 bg-card/50 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards] hover:shadow-[var(--shadow-medium)] transition-all duration-300">
            <div className="grid md:grid-cols-[300px_1fr] gap-6 md:gap-8 lg:gap-12 items-start">
              {/* Headshot */}
              <div className="mx-auto md:mx-0">
                <div className="relative group">
                  {/* Glow effect */}
                  <div
                    className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                  />
                  {/* Image container with terminal styling */}
                  <div className="relative">
                    <div className="absolute -top-6 -left-2 text-primary/60 font-mono text-xs">
                      <span className="opacity-60">{"<img>"}</span>
                    </div>
                    <div className="border-2 border-primary/30 rounded-sm p-2 bg-secondary/30 backdrop-blur-sm">
                      <img
                        src={headshot}
                        alt="Gabriel Suarez"
                        className="w-full h-auto rounded-sm shadow-lg"
                        style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-2 text-primary/60 font-mono text-xs">
                      <span className="opacity-60">{"</img>"}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights badges */}
                <div className="mt-8 space-y-2">
                  {highlights.map((highlight, index) => {
                    const Icon = highlight.icon;
                    return (
                      <div
                        key={highlight.text}
                        className="flex items-center gap-2 text-sm font-mono opacity-0 animate-[fadeSlideLeft_0.3s_ease-out_forwards]"
                        style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                      >
                        <div className="p-1.5 rounded-sm bg-secondary/50 border border-border/50">
                          <Icon className={`h-4 w-4 ${highlight.color}`} />
                        </div>
                        <span className="text-muted-foreground">{highlight.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* About content */}
              <div className="space-y-4 sm:space-y-5">
                {/* Terminal prompt */}
                <div className="font-mono text-sm text-primary/80 flex items-center gap-2 mb-6">
                  <span className="text-muted-foreground/60">$</span>
                  <span>cat about.txt</span>
                </div>

                {/* Bio */}
                <div className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
                  <p className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards]">
                    Hey! I'm Gabriel, a Computer Science student at Florida International University with a passion for building intelligent systems that solve real-world problems.
                  </p>

                  <p className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.4s_forwards]">
                    I've spent the last few years diving deep into <span className="text-primary font-medium">AI/ML</span>, <span className="text-primary font-medium">full-stack development</span>, and <span className="text-primary font-medium">hardware-software integration</span>. From building real-time computer vision systems to architecting scalable web applications, I love creating solutions that push technical boundaries.
                  </p>

                  <p className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.5s_forwards]">
                    As Build Lead at INIT FIU, I mentor teams through advanced AI/ML projects, and I've won multiple hackathons building everything from voice assistants to gesture-controlled systems. My approach combines strong engineering fundamentals with creative problem-solving—because the best solutions often come from thinking differently.
                  </p>

                  <p className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.6s_forwards]">
                    When I'm not coding, you'll find me exploring new technologies, contributing to open source, or competing in CTFs and hackathons. I'm always looking for opportunities to learn, build, and collaborate on projects that make an impact.
                  </p>
                </div>

                {/* Tech interests */}
                <div className="pt-4 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.7s_forwards]">
                  <div className="font-mono text-sm text-primary/80 flex items-center gap-2 mb-3">
                    <span className="text-muted-foreground/60">$</span>
                    <span>echo $INTERESTS</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Artificial Intelligence",
                      "Machine Learning",
                      "Computer Vision",
                      "Full-Stack Development",
                      "System Architecture",
                      "IoT & Hardware",
                      "Competitive Programming"
                    ].map((interest, index) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors duration-200 font-mono opacity-0 animate-[fadeSlideUp_0.3s_ease-out_forwards]"
                        style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';
