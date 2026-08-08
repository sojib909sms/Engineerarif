import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AnimatedRoleTickerProps {
  roles: string[];
}

export const AnimatedRoleTicker: React.FC<AnimatedRoleTickerProps> = ({ roles }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(90);

  useEffect(() => {
    const currentFullRole = roles[roleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing characters
        setDisplayText(currentFullRole.substring(0, displayText.length + 1));
        setTypingSpeed(80);

        // If completed typing full word
        if (displayText === currentFullRole) {
          // Pause before starting deletion
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        // Deleting characters
        setDisplayText(currentFullRole.substring(0, displayText.length - 1));
        setTypingSpeed(45);

        // If completely deleted
        if (displayText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, typingSpeed]);

  return (
    <div className="relative py-1 my-2 flex flex-col items-start space-y-2">
      {/* Modern Badge pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-mono font-semibold tracking-wider uppercase backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
        <span>Specialization & Design Roles</span>
      </div>

      {/* Modern High-End Typewriter Display */}
      <div className="relative min-h-[48px] sm:min-h-[56px] flex items-center">
        <span className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)] font-sans">
          {displayText}
        </span>

        {/* Smooth Blinking Neon Cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
          className="inline-block w-1 sm:w-1.5 h-7 sm:h-10 ml-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#38bdf8]"
        />
      </div>

      {/* Decorative Subtle Glowing Underline Accent */}
      <div className="w-48 sm:w-64 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full opacity-80" />
    </div>
  );
};
