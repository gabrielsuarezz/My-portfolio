import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, MapPin, Send, Terminal } from "lucide-react";
import { toast } from "sonner";

const contactLinks = [
  { icon: Mail, label: "Email", href: "mailto:gsuarez@fiu.edu", external: false },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/gabrielsuarezz", external: true },
  { icon: Github, label: "GitHub", href: "https://github.com/gabrielsuarezz", external: true },
  { icon: MapPin, label: "Miami, FL", href: null, external: false },
];

export const Contact = memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:gsuarez@fiu.edu?subject=${subject}&body=${body}`;

      // Open mailto link
      window.location.href = mailtoLink;

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      toast.success("Opening your email client...", {
        description: "Your message has been prepared!",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try emailing directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-mono">
              <span className="text-muted-foreground opacity-60">$ </span>
              Let's Build <span className="text-gradient">Together</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Always excited to discuss new opportunities, collaborate on projects, or just talk tech.
              Based in South Florida and ready to make an impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8 border-border/50 bg-card/50 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards] hover:shadow-[var(--shadow-medium)] transition-all duration-300">
              <div className="font-mono text-sm text-primary/80 flex items-center gap-2 mb-6">
                <Terminal className="h-4 w-4" />
                <span className="text-muted-foreground/60">$</span>
                <span>./send_message.sh</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-mono text-muted-foreground mb-2">
                    <span className="text-primary/60">{">"}</span> Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors font-mono text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-mono text-muted-foreground mb-2">
                    <span className="text-primary/60">{">"}</span> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors font-mono text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-mono text-muted-foreground mb-2">
                    <span className="text-primary/60">{">"}</span> Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors font-mono text-sm resize-none"
                    placeholder="Let's talk about..."
                    required
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-mono group"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact links */}
            <div className="space-y-4 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards]">
              <div className="font-mono text-sm text-primary/80 flex items-center gap-2 mb-6">
                <Terminal className="h-4 w-4" />
                <span className="text-muted-foreground/60">$</span>
                <span>./quick_links.sh</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isDisabled = !link.href;

                  return (
                    <div
                      key={link.label}
                      className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-auto py-4 flex items-center justify-start gap-4 font-mono transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-subtle)]"
                        asChild={!isDisabled}
                        disabled={isDisabled}
                      >
                        {isDisabled ? (
                          <>
                            <div className="terminal-icon !p-2 opacity-50">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm">{link.label}</span>
                          </>
                        ) : (
                          <a
                            href={link.href!}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-4"
                          >
                            <div className="terminal-icon !p-2">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm">{link.label}</span>
                          </a>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Additional info card */}
              <Card className="p-6 border-border/50 bg-card/30 mt-6">
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  <span className="text-primary/60">// </span>
                  <strong className="text-foreground">Response time:</strong> Usually within 24 hours. For urgent matters, feel free to reach out on LinkedIn!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
