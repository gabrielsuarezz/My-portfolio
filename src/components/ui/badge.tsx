import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-mono tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
  {
    variants: {
      variant: {
        default: "border-primary/50 bg-primary/20 text-primary hover:bg-primary/30 hover:shadow-[0_0_10px_hsl(var(--primary)/0.3)]",
        secondary: "border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
        destructive: "border-destructive/50 bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "border-primary/30 text-foreground hover:border-primary hover:bg-primary/10",
        terminal: "border-primary/60 bg-transparent text-primary font-mono uppercase tracking-widest hover:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
