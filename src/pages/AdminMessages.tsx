import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Mail, 
  Trash2, 
  CheckCheck, 
  Search, 
  Clock, 
  Send, 
  Lock, 
  Download, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import type { ContactMessage } from '../services/contactDatabase';
import { 
  getStoredMessages, 
  markMessageAsRead, 
  markAllMessagesAsRead, 
  deleteMessage, 
  clearStoredMessages 
} from '../services/contactDatabase';

// Hashed passcode for public repository security (SHA-256 hash of password)
const PASSCODE_HASH = 'deab4b1a1376a899b5275e56156c819acbb34b3f51ee67b3b3eadbb0d7dd8399';

async function hashInput(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    // Check if previously unlocked in session
    const unlocked = sessionStorage.getItem('admin_messages_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    }
    loadMessages();
  }, []);

  const loadMessages = () => {
    setMessages(getStoredMessages());
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    const inputTrimmed = passcode.trim();

    if (envPasscode) {
      if (inputTrimmed === envPasscode) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_messages_unlocked', 'true');
        setPassError(false);
        return;
      }
    } else {
      const enteredHash = await hashInput(inputTrimmed);
      if (enteredHash === PASSCODE_HASH) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_messages_unlocked', 'true');
        setPassError(false);
        return;
      }
    }

    setPassError(true);
  };

  const handleMarkRead = (id: string) => {
    const updated = markMessageAsRead(id);
    setMessages(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllMessagesAsRead();
    setMessages(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteMessage(id);
    setMessages(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all messages from the database?')) {
      clearStoredMessages();
      setMessages([]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_messages_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = 
      filter === 'all' ? true : filter === 'unread' ? msg.status === 'unread' : msg.status === 'read';
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      msg.name.toLowerCase().includes(query) || 
      msg.email.toLowerCase().includes(query) || 
      msg.message.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  if (!isAuthenticated) {
    return (
      <section className="py-28 md:py-36 relative z-10 flex items-center justify-center min-h-[75vh]">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-200/80 text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <Lock size={28} />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Admin Messages Access</h2>
            <p className="text-slate-500 text-sm mb-6 font-medium">Enter passcode to view your custom messages inbox database.</p>

            <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setPassError(false); }}
                  placeholder="Enter Admin Passcode"
                  className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl outline-none text-center font-bold text-slate-800 transition-all ${
                    passError ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50'
                  }`}
                />
                {passError && (
                  <p className="text-xs text-red-500 font-semibold mt-2">Incorrect passcode. Please try again.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                <span>Unlock Inbox</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-200/60">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Inbox size={24} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Messages Database</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full animate-pulse">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">Manage and review all contact form messages stored directly in your database.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadMessages}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-semibold text-sm flex items-center gap-2"
                title="Refresh Messages"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportJSON}
                disabled={messages.length === 0}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={16} />
                <span>Export Backup</span>
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-md border border-slate-200/60">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold text-sm text-slate-700"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filter === 'unread' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filter === 'read' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Read ({messages.length - unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Mark All Read
                </button>
              )}

              {messages.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Clear All Messages"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] text-center shadow-lg border border-slate-200/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-1">No Messages Found</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                {messages.length === 0 
                  ? "Your database is empty. Submissions from the contact form will appear here instantly!" 
                  : "No messages match your current search or filter."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white p-6 sm:p-8 rounded-[2rem] border transition-all shadow-md hover:shadow-lg ${
                      msg.status === 'unread' 
                        ? 'border-blue-300 ring-2 ring-blue-50 bg-blue-50/20' 
                        : 'border-slate-200/70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        {/* Avatar initials */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold flex items-center justify-center shadow-md text-lg">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold text-slate-800">{msg.name}</h3>
                            {msg.status === 'unread' && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-md">NEW</span>
                            )}
                          </div>
                          <a href={`mailto:${msg.email}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5">
                            <Mail size={14} />
                            <span>{msg.email}</span>
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Clock size={13} />
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>

                        {msg.status === 'unread' ? (
                          <button
                            onClick={() => handleMarkRead(msg.id)}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                            title="Mark as Read"
                          >
                            <CheckCheck size={18} />
                          </button>
                        ) : (
                          <span className="p-2 text-emerald-600 bg-emerald-50 rounded-xl" title="Read">
                            <CheckCheck size={18} />
                          </span>
                        )}

                        <a
                          href={`mailto:${msg.email}?subject=Re: Portfolio Contact Inquiry&body=Hi ${encodeURIComponent(msg.name)},\n\nThank you for reaching out!\n\nBest regards,\nBhushan Kolte`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-xl transition-all"
                          title="Reply via Email"
                        >
                          <Send size={18} />
                        </a>

                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-slate-700 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
