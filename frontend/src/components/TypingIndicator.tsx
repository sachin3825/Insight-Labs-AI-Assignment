
import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <div className="flex items-end space-x-3">
      {/* Avatar */}
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white font-bold text-sm">₿</span>
      </div>
      
      {/* Typing bubble */}
      <div className="relative px-5 py-4 rounded-2xl bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 shadow-lg">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Message tail */}
        <div className="absolute w-3 h-3 bg-slate-800/90 border-r border-b border-slate-700/50 transform rotate-45 -left-1 bottom-4" />
      </div>
    </div>
  );
};
