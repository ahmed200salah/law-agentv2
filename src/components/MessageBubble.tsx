import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Copy, Bot, User, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MessageBubbleProps {
  message: Message;
  onRetry?: (content: string) => void;
}

const MessageBubble = ({ message, onRetry }: MessageBubbleProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const isUser = message.type === 'human';
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content);
    } else {
      // Typing effect for AI messages
      let index = 0;
      const content = message.content;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20); // Adjust speed as needed

      return () => clearInterval(timer);
    }
  }, [message.content, isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
     <motion.div
       initial={{ opacity: 0, y: 20, scale: 0.95 }}
       animate={{ opacity: 1, y: 0, scale: 1 }}
       transition={{ duration: 0.3, ease: 'easeOut' }}
       className={`flex items-start gap-1.5 sm:gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'} ${isMobile ? 'mb-2' : 'mb-0'}`}
     >
       {!isUser && (
         <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.1 }}
           className="flex-shrink-0 mt-1"
         >
           <Avatar className="w-7 h-7 sm:w-10 sm:h-10 border-2 border-primary/40 bg-primary/10 shadow-lg">
             <AvatarFallback className="text-primary font-bold bg-transparent">
               <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
             </AvatarFallback>
           </Avatar>
         </motion.div>
       )}
       
       <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} flex-1 sm:flex-none`}>
         <motion.div
           whileHover={!isMobile ? { scale: 1.02, y: -2 } : {}}
           transition={{ duration: 0.2 }}
            className={`relative group w-full rounded-3xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${
              isUser
                ? 'sm:max-w-xl bg-primary text-primary-foreground rounded-br-lg shadow-primary/20'
                : 'sm:max-w-4xl bg-card text-card-foreground border border-border rounded-bl-lg shadow-sm'
            } ${isMobile ? 'max-w-[calc(100vw-80px)]' : ''}`}
         >
            <div className={`prose dark:prose-invert ${isMobile ? 'prose-sm' : 'prose-base'} max-w-none overflow-hidden`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1.5 sm:mb-2 last:mb-0 leading-relaxed text-sm sm:text-base">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1 text-sm sm:text-base">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1 text-sm sm:text-base">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed text-sm sm:text-base">{children}</li>,
                  code: ({ className, children }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isUser ? 'bg-primary/30 text-primary-foreground/90' : 'bg-muted text-accent-foreground'}`}>
                        {children}
                      </code>
                    ) : (
                      <code className={`block p-2 rounded-lg text-xs font-mono overflow-x-auto ${isUser ? 'bg-primary/20' : 'bg-muted'}`}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 mt-2 sm:mt-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-1.5 mt-1.5 sm:mt-2.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-medium mb-1 sm:mb-1.5 mt-1 sm:mt-2">{children}</h3>,
                  a: ({ href, children }) => (
                    <a href={href} className={`hover:underline text-xs sm:text-base ${isUser ? 'text-primary-foreground underline' : 'text-primary underline'}`} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {displayedContent}
              </ReactMarkdown>
              {!isUser && displayedContent !== message.content && (
                <span className="animate-pulse text-primary">|</span>
              )}
            </div>
           
           {/* Action buttons - positioned at edges */}
           {!isUser && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2, delay: 0.3 }}
               className="absolute -bottom-3 -right-3 h-7 w-7"
             >
               <motion.div
                 whileTap={{ scale: 0.85 }}
                 transition={{ duration: 0.1 }}
               >
                 <Button
                   size="icon"
                   variant="ghost"
                   className={`h-7 w-7 rounded-lg shadow-md transition-all ${
                     isCopied
                       ? 'bg-green-500/20 text-green-500 ring-2 ring-green-500/30'
                       : 'bg-card/80 text-primary hover:bg-primary/10 border border-border/50'
                   }`}
                   onClick={handleCopy}
                   title="نسخ الرسالة"
                 >
                   {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                 </Button>
               </motion.div>
             </motion.div>
           )}

           {/* Retry button - positioned at edges */}
           {isUser && onRetry && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2, delay: 0.3 }}
               className="absolute -bottom-3 -right-3 h-7 w-7"
             >
               <motion.div
                 whileTap={{ scale: 0.85 }}
                 transition={{ duration: 0.1 }}
               >
                 <Button
                   size="icon"
                   variant="ghost"
                   className="h-7 w-7 rounded-lg shadow-md bg-card/80 text-primary hover:bg-primary/10 border border-border/50"
                   onClick={() => onRetry(message.content)}
                   title="إعادة إرسال الرسالة"
                 >
                   <RotateCcw className="h-3.5 w-3.5" />
                 </Button>
               </motion.div>
             </motion.div>
           )}
         </motion.div>
         
         <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="text-xs text-muted-foreground/60 px-1"
         >
           {format(new Date(message.created_at), 'HH:mm')}
         </motion.p>
       </div>
       
       {isUser && (
         <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.1 }}
           className="flex-shrink-0 mt-1"
         >
           <Avatar className="w-7 h-7 sm:w-10 sm:h-10 border-2 border-primary/40 bg-primary/10 shadow-lg">
             <AvatarFallback className="text-primary font-semibold bg-transparent text-xs">أ</AvatarFallback>
           </Avatar>
         </motion.div>
       )}
     </motion.div>
   );
};

export default MessageBubble;