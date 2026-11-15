import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Headphones, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LiveChatPage({ navigate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsOnline, setWsOnline] = useState(false);

  const wsRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    setupWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [user]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getChatMessages(user ? user._id : null);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    try {
      const socket = new WebSocket('ws://localhost:5000/ws/chat');
      wsRef.current = socket;

      socket.onopen = () => {
        setWsOnline(true);
        socket.send(JSON.stringify({
          type: 'identify',
          userId: user ? user._id : 'guest_collector'
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            setMessages((prev) => {
              // Avoid duplicate if we already have it
              if (prev.some((m) => m._id === data._id)) return prev;
              return [...prev, data];
            });
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      socket.onclose = () => setWsOnline(false);
      socket.onerror = () => setWsOnline(false);
    } catch {
      setWsOnline(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      // Send via HTTP to persist in db
      const savedMsg = await api.sendChatMessage(text);
      
      // Also broadcast over WS
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          _id: savedMsg._id,
          userId: user ? user._id : 'guest_collector',
          userName: user ? user.name : 'Client Connoisseur',
          sender: 'customer',
          text
        }));
      }

      setMessages((prev) => {
        if (prev.some((m) => m._id === savedMsg._id)) return prev;
        return [...prev, savedMsg];
      });
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Return to Maison
        </button>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${wsOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[11px] font-semibold text-slate-600">
            {wsOnline ? 'Atelier Concierge Live' : 'Concierge Relay Active'}
          </span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Headphones size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">XERVALI Atelier Concierge</h2>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">Direct</span>
              </div>
              <p className="text-xs text-slate-400">Personal commission advisor & horological inquiries</p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs text-amber-400 font-mono">EST. 2026</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {/* Welcome Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif flex-shrink-0">
              X
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 max-w-md shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Atelier Private Desk</span>
              <p className="text-xs text-slate-800 leading-relaxed">
                Greetings. Welcome to the XERVALI private concierge channel. You are connected directly with our curation atelier. Inquire regarding custom engravings, bespoke movements, private viewings, or logistics.
              </p>
              <span className="text-[9px] text-slate-400 block pt-1">Atelier Montaigne, Paris</span>
            </div>
          </div>

          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'customer';
            return (
              <div key={msg._id || idx} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold font-serif flex-shrink-0">
                    X
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-md space-y-1 ${
                    isMe
                      ? 'bg-slate-950 text-white rounded-tr-none shadow-md'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isMe ? 'text-amber-400' : 'text-slate-500'}`}>
                    {isMe ? (user ? user.name : 'You') : 'Syed Ismail (Store Owner)'}
                  </span>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] block pt-0.5 ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user ? user.name.charAt(0) : 'C'}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your bespoke commission inquiry..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="px-6 py-3.5 bg-slate-950 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 flex items-center gap-2 shadow-md"
          >
            <Send size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
