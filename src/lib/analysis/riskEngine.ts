// ============================================================
// TRANSPARENT RISK ENGINE
// Weighted scoring with full factor breakdown
// ============================================================
import {
  RiskLevel,
  RiskScore,
  RiskFactors,
  WeatherData,
  NormalizedHazard,
  OfficialAlert,
  CommunityReportData,
  HistoricalPattern,
  TrafficData,
  ConfidenceLevel,
} from '@/types';

// ---- Risk level numeric values ----
const RISK_VALUES: Record<RiskLevel, number> = {
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const VALUE_TO_RISK: Record<number, RiskLevel> = {
  1: 'LOW',
  2: 'MODERATE',
  3: 'HIGH',
  4: 'CRITICAL',
};

function clampRisk(value: number): RiskLevel {
  const clamped = Math.max(1, Math.min(4, Math.round(value)));
  return VALUE_TO_RISK[clamped];
}

// ---- Individual factor scorers ----
export function scoreWeatherRisk(weatherPoints: WeatherData[]): RiskLevel {
  if (!weatherPoints.length) return 'LOW';
  const scores = weatherPoints.map((w) => {
    if (w.conditionCode === 'thunderstorm' || w.conditionCode === 'tornado') return 4;
    if (w.isExtreme) return 3;
    if ((w.precipitation || 0) > 8 || (w.visibility || 10) < 0.5) return 4;
    if ((w.precipitation || 0) > 4 || (w.visibility || 10) < 2) return 3;
    if ((w.precipitation || 0) > 1.5 || (w.visibility || 10) < 5) return 2;
    if ((w.windSpeed || 0) > 70) return 4;
    if ((w.windSpeed || 0) > 45) return 3;
    return 1;
  });
  const max = Math.max(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return clampRisk(max * 0.6 + avg * 0.4);
}

export function scoreHazardRisk(hazards: NormalizedHazard[]): RiskLevel {
  if (!hazards.length) return 'LOW';
  const active = hazards.filter((h) => {
    const confidence = h.confidence;
    return confidence === 'HIGH' || confidence === 'VERIFIED' || confidence === 'MEDIUM';
  });
  if (!active.length) return 'LOW';

  const critical = active.filter((h) => h.severity === 'CRITICAL');
  const high = active.filter((h) => h.severity === 'HIGH');
  const moderate = active.filter((h) => h.severity === 'MODERATE');

  if (critical.length > 0) return 'CRITICAL';
  if (high.length > 0) return 'HIGH';
  if (moderate.length > 1) return 'HIGH';
  if (moderate.length === 1) return 'MODERATE';
  return 'LOW';
}

export function scoreAlertRisk(alerts: OfficialAlert[]): RiskLevel {
  if (!alerts.length) return 'LOW';
  const severities = alerts.map((a) => RISK_VALUES[a.severity]);
  return clampRisk(Math.max(...severities) * 0.8 + (severities.reduce((a, b) => a + b, 0) / severities.length) * 0.2);
}

export function scoreCommunityRisk(reports: CommunityReportData[]): RiskLevel {
  if (!reports.length) return 'LOW';
  const dangerous = reports.filter((r) =>
    ['ROAD_BLOCKED', 'LANDSLIDE', 'FLOOD', 'ACCIDENT'].includes(r.category)
  );
  const confirmed = dangerous.filter((r) =>
    r.verificationStatus === 'CONFIRMED' || r.confirmationCount > 2
  );

  if (confirmed.length >= 3) return 'HIGH';
  if (confirmed.length >= 1) return 'MODERATE';
  if (dangerous.length >= 3) return 'MODERATE';
  return 'LOW';
}

export function scoreTrafficRisk(traffic: TrafficData[]): RiskLevel {
  if (!traffic.length) return 'LOW';
  const levels: Record<string, number> = {
    FREE: 1, LIGHT: 1, MODERATE: 2, HEAVY: 3, STANDSTILL: 4,
  };
  const scores = traffic.map((t) => levels[t.congestionLevel] || 1);
  return clampRisk(Math.max(...scores));
}

export function scoreHistoricalRisk(patterns: HistoricalPattern[]): RiskLevel {
  if (!patterns.length) return 'LOW';
  const high = patterns.filter((p) => p.severity === 'HIGH' || p.severity === 'CRITICAL');
  const moderate = patterns.filter((p) => p.severity === 'MODERATE');

  if (high.length > 0) return 'MODERATE'; // Historical is a signal, not certainty
  if (moderate.length > 1) return 'MODERATE';
  return 'LOW';
}

export function scoreRoadRisk(
  hazards: NormalizedHazard[],
  traffic: TrafficData[]
): RiskLevel {
  const roadHazards = hazards.filter((h) =>
    ['ROAD_CLOSURE', 'BRIDGE_DAMAGE', 'ROCKFALL', 'ACCIDENT'].includes(h.type)
  );
  const hazardScore = roadHazards.length > 0
    ? Math.max(...roadHazards.map((h) => RISK_VALUES[h.severity]))
    : 1;
  const trafficScore = RISK_VALUES[scoreTrafficRisk(traffic)];
  return clampRisk(hazardScore * 0.7 + trafficScore * 0.3);
}

// ---- PRIMARY RISK SCORING FUNCTION ----
export function calculateRiskScore(inputs: {
  weatherPoints: WeatherData[];
  hazards: NormalizedHazard[];
  alerts: OfficialAlert[];
  communityReports: CommunityReportData[];
  historicalPatterns: HistoricalPattern[];
  traffic: TrafficData[];
}): RiskScore {
  const { weatherPoints, hazards, alerts, communityReports, historicalPatterns, traffic } = inputs;

  const factors: RiskFactors = {
    weather: scoreWeatherRisk(weatherPoints),
    road: scoreRoadRisk(hazards, traffic),
    hazard: scoreHazardRisk(hazards),
    alert: scoreAlertRisk(alerts),
    traffic: scoreTrafficRisk(traffic),
    community: scoreCommunityRisk(communityReports),
    historical: scoreHistoricalRisk(historicalPatterns),
  };

  // Weighted combination (must sum to 1.0)
  const weights = {
    weather: 0.25,
    hazard: 0.25,
    road: 0.15,
    alert: 0.15,
    traffic: 0.08,
    community: 0.07,
    historical: 0.05,
  };

  const weightedScore =
    RISK_VALUES[factors.weather] * weights.weather +
    RISK_VALUES[factors.hazard] * weights.hazard +
    RISK_VALUES[factors.road] * weights.road +
    RISK_VALUES[factors.alert] * weights.alert +
    RISK_VALUES[factors.traffic] * weights.traffic +
    RISK_VALUES[factors.community] * weights.community +
    RISK_VALUES[factors.historical] * weights.historical;

  const overall = clampRisk(weightedScore);
  const score = Math.round(((weightedScore - 1) / 3) * 100);

  // Build primary reasons
  const primaryReasons: string[] = [];
  if (factors.hazard === 'HIGH' || factors.hazard === 'CRITICAL') {
    primaryReasons.push(`Active ${factors.hazard.toLowerCase()} hazards detected along route`);
  }
  if (factors.weather === 'HIGH' || factors.weather === 'CRITICAL') {
    primaryReasons.push(`Severe weather conditions affecting route sections`);
  }
  if (factors.alert === 'HIGH' || factors.alert === 'CRITICAL') {
    primaryReasons.push(`Official warnings issued for affected areas`);
  }
  if (factors.traffic === 'HIGH' || factors.traffic === 'CRITICAL') {
    primaryReasons.push(`Heavy traffic or road incidents reported`);
  }
  if (factors.community === 'HIGH') {
    primaryReasons.push(`Multiple confirmed community reports of disruption`);
  }

  if (primaryReasons.length === 0) {
    primaryReasons.push('Conditions appear manageable based on available data');
  }

  // Confidence based on data availability
  const hasLiveData = weatherPoints.length > 0 || alerts.length > 0;
  const hasCommunityData = communityReports.length > 0;
  let confidence: ConfidenceLevel = 'LOW';
  if (hasLiveData && hasCommunityData) confidence = 'HIGH';
  else if (hasLiveData || hasCommunityData) confidence = 'MEDIUM';

  return { overall, score, factors, primaryReasons, confidence };
}

export function shouldRecommendAlternative(risk: RiskScore): boolean {
  return risk.overall === 'HIGH' || risk.overall === 'CRITICAL';
}
