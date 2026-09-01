'use client';

import Link from 'next/link';
import { ArrowLeft, Navigation, RefreshCw } from 'lucide-react';
import { RiskLevel } from '@/types';
import { getRiskColor, getRiskLabel, getRiskBgColor } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface JourneyHeaderProps {
  origin: string;
  destination: string;
  riskLevel?: RiskLevel;
  lastAnalyzedAt?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function JourneyHeader({
  origin,
  destination,
  riskLevel,
  lastAnalyzedAt,
  onRefresh,
  isRefreshing,
}: JourneyHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo + back */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
                  <Navigation className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-text-primary hidden sm:block">OneWay</span>
              </div>
            </Link>
          </div>

          {/* Center: journey route */}
          <div className="flex-1 flex items-center justify-center gap-2 mx-4 min-w-0">
            <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 max-w-sm w-full justify-center">
              <span className="text-sm font-medium text-text-primary truncate">{origin}</span>
              <span className="text-text-muted shrink-0">→</span>
              <span className="text-sm font-medium text-text-primary truncate">{destination}</span>
            </div>
            {riskLevel && (
              <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getRiskBgColor(riskLevel)} ${getRiskColor(riskLevel)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  riskLevel === 'LOW' ? 'bg-risk-low' :
                  riskLevel === 'MODERATE' ? 'bg-risk-moderate' :
                  riskLevel === 'HIGH' ? 'bg-risk-high' : 'bg-risk-critical'
                }`} />
                {getRiskLabel(riskLevel)}
              </div>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {lastAnalyzedAt && (
              <span className="hidden lg:block text-xs text-text-muted">
                Updated {formatRelativeTime(new Date(lastAnalyzedAt))}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary border border-border hover:border-accent/40 rounded-xl px-3 py-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:block">Refresh</span>
            </button>
            <Link
              href="/"
              className="text-xs font-medium bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-xl px-3 py-2 transition-all"
            >
              Change Journey
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
