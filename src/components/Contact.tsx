import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-24 relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Build <span className="text-gradient">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
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
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover-lift"
                asChild
              >
                <a href="mailto:gsuarez@fiu.edu">
                  <Mail className="h-6 w-6" />
                  <span className="text-sm">Email</span>
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
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover-lift"
                asChild
              >
                <a href="https://linkedin.com/in/gabrielsuarezz" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-6 w-6" />
                  <span className="text-sm">LinkedIn</span>
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
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover-lift"
                asChild
              >
                <a href="https://github.com/gabrielsuarezz" target="_blank" rel="noopener noreferrer">
                  <Github className="h-6 w-6" />
                  <span className="text-sm">GitHub</span>
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
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover-lift"
                disabled
              >
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Miami, FL</span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button size="lg" asChild>
              <a href="mailto:gsuarez@fiu.edu">
                Get In Touch
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
