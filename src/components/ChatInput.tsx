import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, CornerDownLeft } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const MAX_LENGTH = 1000;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = isMobile ? 100 : 220;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = isMobile ? '40px' : '56px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

    return (
      <motion.form
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="border-t border-border/50 bg-card/80 backdrop-blur-xl px-2 sm:px-5 py-3 sm:py-3 shadow-2xl shadow-primary/5"
      >
        <div className="flex flex-col gap-2 sm:gap-3 max-w-5xl mx-auto">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-xl sm:rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                layoutId="inputGlow"
              />
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isMobile ? "اكتب سؤالك..." : "اكتب سؤالك القانوني هنا..."}
                disabled={disabled}
                className="relative min-h-[44px] max-h-[80px] sm:min-h-[56px] sm:max-h-[220px] resize-none bg-background/60 border border-border/60 focus:border-primary/50 hover:border-primary/30 focus:bg-background focus:shadow-lg transition-all rounded-xl sm:rounded-2xl pr-12 sm:pr-16 pl-3 sm:pl-4 py-3 sm:py-3 focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                rows={1}
                maxLength={MAX_LENGTH}
              />
              <motion.div 
                className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-3"
                whileHover={!isMobile ? { scale: 1.1 } : {}}
                whileTap={{ scale: 0.85 }}
              >
                <motion.div
                  animate={{ 
                    boxShadow: message.trim() && !disabled ? ['0 0 0 0 rgba(var(--primary), 0)', '0 0 0 6px rgba(var(--primary), 0.15)'] : 'none'
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    size="icon"
                    className="h-7 w-7 sm:h-10 sm:w-10 shrink-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg rounded-lg sm:rounded-xl transition-all duration-200 ease-in-out hover:shadow-xl hover:shadow-primary/50 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
          {!isMobile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center text-xs text-muted-foreground/70 px-2"
            >
              <div className="flex items-center gap-1.5 hover:text-muted-foreground transition-colors">
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Enter</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="font-semibold">Shift + Enter</span>
                <span>سطر جديد</span>
              </div>
              <motion.p
                animate={{ color: message.length > MAX_LENGTH * 0.9 ? 'var(--destructive)' : 'inherit' }}
                className="tabular-nums font-medium"
              >
                <span className={message.length > MAX_LENGTH * 0.9 ? 'text-destructive' : ''}>
                  {message.length}
                </span>
                <span className="text-muted-foreground/50"> / {MAX_LENGTH}</span>
              </motion.p>
            </motion.div>
          )}
        </div>
      </motion.form>
    );
};

export default ChatInput;
