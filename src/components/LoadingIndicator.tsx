import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  const dotVariants = {
    initial: { y: 0, opacity: 0.4, scale: 0.8 },
    animate: { y: [-10, 0, -10], opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-4"
    >
      <motion.div 
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Bot className="w-6 h-6 text-primary" />
      </motion.div>
      
      <motion.div 
        className="flex gap-1.5"
        variants={containerVariants}
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/40"
          />
        ))}
      </motion.div>
      
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm font-medium text-primary ml-1"
      >
        جاري المعالجة...
      </motion.span>
    </motion.div>
  );
};

export default LoadingIndicator;
