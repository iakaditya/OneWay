// ============================================================
// NEWS PROVIDER — GNews API (free tier: 100 requests/day)
// https://gnews.io — get free key at gnews.io
//
// ALERT PROVIDER — adapter boundary for NDMA/IMD feeds
// ============================================================
import { NewsItem, Coordinates, OfficialAlert } from '@/types';

export interface NewsProvider {
  getJourneyNews(origin: string, destination: string, waypoints?: string[]): Promise<NewsItem[]>;
}

const TRAVEL_KEYWORDS = [
  'road', 'highway', 'traffic', 'blocked', 'flood', 'landslide',
  'accident', 'closure', 'disruption', 'weather', 'rain', 'snow',
  'alert', 'warning', 'travel', 'route', 'bridge',
];

function computeRelevance(title: string, description: string, locationKeywords: string[]): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;
  for (const kw of TRAVEL_KEYWORDS) {
    if (text.includes(kw)) score += 0.08;
  }
  for (const kw of locationKeywords) {
    if (text.includes(kw.toLowerCase())) score += 0.18;
  }
  return Math.min(score, 1);
}

export class GNewsProvider implements NewsProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GNEWS_API_KEY || '';
  }

  async getJourneyNews(
    origin: string,
    destination: string,
    waypoints: string[] = []
  ): Promise<NewsItem[]> {
    const locations = [origin, destination, ...waypoints];
    const locationKeywords = locations.map((l) => l.split(',')[0].trim().toLowerCase());

    if (!this.apiKey) return [];

    // GNews free query
    const query = `${origin.split(',')[0]} OR ${destination.split(',')[0]} road OR traffic OR flood OR weather`;
    try {
      const url =
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}` +
        `&lang=en&country=in&max=10&apikey=${this.apiKey}`;

      const res = await fetch(url, { next: { revalidate: 900 } });
      if (!res.ok) return [];
      const data = await res.json();

      return (data.articles || [])
        .map((article: {
          title: string;
          description: string;
          url: string;
          source: { name: string };
          publishedAt: string;
          image?: string;
        }, index: number): NewsItem => {
          const relevance = computeRelevance(
            article.title || '',
            article.description || '',
            locationKeywords
          );
          return {
            id: `gnews_${index}`,
            title: article.title || 'Untitled',
            summary: article.description || '',
            url: article.url,
            source: article.source?.name || 'GNews',
            publishedAt: new Date(article.publishedAt),
            relevanceScore: relevance,
            affectsRoute: relevance > 0.4,
          };
        })
        .filter((item: NewsItem) => item.relevanceScore > 0.15)
        .sort((a: NewsItem, b: NewsItem) => b.relevanceScore - a.relevanceScore)
        .slice(0, 6);
    } catch {
      return [];
    }
  }
}

// ---- Alert Provider (stub — ready for real government APIs) ----
// Production integrations:
// - NDMA: https://ndma.gov.in/Natural-Hazard-Management/Natural-Disasters
// - IMD:  https://mausam.imd.gov.in
// - NRSC: https://bhuvan.nrsc.gov.in
export interface AlertProvider {
  getOfficialAlerts(coords: Coordinates, radiusKm?: number): Promise<OfficialAlert[]>;
}

export class StubAlertProvider implements AlertProvider {
  async getOfficialAlerts(coords: Coordinates, radiusKm: number = 50): Promise<OfficialAlert[]> {
    void coords;
    void radiusKm;
    return [];
  }
}
