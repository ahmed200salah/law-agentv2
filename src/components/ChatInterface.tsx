import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useChat } from '@/hooks/useChat';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { Menu, X, Send, Bot, User, Sun, Moon } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import Sidebar from './Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';

const ChatInterface = () => {
  const {
    messages,
    sessionId,
    isLoading,
    handleSendMessage,
    handleNewChat,
    handleSelectConversation,
  } = useChat();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSelectConversationAndCloseSheet = (sessionId: string) => {
    handleSelectConversation(sessionId);
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const handleNewChatAndCloseSheet = () => {
    handleNewChat();
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const handleDeleteConversation = async (sessionIdToDelete: string) => {
    await deleteConversation(sessionIdToDelete);
    if (sessionIdToDelete === sessionId) {
      handleNewChat();
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {!isMobile && (
        <Sidebar
          currentSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

        <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-background via-background to-card/20">
          <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-4 shadow-lg shadow-primary/5 flex-shrink-0 sticky top-0 z-10">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {isMobile && (
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button size="icon" variant="ghost" className="hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                      </motion.div>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-3/4 sm:max-w-sm bg-background">
                      <Sidebar
                        currentSessionId={sessionId}
                        onNewChat={handleNewChatAndCloseSheet}
                        onSelectConversation={handleSelectConversationAndCloseSheet}
                        onDeleteConversation={handleDeleteConversation}
                        onLogout={handleLogout}
                        isCollapsed={false}
                        onToggleCollapse={() => setIsSheetOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>
                )}
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 min-w-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20 flex-shrink-0">
                    <motion.div
                      animate={{ rotate: isLoading ? 360 : 0 }}
                      transition={{ duration: isLoading ? 1 : 0.3, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                    >
                      <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                    </motion.div>
                  </div>
                  <div className="flex flex-col gap-0 min-w-0">
                    <h1 className="text-xs sm:text-sm font-bold text-foreground leading-tight truncate">شركة ناصر</h1>
                    <p className="text-xs text-primary font-semibold leading-tight">
                      {isLoading ? '⌛ معالجة' : '🟢'}
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div className="flex items-center gap-1 flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hover:bg-primary/10 relative h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
            </div>
          </header>

         <ScrollArea className="flex-1 px-2 sm:px-6 py-3 sm:py-6">
           <div className="w-full mx-auto flex flex-col gap-3 sm:gap-6">
             <AnimatePresence>
              {messages.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] text-center px-3 py-6 sm:py-0"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0, rotateZ: -10 }}
                      animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                      transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-8 shadow-2xl shadow-primary/30 border-2 border-primary/40 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-3xl" />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Bot className="w-10 h-10 sm:w-16 sm:h-16 text-primary relative z-10" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="max-w-sm"
                    >
                      <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                      شركة ناصر بن طريّد وشركاؤه 
                      </h1>
                      <h2 className="text-base sm:text-xl font-semibold text-primary mb-3 sm:mb-6">
                        للمحاماة والاستشارات القانونية
                      </h2>
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-muted-foreground max-w-sm leading-relaxed mb-4 sm:mb-8 text-sm sm:text-base"
                    >
                      مرحباً بك في مساعدنا القانوني الذكي. اسأل عن استشاراتك القانونية.
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex flex-col gap-2 items-center w-full"
                    >
                      <p className="text-xs text-muted-foreground/80 uppercase tracking-widest mb-1">أمثلة:</p>
                      <div className="flex flex-col gap-2 justify-center w-full px-2">
                        {['ما هي إجراءات الإفلاس في السعودية؟', 'ما هي حقوق الدائنين في الإفلاس؟'].map((example, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--primary)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendMessage(example)}
                            className="px-3 py-2 rounded-full border border-primary/50 text-xs sm:text-sm text-primary hover:bg-primary/5 transition-colors cursor-pointer bg-card/50"
                          >
                            {example}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
               {messages.map((message) => (
                 <MessageBubble
                   key={message.id}
                   message={message}
                   onRetry={message.type === 'human' ? handleSendMessage : undefined}
                 />
               ))}
            </AnimatePresence>
             {isLoading && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="flex justify-start w-full"
               >
                 <div className="bg-card border border-border rounded-2xl shadow-lg p-3 sm:p-4 w-fit">
                   <LoadingIndicator />
                 </div>
               </motion.div>
             )}
             <div ref={messagesEndRef} />
           </div>
         </ScrollArea>

         <div className="px-2 sm:px-6 py-3 sm:py-4 bg-card/50 border-t border-border backdrop-blur-lg flex-shrink-0">
           <div className="w-full mx-auto">
             <ChatInput onSend={handleSendMessage} disabled={isLoading} />
           </div>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
