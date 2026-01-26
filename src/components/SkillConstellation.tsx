import { memo, useMemo, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface Skill {
  name: string;
  category: 'language' | 'ai' | 'web' | 'data' | 'hardware' | 'tool';
  level: number; // 1-5
  connections: string[];
}

const SKILLS: Skill[] = [
  // Core Languages (reduced, focused)
  { name: 'Python', category: 'language', level: 5, connections: ['TensorFlow', 'PyTorch', 'OpenCV', 'FastAPI'] },
  { name: 'TypeScript', category: 'language', level: 4, connections: ['React', 'Next.js', 'Node.js'] },
  { name: 'Java', category: 'language', level: 4, connections: ['Spring', 'PostgreSQL'] },
  { name: 'C++', category: 'language', level: 3, connections: ['Arduino', 'OpenCV'] },
  { name: 'SQL', category: 'language', level: 4, connections: ['PostgreSQL', 'Supabase'] },
  
  // AI/ML (core only - reduced from 13 to 6)
  { name: 'TensorFlow', category: 'ai', level: 4, connections: ['Python', 'Computer Vision'] },
  { name: 'PyTorch', category: 'ai', level: 4, connections: ['Python', 'LLMs'] },
  { name: 'OpenCV', category: 'ai', level: 5, connections: ['Python', 'C++', 'Computer Vision'] },
  { name: 'LLMs', category: 'ai', level: 4, connections: ['PyTorch', 'FastAPI'] },
  { name: 'Computer Vision', category: 'ai', level: 5, connections: ['TensorFlow', 'OpenCV'] },
  { name: 'MediaPipe', category: 'ai', level: 4, connections: ['OpenCV', 'Computer Vision'] },
  
  // Web (reduced)
  { name: 'React', category: 'web', level: 5, connections: ['TypeScript', 'Next.js', 'Tailwind'] },
  { name: 'Next.js', category: 'web', level: 4, connections: ['React', 'TypeScript'] },
  { name: 'Tailwind', category: 'web', level: 5, connections: ['React'] },
  { name: 'FastAPI', category: 'web', level: 4, connections: ['Python', 'LLMs'] },
  { name: 'Node.js', category: 'web', level: 3, connections: ['TypeScript'] },
  
  // Data (reduced)
  { name: 'PostgreSQL', category: 'data', level: 4, connections: ['SQL', 'Java', 'Supabase'] },
  { name: 'Supabase', category: 'data', level: 4, connections: ['PostgreSQL', 'SQL', 'React'] },
  { name: 'Spring', category: 'data', level: 3, connections: ['Java', 'PostgreSQL'] },
  
  // Hardware (reduced)
  { name: 'Arduino', category: 'hardware', level: 4, connections: ['C++'] },
  { name: 'Raspberry Pi', category: 'hardware', level: 4, connections: ['Python'] },
  
  // Tools (reduced)
  { name: 'Docker', category: 'tool', level: 3, connections: ['Node.js'] },
  { name: 'Git', category: 'tool', level: 5, connections: [] },
];

const CATEGORY_COLORS = {
  language: 'hsl(var(--primary))',
  ai: 'hsl(280 80% 60%)',
  web: 'hsl(140 70% 50%)',
  data: 'hsl(35 90% 55%)',
  hardware: 'hsl(0 80% 60%)',
  tool: 'hsl(200 80% 55%)',
};

const CATEGORY_LABELS = {
  language: 'Languages',
  ai: 'AI & ML',
  web: 'Web Dev',
  data: 'Data',
  hardware: 'Hardware',
  tool: 'Tools',
};

export const SkillConstellation = memo(() => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate node positions with better spacing for readability
  const nodes = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    
    // Group skills by category
    const categoryGroups: Record<string, typeof SKILLS> = {};
    SKILLS.forEach((skill) => {
      if (!categoryGroups[skill.category]) {
        categoryGroups[skill.category] = [];
      }
      categoryGroups[skill.category].push(skill);
    });
    
    // Better spread layers with more separation between AI and Web
    const categoryLayers: Record<string, { angle: number; radius: number }> = {
      language: { angle: -90, radius: 15 },    // Top center - core
      ai: { angle: -50, radius: 34 },          // Upper left - AI cluster (moved further left)
      web: { angle: 50, radius: 34 },          // Upper right - Web cluster (moved further right)
      data: { angle: 110, radius: 28 },        // Bottom right - Data
      hardware: { angle: 170, radius: 30 },    // Bottom - Hardware
      tool: { angle: -150, radius: 28 },       // Left - Tools
    };
    
    const positionedNodes: Array<typeof SKILLS[0] & { x: number; y: number }> = [];
    
    Object.entries(categoryGroups).forEach(([category, skills]) => {
      const layer = categoryLayers[category] || { angle: 0, radius: 25 };
      const count = skills.length;
      
      skills.forEach((skill, index) => {
        // Narrower spread to keep categories more separate
        const spreadAngle = Math.min(55, count * 12);
        const angleOffset = count > 1 ? (index / (count - 1) - 0.5) * spreadAngle : 0;
        const angle = ((layer.angle + angleOffset) * Math.PI) / 180;
        
        // Stagger radius more for depth and separation
        const radiusVariation = (index % 3) * 4;
        const radius = layer.radius + radiusVariation;
        
        positionedNodes.push({
          ...skill,
          x: Math.max(10, Math.min(90, centerX + Math.cos(angle) * radius)),
          y: Math.max(10, Math.min(90, centerY + Math.sin(angle) * radius)),
        });
      });
    });
    
    return positionedNodes;
  }, []);

  // Calculate connections
  const connections = useMemo(() => {
    const lines: Array<{ from: typeof nodes[0]; to: typeof nodes[0]; key: string }> = [];
    
    nodes.forEach((node) => {
      node.connections.forEach((connName) => {
        const target = nodes.find((n) => n.name === connName);
        if (target && node.name < connName) {
          lines.push({ from: node, to: target, key: `${node.name}-${connName}` });
        }
      });
    });
    
    return lines;
  }, [nodes]);

  const handleNodeHover = useCallback((name: string | null) => {
    setHoveredSkill(name);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }, []);

  const isNodeHighlighted = useCallback((node: typeof nodes[0]) => {
    if (selectedCategory && node.category !== selectedCategory) return false;
    if (hoveredSkill) {
      if (node.name === hoveredSkill) return true;
      const hoveredNode = nodes.find(n => n.name === hoveredSkill);
      if (hoveredNode?.connections.includes(node.name)) return true;
      if (node.connections.includes(hoveredSkill)) return true;
      return false;
    }
    return true;
  }, [hoveredSkill, selectedCategory, nodes]);

  const isConnectionHighlighted = useCallback((conn: typeof connections[0]) => {
    if (selectedCategory && conn.from.category !== selectedCategory && conn.to.category !== selectedCategory) return false;
    if (hoveredSkill) {
      return conn.from.name === hoveredSkill || conn.to.name === hoveredSkill;
    }
    return true;
  }, [hoveredSkill, selectedCategory]);

  return (
    <section id="skill-network" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Skill <span className="text-gradient">Network</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Neural map of technical expertise — hover to explore connections
          </p>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 font-mono text-xs sm:text-sm ${
                selectedCategory === key 
                  ? 'border-primary bg-primary/20' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }}
              />
              {label}
            </button>
          ))}
        </div>

        <Card className="p-4 sm:p-8 border-border/50 backdrop-blur-sm bg-card/30">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full max-w-3xl mx-auto aspect-square"
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Connection lines */}
            {connections.map((conn) => (
              <line
                key={conn.key}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={isConnectionHighlighted(conn) ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border) / 0.2)'}
                strokeWidth={isConnectionHighlighted(conn) && hoveredSkill ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
            ))}
            
            {/* Skill nodes */}
            {nodes.map((node) => {
              const highlighted = isNodeHighlighted(node);
              const isHovered = hoveredSkill === node.name;
              
              return (
                <g
                  key={node.name}
                  onMouseEnter={() => handleNodeHover(node.name)}
                  onMouseLeave={() => handleNodeHover(null)}
                  className="cursor-pointer"
                  style={{ transform: 'translateZ(0)' }}
                >
                  {/* Glow effect */}
                  {isHovered && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.level * 0.8 + 2}
                      fill={CATEGORY_COLORS[node.category]}
                      opacity={0.3}
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.level * 0.5 + 1}
                    fill={CATEGORY_COLORS[node.category]}
                    opacity={highlighted ? 1 : 0.2}
                    className="transition-all duration-300"
                  />
                  
                  {/* Label with better visibility */}
                  <text
                    x={node.x}
                    y={node.y + node.level * 0.6 + 3.5}
                    textAnchor="middle"
                    fill={highlighted ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                    fontSize={isHovered ? 3 : 2.4}
                    fontFamily="monospace"
                    fontWeight={isHovered ? 600 : 400}
                    opacity={highlighted ? 1 : 0.5}
                    className="transition-all duration-300 select-none"
                    style={{ textShadow: '0 0 3px hsl(var(--background))' }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Hover info */}
          <div className="mt-6 text-center min-h-[3rem]">
            {hoveredSkill ? (
              <div className="font-mono text-sm animate-[fadeIn_0.2s_ease-out]">
                <span className="text-accent">{hoveredSkill}</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="text-muted-foreground">
                  {nodes.find(n => n.name === hoveredSkill)?.connections.join(', ')}
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60">
                Hover over nodes to see technology connections
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
});

SkillConstellation.displayName = 'SkillConstellation';
