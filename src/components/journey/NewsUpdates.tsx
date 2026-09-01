'use client';

import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { NewsItem } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface NewsUpdatesProps {
  news: NewsItem[];
  isLoading?: boolean;
}

export default function NewsUpdates({ news, isLoading }: NewsUpdatesProps) {
  const relevantNews = news.filter((n) => n.relevanceScore > 0.3);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <div className="skeleton h-6 w-40 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-accent" />
        Relevant News & Updates
        <span className="ml-auto text-xs text-text-muted">{relevantNews.length} items</span>
      </h3>

      {relevantNews.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-text-muted bg-surface-2 border border-border rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-risk-low" />
          No relevant news affecting this route at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {relevantNews.slice(0, 5).map((item) => (
            <div key={item.id} className="rounded-xl bg-surface-2 border border-border p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {item.affectsRoute && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-risk-high bg-risk-high/10 border border-risk-high/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Affects Route
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted">{item.source}</span>
                  </div>
                  <h4 className="text-sm font-medium text-text-primary leading-snug">{item.title}</h4>
                </div>
                {item.url && item.url !== '#' && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {item.summary && (
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-2">{item.summary}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(new Date(item.publishedAt))}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <span>Relevance:</span>
                  <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/60 rounded-full"
                      style={{ width: `${Math.round(item.relevanceScore * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
