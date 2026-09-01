'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Clock, Route } from 'lucide-react';
import { RouteData } from '@/types';
import { formatDistance, formatDuration } from '@/lib/utils';

interface AlternativeRouteCardProps {
  primaryRoute: RouteData;
  alternativeRoute: RouteData;
  reason: string;
  isLoading?: boolean;
}

export default function AlternativeRouteCard({
  primaryRoute,
  alternativeRoute,
  reason,
  isLoading,
}: AlternativeRouteCardProps) {
  const timeDiff = Math.round((alternativeRoute.duration - primaryRoute.duration) / 60);
  const distDiff = alternativeRoute.distance - primaryRoute.distance;

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-risk-moderate/30 bg-risk-moderate/5 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-6 py-4 bg-risk-moderate/10 border-b border-risk-moderate/20">
        <AlertTriangle className="w-4 h-4 text-risk-moderate" />
        <span className="text-sm font-bold text-risk-moderate">Current Route Affected</span>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1">
            OneWay AI Recommendation
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{reason}</p>
        </div>

        {/* Route comparison */}
        <div className="grid grid-cols-2 gap-3">
          {/* Primary route (affected) */}
          <div className="bg-risk-high/10 border border-risk-high/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-risk-high rounded-full" />
              <span className="text-xs font-bold text-risk-high">PRIMARY ROUTE</span>
            </div>
            <div className="text-sm font-medium text-text-primary">{primaryRoute.summary}</div>
            <div className="flex gap-3 mt-2 text-xs text-text-muted">
              <span>{formatDistance(primaryRoute.distance)}</span>
              <span>{formatDuration(primaryRoute.duration)}</span>
            </div>
            <div className="mt-2 text-xs text-risk-high">⚠ Conditions affected</div>
          </div>

          {/* Alternative route (recommended) */}
          <div className="bg-risk-low/10 border border-risk-low/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-risk-low rounded-full" />
              <span className="text-xs font-bold text-risk-low">RECOMMENDED ROUTE</span>
            </div>
            <div className="text-sm font-medium text-text-primary">{alternativeRoute.summary}</div>
            <div className="flex gap-3 mt-2 text-xs text-text-muted">
              <span>{formatDistance(alternativeRoute.distance)}</span>
              <span>{formatDuration(alternativeRoute.duration)}</span>
            </div>
            <div className="mt-2 text-xs text-risk-low">
              {timeDiff > 0 ? `+${timeDiff}min` : `${timeDiff}min`} · Lower current risk
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Route className="w-3.5 h-3.5" />
          <span>Select the recommended route on the map to view full details</span>
        </div>

        <div className="text-[11px] text-text-muted bg-surface-2/50 border border-border/50 rounded-lg px-3 py-2">
          Recommendation is based on available data only. Verify current conditions before selecting any route.
        </div>
      </div>
    </motion.div>
  );
}
