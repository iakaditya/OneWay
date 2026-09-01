'use client';

import { motion } from 'framer-motion';
import { Cloud, Route, Eye, Mountain, Droplets, Car, Users, Clock } from 'lucide-react';
import { RiskLevel, WeatherData } from '@/types';
import { getRiskColor, getRiskBgColor, getRiskLabel } from '@/lib/utils';

interface ConditionItem {
  label: string;
  value: string;
  risk: RiskLevel;
  icon: React.ElementType;
  detail?: string;
}

interface ConditionsGridProps {
  weather?: WeatherData;
  roadRisk?: RiskLevel;
  hazardRisk?: RiskLevel;
  trafficRisk?: RiskLevel;
  communityActivity?: string;
  lastUpdated?: Date;
  isLoading?: boolean;
}

function buildConditions(props: ConditionsGridProps): ConditionItem[] {
  const w = props.weather;
  return [
    {
      label: 'Weather',
      value: w?.condition || 'Loading…',
      risk: w?.isExtreme ? 'HIGH' : w?.conditionCode === 'rain' ? 'MODERATE' : 'LOW',
      icon: Cloud,
      detail: w?.temperature ? `${w.temperature.toFixed(1)}°C` : undefined,
    },
    {
      label: 'Road',
      value: getRiskLabel(props.roadRisk || 'LOW'),
      risk: props.roadRisk || 'LOW',
      icon: Route,
    },
    {
      label: 'Visibility',
      value: w?.visibility ? `${w.visibility.toFixed(1)}km` : 'Unknown',
      risk: !w?.visibility ? 'LOW' : w.visibility < 1 ? 'CRITICAL' : w.visibility < 3 ? 'HIGH' : w.visibility < 6 ? 'MODERATE' : 'LOW',
      icon: Eye,
    },
    {
      label: 'Landslide Risk',
      value: getRiskLabel(props.hazardRisk || 'LOW'),
      risk: props.hazardRisk || 'LOW',
      icon: Mountain,
    },
    {
      label: 'Flood Risk',
      value: w?.precipitation && w.precipitation > 3 ? 'Elevated' : 'Low',
      risk: w?.precipitation && w.precipitation > 5 ? 'HIGH' : w?.precipitation && w.precipitation > 2 ? 'MODERATE' : 'LOW',
      icon: Droplets,
      detail: w?.precipitation ? `${w.precipitation.toFixed(1)}mm/h` : undefined,
    },
    {
      label: 'Traffic',
      value: getRiskLabel(props.trafficRisk || 'LOW'),
      risk: props.trafficRisk || 'LOW',
      icon: Car,
    },
    {
      label: 'Community',
      value: props.communityActivity || 'Monitoring',
      risk: 'LOW',
      icon: Users,
    },
    {
      label: 'Wind',
      value: w?.windSpeed ? `${w.windSpeed.toFixed(0)} km/h` : 'Unknown',
      risk: !w?.windSpeed ? 'LOW' : w.windSpeed > 70 ? 'CRITICAL' : w.windSpeed > 45 ? 'HIGH' : w.windSpeed > 25 ? 'MODERATE' : 'LOW',
      icon: Cloud,
    },
  ];
}

export default function ConditionsGrid({
  weather,
  roadRisk,
  hazardRisk,
  trafficRisk,
  communityActivity,
  lastUpdated,
  isLoading,
}: ConditionsGridProps) {
  const conditions = buildConditions({ weather, roadRisk, hazardRisk, trafficRisk, communityActivity });

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Current Conditions</h3>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            Updated {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
              -Math.round((Date.now() - new Date(lastUpdated).getTime()) / 60000), 'minute'
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {conditions.map((condition, index) => (
          <motion.div
            key={condition.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-xl p-4 border ${getRiskBgColor(condition.risk)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <condition.icon className={`w-4 h-4 ${getRiskColor(condition.risk)}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide ${getRiskColor(condition.risk)}`}>
                {condition.risk.slice(0, 3)}
              </span>
            </div>
            <div className="text-sm font-semibold text-text-primary leading-tight">{condition.value}</div>
            <div className="text-[11px] text-text-muted mt-1">{condition.label}</div>
            {condition.detail && (
              <div className="text-[11px] text-text-muted">{condition.detail}</div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
