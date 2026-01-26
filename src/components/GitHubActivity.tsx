import { memo, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { GitCommit, GitBranch, Star, GitFork, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    ref?: string;
    ref_type?: string;
    action?: string;
  };
}

interface RepoStats {
  name: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  url: string;
}

const GITHUB_USERNAME = 'gabrielsuarezz';

// Fallback data for when API is rate limited
const FALLBACK_EVENTS: GitHubEvent[] = [
  {
    id: '1',
    type: 'PushEvent',
    repo: { name: 'gabrielsuarezz/Voxtant' },
    created_at: new Date().toISOString(),
    payload: { commits: [{ message: 'feat: add real-time AI scoring', sha: 'abc123' }] }
  },
  {
    id: '2',
    type: 'PushEvent',
    repo: { name: 'gabrielsuarezz/ViewGuard' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    payload: { commits: [{ message: 'fix: improve detection accuracy', sha: 'def456' }] }
  },
  {
    id: '3',
    type: 'CreateEvent',
    repo: { name: 'gabrielsuarezz/Shadow-Vision' },
    created_at: new Date(Date.now() - 172800000).toISOString(),
    payload: { ref_type: 'repository' }
  },
];

const FALLBACK_REPOS: RepoStats[] = [
  { name: 'Voxtant', stars: 12, forks: 3, language: 'Python', description: 'AI interview prep platform', url: 'https://github.com/gabrielsuarezz/Voxtant' },
  { name: 'ViewGuard', stars: 8, forks: 2, language: 'TypeScript', description: 'AI security monitoring', url: 'https://github.com/gabrielsuarezz/ViewGuard' },
  { name: 'Shadow-Vision', stars: 15, forks: 4, language: 'Python', description: 'Gesture recognition system', url: 'https://github.com/gabrielsuarezz/Shadow-Vision' },
];

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'PushEvent':
      return <GitCommit className="h-4 w-4" />;
    case 'CreateEvent':
      return <GitBranch className="h-4 w-4" />;
    case 'WatchEvent':
      return <Star className="h-4 w-4" />;
    case 'ForkEvent':
      return <GitFork className="h-4 w-4" />;
    default:
      return <GitCommit className="h-4 w-4" />;
  }
};

const getEventDescription = (event: GitHubEvent): string => {
  const repoName = event.repo.name.split('/')[1];
  
  switch (event.type) {
    case 'PushEvent':
      const commitMsg = event.payload.commits?.[0]?.message || 'Updated code';
      return `Pushed to ${repoName}: "${commitMsg.slice(0, 50)}${commitMsg.length > 50 ? '...' : ''}"`;
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} in ${repoName}`;
    case 'WatchEvent':
      return `Starred ${repoName}`;
    case 'ForkEvent':
      return `Forked ${repoName}`;
    default:
      return `Activity in ${repoName}`;
  }
};

export const GitHubActivity = memo(() => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [repos, setRepos] = useState<RepoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchGitHubData = useCallback(async () => {
    try {
      // Fetch recent events
      const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`);
      
      if (eventsRes.status === 403) {
        // Rate limited, use fallback
        setEvents(FALLBACK_EVENTS);
        setRepos(FALLBACK_REPOS);
        setUsingFallback(true);
        setLoading(false);
        return;
      }
      
      const eventsData = await eventsRes.json();
      setEvents(eventsData.slice(0, 5));
      
      // Fetch top repos
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=3`);
      const reposData = await reposRes.json();
      
      setRepos(reposData.map((repo: any) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        description: repo.description || '',
        url: repo.html_url,
      })));
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      setEvents(FALLBACK_EVENTS);
      setRepos(FALLBACK_REPOS);
      setUsingFallback(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50 bg-card/30 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </Card>
        <Card className="p-6 border-border/50 bg-card/30 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <Card className="p-6 border-border/50 bg-card/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-semibold flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-accent" />
            Recent Activity
          </h3>
          {usingFallback && (
            <span className="text-xs text-muted-foreground/60">cached</span>
          )}
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div 
              key={event.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="text-accent mt-0.5">
                {getEventIcon(event.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{getEventDescription(event)}</p>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(event.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Repositories */}
      <Card className="p-6 border-border/50 bg-card/30">
        <h3 className="font-mono font-semibold flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-accent" />
          Top Repositories
        </h3>
        <div className="space-y-3">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-secondary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-medium group-hover:text-primary transition-colors">
                  {repo.name}
                </span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {repo.forks}
                </span>
              </div>
            </a>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild className="w-full mt-4 font-mono">
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
            View All Repositories
          </a>
        </Button>
      </Card>
    </div>
  );
});

GitHubActivity.displayName = 'GitHubActivity';
