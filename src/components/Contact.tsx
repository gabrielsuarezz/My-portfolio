import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-3 sm:py-4 flex flex-col items-center gap-2 hover-lift min-h-[80px] font-mono"
                asChild
              >
                <a href="mailto:gsuarez@fiu.edu">
                  <div className="terminal-icon !p-2">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-xs sm:text-sm">Email</span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-3 sm:py-4 flex flex-col items-center gap-2 hover-lift min-h-[80px] font-mono"
                asChild
              >
                <a href="https://linkedin.com/in/gabrielsuarezz" target="_blank" rel="noopener noreferrer">
                  <div className="terminal-icon !p-2">
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-3 sm:py-4 flex flex-col items-center gap-2 hover-lift min-h-[80px] font-mono"
                asChild
              >
                <a href="https://github.com/gabrielsuarezz" target="_blank" rel="noopener noreferrer">
                  <div className="terminal-icon !p-2">
                    <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-xs sm:text-sm">GitHub</span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-3 sm:py-4 flex flex-col items-center gap-2 hover-lift min-h-[80px] font-mono"
                disabled
              >
                <div className="terminal-icon !p-2 opacity-50">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm">Miami, FL</span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
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
};
