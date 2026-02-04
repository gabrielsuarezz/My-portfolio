import { memo, useState, useCallback } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const THEMES = [
  { id: 'default', name: 'Neon', color: 'hsl(189 94% 43%)', description: 'Electric cyan glow' },
  { id: 'matrix', name: 'Matrix', color: 'hsl(120 100% 50%)', description: 'Green terminal' },
  { id: 'retro', name: 'Amber CRT', color: 'hsl(35 100% 55%)', description: 'Retro monitor' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'hsl(300 100% 60%)', description: 'Neon pink' },
  { id: 'minimal', name: 'Minimal', color: 'hsl(0 0% 10%)', description: 'Clean grayscale' },
] as const;

export const ThemeSwitcher = memo(() => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.body.dataset.theme || 'default';
  });

  const handleThemeChange = useCallback((themeId: string) => {
    if (themeId === 'default') {
      delete document.body.dataset.theme;
    } else {
      document.body.dataset.theme = themeId;
    }
    setCurrentTheme(themeId);
    
    const theme = THEMES.find(t => t.id === themeId);
    toast.success(`🎨 ${theme?.name} theme activated`, {
      description: theme?.description,
    });
  }, []);

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative group"
          aria-label="Change theme"
        >
          <Palette className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span 
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background"
            style={{ backgroundColor: currentThemeData.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 font-mono">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`flex items-center gap-3 cursor-pointer ${
              currentTheme === theme.id ? 'bg-accent/20' : ''
            }`}
          >
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: theme.color }}
            />
            <span className="flex-1">{theme.name}</span>
            {currentTheme === theme.id && (
              <span className="text-accent text-xs">●</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
