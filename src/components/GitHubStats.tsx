import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Github, Star, GitFork, Code2 } from "lucide-react";

const GITHUB_USERNAME = "gabrielsuarezz";

// Using GitHub's readme stats cards - no API key needed
const statsUrl = `https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&hide_border=true&bg_color=00000000&title_color=06b6d4&icon_color=06b6d4&text_color=94a3b8&hide_title=true&hide_rank=true`;
const languagesUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&hide_border=true&bg_color=00000000&title_color=06b6d4&text_color=94a3b8&hide_title=true`;
const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&hide_border=true&background=00000000&ring=06b6d4&fire=06b6d4&currStreakLabel=06b6d4&sideLabels=94a3b8&currStreakNum=e2e8f0&sideNums=e2e8f0&dates=64748b`;

export const GitHubStats = memo(() => {
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            GitHub <span className="text-gradient">Activity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Real-time contribution data from my open source work
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Stats Card */}
          <Card 
            className="p-6 border-border/50 backdrop-blur-sm bg-card/50 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.1s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="terminal-icon !p-1.5">
                <Github className="h-4 w-4" />
              </div>
              <h3 className="font-mono font-semibold text-foreground">Stats</h3>
            </div>
            <div className="flex justify-center">
              <img
                src={statsUrl}
                alt="GitHub Stats"
                className="w-full max-w-[300px]"
                loading="lazy"
              />
            </div>
          </Card>

          {/* Languages Card */}
          <Card 
            className="p-6 border-border/50 backdrop-blur-sm bg-card/50 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="terminal-icon !p-1.5">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-mono font-semibold text-foreground">Top Languages</h3>
            </div>
            <div className="flex justify-center">
              <img
                src={languagesUrl}
                alt="Top Languages"
                className="w-full max-w-[300px]"
                loading="lazy"
              />
            </div>
          </Card>

          {/* Streak Card */}
          <Card 
            className="p-6 border-border/50 backdrop-blur-sm bg-card/50 md:col-span-2 lg:col-span-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="terminal-icon !p-1.5">
                <Star className="h-4 w-4" />
              </div>
              <h3 className="font-mono font-semibold text-foreground">Contribution Streak</h3>
            </div>
            <div className="flex justify-center">
              <img
                src={streakUrl}
                alt="GitHub Streak"
                className="w-full max-w-[300px]"
                loading="lazy"
              />
            </div>
          </Card>
        </div>

        {/* GitHub Profile Link */}
        <div 
          className="text-center mt-8 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.4s_forwards]"
        >
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-mono"
          >
            <Github className="h-4 w-4" />
            View full profile on GitHub
          </a>
        </div>
      </div>
    </section>
  );
});

GitHubStats.displayName = 'GitHubStats';
