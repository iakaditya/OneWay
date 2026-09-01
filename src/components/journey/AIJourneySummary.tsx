'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertOctagon, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { RiskLevel } from '@/types';
import { getRiskColor, getRiskBgColor, getRiskLabel } from '@/lib/utils';
import { useState } from 'react';

interface AIJourneySummaryProps {
  origin: string;
  destination: string;
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  recommendation: string;
  keyFindings: string[];
  confidence: number;
  alternativeRecommended?: boolean;
  riskFactors?: Record<string, RiskLevel>;
  isLoading?: boolean;
}

const RiskIcon = ({ level }: { level: RiskLevel }) => {
  switch (level) {
    case 'LOW': return <CheckCircle className="w-6 h-6 text-risk-low" />;
    case 'MODERATE': return <Info className="w-6 h-6 text-risk-moderate" />;
    case 'HIGH': return <AlertTriangle className="w-6 h-6 text-risk-high" />;
    case 'CRITICAL': return <AlertOctagon className="w-6 h-6 text-risk-critical" />;
  }
};

export default function AIJourneySummary({
  origin,
  destination,
  riskLevel,
  riskScore,
  summary,
  recommendation,
  keyFindings,
  confidence,
  alternativeRecommended,
  riskFactors,
  isLoading,
}: AIJourneySummaryProps) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border ${getRiskBgColor(riskLevel)} overflow-hidden`}
    >
      {/* Top band */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <RiskIcon level={riskLevel} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-xl font-bold ${getRiskColor(riskLevel)}`}>
                  {getRiskLabel(riskLevel)}
                </h2>
                <span className="text-xs text-text-muted bg-surface-2 border border-border rounded-full px-2 py-0.5">
                  Score: {riskScore}/100
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {origin} → {destination} · Confidence: {Math.round(confidence * 100)}%
              </p>
            </div>
          </div>

          {alternativeRecommended && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-risk-moderate bg-risk-moderate/10 border border-risk-moderate/20 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              Alternative route recommended
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 pb-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Recommendation */}
      <div className="mx-6 mb-4 bg-surface-2/50 rounded-xl p-4 border border-border/50">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1">
          OneWay AI Recommendation
        </div>
        <p className="text-sm font-medium text-text-primary">{recommendation}</p>
      </div>

      {/* Key findings - collapsible */}
      {keyFindings.length > 0 && (
        <div className="px-6 pb-5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-3"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Hide' : 'Show'} key findings ({keyFindings.length})
          </button>

          {expanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              {keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    riskLevel === 'LOW' ? 'bg-risk-low' :
                    riskLevel === 'MODERATE' ? 'bg-risk-moderate' : 'bg-risk-high'
                  }`} />
                  {finding}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      )}

      {/* Risk factors breakdown */}
      {riskFactors && (
        <div className="px-6 pb-5">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Risk Factors</div>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {Object.entries(riskFactors).map(([factor, level]) => (
              <div key={factor} className="text-center">
                <div className={`text-xs font-bold ${getRiskColor(level as RiskLevel)}`}>
                  {(level as string).slice(0, 3)}
                </div>
                <div className="text-[10px] text-text-muted capitalize mt-0.5">{factor}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-6 pb-5">
        <p className="text-[11px] text-text-muted bg-surface-2/30 rounded-lg p-3 border border-border/30">
          <span className="font-semibold">Data disclaimer:</span> OneWay AI bases analysis on available data at the time of generation.
          Conditions may change. Always exercise personal judgment and follow official advisories.
        </p>
      </div>
    </motion.div>
  );
}
