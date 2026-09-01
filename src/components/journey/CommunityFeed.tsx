'use client';

import { motion } from 'framer-motion';
import { Users, ThumbsUp, CheckCircle, MessageCircle, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { CommunityReportData, ReportCategory } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

interface CommunityFeedProps {
  reports: CommunityReportData[];
  journeyId: string;
  isLoading?: boolean;
}

const categoryColors: Record<ReportCategory, string> = {
  ROAD_BLOCKED: 'text-risk-critical bg-risk-critical/10 border-risk-critical/20',
  LANDSLIDE: 'text-risk-critical bg-risk-critical/10 border-risk-critical/20',
  FLOOD: 'text-route bg-route/10 border-route/20',
  HEAVY_RAIN: 'text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20',
  SNOW: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  POOR_VISIBILITY: 'text-text-muted bg-surface-3 border-border',
  TRAFFIC: 'text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20',
  ACCIDENT: 'text-risk-high bg-risk-high/10 border-risk-high/20',
  ROAD_CLEAR: 'text-risk-low bg-risk-low/10 border-risk-low/20',
  BRIDGE_DAMAGE: 'text-risk-high bg-risk-high/10 border-risk-high/20',
  OTHER: 'text-text-muted bg-surface-3 border-border',
};

const categoryLabels: Record<ReportCategory, string> = {
  ROAD_BLOCKED: 'Road Blocked',
  LANDSLIDE: 'Landslide',
  FLOOD: 'Flood',
  HEAVY_RAIN: 'Heavy Rain',
  SNOW: 'Snow',
  POOR_VISIBILITY: 'Poor Visibility',
  TRAFFIC: 'Traffic',
  ACCIDENT: 'Accident',
  ROAD_CLEAR: 'Road Clear',
  BRIDGE_DAMAGE: 'Bridge Damage',
  OTHER: 'Other',
};

function CommunityReportCard({ report, journeyId }: { report: CommunityReportData; journeyId: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(report.confirmationCount);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (loading || confirmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/reports/${report.id}/confirm`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setConfirmed(true);
        setConfirmCount(data.data.confirmationCount);
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  return (
    <div className="glass-card rounded-xl p-4 hover:border-accent/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent shrink-0">
            {report.userName?.[0] || 'T'}
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary">{report.userName || 'Traveler'}</div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              {report.locationName && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {report.locationName}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> {formatRelativeTime(new Date(report.createdAt))}
              </span>
            </div>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${categoryColors[report.category]}`}>
          {categoryLabels[report.category]}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-text-secondary leading-relaxed mb-3">"{report.content}"</p>

      {/* Actions */}
      <div className="flex items-center gap-4 text-xs">
        <button
          onClick={handleConfirm}
          disabled={loading || confirmed}
          className={`flex items-center gap-1.5 transition-colors ${
            confirmed ? 'text-risk-low' : 'text-text-muted hover:text-risk-low'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {confirmCount} confirmed
        </button>
        <div className="flex items-center gap-1.5 text-text-muted">
          <ThumbsUp className="w-3.5 h-3.5" />
          {report.usefulCount} useful
        </div>
        <div className="ml-auto">
          {report.verificationStatus === 'CONFIRMED' ? (
            <span className="text-risk-low flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" /> Confirmed
            </span>
          ) : report.verificationStatus === 'REPORTED' ? (
            <span className="text-text-muted flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Reported
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CommunityFeed({ reports, journeyId, isLoading }: CommunityFeedProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-28 rounded-xl" />
        <div className="skeleton h-28 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-accent" />
        Community Intelligence
        {reports.length > 0 && (
          <span className="ml-auto text-xs bg-surface-2 text-text-muted border border-border rounded-full px-2 py-0.5">
            {reports.length} reports
          </span>
        )}
      </h3>

      {reports.length === 0 ? (
        <div className="text-sm text-text-muted bg-surface-2 border border-border rounded-xl px-4 py-3">
          No community reports along this route yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.slice(0, 5).map((report) => (
            <CommunityReportCard key={report.id} report={report} journeyId={journeyId} />
          ))}
          {reports.length > 5 && (
            <button className="w-full text-xs text-accent hover:text-accent-hover py-2 transition-colors">
              View {reports.length - 5} more reports →
            </button>
          )}
        </div>
      )}

      <div className="mt-4 text-[11px] text-text-muted border-t border-border pt-3">
        Community reports are evaluated against official data. Confidence levels are assigned based on verification status and confirmation count.
      </div>
    </motion.div>
  );
}
