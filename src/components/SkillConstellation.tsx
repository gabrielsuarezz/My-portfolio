import { memo, useMemo, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface Skill {
  name: string;
  category: 'language' | 'ai' | 'web' | 'data' | 'hardware';
  level: number; // 1-5
  connections: string[];
}

const SKILLS: Skill[] = [
  // Languages
  { name: 'Python', category: 'language', level: 5, connections: ['TensorFlow', 'PyTorch', 'Flask', 'FastAPI', 'OpenCV'] },
  { name: 'TypeScript', category: 'language', level: 4, connections: ['React', 'Next.js', 'Node.js'] },
  { name: 'Java', category: 'language', level: 4, connections: ['Spring', 'PostgreSQL'] },
  { name: 'C++', category: 'language', level: 3, connections: ['Arduino', 'OpenCV'] },
  { name: 'SQL', category: 'language', level: 4, connections: ['PostgreSQL', 'SQLite'] },
  
  // AI/ML
  { name: 'TensorFlow', category: 'ai', level: 4, connections: ['Python', 'Computer Vision', 'NLP'] },
  { name: 'PyTorch', category: 'ai', level: 4, connections: ['Python', 'LLMs', 'NLP'] },
  { name: 'OpenCV', category: 'ai', level: 5, connections: ['Python', 'C++', 'Computer Vision', 'MediaPipe'] },
  { name: 'MediaPipe', category: 'ai', level: 4, connections: ['OpenCV', 'Computer Vision'] },
  { name: 'LLMs', category: 'ai', level: 4, connections: ['PyTorch', 'NLP', 'FastAPI'] },
  { name: 'NLP', category: 'ai', level: 4, connections: ['TensorFlow', 'PyTorch', 'LLMs'] },
  { name: 'Computer Vision', category: 'ai', level: 5, connections: ['TensorFlow', 'OpenCV', 'MediaPipe'] },
  
  // Web
  { name: 'React', category: 'web', level: 5, connections: ['TypeScript', 'Next.js', 'Node.js'] },
  { name: 'Next.js', category: 'web', level: 4, connections: ['React', 'TypeScript'] },
  { name: 'Flask', category: 'web', level: 4, connections: ['Python', 'PostgreSQL'] },
  { name: 'FastAPI', category: 'web', level: 4, connections: ['Python', 'LLMs'] },
  { name: 'Node.js', category: 'web', level: 3, connections: ['TypeScript', 'React'] },
  
  // Data
  { name: 'PostgreSQL', category: 'data', level: 4, connections: ['SQL', 'Flask', 'Java'] },
  { name: 'SQLite', category: 'data', level: 4, connections: ['SQL', 'Python'] },
  { name: 'Spring', category: 'data', level: 3, connections: ['Java'] },
  
  // Hardware
  { name: 'Arduino', category: 'hardware', level: 4, connections: ['C++', 'Sensors'] },
  { name: 'Raspberry Pi', category: 'hardware', level: 4, connections: ['Python', 'Sensors'] },
  { name: 'Sensors', category: 'hardware', level: 4, connections: ['Arduino', 'Raspberry Pi'] },
];

const CATEGORY_COLORS = {
  language: 'hsl(var(--primary))',
  ai: 'hsl(280 80% 60%)',
  web: 'hsl(140 70% 50%)',
  data: 'hsl(35 90% 55%)',
  hardware: 'hsl(0 80% 60%)',
};

const CATEGORY_LABELS = {
  language: 'Languages',
  ai: 'AI & ML',
  web: 'Web Dev',
  data: 'Data',
  hardware: 'Hardware',
};

export const SkillConstellation = memo(() => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate node positions in a constellation pattern
  const nodes = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    const categoryAngles: Record<string, number> = {
      language: -90,
      ai: -18,
      web: 54,
      data: 126,
      hardware: 198,
    };
    
    const categoryCount: Record<string, number> = {};
    
    return SKILLS.map((skill) => {
      const baseAngle = categoryAngles[skill.category];
      categoryCount[skill.category] = (categoryCount[skill.category] || 0) + 1;
      const offset = (categoryCount[skill.category] - 1) * 12 - 18;
      const angle = ((baseAngle + offset) * Math.PI) / 180;
      
      // Vary radius based on skill level
      const radius = 25 + (skill.level * 3) + (categoryCount[skill.category] % 2 === 0 ? 5 : 0);
      
      return {
        ...skill,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
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
    <section id="skills" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Interactive skill map — hover to explore connections
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
                  
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + node.level * 0.5 + 3}
                    textAnchor="middle"
                    fill={highlighted ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                    fontSize={isHovered ? 2.5 : 2}
                    fontFamily="monospace"
                    opacity={highlighted ? 1 : 0.4}
                    className="transition-all duration-300 select-none"
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
