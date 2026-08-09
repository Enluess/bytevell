'use client'

import { ChevronDown, Globe, Mail, Server, HardDrive, ShoppingCart, LogIn, Menu as MenuIcon, X, FileText, Package, Users, LifeBuoy, Info, Tag, Activity, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // --- Advanced Desktop Navigation State ---
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [dropdownX, setDropdownX] = useState(0);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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
      title: "Web Hosting",
      description: "Hızlı ve güvenilir paylaşımlı hosting",
      icon: <Globe className="w-5 h-5" />,
      href: "/hosting/web"
    },
    {
      title: "Mail Hosting",
      description: "Kurumsal e-posta çözümleri",
      icon: <Mail className="w-5 h-5" />,
      href: "/hosting/mail"
    }
  ];

  const serverItems: DropdownItem[] = [
    {
      title: "VDS Sunucu",
      description: "Yüksek performanslı sanal sunucular",
      icon: <Server className="w-5 h-5" />,
      href: "/servers/vds"
    },
    {
      title: "Dedicated Sunucu",
      description: "Tamamen size ait fiziksel sunucular",
      icon: <HardDrive className="w-5 h-5" />,
      href: "/servers/dedicated"
    }
  ];

  const supportItems: DropdownItem[] = [
    { title: "Hizmet Şartları", icon: <FileText className="w-5 h-5" />, href: "/legal/terms" },
    { title: "Gizlilik Politikası", icon: <FileText className="w-5 h-5" />, href: "/legal/privacy" },
    { title: "Teslimat ve İade Politikası", icon: <Package className="w-5 h-5" />, href: "/legal/refund" },
    { title: "Adil Kullanım Politikası", icon: <Users className="w-5 h-5" />, href: "/legal/fair-use" },
    { title: "Genel Destek Politikası", icon: <LifeBuoy className="w-5 h-5" />, href: "/legal/support" },
    { title: "Hakkımızda", icon: <Info className="w-5 h-5" />, href: "/about" },
    { title: "Aktif Kampanyalar", icon: <Tag className="w-5 h-5" />, href: "/campaigns" },
    { title: "Ağ Durumu", icon: <Activity className="w-5 h-5" />, href: "https://status.hostihub.com" },
    { title: "Dokümantasyon", icon: <BookOpen className="w-5 h-5" />, href: "/docs" }
  ];

  const navItems = [
    { id: "home", label: "Ana Sayfa", href: "/", dropdown: null as DropdownItem[] | null },
    { id: "hosting", label: "Hosting", dropdown: hostingItems },
    { id: "servers", label: "Sunucular", dropdown: serverItems },
    { id: "support", label: "Destek", dropdown: supportItems },
  ];

  const dropdownWidth = activeItem === 'support' ? 640 : 340;

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveItem(id);
    
    // Position dropdown to center of hovered item
    const el = navRefs.current[id];
    if (el) {
      const center = el.offsetLeft + (el.offsetWidth / 2);
      // Use dynamic width for calculation
      const calculatedWidth = id === 'support' ? 640 : 340;
      const calculatedX = Math.max(0, center - (calculatedWidth / 2));
      setDropdownX(calculatedX);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  };

  const activeDropdownContent = activeItem ? navItems.find(i => i.id === activeItem)?.dropdown : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none mt-6">
      <div 
        className={`pointer-events-auto flex items-center justify-between overflow-visible w-[95%] xl:w-[1200px] max-w-full mx-auto rounded-full transition-all duration-500 ease-out px-6 md:px-10 py-3 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent backdrop-blur-none border border-white/[0.04] shadow-none'
        }`}
      >
        <div className="flex items-center">
          <Link href="/" className="font-bold text-2xl font-heading text-white tracking-tight transition-opacity pr-6 md:pr-10">
            Hosti<span className="text-primary">Hub</span>
          </Link>
        </div>

        {/* Desktop Nav - Advanced Animated Structure */}
        <nav 
          className="hidden md:flex items-center gap-6 relative"
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
                  className={`relative flex items-center px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-foreground/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`} />
                    </motion.div>
                  )}
                </Link>

                {/* Shared Sliding Pill Background */}
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-full -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                  />
                )}
              </div>
            );
          })}

          {/* Shared Dropdown Container */}
          <AnimatePresence>
            {activeDropdownContent && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: dropdownX, width: dropdownWidth }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ 
                  opacity: { duration: 0.2, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" },
                  scale: { duration: 0.2, ease: "easeOut" },
                  x: { type: "spring", bounce: 0, duration: 0.25 },
                  width: { type: "spring", bounce: 0, duration: 0.25 }
                }}
                className="absolute top-full mt-4 bg-[#030303]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] overflow-hidden pointer-events-auto"
                onMouseEnter={() => {
                  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                }}
              >
                {/* Dropdown Content with smooth transition between panels */}
                <motion.div 
                  layout
                  className="p-3 max-h-[70vh] overflow-y-auto scrollbar-hide"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeItem}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={`grid gap-2 w-full ${activeItem === 'support' ? 'grid-cols-2' : 'grid-cols-1'}`}
                    >
                      {activeDropdownContent.map((item, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: index * 0.015, ease: "easeOut" }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-white/[0.04] transition-colors duration-300 group h-full"
                          >
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.05] flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/5 group-hover:border-primary/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-white/70 group-hover:text-primary">
                              {item.icon}
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="font-medium text-white text-[14px] group-hover:text-primary transition-colors duration-300">{item.title}</span>
                              {item.description && (
                                <span className="text-[12px] text-white/50 group-hover:text-white/70 transition-colors duration-300 line-clamp-1 mt-0.5">{item.description}</span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6 ml-4">
          <Link href="/checkout" className="text-foreground/70 hover:text-white transition-colors duration-200 relative group">
            <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          </Link>
          
          <button 
            onClick={() => router.push("/auth/login")} 
            className="bg-white text-black hover:bg-white/90 active:scale-95 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 text-[14px]"
          >
            <LogIn className="w-[16px] h-[16px]" strokeWidth={2} />
            Müşteri Paneli
          </button>
        </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/checkout" className="text-foreground/80 hover:text-white transition-colors">
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground/80 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-0 left-0 w-full h-full bg-[#030303]/98 backdrop-blur-2xl z-[60] overflow-y-auto overscroll-contain"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Mobile Menu Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-xl font-heading text-white tracking-tight">
                Hosti<span className="text-primary">Hub</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-white p-2.5 rounded-full hover:bg-white/5 transition-colors active:bg-white/10"
                aria-label="Menüyü Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-8 flex flex-col gap-2">
              <Link 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full text-foreground/90 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3.5 font-medium transition-colors text-[15px]" 
                href="/"
              >
                Ana Sayfa
              </Link>
              
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Hosting</div>
                <div className="flex flex-col gap-0.5">
                  {hostingItems.map((item, i) => (
                    <Link 
                      key={i} 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]" 
                      href={item.href}
                    >
                      <div className="text-primary bg-primary/10 p-2 rounded-lg flex-shrink-0">{item.icon}</div>
                      <div>
                        <div>{item.title}</div>
                        {item.description && <div className="text-xs text-foreground/50 mt-0.5">{item.description}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Sunucular</div>
                <div className="flex flex-col gap-0.5">
                  {serverItems.map((item, i) => (
                    <Link 
                      key={i} 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3.5 text-[15px]" 
                      href={item.href}
                    >
                      <div className="text-primary bg-primary/10 p-2 rounded-lg flex-shrink-0">{item.icon}</div>
                      <div>
                        <div>{item.title}</div>
                        {item.description && <div className="text-xs text-foreground/50 mt-0.5">{item.description}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-2 px-4">Destek & Bilgi</div>
                <div className="grid grid-cols-2 gap-0.5">
                  {supportItems.map((item, i) => (
                    <Link 
                      key={i} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-foreground/80 hover:text-white hover:bg-white/5 active:bg-white/8 rounded-xl px-3 py-3 font-medium transition-colors flex items-center gap-2.5 text-[13px]" 
                      href={item.href}
                    >
                      <div className="text-primary/80 flex-shrink-0">{item.icon}</div>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 mt-3 border-t border-white/5">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/auth/login");
                  }} 
                  className="w-full h-[52px] bg-white text-black hover:bg-white/90 active:bg-white/80 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <LogIn className="w-5 h-5" />
                  Müşteri Paneli
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
