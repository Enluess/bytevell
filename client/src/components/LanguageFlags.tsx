'use client'

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const FlagTR = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 rounded-full object-cover shrink-0">
    <rect width="512" height="512" fill="#E30A17"/>
    <circle cx="230" cy="256" r="120" fill="#FFF"/>
    <circle cx="265" cy="256" r="96" fill="#E30A17"/>
    <polygon points="340,256 305,278 318,238 285,214 326,214 340,175 354,214 395,214 362,238 375,278" fill="#FFF"/>
  </svg>
);

const FlagEN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 rounded-full object-cover shrink-0">
    <rect width="512" height="512" fill="#012169"/>
    <path d="M0,0 L512,512 M512,0 L0,512" stroke="#FFF" strokeWidth="110"/>
    <path d="M0,0 L512,512 M512,0 L0,512" stroke="#C8102E" strokeWidth="70"/>
    <path d="M256,0 L256,512 M0,256 L512,256" stroke="#FFF" strokeWidth="140"/>
    <path d="M256,0 L256,512 M0,256 L512,256" stroke="#C8102E" strokeWidth="100"/>
  </svg>
);

const FlagDE = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 rounded-full object-cover shrink-0">
    <rect width="512" height="171" y="0" fill="#000"/>
    <rect width="512" height="171" y="171" fill="#DD0000"/>
    <rect width="512" height="171" y="341" fill="#FFCE00"/>
  </svg>
);

const languages = [
  { code: 'tr', name: 'Türkçe', flag: <FlagTR /> },
  { code: 'en', name: 'English', flag: <FlagEN /> },
  { code: 'de', name: 'Deutsch', flag: <FlagDE /> },
];

export function LanguageFlags() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const activeLanguage = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 text-foreground/80 hover:text-white"
        aria-label="Dil Seçimi"
      >
        {activeLanguage.flag}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-36 rounded-2xl overflow-hidden bg-[#111] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50"
          >
            <div className="p-1.5 flex flex-col">
              {languages.map((lang) => {
                const isActive = lang.code === activeLanguage.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                      isActive 
                        ? 'bg-primary/20 text-white' 
                        : 'text-foreground/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {lang.flag}
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
