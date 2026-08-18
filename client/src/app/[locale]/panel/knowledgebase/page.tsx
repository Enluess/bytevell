'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Search, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function KnowledgebasePage() {
  const t = useTranslations('Panel.Knowledgebase');
  const [categories, setCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<any>('/kb/categories');
        if (res.categories) setCategories(res.categories);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await api.get<any>(`/kb/search?q=${encodeURIComponent(q)}`);
      if (res.articles) setSearchResults(res.articles);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded mb-8"></div>
        <div className="h-12 bg-surface border border-border rounded-md"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-white/5">
        <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-[14px] text-white/50 tracking-wide">{t('subtitle')}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white text-[15px] outline-none focus:border-white/20 transition-all backdrop-blur-xl placeholder:text-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {searchResults.map((article) => (
            <Link key={article.id} href={`/panel/knowledgebase/${article.slug}`} className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 flex items-center justify-between gap-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex-1 min-w-0">
                <h3 className="text-[16px] font-medium text-white tracking-tight mb-1">{article.title}</h3>
                {article.excerpt && <p className="text-[14px] text-white/40 truncate tracking-wide">{article.excerpt}</p>}
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
                <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-black transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Categories */}
      {searchQuery.length < 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/panel/knowledgebase/${cat.slug}`} className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-xl min-h-[160px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white tracking-tight mb-1">{cat.name}</h3>
                  {cat.description && <p className="text-[13px] text-white/40 tracking-wide line-clamp-2">{cat.description}</p>}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 relative z-10">
                <span className="text-[11px] uppercase tracking-widest font-bold text-white/30">{cat.articleCount} {t('articles_count')}</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/40 text-[14px] tracking-wide">{t('no_categories')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
