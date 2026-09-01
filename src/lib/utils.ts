import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, ConfidenceLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW': return 'text-green-400';
    case 'MODERATE': return 'text-amber-400';
    case 'HIGH': return 'text-red-400';
    case 'CRITICAL': return 'text-red-600';
    default: return 'text-gray-400';
  }
}

export function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW': return 'bg-green-500/10 border-green-500/30';
    case 'MODERATE': return 'bg-amber-500/10 border-amber-500/30';
    case 'HIGH': return 'bg-red-500/10 border-red-500/30';
    case 'CRITICAL': return 'bg-red-900/20 border-red-600/50';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW': return 'Low Risk';
    case 'MODERATE': return 'Moderate Risk';
    case 'HIGH': return 'High Risk';
    case 'CRITICAL': return 'Critical Risk';
    default: return 'Unknown';
  }
}

export function getRiskDotColor(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
    default: return '#6b7280';
  }
}

export function getConfidenceLabel(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case 'LOW': return 'Unconfirmed';
    case 'MEDIUM': return 'Reported';
    case 'HIGH': return 'Likely';
    case 'VERIFIED': return 'Verified';
    default: return 'Unknown';
  }
}

export function getConfidenceColor(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case 'LOW': return 'text-gray-400';
    case 'MEDIUM': return 'text-amber-400';
    case 'HIGH': return 'text-blue-400';
    case 'VERIFIED': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export function isDataStale(fetchedAt: Date, maxAgeMinutes: number = 30): boolean {
  const now = new Date();
  const diffMs = now.getTime() - new Date(fetchedAt).getTime();
  return diffMs > maxAgeMinutes * 60 * 1000;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
