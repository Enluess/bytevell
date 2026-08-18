import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { Home, ShoppingCart, PlusCircle, CreditCard, Wallet, Settings, LogOut, LifeBuoy, FileText, Globe, BookOpen, Megaphone, Mail, DollarSign, Server } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';

export function PanelSidebar() {
  const t = useTranslations('Panel.Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navGroups = [
    {
      title: t('group_overview') || 'BYTEVELL',
      items: [
        { icon: <Home className="w-4 h-4" />, label: t('dashboard') || 'Dashboard', href: '/panel/dashboard' },
        { icon: <ShoppingCart className="w-4 h-4" />, label: t('buy_services') || 'Buy Services', href: '/panel/store' },
        { icon: <Server className="w-4 h-4" />, label: t('services') || 'Services', href: '/panel/services' },
        { icon: <PlusCircle className="w-4 h-4" />, label: t('orders') || 'Orders', href: '/panel/orders' },
      ]
    },
    {
      title: t('group_billing') || 'BILLING',
      items: [
        { icon: <FileText className="w-4 h-4" />, label: t('invoices') || 'Invoices', href: '/panel/invoices' },
        { icon: <Wallet className="w-4 h-4" />, label: t('wallet') || 'Wallet', href: '/panel/wallet' },
      ]
    },
    {
      title: t('group_support') || 'SUPPORT',
      items: [
        { icon: <LifeBuoy className="w-4 h-4" />, label: t('tickets') || 'Tickets', href: '/panel/tickets' },
        { icon: <BookOpen className="w-4 h-4" />, label: t('knowledgebase') || 'Knowledgebase', href: '/panel/knowledgebase' },
        { icon: <Megaphone className="w-4 h-4" />, label: t('announcements') || 'Announcements', href: '/panel/announcements' },
      ]
    },
    {
      title: t('group_account') || 'ACCOUNT',
      items: [
        { icon: <Settings className="w-4 h-4" />, label: t('settings') || 'Settings', href: '/panel/settings' },
        { icon: <Mail className="w-4 h-4" />, label: t('emails') || 'Email History', href: '/panel/emails' },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full text-foreground relative z-10">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 shrink-0">
        <Link href="/" className="transition-opacity hover:opacity-80 flex items-center gap-2">
          <Image src="/bytevell-beyaz.svg" alt="Bytevell" width={100} height={20} className="object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-6 scrollbar-hide px-5">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-white/30 px-3 mb-2">
              {group.title}
            </span>
            <div className="flex flex-col gap-[2px]">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href || (item.href !== '/panel/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative ${
                      isActive 
                        ? 'bg-white/10 text-white font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[13px] leading-none tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area */}
      <div className="p-5 shrink-0">
        <button onClick={handleLogout} className="group flex w-full items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300">
          <LogOut className="w-4 h-4 shrink-0 text-white/40 group-hover:text-white/70 transition-colors" />
          <span className="text-[13px] leading-none tracking-wide font-medium">{t('logout') || 'Logout'}</span>
        </button>
      </div>
    </div>
  );
}
