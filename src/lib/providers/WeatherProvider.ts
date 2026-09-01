// ============================================================
// WEATHER PROVIDER — OpenWeatherMap
// Requirements: OPENWEATHER_API_KEY
// No fake data fallbacks as per requirements.
// ============================================================
import { WeatherData, WeatherForecast, Coordinates, RiskLevel } from '@/types';

export interface WeatherProvider {
  getCurrentWeather(coords: Coordinates): Promise<WeatherData>;
  getForecast(coords: Coordinates, days?: number): Promise<WeatherForecast>;
  getWeatherAlongRoute(waypoints: Coordinates[]): Promise<WeatherData[]>;
}

export class OpenWeatherMapProvider implements WeatherProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  private checkConfig() {
    if (!this.apiKey) {
      throw new Error('MISSING_CONFIG: OPENWEATHER_API_KEY is not set.');
    }
  }

  private mapConditionCode(id: number): string {
    if (id >= 200 && id < 300) return 'thunderstorm';
    if (id >= 300 && id < 600) return 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'fog';
    if (id === 800) return 'clear';
    if (id > 800) return 'cloudy';
    return 'unknown';
  }

  private isExtremeWeather(id: number): boolean {
    // Severe thunderstorms, heavy snow, extreme conditions
    return (id >= 210 && id <= 212) || id === 232 || id === 504 || (id >= 601 && id <= 622) || id === 781;
  }

  async getCurrentWeather(coords: Coordinates): Promise<WeatherData> {
    this.checkConfig();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${this.apiKey}&units=metric`;
    
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();

    if (data.cod !== 200) {
      throw new Error(`OpenWeatherMap error: ${data.message}`);
    }

    const weather = data.weather[0];
    return {
      location: data.name || `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}`,
      coordinates: coords,
      timestamp: new Date(data.dt * 1000),
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
      windSpeed: data.wind.speed * 3.6, // m/s to km/h
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // m to km
      humidity: data.main.humidity,
      condition: weather.main,
      conditionCode: this.mapConditionCode(weather.id),
      isExtreme: this.isExtremeWeather(weather.id),
      alerts: [],
    };
  }

  async getForecast(coords: Coordinates, days: number = 3): Promise<WeatherForecast> {
    this.checkConfig();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${this.apiKey}&units=metric`;
    
    const res = await fetch(url, { next: { revalidate: 1800 } });
    const data = await res.json();

    if (data.cod !== '200') {
      throw new Error(`OpenWeatherMap forecast error: ${data.message}`);
    }

    const hourly = data.list.slice(0, 24).map((item: any): WeatherData => ({
      location: data.city.name,
      coordinates: coords,
      timestamp: new Date(item.dt * 1000),
      temperature: item.main.temp,
      precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
      windSpeed: item.wind.speed * 3.6,
      visibility: item.visibility / 1000,
      condition: item.weather[0].main,
      conditionCode: this.mapConditionCode(item.weather[0].id),
      isExtreme: this.isExtremeWeather(item.weather[0].id),
    }));

    return {
      location: data.city.name,
      coordinates: coords,
      hourly,
      daily: [],
    };
  }

  async getWeatherAlongRoute(waypoints: Coordinates[]): Promise<WeatherData[]> {
    this.checkConfig();
    const sampled = waypoints.filter((_, i) => i % Math.max(1, Math.floor(waypoints.length / 5)) === 0).slice(0, 5);
    const results = await Promise.allSettled(sampled.map((wp) => this.getCurrentWeather(wp)));
    return results
      .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === 'fulfilled')
      .map((r) => r.value);
  }
}

export function getRiskFromWeather(weather: WeatherData): RiskLevel {
  if (weather.conditionCode === 'thunderstorm') return 'CRITICAL';
  if (weather.isExtreme) return 'HIGH';
  if ((weather.precipitation ?? 0) > 5) return 'HIGH';
  if ((weather.precipitation ?? 0) > 2) return 'MODERATE';
  if ((weather.visibility ?? 10) < 1) return 'CRITICAL';
  if ((weather.visibility ?? 10) < 3) return 'HIGH';
  if ((weather.visibility ?? 10) < 6) return 'MODERATE';
  if ((weather.windSpeed ?? 0) > 80) return 'CRITICAL';
  if ((weather.windSpeed ?? 0) > 50) return 'HIGH';
  return 'LOW';
}
