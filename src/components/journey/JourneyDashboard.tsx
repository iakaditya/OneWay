'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, Bookmark, Check, CheckCircle2, ChevronRight, CloudRain,
  Compass, ExternalLink, FileText, Heart, Info, Loader2, Map, MapPin, Menu, MessageCircle,
  Navigation, RefreshCw, Route as RouteIcon, Save, Send, Settings, ShieldCheck, Sparkles,
  Users, X, Zap,
} from 'lucide-react';
import type { DashboardData } from '@/lib/intelligence/dashboard';
import { formatDistance, formatDuration, formatRelativeTime } from '@/lib/utils';
import type { RiskLevel } from '@/types';

type Tab = 'Overview' | 'Live Map' | 'Alerts' | 'Weather' | 'Road Conditions' | 'Community' | 'News & Updates' | 'OneWay AI' | 'Saved Journeys' | 'Settings';
type Report = { id: string; lat?: number; lng?: number; coordinates?: { lat: number; lng: number }; content?: string; description?: string; category?: string; usefulCount?: number; confirmationCount?: number; verificationStatus?: string; severity?: string; locationName?: string };

const tabs: Array<{ label: Tab; icon: typeof Map }> = [
  { label: 'Overview', icon: Compass },
  { label: 'Live Map', icon: Map },
  { label: 'Alerts', icon: AlertTriangle },
  { label: 'Weather', icon: CloudRain },
  { label: 'Road Conditions', icon: RouteIcon },
  { label: 'Community', icon: Users },
  { label: 'News & Updates', icon: FileText },
  { label: 'OneWay AI', icon: Sparkles },
  { label: 'Saved Journeys', icon: Bookmark },
  { label: 'Settings', icon: Settings },
];

const riskClasses: Record<RiskLevel | string, string> = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  MODERATE: 'bg-amber-50 text-amber-700 border-amber-100',
  HIGH: 'bg-red-50 text-red-700 border-red-100',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
};

function jsonDate(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? 'Unknown time' : formatRelativeTime(date);
}

