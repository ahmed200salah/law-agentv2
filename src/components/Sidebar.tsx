import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageSquare, ChevronLeft, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { Conversation } from '@/types/chat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectConversation: (sessionId: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  currentSessionId,
  onNewChat,
  onSelectConversation,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const { conversations, deleteConversation } = useConversations();

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen bg-card/90 backdrop-blur-md border-r border-border shadow-2xl"
    >
      <div className="flex flex-col h-full">
         {/* Header */}
         <div className="p-4 border-b border-border/50 bg-card/80">
           <div className="flex items-center justify-between mb-3">
             <AnimatePresence mode="wait">
               {!isCollapsed && (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="flex items-center gap-2 flex-1"
                 >
                   <motion.div 
                     whileHover={{ rotate: 360, scale: 1.1 }}
                     transition={{ duration: 0.6 }}
                     className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 shadow-lg"
                   >
                     <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                     </svg>
                   </motion.div>
                   <div className="flex flex-col gap-0.5">
                     <span className="font-bold text-xs text-primary">شركة ناصر</span>
                     <span className="text-xs text-muted-foreground leading-tight">استشارات قانونية</span>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
            {!isCollapsed && ( // Only show collapse button when not in mobile sheet (isCollapsed is false)
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="hover:bg-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
            {isCollapsed && ( // Show expand button when collapsed (desktop)
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* New Chat Button */}
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onNewChat}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2 shadow-lg"
                >
                  <PlusCircle className="h-5 w-5" />
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    محادثة جديدة
                  </motion.span>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={onNewChat}
                  size="icon"
                  className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-2">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 pb-4"
              >
                {conversations.map((conv, index) => (
                  <motion.button
                    key={conv.session_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ x: 4, scale: 1.02, backgroundColor: "var(--accent)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectConversation(conv.session_id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ease-in-out group ${
                      currentSessionId === conv.session_id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`h-4 w-4 shrink-0 ${currentSessionId === conv.session_id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                      <span className={`text-sm line-clamp-1 ${currentSessionId === conv.session_id ? 'font-semibold' : ''}`}>{conv.title}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 pb-4"
              >
                {conversations.map((conv, index) => (
                  <motion.button
                    key={conv.session_id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ scale: 1.1, backgroundColor: "var(--accent)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelectConversation(conv.session_id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 ease-in-out ${
                      currentSessionId === conv.session_id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <MessageSquare className={`h-5 w-5 mx-auto ${currentSessionId === conv.session_id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-border space-y-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={!currentSessionId} // Disable if no conversation is selected
                >
                  <Trash2 className="h-5 w-5" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        حذف المحادثة الحالية
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيؤدي هذا الإجراء إلى حذف المحادثة الحالية نهائيًا. لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={() => currentSessionId && deleteConversation(currentSessionId)}>حذف</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    تسجيل الخروج
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
