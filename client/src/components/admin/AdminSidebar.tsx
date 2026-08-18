'use client'
import { useTranslations } from 'next-intl';

import { Link, useRouter } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { 
  LayoutDashboard, Users, Server, Receipt, Ticket, 
  LogOut, Shield, Settings, Network, HardDrive, 
  Activity, Globe, Terminal, Box, Database, Search
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export function AdminSidebar() {
  const t = useTranslations('Admin');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/panel/dashboard');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navGroups = [
    {
      title: t('Sidebar.OVERVIEW'),
      items: [
        { icon: <LayoutDashboard className="w-4 h-4" />, label: t('Sidebar.Dashboard'), href: '/admin/dashboard' },
        { icon: <Users className="w-4 h-4" />, label: t('Sidebar.Customers'), href: '/admin/users' },
      ]
    },
    {
      title: t('Sidebar.SERVICES_CATALOG'),
      items: [
        { icon: <Box className="w-4 h-4" />, label: t('Sidebar.Products'), href: '/admin/products' },
        { icon: <Server className="w-4 h-4" />, label: t('Sidebar.AllServices'), href: '/admin/services' },
      ]
    },
    {
      title: t('Sidebar.BILLING_FINANCE'),
      items: [
        { icon: <Receipt className="w-4 h-4" />, label: t('Sidebar.Invoices'), href: '/admin/invoices' },
        { icon: <Receipt className="w-4 h-4" />, label: t('Sidebar.Orders'), href: '/admin/orders' },
        { icon: <Activity className="w-4 h-4" />, label: t('Sidebar.FinanceTaxes'), href: '/admin/finance' },
        { icon: <Ticket className="w-4 h-4" />, label: t('Sidebar.Coupons'), href: '/admin/coupons' },
      ]
    },
    {
      title: t('Sidebar.SUPPORT'),
      items: [
        { icon: <Ticket className="w-4 h-4" />, label: t('Sidebar.Tickets'), href: '/admin/tickets' },
        { icon: <LayoutDashboard className="w-4 h-4" />, label: t('Sidebar.Knowledgebase'), href: '/admin/knowledgebase' },
      ]
    },
    {
      title: t('Sidebar.INFRASTRUCTURE'),
      items: [
        { icon: <HardDrive className="w-4 h-4" />, label: t('Sidebar.Servers'), href: '/admin/infrastructure/servers' },
        { icon: <Database className="w-4 h-4" />, label: t('Sidebar.Datacenters'), href: '/admin/infrastructure/datacenters' },
        { icon: <Network className="w-4 h-4" />, label: t('Sidebar.IPAddresses'), href: '/admin/infrastructure/ips' },
      ]
    },
    {
      title: t('Sidebar.SYSTEM_LOGS'),
      items: [
        { icon: <Terminal className="w-4 h-4" />, label: t('Sidebar.Announcements'), href: '/admin/announcements' },
        { icon: <Terminal className="w-4 h-4" />, label: t('Sidebar.EmailTemplates'), href: '/admin/emails' },
        { icon: <Settings className="w-4 h-4" />, label: t('Sidebar.Settings'), href: '/admin/settings' },
        { icon: <Shield className="w-4 h-4" />, label: t('Sidebar.AuditLogs'), href: '/admin/security/audit' },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface flex flex-col z-40 border-r border-border">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 shrink-0 border-b border-border">
        <Link href="/admin/dashboard" className="transition-opacity hover:opacity-80 flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-sm bg-white"></div>
          </div>
          <span className="text-foreground font-semibold tracking-tight text-[15px]">{t('Admin')}</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-hide px-3">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-wider text-foreground-muted px-3 mb-1">
              {group.title}
            </span>
            <div className="flex flex-col gap-[2px]">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative ${
                      isActive 
                        ? 'bg-surface-elevated text-foreground font-medium' 
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface-raised'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-primary rounded-r-full" />
                    )}
                    <div className={`shrink-0 ${isActive ? 'text-primary' : 'text-foreground-muted group-hover:text-foreground-secondary'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[13.5px] leading-none">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area */}
      <div className="p-4 shrink-0 border-t border-border">
        <button onClick={handleLogout} className="group flex w-full items-center gap-3 px-3 py-2 rounded-md text-foreground-secondary hover:text-foreground hover:bg-surface-raised transition-all duration-200">
          <LogOut className="w-4 h-4 shrink-0 text-foreground-muted group-hover:text-foreground-secondary" />
          <span className="text-[13.5px] leading-none">{t('Logout')}</span>
        </button>
      </div>
    </aside>
  );
}