function formatDate(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function RiskBadge({ risk }: { risk?: string }) {
  const value = risk || 'UNKNOWN';
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${riskClasses[value] || 'bg-slate-50 text-slate-600 border-slate-200'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{value}</span>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${className}`}>{children}</section>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><Info className="mx-auto mb-3 h-6 w-6 text-slate-400" /><p className="font-semibold text-slate-800">{title}</p><p className="mt-1 text-sm text-slate-500">{body}</p></div>;
}

function RouteMap({ dashboard, onSelect }: { dashboard: DashboardData; onSelect: (item: Report | null) => void }) {
  const points = dashboard.routes.flatMap((route) => route.geometry.coordinates);
  const minLng = Math.min(...points.map((point) => point[0]), dashboard.journey.originLng);
  const maxLng = Math.max(...points.map((point) => point[0]), dashboard.journey.destinationLng);
  const minLat = Math.min(...points.map((point) => point[1]), dashboard.journey.originLat);
  const maxLat = Math.max(...points.map((point) => point[1]), dashboard.journey.destinationLat);
  const toPoint = (lng: number, lat: number) => ({ x: 8 + ((lng - minLng) / Math.max(maxLng - minLng, 0.01)) * 84, y: 90 - ((lat - minLat) / Math.max(maxLat - minLat, 0.01)) * 78 });
  const primary = dashboard.routes.find((route) => route.isPrimary);
  const reports = [...dashboard.hazards, ...dashboard.communityReports] as Report[];

  return <div className="relative min-h-[480px] overflow-hidden rounded-3xl border border-slate-200 bg-[#eef3ee]">
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#d4dfd6 1px, transparent 1px), linear-gradient(90deg, #d4dfd6 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full p-10">
      {dashboard.routes.filter((route) => !route.isPrimary).map((route) => <polyline key={route.id} points={route.geometry.coordinates.map(([lng, lat]) => { const point = toPoint(lng, lat); return `${point.x},${point.y}`; }).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />)}
      {primary && <polyline points={primary.geometry.coordinates.map(([lng, lat]) => { const point = toPoint(lng, lat); return `${point.x},${point.y}`; }).join(' ')} fill="none" stroke="#245c45" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />}
    </svg>
    <div className="absolute left-5 top-5 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#245c45]" />Recommended route</div>
    <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-3 py-2 text-xs text-slate-500 shadow-sm backdrop-blur">Click a marker to inspect its journey impact.</div>
    {(() => { const point = toPoint(dashboard.journey.originLng, dashboard.journey.originLat); return <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#245c45] p-2 text-white shadow-lg" style={{ left: `${point.x}%`, top: `${point.y}%` }}><Navigation className="h-3 w-3" /></div>; })()}
    {(() => { const point = toPoint(dashboard.journey.destinationLng, dashboard.journey.destinationLat); return <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-slate-800 p-2 text-white shadow-lg" style={{ left: `${point.x}%`, top: `${point.y}%` }}><MapPin className="h-3 w-3" /></div>; })()}
    {reports.map((item) => { const lat = item.lat ?? (item as unknown as { coordinates?: { lat: number } }).coordinates?.lat; const lng = item.lng ?? (item as unknown as { coordinates?: { lng: number } }).coordinates?.lng; if (lat === undefined || lng === undefined) return null; const point = toPoint(lng, lat); return <button key={String(item.id)} onClick={() => onSelect(item)} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-500 p-2 text-white shadow-lg transition hover:scale-110" style={{ left: `${point.x}%`, top: `${point.y}%` }} title="Open journey update"><AlertTriangle className="h-3 w-3" /></button>; })}
  </div>;
}

export default function JourneyDashboard({ journeyId }: { journeyId: string }) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [selectedItem, setSelectedItem] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [post, setPost] = useState({ content: '', category: 'ROAD_UPDATE', locationName: '' });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedJourneys, setSavedJourneys] = useState<Array<{ id: string; journey: { id: string; origin: string; destination: string; travelDate: string; analysis?: { overallRisk: string } | null } }>>([]);

  const loadDashboard = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true); else setRefreshing(true);
    try {
      const response = await fetch(`/api/journeys/${journeyId}/dashboard`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Journey unavailable');
      setDashboard(payload.data as DashboardData);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Journey unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [journeyId]);

  useEffect(() => {
    // The effect subscribes to the server event stream; the initial fetch is part of that synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
    const source = new EventSource(`/api/journeys/${journeyId}/events`);
    source.onmessage = (event) => { try { const data = JSON.parse(event.data) as { type: string }; if (data.type !== 'HEARTBEAT' && data.type !== 'CONNECTED') void loadDashboard(true); } catch { /* ignore malformed event */ } };
    const interval = window.setInterval(() => void loadDashboard(true), 30000);
    return () => { source.close(); window.clearInterval(interval); };
  }, [journeyId, loadDashboard]);

  useEffect(() => {
    if (activeTab !== 'Saved Journeys') return;
    void fetch('/api/saved-journeys', { cache: 'no-store' }).then((response) => response.json()).then((payload) => { if (payload.success) setSavedJourneys(payload.data); }).catch(() => undefined);
  }, [activeTab]);

  async function saveJourney() {
    const response = await fetch('/api/saved-journeys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ journeyId }) });
    if (response.ok) setSaved(true);
  }

  async function publishPost(event: React.FormEvent) {
    event.preventDefault();
    if (post.content.trim().length < 5) return;
    setPosting(true);
    try {
      const response = await fetch('/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ journeyId, lat: dashboard?.journey.originLat, lng: dashboard?.journey.originLng, ...post }) });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Could not publish update');
      setPost({ content: '', category: 'ROAD_UPDATE', locationName: '' }); setComposerOpen(false); await loadDashboard(true);
    } catch (postError) { setError(postError instanceof Error ? postError.message : 'Could not publish update'); } finally { setPosting(false); }
  }

  async function confirmReport(id: string) {
    await fetch(`/api/community/posts/${id}/confirm`, { method: 'POST' });
    await loadDashboard(true);
  }

  async function askAI(message = chatInput) {
    const text = message.trim(); if (!text || chatLoading) return;
    setChatInput(''); setChatMessages((current) => [...current, { role: 'user', content: text }]); setChatLoading(true);
    try {
      const response = await fetch(`/api/journeys/${journeyId}/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ journeyId, message: text, history: chatMessages.map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text: item.content }] })) }) });
      const payload = await response.json();
      setChatMessages((current) => [...current, { role: 'assistant', content: payload.data?.response || payload.error || 'I do not have enough current information to confirm that.' }]);
    } catch { setChatMessages((current) => [...current, { role: 'assistant', content: 'Live journey analysis is temporarily unavailable. Please review the latest cards above.' }]); } finally { setChatLoading(false); }
  }

  async function updatePreference(key: string, value: boolean) {
    if (!dashboard) return;
    const preferences = { ...dashboard.journey.preferences, [key]: value };
    setDashboard({ ...dashboard, journey: { ...dashboard.journey, preferences } });
    await fetch(`/api/journeys/${journeyId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preferences }) });
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f6] text-slate-600"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Loading your journey intelligence…</div>;
  if (!dashboard) return <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f8f6] p-6 text-center"><AlertTriangle className="mb-4 h-8 w-8 text-red-500" /><h1 className="text-xl font-bold text-slate-900">Journey unavailable</h1><p className="mt-2 text-slate-500">{error || 'We could not load this journey.'}</p><Link href="/" className="mt-5 rounded-full bg-[#245c45] px-5 py-2.5 text-sm font-semibold text-white">Plan another journey</Link></div>;

  const primary = dashboard.routes.find((route) => route.isPrimary) || dashboard.routes[0];
  const analysis = dashboard.analysis;
  const risk = analysis?.overallRisk || dashboard.journey.status;
  const alerts = dashboard.alerts as Array<{ id: string; title: string; description: string; severity: string; issuer?: string; issuedAt?: string; coordinates?: { lat: number; lng: number } }>;
  const weather = dashboard.weather as Array<{ location: string; condition: string; temperature?: number; precipitation?: number; visibility?: number; windSpeed?: number; timestamp?: string; coordinates?: { lat: number; lng: number } }>;
  const reports = dashboard.communityReports as Array<{ id: string; content: string; category: string; locationName?: string; createdAt: string; usefulCount: number; confirmationCount: number; verificationStatus: string; user?: { name?: string | null } | null }>;
  const news = dashboard.news as Array<{ id: string; title: string; summary: string; source: string; publishedAt: string; url: string; affectsRoute: boolean }>;
  const segments = dashboard.routes.flatMap((route) => route.segments.map((segment) => ({ ...segment, routeSummary: route.summary })));
  const nav = (tab: Tab) => { setActiveTab(tab); setMobileNavOpen(false); };

  return <div className="flex min-h-screen bg-[#f6f8f6] text-slate-900">
    <aside className={`${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0`}>
      <div className="border-b border-slate-100 px-6 py-6"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#245c45] text-white"><Navigation className="h-5 w-5" /></span><span className="text-xl font-bold tracking-tight">OneWay</span></Link><p className="mt-2 pl-11 text-[11px] text-slate-400">Know the road before you take it.</p></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">{tabs.map(({ label, icon: Icon }) => <button key={label} onClick={() => nav(label)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${activeTab === label ? 'bg-[#e9f3ec] text-[#245c45]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon className="h-[17px] w-[17px]" />{label}{label === 'Alerts' && alerts.length > 0 && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{alerts.length}</span>}</button>)}</nav>
      <div className="m-4 rounded-2xl bg-[#f0f6f1] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#245c45]">Data confidence</p><p className="mt-2 text-sm font-semibold text-slate-800">{analysis ? `${Math.round(analysis.confidence * 100)}% based on available data` : 'Analysis pending'}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">OneWay distinguishes live provider data from community reports.</p></div>
    </aside>
    {mobileNavOpen && <button aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden" />}
    <main className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-500 lg:hidden"><Menu className="h-5 w-5" /></button><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-bold"><span className="truncate">{dashboard.journey.origin}</span><span className="text-slate-300">→</span><span className="truncate">{dashboard.journey.destination}</span></div><p className="mt-0.5 text-xs text-slate-400">{formatDate(dashboard.journey.travelDate)} · {dashboard.journey.travelMode.toLowerCase()}</p></div></div><div className="flex items-center gap-2"><button onClick={() => void loadDashboard(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50" title="Refresh data">{refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</button><button onClick={() => void saveJourney()} className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold sm:flex ${saved ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saved ? 'Saved' : 'Save journey'}</button><Link href="/" className="rounded-xl bg-[#245c45] px-3 py-2 text-xs font-bold text-white hover:bg-[#184a35]">New journey</Link></div></header>
      <div className="mx-auto max-w-[1500px] p-4 lg:p-8">
        {error && <div className="mb-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><Info className="h-4 w-4" />{error}</div>}
        {activeTab === 'Overview' && <Overview dashboard={dashboard} primary={primary} risk={risk} alerts={alerts} weather={weather} reports={reports} onMap={() => nav('Live Map')} onAlerts={() => nav('Alerts')} />}
        {activeTab === 'Live Map' && <><PageTitle title="Live map" subtitle="Every marker is tied to the current journey context." /><RouteMap dashboard={dashboard} onSelect={setSelectedItem} />{selectedItem && <Card className="mt-5"><div className="flex items-start justify-between"><div><RiskBadge risk={selectedItem.verificationStatus || (selectedItem as unknown as { severity?: string }).severity} /><h3 className="mt-2 text-lg font-bold">{selectedItem.content || (selectedItem as unknown as { description?: string }).description || 'Journey update'}</h3><p className="mt-1 text-sm text-slate-500">{selectedItem.locationName || 'Location attached to report'}</p></div><button onClick={() => setSelectedItem(null)} className="text-slate-400"><X className="h-5 w-5" /></button></div><p className="mt-4 text-sm leading-relaxed text-slate-600">This marker is included in the shared journey context and may affect the route recommendation.</p></Card>}</>}
        {activeTab === 'Alerts' && <AlertsView alerts={alerts} onMap={(item) => { setSelectedItem(item as Report); nav('Live Map'); }} />}
        {activeTab === 'Weather' && <WeatherView weather={weather} available={dashboard.dataAvailability.weather} />}
        {activeTab === 'Road Conditions' && <RoadView segments={segments} onMap={() => nav('Live Map')} />}
        {activeTab === 'Community' && <CommunityView reports={reports} composerOpen={composerOpen} setComposerOpen={setComposerOpen} post={post} setPost={setPost} posting={posting} publishPost={publishPost} confirmReport={confirmReport} />}
        {activeTab === 'News & Updates' && <NewsView news={news} available={dashboard.dataAvailability.news} />}
        {activeTab === 'OneWay AI' && <AIView messages={chatMessages} input={chatInput} setInput={setChatInput} loading={chatLoading} ask={askAI} />}
        {activeTab === 'Saved Journeys' && <SavedView journeys={savedJourneys} />}
        {activeTab === 'Settings' && <SettingsView preferences={dashboard.journey.preferences} update={updatePreference} />}
      </div>
    </main>
  </div>;
}

function PageTitle({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-6"><h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>; }

function Overview({ dashboard, primary, risk, alerts, weather, reports, onMap, onAlerts }: { dashboard: DashboardData; primary?: DashboardData['routes'][number]; risk: string; alerts: Array<{ id: string; title: string; description: string; severity: string }>; weather: Array<{ location: string; condition: string; temperature?: number; precipitation?: number; visibility?: number }>; reports: Array<{ id: string; content: string; category: string; createdAt: string; usefulCount: number; confirmationCount: number; locationName?: string }>; onMap: () => void; onAlerts: () => void }) {
  return <><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#245c45]">Journey overview</p><h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{dashboard.journey.origin} <span className="font-normal text-slate-300">to</span> {dashboard.journey.destination}</h1><p className="mt-2 text-sm text-slate-500">Last checked {dashboard.journey.lastAnalyzedAt ? jsonDate(dashboard.journey.lastAnalyzedAt) : 'not yet'} · Information is based on currently available provider data.</p></div><div className="flex gap-2"><button onClick={onMap} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><Map className="h-4 w-4" />View map</button><button onClick={onAlerts} className="inline-flex items-center gap-2 rounded-xl bg-[#245c45] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#184a35]"><AlertTriangle className="h-4 w-4" />{alerts.length} alerts</button></div></div>
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><Card className="relative overflow-hidden bg-[#17352b] text-white"><div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#2d7054]/40 blur-3xl" /><div className="relative"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Current journey status</span><RiskBadge risk={risk} /></div><h2 className="mt-7 max-w-xl text-3xl font-bold leading-tight">{risk === 'LOW' ? 'Conditions look manageable.' : risk === 'MODERATE' ? 'Proceed with added awareness.' : 'Review conditions before you leave.'}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50/80">{dashboard.analysis?.summary || 'Analysis is waiting for current route data. Start an analysis to combine weather, road, alert, and community information.'}</p><div className="mt-8 flex flex-wrap gap-3"><div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-emerald-100/70">Recommended route</p><p className="mt-1 font-bold">{primary ? formatDistance(primary.distance) : 'Pending'}</p></div><div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-emerald-100/70">Estimated travel</p><p className="mt-1 font-bold">{primary ? formatDuration(primary.duration) : 'Pending'}</p></div><div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-emerald-100/70">Confidence</p><p className="mt-1 font-bold">{dashboard.analysis ? `${Math.round(dashboard.analysis.confidence * 100)}%` : 'Limited'}</p></div></div></div></Card><Card><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Main concern</p><h3 className="mt-2 text-xl font-bold">{dashboard.analysis?.recommendation || 'No concern confirmed'}</h3></div><ShieldCheck className="h-8 w-8 text-[#245c45]" /></div><div className="mt-6 space-y-3">{(dashboard.analysis?.riskFactors ? Object.entries(dashboard.analysis.riskFactors).slice(0, 4) : []).map(([key, value]) => <div key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><span className="text-sm capitalize text-slate-500">{key}</span><RiskBadge risk={value} /></div>)}{!dashboard.analysis && <EmptyState title="Analysis not ready" body="Run the journey analysis from the loading screen to populate this summary." />}</div></Card></div>
    <div className="mt-5 grid gap-5 md:grid-cols-3"><Card><div className="flex items-center justify-between"><h3 className="font-bold">Weather along route</h3><CloudRain className="h-5 w-5 text-sky-500" /></div>{weather.length ? <div className="mt-4 space-y-3">{weather.slice(0, 3).map((item) => <div key={`${item.location}-${item.condition}`} className="flex items-center justify-between"><div><p className="text-sm font-semibold">{item.location}</p><p className="text-xs text-slate-500">{item.condition} · visibility {item.visibility ?? '—'} km</p></div><span className="text-lg font-bold">{item.temperature ?? '—'}°</span></div>)}</div> : <div className="mt-4"><EmptyState title="No live weather yet" body="Add an OpenWeather API key and re-analyze." /></div>}</Card><Card><div className="flex items-center justify-between"><h3 className="font-bold">Active alerts</h3><AlertTriangle className="h-5 w-5 text-amber-500" /></div>{alerts.length ? <div className="mt-4 space-y-3">{alerts.slice(0, 3).map((item) => <div key={item.id} className="border-l-2 border-amber-400 pl-3"><div className="flex items-center gap-2"><RiskBadge risk={item.severity} /><span className="text-[11px] text-slate-400">{item.title}</span></div><p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.description}</p></div>)}</div> : <div className="mt-4"><EmptyState title="No active alerts" body="No official alerts are currently attached to this journey." /></div>}</Card><Card><div className="flex items-center justify-between"><h3 className="font-bold">Community activity</h3><Users className="h-5 w-5 text-[#245c45]" /></div>{reports.length ? <div className="mt-4 space-y-3">{reports.slice(0, 3).map((item) => <div key={item.id}><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-[#245c45]">{item.category.replaceAll('_', ' ')}</span><span className="text-[11px] text-slate-400">{jsonDate(item.createdAt)}</span></div><p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.content}</p></div>)}</div> : <div className="mt-4"><EmptyState title="No reports yet" body="Be the first traveler to share a useful update." /></div>}</Card></div>
  </>;
}

function AlertsView({ alerts, onMap }: { alerts: Array<{ id: string; title: string; description: string; severity: string; issuer?: string; issuedAt?: string; coordinates?: { lat: number; lng: number } }>; onMap: (item: unknown) => void }) { return <><PageTitle title="Alerts" subtitle="Official warnings and route hazards from the shared journey context." />{alerts.length ? <div className="grid gap-4 lg:grid-cols-2">{alerts.map((alert) => <Card key={alert.id}><div className="flex items-start justify-between gap-4"><div><RiskBadge risk={alert.severity} /><h3 className="mt-3 text-lg font-bold">{alert.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{alert.description}</p><p className="mt-4 text-xs text-slate-400">{alert.issuer || 'Official source'} · {alert.issuedAt ? jsonDate(alert.issuedAt) : 'time unavailable'}</p></div><AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" /></div><button onClick={() => onMap(alert)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#245c45]">Show on map <ChevronRight className="h-4 w-4" /></button></Card>)}</div> : <EmptyState title="No active alerts" body="The journey has no current official alerts in its available data sources." />}</>; }

function WeatherView({ weather, available }: { weather: Array<{ location: string; condition: string; temperature?: number; precipitation?: number; visibility?: number; windSpeed?: number; timestamp?: string }>; available: boolean }) { return <><PageTitle title="Weather along the route" subtitle="Checkpoint weather is collected during journey analysis and reused across the dashboard." />{!available && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Live weather information is temporarily unavailable. We’re showing the latest available update, if one exists.</div>}{weather.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{weather.map((item) => <Card key={`${item.location}-${item.timestamp}`}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Checkpoint</p><h3 className="mt-1 text-lg font-bold">{item.location}</h3></div><CloudRain className="h-7 w-7 text-sky-500" /></div><p className="mt-5 text-3xl font-bold">{item.temperature ?? '—'}°<span className="ml-2 text-sm font-medium text-slate-400">{item.condition}</span></p><div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-slate-50 p-2"><p className="font-bold">{item.precipitation ?? 0} mm</p><p className="mt-1 text-slate-400">rain</p></div><div className="rounded-xl bg-slate-50 p-2"><p className="font-bold">{item.visibility ?? '—'} km</p><p className="mt-1 text-slate-400">visibility</p></div><div className="rounded-xl bg-slate-50 p-2"><p className="font-bold">{item.windSpeed ?? '—'}</p><p className="mt-1 text-slate-400">km/h wind</p></div></div><p className="mt-4 text-xs text-slate-400">Updated {item.timestamp ? jsonDate(item.timestamp) : 'during analysis'}</p></Card>)}</div> : <EmptyState title="No checkpoint weather" body="Configure OPENWEATHER_API_KEY and re-analyze the journey to collect weather checkpoints." />}</>; }

function RoadView({ segments, onMap }: { segments: Array<{ id: string; name: string; condition: string; riskLevel: string; averageSpeed: number | null; isBlocked: boolean; routeSummary: string }>; onMap: () => void }) { return <><PageTitle title="Road conditions" subtitle="Route segments are updated by the journey intelligence engine." />{segments.length ? <div className="space-y-3">{segments.map((segment, index) => <Card key={segment.id} className="p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div className="flex items-start gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ec] text-sm font-bold text-[#245c45]">{index + 1}</span><div><p className="font-bold">{segment.name}</p><p className="mt-1 text-xs text-slate-400">{segment.routeSummary}</p></div></div><div className="flex items-center gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{segment.condition.replaceAll('_', ' ')}</span><RiskBadge risk={segment.riskLevel} /><button onClick={onMap} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><Map className="h-4 w-4" /></button></div></div></Card>)}</div> : <EmptyState title="No route segments" body="Run journey analysis to build segment-level road intelligence." />}</>; }

function CommunityView({ reports, composerOpen, setComposerOpen, post, setPost, posting, publishPost, confirmReport }: { reports: Array<{ id: string; content: string; category: string; locationName?: string; createdAt: string; usefulCount: number; confirmationCount: number; verificationStatus: string; user?: { name?: string | null } | null }>; composerOpen: boolean; setComposerOpen: (value: boolean) => void; post: { content: string; category: string; locationName: string }; setPost: (value: { content: string; category: string; locationName: string }) => void; posting: boolean; publishPost: (event: React.FormEvent) => void; confirmReport: (id: string) => void }) { return <><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><PageTitle title="Community" subtitle="Traveler reports remain clearly marked until corroborated." /><button onClick={() => setComposerOpen(!composerOpen)} className="inline-flex h-fit items-center gap-2 rounded-xl bg-[#245c45] px-4 py-2.5 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />Share an update</button></div>{composerOpen && <Card className="mb-5"><form onSubmit={publishPost}><div className="flex items-center justify-between"><h3 className="font-bold">What’s happening on your route?</h3><button type="button" onClick={() => setComposerOpen(false)} className="text-slate-400"><X className="h-5 w-5" /></button></div><textarea value={post.content} onChange={(event) => setPost({ ...post, content: event.target.value })} placeholder="Describe a road, weather, traffic, or safety update…" className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#245c45]" /><div className="mt-3 flex flex-col gap-3 sm:flex-row"><select value={post.category} onChange={(event) => setPost({ ...post, category: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="ROAD_UPDATE">Road update</option><option value="WEATHER_REPORT">Weather report</option><option value="HAZARD">Hazard</option><option value="TIP">Travel tip</option><option value="GENERAL">General</option></select><input value={post.locationName} onChange={(event) => setPost({ ...post, locationName: event.target.value })} placeholder="Location (optional)" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#245c45]" /><button disabled={posting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#245c45] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Publish</button></div></form></Card>}{reports.length ? <div className="space-y-4">{reports.map((report) => <Card key={report.id}><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e9f3ec] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245c45]">{report.category.replaceAll('_', ' ')}</span><RiskBadge risk={report.verificationStatus} /></div><p className="mt-3 text-base leading-relaxed text-slate-700">{report.content}</p><p className="mt-3 text-xs text-slate-400">{report.user?.name || 'Traveler'} · {report.locationName || 'Route update'} · {jsonDate(report.createdAt)}</p></div><Users className="h-5 w-5 shrink-0 text-slate-400" /></div><div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4"><button onClick={() => confirmReport(report.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><CheckCircle2 className="h-4 w-4 text-[#245c45]" />Confirm report ({report.confirmationCount})</button><span className="inline-flex items-center gap-1 text-xs text-slate-400"><Heart className="h-4 w-4" />{report.usefulCount}</span></div></Card>)}</div> : <EmptyState title="No community reports" body="Share the first verified-by-people update for this journey." />}</>; }

function NewsView({ news, available }: { news: Array<{ id: string; title: string; summary: string; source: string; publishedAt: string; url: string; affectsRoute: boolean }>; available: boolean }) { return <><PageTitle title="News & updates" subtitle="Only route-relevant updates are included in the journey context." />{!available && <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">No news provider is configured. We won’t invent updates; add GNEWS_API_KEY to enable this category.</div>}{news.length ? <div className="grid gap-4 lg:grid-cols-2">{news.map((item) => <Card key={item.id}><div className="flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item.affectsRoute ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{item.affectsRoute ? 'Potential route impact' : 'Context'}</span><span className="text-xs text-slate-400">{jsonDate(item.publishedAt)}</span></div><h3 className="mt-4 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.summary}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>{item.source}</span>{item.url && item.url !== '#' && <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#245c45]">Open source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></Card>)}</div> : <EmptyState title="No route-relevant updates" body="News will appear here after a configured provider returns items matching this journey." />}</>; }

function AIView({ messages, input, setInput, loading, ask }: { messages: Array<{ role: 'user' | 'assistant'; content: string }>; input: string; setInput: (value: string) => void; loading: boolean; ask: (message?: string) => void }) { const suggestions = ['Is it okay to leave now?', 'What should I be careful about?', 'Show me a better route']; return <><PageTitle title="OneWay AI" subtitle="Answers are grounded in the stored journey context and disclose uncertainty." /><div className="grid gap-5 xl:grid-cols-[1fr_320px]"><Card className="min-h-[560px] flex flex-col"><div className="flex-1 space-y-4">{messages.length === 0 && <div className="rounded-2xl bg-[#f0f6f1] p-5"><div className="flex items-center gap-2 font-bold text-[#245c45]"><Sparkles className="h-5 w-5" />Ask about this journey</div><p className="mt-2 text-sm leading-relaxed text-slate-600">I can explain current conditions, route risks, alerts, and alternatives using the latest available data.</p><div className="mt-4 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)} className="rounded-full border border-[#cfe2d3] bg-white px-3 py-2 text-xs font-semibold text-[#245c45]">{suggestion}</button>)}</div></div>}{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-[#245c45] text-white' : 'bg-slate-100 text-slate-700'}`}>{message.content}</div></div>)}{loading && <div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" />Checking journey context…</div>}</div><div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void ask(); }} placeholder="Ask about your journey…" className="flex-1 px-3 py-2 text-sm outline-none" /><button onClick={() => void ask()} className="rounded-xl bg-[#245c45] p-2.5 text-white"><Send className="h-4 w-4" /></button></div></Card><Card><h3 className="font-bold">How answers work</h3><div className="mt-4 space-y-4 text-sm text-slate-600"><p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#245c45]" />No live facts are invented when a provider is unavailable.</p><p className="flex gap-2"><Users className="h-4 w-4 shrink-0 text-[#245c45]" />Community reports are labelled by verification status.</p><p className="flex gap-2"><Zap className="h-4 w-4 shrink-0 text-[#245c45]" />New journey events refresh this context automatically.</p></div></Card></div></>; }

function SavedView({ journeys }: { journeys: Array<{ id: string; journey: { id: string; origin: string; destination: string; travelDate: string; analysis?: { overallRisk: string } | null } }> }) { return <><PageTitle title="Saved journeys" subtitle="Saved records reuse the same live journey intelligence." />{journeys.length ? <div className="grid gap-4 md:grid-cols-2">{journeys.map((item) => <Link key={item.id} href={`/journey/${item.journey.id}`}><Card className="transition hover:-translate-y-0.5 hover:border-[#9fc6aa]"><div className="flex items-start justify-between"><div><p className="font-bold">{item.journey.origin} <span className="font-normal text-slate-300">→</span> {item.journey.destination}</p><p className="mt-2 text-xs text-slate-400">Travel date {formatDate(item.journey.travelDate)}</p></div><Bookmark className="h-5 w-5 text-[#245c45]" /></div><div className="mt-5 flex items-center justify-between"><RiskBadge risk={item.journey.analysis?.overallRisk || 'ANALYZING'} /><span className="text-xs font-bold text-[#245c45]">Open journey <ChevronRight className="inline h-4 w-4" /></span></div></Card></Link>)}</div> : <EmptyState title="No saved journeys" body="Use Save journey in the header to keep this route available." />}</>; }

function SettingsView({ preferences, update }: { preferences: Record<string, boolean>; update: (key: string, value: boolean) => void }) { const settings = [{ key: 'avoidNightTravel', label: 'Avoid night travel', body: 'Route recommendations will penalize late-night arrival.', icon: Navigation }, { key: 'preferSaferRoutes', label: 'Prefer safer routes', body: 'Risk weighs more heavily than travel time.', icon: ShieldCheck }, { key: 'preferFasterRoutes', label: 'Prefer faster routes', body: 'Duration weighs more heavily when alternatives are compared.', icon: Zap }, { key: 'severeWeatherAlerts', label: 'Severe weather alerts', body: 'Keep severe-weather notifications enabled for this journey.', icon: CloudRain }, { key: 'communityLocationVisibility', label: 'Community location visibility', body: 'Show approximate location with community updates.', icon: MapPin }]; return <><PageTitle title="Journey settings" subtitle="These preferences are persisted with the journey and shape future recommendations." /><div className="max-w-3xl space-y-3">{settings.map(({ key, label, body, icon: Icon }) => <Card key={key} className="p-4"><button onClick={() => update(key, !preferences[key])} className="flex w-full items-center justify-between gap-4 text-left"><span className="flex items-center gap-3"><span className="rounded-xl bg-[#e9f3ec] p-2.5 text-[#245c45]"><Icon className="h-5 w-5" /></span><span><span className="block font-bold">{label}</span><span className="mt-1 block text-xs text-slate-500">{body}</span></span></span><span className={`relative h-6 w-11 rounded-full transition ${preferences[key] ? 'bg-[#245c45]' : 'bg-slate-200'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${preferences[key] ? 'left-6' : 'left-1'}`} /></span></button></Card>)}</div></>; }
