'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Eye, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ArticlePage() {
  const t = useTranslations('Panel.Knowledgebase');
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState<{ article: any, category: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const res = await api.get<any>(`/kb/articles/${slug}`);
        setData(res);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-10 w-3/4 bg-surface-elevated rounded mb-4"></div>
        <div className="h-4 w-1/4 bg-surface-elevated rounded mb-12"></div>
        <div className="h-64 bg-surface border border-border rounded-md"></div>
      </div>
    );
  }

  if (!data || !data.article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">{t('not_found_title')}</h2>
        <p className="text-foreground-muted mb-6">{t('not_found_desc')}</p>
        <button onClick={() => router.push('/panel/knowledgebase')} className="px-4 py-2 bg-surface-elevated hover:bg-surface-raised text-foreground rounded-md transition-colors">
          {t('back_to_kb')}
        </button>
      </div>
    );
  }

  const { article, category } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/panel/knowledgebase" className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground-muted hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> {t('back_to_kb')}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-foreground-muted mb-4 font-medium">
          {category && (
            <Link href={`/panel/knowledgebase?cat=${category.slug}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Tag className="w-3.5 h-3.5" /> {category.name}
            </Link>
          )}
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString('tr-TR')}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> {article.views} {t('views')}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">{article.title}</h1>
        {article.excerpt && (
          <p className="text-base text-foreground-secondary leading-relaxed border-l-2 border-primary pl-4">{article.excerpt}</p>
        )}
      </div>

      <div className="bg-surface border border-border rounded-md p-8 mt-8">
        <div 
          className="prose prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:text-foreground-secondary prose-p:leading-relaxed 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-foreground prose-code:bg-surface-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
