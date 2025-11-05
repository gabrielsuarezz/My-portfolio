import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Loader2, Send, Trophy, X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { TerminalBackground } from "./TerminalBackground";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export const TuringGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [input, setInput] = useState("");
  const [chat1, setChat1] = useState<ChatState>({ messages: [], isLoading: false });
  const [chat2, setChat2] = useState<ChatState>({ messages: [], isLoading: false });
  const [revealed, setRevealed] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Randomly assign which chat is Gabriel
  const [gabrielIsChat1] = useState(() => Math.random() > 0.5);

  const streamChat = async (
    messages: Message[],
    isGabriel: boolean,
    setChat: React.Dispatch<React.SetStateAction<ChatState>>
  ) => {
    setChat((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/turing-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages, isGabriel }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChat((prev) => {
                const lastMsg = prev.messages[prev.messages.length - 1];
                if (lastMsg?.role === "assistant") {
                  return {
                    ...prev,
                    messages: prev.messages.map((m, i) =>
                      i === prev.messages.length - 1 ? { ...m, content: assistantContent } : m
                    ),
                  };
                }
                return {
                  ...prev,
                  messages: [...prev.messages, { role: "assistant", content: assistantContent }],
                };
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChat((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || chat1.isLoading || chat2.isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    
    setChat1((prev) => ({ ...prev, messages: [...prev.messages, userMessage] }));
    setChat2((prev) => ({ ...prev, messages: [...prev.messages, userMessage] }));
    setInput("");

    // Stream to both chats simultaneously
    await Promise.all([
      streamChat([...chat1.messages, userMessage], gabrielIsChat1, setChat1),
      streamChat([...chat2.messages, userMessage], !gabrielIsChat1, setChat2),
    ]);
  };

  const handleGuess = (guessedChat1: boolean) => {
    const correct = guessedChat1 === gabrielIsChat1;
    setGuessedCorrectly(correct);
    setRevealed(true);

    toast({
      title: correct ? "🎉 Correct!" : "❌ Not quite!",
      description: correct
        ? `Chat ${gabrielIsChat1 ? "1" : "2"} is the real Gabriel!`
        : `Chat ${gabrielIsChat1 ? "1" : "2"} was the real Gabriel.`,
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setChat1({ messages: [], isLoading: false });
    setChat2({ messages: [], isLoading: false });
    setRevealed(false);
    setGuessedCorrectly(null);
    setInput("");
  };

  if (!gameStarted) {
    return (
      <section id="turing-game" className="py-20 px-6 relative overflow-hidden">
        <TerminalBackground density="heavy" speed="fast" />
        {/* Terminal background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-4xl relative z-10"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md"
            >
              <code className="text-primary text-sm">$ ./turing_test.sh --interactive</code>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              The Turing Test
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-2">
              Can you tell which AI is the real Gabriel?
            </p>
            <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              This isn't just a game - it's the best way to get to know me beyond the resume. 
              Ask about my projects, passions, hot takes, or that time I got stranded in the Everglades with a gator. 
              One AI has my personality, experiences, and sense of humor. The other doesn't.
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-2 sm:mb-4">
                <p className="text-base sm:text-lg font-semibold text-accent mb-2">
                  💡 Want to really get to know me? Ask about:
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> My AI/ML projects (Shadow Vision, Helios AI)
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> Fishing and motorcycles in the Everglades
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> Hot takes on tech, AI regulation, or legacy code
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> My Daft Punk helmet or custom lightsaber
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> Why I love computer vision
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent">›</span> That ShellHacks police story
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                  <p className="text-foreground">
                    Chat with two AIs simultaneously
                  </p>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                  <p className="text-foreground">
                    Ask them anything - tech, hobbies, opinions, experiences
                  </p>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                  <p className="text-foreground">
                    Figure out which one truly knows Gabriel
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setGameStarted(true)}
                className="w-full mt-6 sm:mt-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-5 sm:py-6 min-h-[48px]"
              >
                Start the Test
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="turing-game" className="py-20 px-6 relative overflow-hidden">
      <TerminalBackground density="medium" speed="medium" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Which one is Gabriel?</h2>
          <Button onClick={resetGame} variant="outline" size="sm" className="min-h-[40px]">
            <X className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Chat 1 */}
          <Card className={`p-3 sm:p-4 md:p-6 bg-card/50 backdrop-blur-sm transition-all ${
            revealed ? (gabrielIsChat1 ? "border-2 border-accent ring-2 ring-accent/50" : "border-border opacity-70") : "border-primary/20"
          }`}>
            <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-primary">Chat 1</h3>
              {revealed && gabrielIsChat1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-accent flex items-center gap-1 sm:gap-2"
                >
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-bold text-xs sm:text-base">Real Gabriel!</span>
                </motion.div>
              )}
              {!revealed && (
                <Button onClick={() => handleGuess(true)} variant="outline" size="sm" className="text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                  This is Gabriel
                </Button>
              )}
            </div>
            
            <div className="h-[300px] sm:h-[350px] md:h-[400px] overflow-y-auto mb-3 sm:mb-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <AnimatePresence>
                {chat1.messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 sm:p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 ml-4 sm:ml-8"
                        : "bg-muted mr-4 sm:mr-8"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">{msg.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {chat1.isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </div>
          </Card>

          {/* Chat 2 */}
          <Card className={`p-3 sm:p-4 md:p-6 bg-card/50 backdrop-blur-sm transition-all ${
            revealed ? (!gabrielIsChat1 ? "border-2 border-accent ring-2 ring-accent/50" : "border-border opacity-70") : "border-primary/20"
          }`}>
            <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-primary">Chat 2</h3>
              {revealed && !gabrielIsChat1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-accent flex items-center gap-1 sm:gap-2"
                >
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-bold text-xs sm:text-base">Real Gabriel!</span>
                </motion.div>
              )}
              {!revealed && (
                <Button onClick={() => handleGuess(false)} variant="outline" size="sm" className="text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                  This is Gabriel
                </Button>
              )}
            </div>
            
            <div className="h-[300px] sm:h-[350px] md:h-[400px] overflow-y-auto mb-3 sm:mb-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <AnimatePresence>
                {chat2.messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 sm:p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 ml-4 sm:ml-8"
                        : "bg-muted mr-4 sm:mr-8"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">{msg.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {chat2.isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Input */}
        <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask them anything..."
              disabled={chat1.isLoading || chat2.isLoading || revealed}
              className="flex-1 bg-background/50 border-primary/20 text-sm sm:text-base min-h-[44px]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chat1.isLoading || chat2.isLoading || revealed}
              className="bg-primary hover:bg-primary/90 min-h-[44px] min-w-[44px] p-2 sm:px-4"
            >
              {chat1.isLoading || chat2.isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </Card>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <p className="text-lg">
                {guessedCorrectly ? (
                  <span className="text-accent font-bold">
                    🎉 Impressive! You passed the Turing Test!
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    The AI did a pretty good job, didn't it? Chat {gabrielIsChat1 ? "1" : "2"} was trained on Gabriel's personality and experiences.
                  </span>
                )}
              </p>
              <Button onClick={resetGame} className="mt-4" variant="outline">
                Try Again
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};
