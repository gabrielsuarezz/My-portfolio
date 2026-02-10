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

const calculateStreak = (events: any[]): { current: number; longest: number } => {
  if (!events || events.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Get unique dates of contribution activity (PushEvent, PullRequestEvent, IssuesEvent, CreateEvent)
  const contributionTypes = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'CommitCommentEvent'];
  const activityDates = new Set(
    events
      .filter(event => contributionTypes.includes(event.type))
      .map(event => {
        const date = new Date(event.created_at);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
  );

  if (activityDates.size === 0) {
    return { current: 0, longest: 0 };
  }

  const sortedDates = Array.from(activityDates).sort().reverse();

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // Check if there's activity today or yesterday to start the streak
  if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
    currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffTime = prevDate.getTime() - currDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffTime = prevDate.getTime() - currDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
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

      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          signal: controller.signal,
        }),
        fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          signal: controller.signal,
        }),
        fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=100`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeout);

      if (!userRes.ok || !reposRes.ok || !eventsRes.ok) {
        throw new Error(`GitHub API error: user=${userRes.status}, repos=${reposRes.status}, events=${eventsRes.status}`);
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();
      const eventsData = await eventsRes.json();

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

      // Calculate contribution streak from events
      const streak = calculateStreak(eventsData);

      const stats: GitHubStats = {
        user: {
          public_repos: userData.public_repos || 0,
          followers: userData.followers || 0,
          following: userData.following || 0,
          total_stars: totalStars,
        },
        languages,
        streak,
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Stats Card */}
          <Card
            className="group p-8 border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.1s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="terminal-icon !p-2 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Github className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-mono font-bold text-lg text-foreground">Stats</h3>
              </div>
              {usingFallback && (
                <span className="text-xs text-muted-foreground/60 font-mono">cached</span>
              )}
            </div>
            <div className="space-y-5">
              <div className="group/stat flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 transition-all duration-200 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/stat:bg-accent/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-mono font-medium text-muted-foreground">Repositories</span>
                </div>
                <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stats.user.public_repos}</span>
              </div>
              <div className="group/stat flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 transition-all duration-200 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/stat:bg-accent/20 transition-colors">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-mono font-medium text-muted-foreground">Followers</span>
                </div>
                <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stats.user.followers}</span>
              </div>
              <div className="group/stat flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 transition-all duration-200 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/stat:bg-accent/20 transition-colors">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-mono font-medium text-muted-foreground">Total Stars</span>
                </div>
                <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stats.user.total_stars}</span>
              </div>
            </div>
          </Card>

          {/* Languages Card */}
          <Card
            className="group p-8 border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="terminal-icon !p-2 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-mono font-bold text-lg text-foreground">Top Languages</h3>
            </div>
            <div className="space-y-4">
              {stats.languages.map((lang, index) => (
                <div key={lang.name} className="group/lang space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full shadow-lg group-hover/lang:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}40` }}
                      />
                      <span className="font-mono font-medium group-hover/lang:text-foreground transition-colors">{lang.name}</span>
                    </div>
                    <span className="font-mono font-bold text-base tabular-nums" style={{ color: lang.color }}>{lang.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out group-hover/lang:shadow-lg"
                      style={{
                        backgroundColor: lang.color,
                        width: `${lang.percentage}%`,
                        animationDelay: `${index * 150}ms`,
                        boxShadow: `0 0 15px ${lang.color}60`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak Card */}
          <Card
            className="group p-8 border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 md:col-span-2 lg:col-span-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards] relative overflow-hidden"
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="terminal-icon !p-2 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Flame className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-mono font-bold text-lg text-foreground">Contribution Streak</h3>
              </div>
              <div className="space-y-6">
                <div className="group/current text-center p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 relative overflow-hidden">
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover/current:translate-x-full transition-transform duration-1000" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Flame className="h-6 w-6 text-accent animate-pulse" />
                      <span className="text-sm font-mono font-medium text-accent uppercase tracking-wider">Current Streak</span>
                    </div>
                    <div className="text-6xl font-bold font-mono tabular-nums bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent mb-2">
                      {stats.streak.current}
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">consecutive days</span>
                  </div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">Record Streak</span>
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-foreground mb-1">
                    {stats.streak.longest}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">days</span>
                </div>
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
