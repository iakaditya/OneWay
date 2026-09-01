'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  journeyId: string;
  origin: string;
  destination: string;
}

const SUGGESTED_QUESTIONS = [
  'Is it safe to leave now?',
  'Why is the route marked moderate risk?',
  'Should I delay my journey?',
  'Tell me about hazards on my route',
  'Has this route been disrupted before?',
];

export default function AIChatPanel({ journeyId, origin, destination }: AIChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I'm OneWay AI. Ask me anything about your ${origin} → ${destination} journey — current conditions, risks, or recommendations.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(messageText?: string) {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyId,
          message: text,
          history: chatHistory,
        }),
      });

      if (!res.ok) throw new Error('Chat failed');

      const contentType = res.headers.get('Content-Type') || '';

      if (contentType.includes('text/event-stream')) {
        // Handle streaming
        const assistantMessage: Message = { role: 'assistant', content: '', timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMessage]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                try {
                  const parsed = JSON.parse(data);
                  fullResponse += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...assistantMessage, content: fullResponse };
                    return updated;
                  });
                } catch { /* skip */ }
              }
            }
          }
        }

        setChatHistory((prev) => [
          ...prev,
          { role: 'user', parts: [{ text }] },
          { role: 'model', parts: [{ text: fullResponse }] },
        ]);
      } else {
        // Non-streaming fallback
        const data = await res.json();
        const response = data.data?.response || 'I was unable to process your request at this time.';
        setMessages((prev) => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', parts: [{ text }] },
          { role: 'model', parts: [{ text: response }] },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent-hover rounded-2xl shadow-glow-accent flex items-center justify-center transition-all ${open ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-risk-low rounded-full border-2 border-background" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-100px)] bg-surface border border-border rounded-2xl shadow-card-hover flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-2">
              <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">OneWay AI</div>
                <div className="text-xs text-risk-low flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-risk-low rounded-full animate-pulse-slow" />
                  Journey-aware
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-tr-sm'
                        : 'bg-surface-2 text-text-secondary rounded-tl-sm border border-border'
                    }`}
                  >
                    {msg.content || (loading && index === messages.length - 1 && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ))}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center mr-2 shrink-0">
                    <Bot className="w-3 h-3 text-accent" />
                  </div>
                  <div className="bg-surface-2 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-[11px] whitespace-nowrap bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-3 py-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your journey…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-accent hover:bg-accent-hover rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
