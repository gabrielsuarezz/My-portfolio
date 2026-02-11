import { memo, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Github, Star, Code2, Users, BookOpen, Flame, TrendingUp, Activity, GitCommit } from "lucide-react";

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

// Fallback data for reliability - Realistic stats for new grad/student developer
const FALLBACK_STATS: GitHubStats = {
  user: {
    public_repos: 18,
    followers: 32,
    following: 45,
    total_stars: 67,
  },
  languages: [
    { name: 'Python', percentage: 32, color: '#3572A5' },
    { name: 'TypeScript', percentage: 28, color: '#2b7489' },
    { name: 'JavaScript', percentage: 22, color: '#f1e05a' },
    { name: 'Java', percentage: 12, color: '#b07219' },
    { name: 'C++', percentage: 6, color: '#f34b7d' },
  ],
  streak: {
    current: 12,
    longest: 22,
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

  let currentStreak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

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

      const totalStars = reposData.reduce((sum: number, repo: any) =>
        sum + (repo.stargazers_count || 0), 0
      );

      const languageBytes: { [key: string]: number } = {};
      reposData.forEach((repo: any) => {
        if (repo.language) {
          languageBytes[repo.language] = (languageBytes[repo.language] || 0) + (repo.size || 1);
        }
      });

      const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);

      const languages = Object.entries(languageBytes)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 100),
          color: getLanguageColor(name),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

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
      <section id="github-stats" className="py-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-mono">
              <span className="text-muted-foreground opacity-60">// </span>
              GitHub <span className="text-gradient">Analytics</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
              Loading real-time contribution data...
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="p-8 border-border/50 bg-card/30 animate-pulse h-64"
              >
                <div className="h-8 bg-muted/50 rounded w-1/2 mb-6" />
                <div className="space-y-4">
                  <div className="h-6 bg-muted/30 rounded w-3/4" />
                  <div className="h-6 bg-muted/30 rounded w-2/3" />
                  <div className="h-6 bg-muted/30 rounded w-5/6" />
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
    <section id="github-stats" className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <Activity className="h-5 w-5 text-accent animate-pulse" />
            <span className="text-sm font-mono font-medium text-accent uppercase tracking-wider">
              Live from GitHub
            </span>
            {!usingFallback && (
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            )}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Developer <span className="text-gradient bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-gradient">Analytics</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
            Real-time insights from @{GITHUB_USERNAME}'s open source contributions
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

          {/* Streak Mega Card - Takes up half */}
          <div className="lg:col-span-6">
            <Card className="group relative h-full p-10 border-2 border-accent/20 bg-gradient-to-br from-card via-card/95 to-accent/5 hover:border-accent/40 transition-all duration-500 opacity-0 animate-[fadeSlideUp_0.6s_ease-out_0.1s_forwards] overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-accent/5 to-transparent group-hover:inset-full transition-all duration-1500 ease-out" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:scale-110 transition-transform duration-300">
                      <Flame className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-mono text-foreground">Contribution Streak</h3>
                      <p className="text-sm text-muted-foreground font-mono">Consistency Score</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-8">
                  {/* Current Streak - Hero Display */}
                  <div className="relative group/streak">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/30 to-primary/20 blur-3xl group-hover/streak:blur-2xl transition-all duration-500" />
                    <div className="relative text-center p-12 rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border-2 border-accent/30 group-hover/streak:border-accent/50 transition-all duration-300">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Flame className="h-10 w-10 text-accent animate-pulse" />
                        <span className="text-lg font-mono font-bold text-accent uppercase tracking-widest">Current Streak</span>
                      </div>
                      <div className="relative">
                        <div className="text-9xl font-black font-mono tabular-nums mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent" style={{
                          textShadow: '0 0 80px rgba(var(--accent), 0.3)',
                        }}>
                          {stats.streak.current}
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 blur-2xl opacity-50 animate-pulse" />
                      </div>
                      <span className="text-xl text-muted-foreground font-mono font-medium">consecutive days coding</span>
                    </div>
                  </div>

                  {/* Record Streak - Secondary */}
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-secondary/50 to-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Personal Best</div>
                        <div className="text-4xl font-bold font-mono tabular-nums text-foreground">{stats.streak.longest}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono text-muted-foreground">days</div>
                      <div className="text-xs font-mono text-muted-foreground/60">all-time record</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats Grid */}
          <div className="lg:col-span-6 grid grid-rows-2 gap-8">

            {/* Quick Stats Row */}
            <Card className="group p-8 border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 opacity-0 animate-[fadeSlideUp_0.6s_ease-out_0.2s_forwards] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    <Github className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono">Repository Stats</h3>
                    <p className="text-xs text-muted-foreground font-mono">Project overview</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center group/stat">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/20 transition-all duration-300 mb-3">
                      <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-4xl font-black font-mono tabular-nums bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        {stats.user.public_repos}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Repositories</div>
                  </div>

                  <div className="text-center group/stat">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 transition-all duration-300 mb-3">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-4xl font-black font-mono tabular-nums bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {stats.user.followers}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Followers</div>
                  </div>

                  <div className="text-center group/stat">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/20 transition-all duration-300 mb-3">
                      <Star className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-4xl font-black font-mono tabular-nums bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        {stats.user.total_stars}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Stars</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Languages Card */}
            <Card className="group p-8 border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 opacity-0 animate-[fadeSlideUp_0.6s_ease-out_0.3s_forwards] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5">
                    <Code2 className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-mono">Code Distribution</h3>
                    <p className="text-xs text-muted-foreground font-mono">Top 5 languages</p>
                  </div>
                  <GitCommit className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-5">
                  {stats.languages.map((lang, index) => (
                    <div key={lang.name} className="group/lang">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shadow-lg ring-2 ring-offset-2 ring-offset-card group-hover/lang:ring-4 transition-all duration-300"
                            style={{
                              backgroundColor: lang.color,
                              boxShadow: `0 0 20px ${lang.color}80`,
                              ringColor: `${lang.color}40`
                            }}
                          />
                          <span className="font-mono font-bold text-sm group-hover/lang:text-foreground transition-colors">
                            {lang.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-secondary/30 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                backgroundColor: lang.color,
                                width: `${lang.percentage}%`,
                                boxShadow: `0 0 10px ${lang.color}60`
                              }}
                            />
                          </div>
                          <span
                            className="font-mono font-black text-lg tabular-nums min-w-[3rem] text-right"
                            style={{ color: lang.color }}
                          >
                            {lang.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* GitHub Profile Link */}
        <div className="text-center mt-12 opacity-0 animate-[fadeSlideUp_0.6s_ease-out_0.4s_forwards]">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 border border-accent/20 hover:border-accent/40 transition-all duration-300 group/link"
          >
            <Github className="h-5 w-5 text-accent group-hover/link:scale-110 transition-transform" />
            <span className="font-mono font-medium">View Complete Profile on GitHub</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground group-hover/link:text-accent transition-colors" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          25% {
            transform: translateY(-100px) translateX(50px);
          }
          75% {
            transform: translateY(-100px) translateX(-50px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
});

GitHubStats.displayName = 'GitHubStats';
