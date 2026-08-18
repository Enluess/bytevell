'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Search, Server, Receipt, Ticket, Settings, Shield, User, LayoutDashboard, Globe } from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const t = useTranslations('Panel.CommandPalette');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'dashboard', label: t('go_dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, href: '/panel/dashboard', group: t('group_navigation') },
    { id: 'services', label: t('my_services'), icon: <Server className="w-4 h-4" />, href: '/panel/services', group: t('group_navigation') },
    { id: 'invoices', label: t('invoices'), icon: <Receipt className="w-4 h-4" />, href: '/panel/invoices', group: t('group_billing') },
    { id: 'tickets', label: t('tickets'), icon: <Ticket className="w-4 h-4" />, href: '/panel/tickets', group: t('group_support') },
    { id: 'profile', label: t('profile_settings'), icon: <User className="w-4 h-4" />, href: '/panel/settings/profile', group: t('group_account') },
    { id: 'security', label: t('security'), icon: <Shield className="w-4 h-4" />, href: '/panel/settings/security', group: t('group_account') },
    { id: 'api', label: t('api_keys'), icon: <Settings className="w-4 h-4" />, href: '/panel/settings/api-keys', group: t('group_account') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) || 
    cmd.group.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          router.push(filteredCommands[selectedIndex].href);
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, router]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-[100]" 
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#080808] border border-[#151515] rounded-xl shadow-2xl z-[101] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#151515]">
          <Search className="w-5 h-5 text-[#666666]" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('search_placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#666666] text-[15px]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-[#111111] border border-[#222222] rounded px-1.5 py-0.5 text-[10px] font-medium text-[#888888]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#666666] text-[14px]">
              {t('no_results')}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredCommands.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    router.push(cmd.href);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-colors ${
                    i === selectedIndex 
                      ? 'bg-[#151515] text-white' 
                      : 'text-[#AAAAAA] hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`shrink-0 ${i === selectedIndex ? 'text-white' : 'text-[#666666]'}`}>
                      {cmd.icon}
                    </div>
                    <span className="text-[14px]">{cmd.label}</span>
                  </div>
                  <span className="text-[12px] text-[#666666]">{cmd.group}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
