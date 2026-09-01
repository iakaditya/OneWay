// ============================================================
// ONEWAY — Core Type Definitions
// ============================================================

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';
export type HazardType =
  | 'LANDSLIDE'
  | 'FLOOD'
  | 'HEAVY_RAIN'
  | 'SNOW'
  | 'LOW_VISIBILITY'
  | 'ROAD_CLOSURE'
  | 'ACCIDENT'
  | 'TRAFFIC'
  | 'BRIDGE_DAMAGE'
  | 'ROCKFALL'
  | 'FOG'
  | 'STRONG_WINDS'
  | 'OTHER';

export type ReportCategory =
  | 'ROAD_BLOCKED'
  | 'LANDSLIDE'
  | 'FLOOD'
  | 'HEAVY_RAIN'
  | 'SNOW'
  | 'POOR_VISIBILITY'
  | 'TRAFFIC'
  | 'ACCIDENT'
  | 'ROAD_CLEAR'
  | 'BRIDGE_DAMAGE'
  | 'OTHER';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'REPORTED'
  | 'CONFIRMED'
  | 'DISPUTED'
  | 'RESOLVED';

// ============================================================
// NORMALIZED DATA INTERFACES (provider-agnostic)
// ============================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WeatherData {
  location: string;
  coordinates: Coordinates;
  timestamp: Date;
  temperature?: number;        // Celsius
  feelsLike?: number;
  precipitation?: number;      // mm/hour
  precipitationProbability?: number; // 0-1
  windSpeed?: number;          // km/h
  windDirection?: number;      // degrees
  visibility?: number;         // km
  humidity?: number;           // percentage
  condition: string;           // human-readable
  conditionCode: string;       // normalized code
  isExtreme: boolean;
  alerts?: WeatherAlert[];
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: RiskLevel;
  startTime: Date;
  endTime?: Date;
  source: string;
}

export interface WeatherForecast {
  location: string;
  coordinates: Coordinates;
  hourly: WeatherData[];
  daily: DailyForecast[];
}

export interface DailyForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  precipitation: number;
  condition: string;
  conditionCode: string;
}

export interface RoutePoint {
  coordinates: Coordinates;
  name?: string;
  distanceFromOrigin?: number; // meters
}

export interface RouteData {
  id: string;
  isPrimary: boolean;
  distance: number;            // meters
  duration: number;            // seconds
  summary: string;             // "via NH-3"
  geometry: GeoJSONLineString;
  waypoints: RoutePoint[];
  steps?: RouteStep[];
  warnings?: string[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface TrafficData {
  routeId: string;
  overallDelay: number;        // minutes
  congestionLevel: 'FREE' | 'LIGHT' | 'MODERATE' | 'HEAVY' | 'STANDSTILL';
  incidents: TrafficIncident[];
  updatedAt: Date;
}

export interface TrafficIncident {
  type: 'ACCIDENT' | 'CONGESTION' | 'ROAD_WORK' | 'CLOSURE' | 'OTHER';
  location: Coordinates;
  description: string;
  severity: RiskLevel;
  delay?: number;              // minutes
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  relevanceScore: number;      // 0-1 how relevant to the journey
  affectsRoute: boolean;
  location?: string;
  coordinates?: Coordinates;
}

export interface OfficialAlert {
  id: string;
  title: string;
  description: string;
  alertType: HazardType;
  severity: RiskLevel;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  affectedArea: string;
  coordinates?: Coordinates;
  radius?: number;             // km radius of effect
  actionRequired?: string;
  url?: string;
}

export interface NormalizedHazard {
  id: string;
  type: HazardType;
  severity: RiskLevel;
  coordinates: Coordinates;
  description: string;
  source: string;
  confidence: ConfidenceLevel;
  reportedAt: Date;
  distanceFromRoute?: number;
  potentialImpact: string;
}

export interface CommunityReportData {
  id: string;
  userId?: string;
  userName?: string;
  userImage?: string;
  coordinates: Coordinates;
  locationName?: string;
  category: ReportCategory;
  content: string;
  imageUrl?: string;
  verificationStatus: VerificationStatus;
  confirmationCount: number;
  usefulCount: number;
  createdAt: Date;
  distanceFromRoute?: number;
}

export interface HistoricalPattern {
  location: string;
  coordinates: Coordinates;
  incidentType: HazardType;
  frequency: number;           // incidents per year
  lastOccurred?: Date;
  seasonality?: string[];      // months most common
  weatherCorrelation?: string;
  description: string;
  severity: RiskLevel;
}

// ============================================================
// RISK ENGINE TYPES
// ============================================================

export interface RiskFactors {
  weather: RiskLevel;
  road: RiskLevel;
  hazard: RiskLevel;
  alert: RiskLevel;
  traffic: RiskLevel;
  community: RiskLevel;
  historical: RiskLevel;
}

export interface RiskScore {
  overall: RiskLevel;
  score: number;               // 0-100
  factors: RiskFactors;
  primaryReasons: string[];
  confidence: ConfidenceLevel;
}

// ============================================================
// JOURNEY ANALYSIS TYPES
// ============================================================

export interface JourneyContext {
  journey: {
    origin: string;
    destination: string;
    originCoords: Coordinates;
    destinationCoords: Coordinates;
    travelDate: Date;
    distance: number;
    duration: number;
  };
  weather: WeatherData[];
  forecasts: WeatherForecast[];
  routes: RouteData[];
  traffic: TrafficData[];
  hazards: NormalizedHazard[];
  alerts: OfficialAlert[];
  news: NewsItem[];
  communityReports: CommunityReportData[];
  historicalPatterns: HistoricalPattern[];
  riskScore: RiskScore;
}

export interface JourneyAnalysisResult {
  journeyId: string;
  overallRisk: RiskLevel;
  summary: string;
  recommendation: string;
  keyFindings: string[];
  confidence: number;          // 0-1
  riskFactors: RiskFactors;
  alternativeRecommended: boolean;
  alternativeReason?: string;
  generatedAt: Date;
  expiresAt: Date;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface JourneyCreateInput {
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  travelDate: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIChatRequest {
  journeyId: string;
  message: string;
  history: ChatMessage[];
}
