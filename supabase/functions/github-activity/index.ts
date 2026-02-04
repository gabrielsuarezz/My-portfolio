import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  checkRateLimit, 
  getClientId, 
  rateLimitHeaders, 
  rateLimitExceededResponse 
} from "../_shared/rate-limiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const GITHUB_USERNAME = 'gabrielsuarezz';
const MAX_EVENTS = 5;
const MAX_REPOS = 6;

// Rate limit: 30 requests per minute per client
const RATE_LIMIT_CONFIG = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: 'github-activity',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check rate limit
  const clientId = getClientId(req);
  const rateLimitResult = checkRateLimit(clientId, RATE_LIMIT_CONFIG);
  
  if (!rateLimitResult.allowed) {
    return rateLimitExceededResponse(rateLimitResult, corsHeaders);
  }

  try {
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };
    
    // Add auth header if token is available (increases rate limit from 60 to 5000/hour)
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch events and repos in parallel with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const [eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=${MAX_EVENTS}`, { 
        headers,
        signal: controller.signal 
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${MAX_REPOS}`, { 
        headers,
        signal: controller.signal 
      }),
    ]);
    
    clearTimeout(timeout);

    if (!eventsRes.ok || !reposRes.ok) {
      console.error('GitHub API error:', eventsRes.status, reposRes.status);
      return new Response(
        JSON.stringify({ error: 'GitHub API error', fallback: true }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            ...rateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const events = await eventsRes.json();
    const reposData = await reposRes.json();

    // Enrich PushEvents with commit messages by fetching from commits API
    const enrichedEvents = await Promise.all(
      events.map(async (event: any) => {
        if (event.type === 'PushEvent' && event.payload?.head) {
          try {
            const repoName = event.repo.name;
            const commitSha = event.payload.head;
            
            const commitRes = await fetch(
              `https://api.github.com/repos/${repoName}/commits/${commitSha}`,
              { headers }
            );
            
            if (commitRes.ok) {
              const commitData = await commitRes.json();
              // Add the commit message to the payload
              return {
                ...event,
                payload: {
                  ...event.payload,
                  commits: [{
                    message: commitData.commit?.message || 'Updated code',
                    sha: commitSha
                  }]
                }
              };
            }
          } catch (e) {
            console.log('Failed to fetch commit details:', e);
          }
        }
        return event;
      })
    );

    // Sort repos by stars and take top 3
    const repos = reposData
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map((repo: any) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        description: repo.description || '',
        url: repo.html_url,
      }));

    return new Response(
      JSON.stringify({ events: enrichedEvents, repos, fallback: false }),
      { 
        headers: { 
          ...corsHeaders, 
          ...rateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch GitHub data', fallback: true }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          ...rateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
