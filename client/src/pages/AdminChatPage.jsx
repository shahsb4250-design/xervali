import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageSquare, Headphones, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';

export default function AdminChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    setupWebSocket();

    const pollInterval = setInterval(loadConversations, 6000);
    return () => {
      clearInterval(pollInterval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvo?.messages]);

  const setupWebSocket = () => {
    try {
      const socket = new WebSocket('ws://localhost:5000/ws/chat');
      wsRef.current = socket;
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'identify', userId: 'admin_syed' }));
      };
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            loadConversations();
          }
        } catch (e) {}
      };
    } catch {}
  };

  const loadConversations = async () => {
    try {
      const data = await api.getChatConversations();
      if (Array.isArray(data)) {
        setConversations(data);
        if (!selectedConvo && data.length > 0) {
          setSelectedConvo(data[0]);
        } else if (selectedConvo) {
          const fresh = data.find((c) => c.userId === selectedConvo.userId);
          if (fresh) setSelectedConvo(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvo) return;

    const text = replyText.trim();
    setReplyText('');
    setSending(true);

    try {
      const saved = await api.sendAdminMessage(selectedConvo.userId, text);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          _id: saved._id,
          userId: selectedConvo.userId,
          userName: 'Syed Ismail (Store Owner)',
          sender: 'admin',
          text
        }));
      }
      await loadConversations();
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Client Conversations</h3>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            {conversations.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading dialogue...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <MessageSquare size={24} className="mx-auto text-slate-300" />
              <p className="text-xs text-slate-400">No client messages received yet.</p>
            </div>
          ) : (
            conversations.map((convo) => {
              const isSelected = selectedConvo?.userId === convo.userId;
              return (
                <div
                  key={convo.userId}
                  onClick={() => setSelectedConvo(convo)}
                  className={`p-4 cursor-pointer transition ${
                    isSelected ? 'bg-amber-50/80 border-l-4 border-amber-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{convo.userName}</span>
                    <span className="text-[10px] text-slate-400">
                      {convo.lastDate ? new Date(convo.lastDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{convo.lastMessage}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConvo ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedConvo.userName}</h4>
                <p className="text-[10px] text-slate-400">ID: {selectedConvo.userId} • {selectedConvo.userEmail || 'Client'}</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                Live Concierge Relaying
              </span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/30">
              {(selectedConvo.messages || []).map((msg, i) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg._id || i} className={`flex gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`rounded-2xl p-3.5 max-w-sm text-xs space-y-1 ${
                        isAdmin
                          ? 'bg-amber-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <span className={`text-[9px] uppercase font-bold block ${isAdmin ? 'text-amber-100' : 'text-slate-400'}`}>
                        {isAdmin ? 'Syed Ismail (Store Owner)' : selectedConvo.userName}
                      </span>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] block pt-0.5 ${isAdmin ? 'text-amber-200' : 'text-slate-400'}`}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${selectedConvo.userName} as Atelier Owner...`}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900"
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-6 py-3 bg-slate-950 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold uppercase transition disabled:opacity-40 flex items-center gap-2"
              >
                <Send size={14} /> Send Reply
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8 space-y-2">
            <div>
              <Headphones size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Select a client conversation to begin concierge dialogue.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
