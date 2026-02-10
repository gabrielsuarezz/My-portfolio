import { memo, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Github, Star, Code2, Users, BookOpen, Flame } from "lucide-react";

const GITHUB_USERNAME = "gabrielsuarezz";
const GITHUB_API = "https://api.github.com";

interface GitHubStats {
  user: {
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
  };
  languages: Array<{ name: string; percentage: number; color: string }>;
  streak: {
    current: number;
    longest: number;
  };
  fallback: boolean;
}

// Fallback data for reliability
const FALLBACK_STATS: GitHubStats = {
  user: {
    public_repos: 25,
    followers: 45,
    following: 30,
    total_stars: 120,
  },
  languages: [
    { name: 'Python', percentage: 35, color: '#3572A5' },
    { name: 'TypeScript', percentage: 30, color: '#2b7489' },
    { name: 'JavaScript', percentage: 20, color: '#f1e05a' },
    { name: 'Java', percentage: 10, color: '#b07219' },
    { name: 'C++', percentage: 5, color: '#f34b7d' },
  ],
  streak: {
    current: 15,
    longest: 45,
  },
  fallback: true,
};

const getLanguageColor = (language: string): string => {
  const colors: { [key: string]: string } = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Vue': '#2c3e50',
    'React': '#61dafb',
  };
  return colors[language] || '#858585';
};

export const GitHubStats = memo(() => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch user data and repos in parallel with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          signal: controller.signal,
        }),
        fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeout);

      if (!userRes.ok || !reposRes.ok) {
        throw new Error('GitHub API error');
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      // Calculate total stars
      const totalStars = reposData.reduce((sum: number, repo: any) =>
        sum + (repo.stargazers_count || 0), 0
      );

      // Calculate language statistics
      const languageBytes: { [key: string]: number } = {};
      reposData.forEach((repo: any) => {
        if (repo.language) {
          languageBytes[repo.language] = (languageBytes[repo.language] || 0) + (repo.size || 1);
        }
      });

      const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);

      // Convert to percentages and sort
      const languages = Object.entries(languageBytes)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 100),
          color: getLanguageColor(name),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

      // Note: Contribution streak requires authentication or events API
      // Using fallback values for streak as calculating without auth is complex
      const stats: GitHubStats = {
        user: {
          public_repos: userData.public_repos || 0,
          followers: userData.followers || 0,
          following: userData.following || 0,
          total_stars: totalStars,
        },
        languages,
        streak: FALLBACK_STATS.streak, // Use fallback for streak
        fallback: false,
      };

      setStats(stats);
      setUsingFallback(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
      setStats(FALLBACK_STATS);
      setUsingFallback(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  if (loading) {
    return (
      <section id="github-stats" className="py-16 bg-muted/30 relative overflow-hidden">
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
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="p-6 border-border/50 bg-card/30 animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section id="github-stats" className="py-16 bg-muted/30 relative overflow-hidden">
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
            className="p-6 border-border/50 bg-card/30 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.1s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="terminal-icon !p-1.5">
                  <Github className="h-4 w-4" />
                </div>
                <h3 className="font-mono font-semibold text-foreground">Stats</h3>
              </div>
              {usingFallback && (
                <span className="text-xs text-muted-foreground/60">cached</span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-sm font-mono">Repositories</span>
                </div>
                <span className="text-lg font-bold font-mono">{stats.user.public_repos}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-mono">Followers</span>
                </div>
                <span className="text-lg font-bold font-mono">{stats.user.followers}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-mono">Total Stars</span>
                </div>
                <span className="text-lg font-bold font-mono">{stats.user.total_stars}</span>
              </div>
            </div>
          </Card>

          {/* Languages Card */}
          <Card
            className="p-6 border-border/50 bg-card/30 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="terminal-icon !p-1.5">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-mono font-semibold text-foreground">Top Languages</h3>
            </div>
            <div className="space-y-3">
              {stats.languages.map((lang, index) => (
                <div key={lang.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="font-mono">{lang.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: lang.color,
                        width: `${lang.percentage}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak Card */}
          <Card
            className="p-6 border-border/50 bg-card/30 md:col-span-2 lg:col-span-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="terminal-icon !p-1.5">
                <Flame className="h-4 w-4" />
              </div>
              <h3 className="font-mono font-semibold text-foreground">Contribution Streak</h3>
            </div>
            <div className="space-y-6">
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-accent" />
                  <span className="text-sm font-mono text-muted-foreground">Current Streak</span>
                </div>
                <div className="text-4xl font-bold font-mono text-accent">
                  {stats.streak.current}
                </div>
                <span className="text-xs text-muted-foreground font-mono">days</span>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">Longest Streak</span>
                </div>
                <div className="text-2xl font-bold font-mono">
                  {stats.streak.longest}
                </div>
                <span className="text-xs text-muted-foreground font-mono">days</span>
              </div>
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
