import { memo, useMemo, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface Skill {
  name: string;
  category: 'language' | 'ai' | 'web' | 'data' | 'hardware' | 'tool';
  level: number; // 1-5
  connections: string[];
}

const SKILLS: Skill[] = [
  // Core Languages
  { name: 'Python', category: 'language', level: 5, connections: ['TensorFlow', 'PyTorch', 'Flask', 'FastAPI', 'OpenCV', 'NumPy', 'Pandas'] },
  { name: 'TypeScript', category: 'language', level: 4, connections: ['React', 'Next.js', 'Node.js', 'Vite'] },
  { name: 'JavaScript', category: 'language', level: 4, connections: ['React', 'Node.js', 'Vite'] },
  { name: 'Java', category: 'language', level: 4, connections: ['Spring', 'PostgreSQL', 'Android'] },
  { name: 'C++', category: 'language', level: 3, connections: ['Arduino', 'OpenCV', 'Embedded'] },
  { name: 'SQL', category: 'language', level: 4, connections: ['PostgreSQL', 'SQLite', 'Supabase'] },
  
  // AI/ML Core
  { name: 'TensorFlow', category: 'ai', level: 4, connections: ['Python', 'Computer Vision', 'NLP', 'Keras'] },
  { name: 'PyTorch', category: 'ai', level: 4, connections: ['Python', 'LLMs', 'NLP', 'Transformers'] },
  { name: 'OpenCV', category: 'ai', level: 5, connections: ['Python', 'C++', 'Computer Vision', 'MediaPipe'] },
  { name: 'MediaPipe', category: 'ai', level: 4, connections: ['OpenCV', 'Computer Vision', 'Gesture'] },
  { name: 'LLMs', category: 'ai', level: 4, connections: ['PyTorch', 'NLP', 'FastAPI', 'Transformers', 'GPT'] },
  { name: 'NLP', category: 'ai', level: 4, connections: ['TensorFlow', 'PyTorch', 'LLMs', 'Transformers'] },
  { name: 'Computer Vision', category: 'ai', level: 5, connections: ['TensorFlow', 'OpenCV', 'MediaPipe', 'YOLOv8'] },
  
  // AI/ML Extended
  { name: 'Keras', category: 'ai', level: 4, connections: ['TensorFlow', 'Python'] },
  { name: 'Transformers', category: 'ai', level: 3, connections: ['PyTorch', 'LLMs', 'NLP'] },
  { name: 'YOLOv8', category: 'ai', level: 4, connections: ['Computer Vision', 'Python'] },
  { name: 'GPT', category: 'ai', level: 4, connections: ['LLMs', 'FastAPI'] },
  { name: 'Gesture', category: 'ai', level: 4, connections: ['MediaPipe', 'TouchDesigner'] },
  { name: 'NumPy', category: 'ai', level: 4, connections: ['Python', 'Pandas'] },
  { name: 'Pandas', category: 'ai', level: 4, connections: ['Python', 'NumPy'] },
  
  // Web Frontend
  { name: 'React', category: 'web', level: 5, connections: ['TypeScript', 'JavaScript', 'Next.js', 'Vite', 'Tailwind'] },
  { name: 'Next.js', category: 'web', level: 4, connections: ['React', 'TypeScript', 'Vercel'] },
  { name: 'Tailwind', category: 'web', level: 5, connections: ['React', 'Vite'] },
  { name: 'Vite', category: 'web', level: 4, connections: ['React', 'TypeScript', 'JavaScript'] },
  
  // Web Backend
  { name: 'Flask', category: 'web', level: 4, connections: ['Python', 'PostgreSQL', 'REST'] },
  { name: 'FastAPI', category: 'web', level: 4, connections: ['Python', 'LLMs', 'REST'] },
  { name: 'Node.js', category: 'web', level: 3, connections: ['TypeScript', 'JavaScript', 'REST'] },
  { name: 'REST', category: 'web', level: 4, connections: ['Flask', 'FastAPI', 'Node.js'] },
  { name: 'Vercel', category: 'web', level: 3, connections: ['Next.js', 'React'] },
  
  // Data & Infrastructure
  { name: 'PostgreSQL', category: 'data', level: 4, connections: ['SQL', 'Flask', 'Java', 'Supabase'] },
  { name: 'SQLite', category: 'data', level: 4, connections: ['SQL', 'Python'] },
  { name: 'Supabase', category: 'data', level: 4, connections: ['PostgreSQL', 'SQL', 'React'] },
  { name: 'Firebase', category: 'data', level: 3, connections: ['React', 'Android'] },
  { name: 'Spring', category: 'data', level: 3, connections: ['Java'] },
  
  // Hardware & IoT
  { name: 'Arduino', category: 'hardware', level: 4, connections: ['C++', 'Sensors', 'Embedded'] },
  { name: 'Raspberry Pi', category: 'hardware', level: 4, connections: ['Python', 'Sensors', 'Linux'] },
  { name: 'Sensors', category: 'hardware', level: 4, connections: ['Arduino', 'Raspberry Pi'] },
  { name: 'Embedded', category: 'hardware', level: 3, connections: ['C++', 'Arduino'] },
  { name: 'Linux', category: 'hardware', level: 3, connections: ['Raspberry Pi', 'Docker'] },
  
  // Tools
  { name: 'TouchDesigner', category: 'tool', level: 4, connections: ['Python', 'Gesture'] },
  { name: 'Docker', category: 'tool', level: 3, connections: ['Linux', 'Vercel'] },
  { name: 'Git', category: 'tool', level: 5, connections: ['GitHub'] },
  { name: 'GitHub', category: 'tool', level: 5, connections: ['Git', 'Vercel'] },
  { name: 'Android', category: 'tool', level: 3, connections: ['Java', 'Firebase'] },
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

  // Calculate node positions in a neural network-like layered pattern
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
    
    // Define layer positions (like neural network layers)
    const categoryLayers: Record<string, { angle: number; minRadius: number; maxRadius: number }> = {
      language: { angle: -90, minRadius: 8, maxRadius: 22 },      // Top center - core
      ai: { angle: -30, minRadius: 20, maxRadius: 42 },           // Top right - AI cluster
      web: { angle: 30, minRadius: 20, maxRadius: 42 },           // Right - Web cluster
      data: { angle: 90, minRadius: 15, maxRadius: 35 },          // Bottom right - Data
      hardware: { angle: 150, minRadius: 18, maxRadius: 38 },     // Bottom left - Hardware
      tool: { angle: -150, minRadius: 15, maxRadius: 35 },        // Left - Tools
    };
    
    const positionedNodes: Array<typeof SKILLS[0] & { x: number; y: number }> = [];
    
    Object.entries(categoryGroups).forEach(([category, skills]) => {
      const layer = categoryLayers[category] || { angle: 0, minRadius: 20, maxRadius: 40 };
      const count = skills.length;
      
      skills.forEach((skill, index) => {
        // Spread nodes in an arc within the category zone
        const spreadAngle = 50; // degrees of spread
        const angleOffset = count > 1 ? (index / (count - 1) - 0.5) * spreadAngle : 0;
        const angle = ((layer.angle + angleOffset) * Math.PI) / 180;
        
        // Vary radius based on skill level and index for depth
        const radiusRange = layer.maxRadius - layer.minRadius;
        const radiusOffset = (index % 3) * (radiusRange / 3);
        const levelBonus = (skill.level - 3) * 2;
        const radius = layer.minRadius + radiusOffset + levelBonus + (Math.random() * 3 - 1.5);
        
        positionedNodes.push({
          ...skill,
          x: Math.max(5, Math.min(95, centerX + Math.cos(angle) * radius)),
          y: Math.max(5, Math.min(95, centerY + Math.sin(angle) * radius)),
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
