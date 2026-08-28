'use client'

import { ChevronDown, Globe, Mail, Server, HardDrive, LogIn, Menu as MenuIcon, X, FileText, Package, Users, LifeBuoy, Info, Tag, Activity, BookOpen } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import { LanguageFlags } from "./LanguageFlags";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function Navigation() {
  const t = useTranslations('Navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  type DropdownItem = {
    title: string;
    description?: string;
    icon: React.ReactNode;
    href: string;
  };

  const hostingItems: DropdownItem[] = [
    {
      title: t('hosting_web_title'),
      description: t('hosting_web_desc'),
      icon: <Globe className="w-5 h-5" />,
      href: "/hosting/web"
    },
    {
      title: t('hosting_mail_title'),
      description: t('hosting_mail_desc'),
      icon: <Mail className="w-5 h-5" />,
      href: "/hosting/mail"
    }
  ];

  const serverItems: DropdownItem[] = [
    {
      title: t('server_vds_title'),
      description: t('server_vds_desc'),
      icon: <Server className="w-5 h-5" />,
      href: "/servers/vds"
    },
    {
      title: t('server_dedi_title'),
      description: t('server_dedi_desc'),
      icon: <HardDrive className="w-5 h-5" />,
      href: "/servers/dedicated"
    }
  ];

  const supportItems: DropdownItem[] = [
    { title: t('support_terms'), icon: <FileText className="w-5 h-5" />, href: "/legal/terms" },
    { title: t('support_privacy'), icon: <FileText className="w-5 h-5" />, href: "/legal/privacy" },
    { title: t('support_refund'), icon: <Package className="w-5 h-5" />, href: "/legal/refund" },
    { title: t('support_fair'), icon: <Users className="w-5 h-5" />, href: "/legal/fair-use" },
    { title: t('support_support'), icon: <LifeBuoy className="w-5 h-5" />, href: "/legal/support" },
    { title: t('support_about'), icon: <Info className="w-5 h-5" />, href: "/about" },
    { title: t('support_status'), icon: <Activity className="w-5 h-5" />, href: "https://status.bytevell.com" }
  ];

  const navItems = [
    { id: "home", label: t('home'), href: "/", dropdown: null as DropdownItem[] | null },
    { id: "hosting", label: t('hosting'), dropdown: hostingItems },
    { id: "servers", label: t('servers'), dropdown: serverItems },
    { id: "support", label: t('support'), dropdown: supportItems },
  ];

  const FIXED_DROPDOWN_WIDTH = 560;

  const directionRef = useRef(1);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    if (activeItem && activeItem !== id) {
      const prevIndex = navItems.findIndex(i => i.id === activeItem);
      const newIndex = navItems.findIndex(i => i.id === id);
      directionRef.current = newIndex > prevIndex ? 1 : -1;
    }

    setActiveItem(id);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  };

  const activeDropdownContent = activeItem ? navItems.find(i => i.id === activeItem)?.dropdown : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none mt-4 md:mt-6 transition-all duration-300">
      <div
        className={`pointer-events-auto relative flex items-center justify-between overflow-visible transition-all duration-500 mx-auto w-full max-w-6xl px-6 md:px-8 py-3 rounded-2xl ${
          scrolled 
            ? 'bg-[#060709]/95 border border-white/5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
            : 'bg-transparent border border-transparent backdrop-blur-none shadow-none'
        }`}
      >
        <div className="flex items-center">
          <Link href="/" className="font-bold text-2xl font-heading text-white tracking-tight transition-opacity pr-6 md:pr-10">
            <Image src="/bytevell-beyaz.svg" alt="Bytevell Logo" width={105} height={28} className="object-contain" />
          </Link>
        </div>

        <nav
          className="hidden md:flex items-center gap-2 relative"
          onMouseLeave={handleMouseLeave}
        >
          {navItems.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => { navRefs.current[item.id] = el; }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                className="relative z-10"
              >
                <Link
                  href={item.href || "#"}
                  className={`relative flex items-center px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-foreground/80 hover:text-white"
                    }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <ChevronDown className={`w-4 h-4 ml-1.5 transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`} />
                    </motion.div>
                  )}
                </Link>

                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                  />
                )}
              </div>
            );
          })}

          <AnimatePresence>
            {activeDropdownContent && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" },
                  scale: { duration: 0.2, ease: "easeOut" }
                }}
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 rounded-2xl overflow-hidden pointer-events-auto transition-all duration-300 ease-out w-95 border backdrop-blur-3xl ${scrolled
                  ? 'bg-[#060709]/50 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  : 'bg-[#0a0b0d]/50 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  }`}
                onMouseEnter={() => {
                  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                }}
              >
                <div className="p-3 overflow-hidden relative">
                  <AnimatePresence mode="popLayout" custom={directionRef.current}>
                    <motion.div
                      key={activeItem}
                      custom={directionRef.current}
                      variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex flex-col gap-1 w-full"
                    >
                      {activeDropdownContent.map((dropItem, idx) => (
                        <Link
                          key={idx}
                          href={dropItem.href}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-colors duration-200 group"
                        >
                          <div className="shrink-0 mt-0.5 text-white/90 group-hover:text-white transition-colors">
                            {dropItem.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white text-[14px] leading-tight tracking-wide">{dropItem.title}</span>
                            {dropItem.description && (
                              <span className="text-[13px] text-white/50 mt-1.5 leading-snug">{dropItem.description}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <div className="hidden md:flex items-center gap-6 ml-4">
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />}>
            <LanguageFlags />
          </Suspense>

          <button
            onClick={() => router.push("/auth/login")}
            className="bg-white text-black hover:bg-white/90 active:scale-95 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 text-[14px]"
          >
            <LogIn className="w-4 h-4" strokeWidth={2} />
            {t('customerPanel')}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />}>
            <LanguageFlags />
          </Suspense>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground/80 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-0 left-0 w-full h-full bg-[#030303]/98 backdrop-blur-2xl z-60 overflow-y-auto overscroll-contain pointer-events-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5">
              <button onClick={() => { setIsMenuOpen(false); router.push("/"); }} className="font-bold text-xl font-heading text-white tracking-tight">
                <Image src="/bytevell-beyaz.svg" alt="Bytevell Logo" width={90} height={24} className="object-contain" />
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-white p-2.5 rounded-full hover:bg-white/5 transition-colors active:bg-white/10"
                aria-label="Menüyü Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-8 flex flex-col gap-2">
              <button
                onClick={() => { setIsMenuOpen(false); router.push("/"); }}
                className="w-full text-left text-foreground/90 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3.5 font-medium transition-colors text-[15px] rounded-xl"
              >
                Ana Sayfa
              </button>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Hosting</div>
                <div className="flex flex-col gap-0.5">
                  {hostingItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setIsMenuOpen(false); router.push(item.href); }}
                      className="w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]"
                    >
                      <div className="text-primary bg-primary/10 p-2 rounded-lg shrink-0">{item.icon}</div>
                      <div>
                        <div>{item.title}</div>
                        {item.description && <div className="text-xs text-foreground/50 mt-0.5">{item.description}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Sunucular</div>
                <div className="flex flex-col gap-0.5">
                  {serverItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setIsMenuOpen(false); router.push(item.href); }}
                      className="w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]"
                    >
                      <div className="text-primary bg-primary/10 p-2 rounded-lg shrink-0">{item.icon}</div>
                      <div>
                        <div>{item.title}</div>
                        {item.description && <div className="text-xs text-foreground/50 mt-0.5">{item.description}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Destek & Bilgi</div>
                <div className="grid grid-cols-2 gap-0.5">
                  {supportItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (item.href.startsWith("http")) {
                          window.open(item.href, "_blank");
                        } else {
                          router.push(item.href);
                        }
                      }}
                      className="w-full text-left text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-3 py-3 font-medium transition-colors flex items-center gap-2.5 text-[13px]"
                    >
                      <div className="text-primary/80 shrink-0">{item.icon}</div>
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/auth/login");
                  }}
                  className="w-full h-13 bg-white text-black hover:bg-white/90 active:bg-white/80 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <LogIn className="w-5 h-5" />
                  {t('customerPanel')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
