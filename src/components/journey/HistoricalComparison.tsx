'use client';

import { motion } from 'framer-motion';
import { History, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { HistoricalPattern } from '@/types';
import { getRiskColor } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface HistoricalComparisonProps {
  patterns: HistoricalPattern[];
  currentRisk: string;
  isLoading?: boolean;
}

export default function HistoricalComparison({ patterns, currentRisk, isLoading }: HistoricalComparisonProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="skeleton h-6 w-48 rounded mb-4" />
        <div className="skeleton h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
        <History className="w-4 h-4 text-accent" />
        Historical Pattern Analysis
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Comparing current conditions against historical incident records for this route region.
      </p>

      {patterns.length === 0 ? (
        <div className="text-sm text-text-muted bg-surface-2 border border-border rounded-xl px-4 py-3">
          <span className="font-medium">Limited historical data available</span> for this specific route.
          Analysis is based on current live data only.
        </div>
      ) : (
        <div className="space-y-3">
          {patterns.slice(0, 4).map((pattern, index) => (
            <div key={index} className="bg-surface-2 border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${getRiskColor(pattern.severity)}`} />
                  <span className="text-sm font-medium text-text-primary">
                    {pattern.incidentType.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`text-xs font-bold ${getRiskColor(pattern.severity)}`}>
                  {pattern.frequency}x/yr
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {pattern.location}
                </span>
                {pattern.lastOccurred && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Last: {formatRelativeTime(new Date(pattern.lastOccurred))}
                  </span>
                )}
              </div>

              <p className="text-xs text-text-muted">{pattern.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-surface-2/50 border border-border/50 rounded-xl p-4">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-text-secondary">Important:</span> Historical patterns indicate
          past behavior, not predictions. Similar past conditions were associated with increased disruption
          frequency — but each journey is unique. Never rely solely on historical data when making travel decisions.
        </p>
      </div>
    </motion.div>
  );
}
