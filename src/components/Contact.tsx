import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const contactLinks = [
  { icon: Mail, label: "Email", href: "mailto:gsuarez@fiu.edu", external: false },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/gabrielsuarezz", external: true },
  { icon: Github, label: "GitHub", href: "https://github.com/gabrielsuarezz", external: true },
  { icon: MapPin, label: "Miami, FL", href: null, external: false },
];

export const Contact = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion 
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          {...containerVariants}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-mono">
            <span className="text-muted-foreground opacity-60">$ </span>
            Let's Build <span className="text-gradient">Together</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
            Always excited to discuss new opportunities, collaborate on projects, or just talk tech. 
            Based in South Florida and ready to make an impact.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactLinks.map((link, index) => {
              const Icon = link.icon;
              const isDisabled = !link.href;
              
              return (
                <motion.div
                  key={link.label}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: 0.5 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-auto py-3 sm:py-4 flex flex-col items-center gap-2 hover-lift min-h-[80px] font-mono"
                    asChild={!isDisabled}
                    disabled={isDisabled}
                  >
                    {isDisabled ? (
                      <>
                        <div className="terminal-icon !p-2 opacity-50">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-xs sm:text-sm">{link.label}</span>
                      </>
                    ) : (
                      <a 
                        href={link.href!} 
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        <div className="terminal-icon !p-2">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-xs sm:text-sm">{link.label}</span>
                      </a>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: 0.5 }}
          >
            <Button size="lg" asChild className="min-h-[48px] text-base font-mono uppercase tracking-wider">
              <a href="mailto:gsuarez@fiu.edu">
                <span className="mr-2 opacity-60">&gt;</span>
                Get In Touch
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
