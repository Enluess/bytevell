"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function InitialLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 1200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-bold text-3xl md:text-4xl font-heading text-white tracking-tight"
            >
              Hosti<span className="text-primary">Hub</span>
            </motion.div>
            
            <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
