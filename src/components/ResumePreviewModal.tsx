import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, GraduationCap, Briefcase, Code, Award } from 'lucide-react';

interface ResumePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const highlights = {
  education: {
    icon: GraduationCap,
    title: 'Education',
    items: [
      'B.S. Computer Science - Florida International University',
      'Minor in Mathematics',
      'GPA: 3.7',
    ],
  },
  experience: {
    icon: Briefcase,
    title: 'Experience',
    items: [
      'AI/ML Research & Development',
      'Full-Stack Web Development',
      'Computer Vision Projects',
    ],
  },
  skills: {
    icon: Code,
    title: 'Top Skills',
    items: ['Python', 'TypeScript', 'React', 'TensorFlow', 'OpenCV', 'LLMs'],
  },
  achievements: {
    icon: Award,
    title: 'Highlights',
    items: [
      'Published AI research',
      'Open source contributor',
      'Hackathon winner',
    ],
  },
};

export const ResumePreviewModal = memo(({ open, onOpenChange }: ResumePreviewModalProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Gabriel_Suarez_Resume.pdf';
    link.download = 'Gabriel_Suarez_Resume.pdf';
    link.click();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl flex items-center gap-2">
            <span className="text-muted-foreground">//</span> Resume Preview
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Quick overview before downloading the full PDF
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {Object.entries(highlights).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <div
                key={key}
                className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="font-mono font-semibold text-sm">{section.title}</h3>
                </div>
                {key === 'skills' ? (
                  <div className="flex flex-wrap gap-1.5">
                    {section.items.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1 gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Full Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ResumePreviewModal.displayName = 'ResumePreviewModal';
