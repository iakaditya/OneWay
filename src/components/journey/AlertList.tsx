'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, AlertOctagon, Bell, CheckCircle, Clock, MapPin, ExternalLink } from 'lucide-react';
import { OfficialAlert, RiskLevel } from '@/types';
import { getRiskColor, getRiskBgColor, formatRelativeTime } from '@/lib/utils';

interface AlertListProps {
  alerts: OfficialAlert[];
  isLoading?: boolean;
}

const AlertIcon = ({ severity }: { severity: RiskLevel }) => {
  switch (severity) {
    case 'CRITICAL': return <AlertOctagon className="w-5 h-5 text-risk-critical" />;
    case 'HIGH': return <AlertTriangle className="w-5 h-5 text-risk-high" />;
    case 'MODERATE': return <Bell className="w-5 h-5 text-risk-moderate" />;
    default: return <Bell className="w-5 h-5 text-text-muted" />;
  }
};

export default function AlertList({ alerts, isLoading }: AlertListProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Bell className="w-4 h-4 text-accent" />
        Active Alerts
        {alerts.length > 0 && (
          <span className="ml-auto text-xs bg-risk-high/10 text-risk-high border border-risk-high/20 rounded-full px-2 py-0.5 font-bold">
            {alerts.length}
          </span>
        )}
      </h3>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-risk-low bg-risk-low/10 border border-risk-low/20 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          No major active alerts currently affecting your route.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${getRiskBgColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <AlertIcon severity={alert.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold ${getRiskColor(alert.severity)}`}>
                      {alert.title}
                    </h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskBgColor(alert.severity)} ${getRiskColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{alert.description}</p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.affectedArea}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(new Date(alert.issuedAt))}
                    </div>
                    <span className="text-text-muted">{alert.issuer}</span>
                  </div>

                  {alert.actionRequired && (
                    <div className="mt-2 text-xs font-medium text-text-primary bg-surface-2/50 rounded-lg px-3 py-2 border border-border/50">
                      ⚡ {alert.actionRequired}
                    </div>
                  )}

                  {alert.url && (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover mt-2 transition-colors"
                    >
                      Official source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
