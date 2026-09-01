'use client';

import { useState, useEffect } from 'react';
import { getCommunityFeed, likeReport, addComment } from '@/app/actions/community';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: { name: string | null; image: string | null } | null;
}

interface Report {
  id: string;
  user: { name: string | null; image: string | null; id: string } | null;
  content: string;
  category: string;
  locationName: string | null;
  createdAt: Date;
  likesCount: number;
  comments: Comment[];
  hasLiked: boolean;
}

export default function CommunityFeed({ hideHeader = false }: { hideHeader?: boolean }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fetchFeed = async () => {
    try {
      const data = await getCommunityFeed();
      setReports(data as any);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = async (reportId: string) => {
    // Optimistic UI update
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          hasLiked: !r.hasLiked,
          likesCount: r.hasLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
        };
      }
      return r;
    }));
    await likeReport(reportId);
  };

  const handleCommentSubmit = async (e: React.FormEvent, reportId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const text = commentText;
    setCommentText('');
    setCommentingOn(null);

    // Optimistic update
    const tempComment = {
      id: Date.now().toString(),
      content: text,
      createdAt: new Date(),
      user: { name: 'You (Demo)', image: 'https://i.pravatar.cc/150?u=demo' }
    };
    
    setReports(prev => prev.map(r => {
      if (r.id === reportId) return { ...r, comments: [...r.comments, tempComment] };
      return r;
    }));

    await addComment(reportId, text);
    // Refresh to get real IDs
    fetchFeed();
  };

  if (loading) {
    return <div className="animate-pulse space-y-6 opacity-50">
      {[1, 2].map(i => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
      ))}
    </div>;
  }

  const formatTime = (date: Date) => {
    const min = Math.round((Date.now() - new Date(date).getTime()) / 60000);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.round(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.round(hrs / 24)}d ago`;
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
      {reports.map(report => (
        <div key={report.id} className="flex gap-4 border-b border-gray-100 pb-6">
          <img src={report.user?.image || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-12 h-12 rounded-full object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-bold text-gray-900 truncate">{report.user?.name || 'Traveler'}</h4>
                <span className="text-xs text-gray-400">{formatTime(report.createdAt)}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                report.category === 'Alert' || report.category.includes('RAIN') || report.category.includes('CLOSURE') ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
              }`}>
                {report.category}
              </span>
            </div>
            
            {report.locationName && (
              <p className="text-xs font-semibold text-accent mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {report.locationName}
              </p>
            )}

            <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap break-words">{report.content}</p>
            
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <button 
                onClick={() => handleLike(report.id)} 
                className={`flex items-center gap-1.5 transition-colors ${report.hasLiked ? 'text-accent' : 'hover:text-accent'}`}
              >
                <svg className={`w-4 h-4 ${report.hasLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg> 
                {report.likesCount}
              </button>
              
              <button 
                onClick={() => setCommentingOn(commentingOn === report.id ? null : report.id)} 
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> 
                {report.comments.length}
              </button>
            </div>

            {/* Comments List */}
            {report.comments.length > 0 && (
              <div className="mt-4 space-y-3 bg-gray-50/50 p-3 rounded-xl">
                {report.comments.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <img src={c.user?.image || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-gray-900 mr-2">{c.user?.name || 'Traveler'}</span>
                      <span className="text-sm text-gray-700">{c.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {commentingOn === report.id && (
              <form onSubmit={(e) => handleCommentSubmit(e, report.id)} className="mt-4 flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Write a comment..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" disabled={!commentText.trim()} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover disabled:opacity-50">Post</button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
