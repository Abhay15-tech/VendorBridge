import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Search, User, ChevronDown, X, ArrowUpRight,
  Building2, FileText, FileSignature, ShoppingCart, Receipt, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { vendors, rfqs, quotations, purchaseOrders, invoices } from '@/data/mockData';

// ─── Global Search Index ───────────────────────────────────────────────────────
const buildSearchIndex = () => {
  const results: {
    id: string; label: string; sublabel: string;
    type: string; icon: React.ElementType; path: string; badge?: string;
  }[] = [];
  vendors.forEach(v => results.push({ id: v.id, label: v.name, sublabel: `${v.category} · ${v.location}`, type: 'Vendor', icon: Building2, path: '/vendors', badge: v.status }));
  rfqs.forEach(r => results.push({ id: r.id, label: r.title, sublabel: `${r.department} · Deadline: ${r.deadline}`, type: 'RFQ', icon: FileText, path: '/rfqs', badge: r.status }));
  quotations.forEach(q => results.push({ id: q.id, label: `${q.id} — ${q.vendor}`, sublabel: `RFQ: ${q.rfqId} · $${q.totalAmount.toLocaleString()}`, type: 'Quotation', icon: FileSignature, path: '/quotations', badge: q.status }));
  purchaseOrders.forEach(po => results.push({ id: po.id, label: po.id, sublabel: `${po.vendor} · $${po.amount.toLocaleString()}`, type: 'Purchase Order', icon: ShoppingCart, path: '/purchase-orders', badge: po.status }));
  invoices.forEach(inv => results.push({ id: inv.id, label: inv.id, sublabel: `${inv.vendor} · $${inv.amount.toLocaleString()}`, type: 'Invoice', icon: Receipt, path: '/invoices', badge: inv.status }));
  return results;
};

const searchIndex = buildSearchIndex();

const badgeColors: Record<string, string> = {
  Active:       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Inactive:     'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  Published:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Draft:        'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  Closed:       'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  Submitted:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Shortlisted:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Rejected:     'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Pending:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Delivered:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Paid:         'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Unpaid:       'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Under Review':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

// ─── Global Search Component ───────────────────────────────────────────────────
function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(-1);
  const navigate = useNavigate();
  const inputRef  = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? searchIndex.filter(item =>
        [item.id, item.label, item.sublabel, item.type, item.badge || '']
          .join(' ').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const isOpen = focused && query.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter' && selected >= 0) handleSelect(results[selected]);
    else if (e.key === 'Escape') { setQuery(''); setFocused(false); inputRef.current?.blur(); }
  };

  const handleSelect = (item: typeof searchIndex[0]) => {
    navigate(item.path);
    setQuery('');
    setFocused(false);
    setSelected(-1);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) { setFocused(false); setSelected(-1); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setSelected(-1); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search vendors, RFQs, POs… (⌘K)"
          className="w-full pl-9 pr-12 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400/60 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-fade-in"
        >
          {results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No results for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by ID, name, or type</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto py-2">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{type}</div>
                  {items.map(item => {
                    const Icon = item.icon;
                    const idx = flatIndex++;
                    const isActive = idx === selected;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setSelected(idx)}
                        onMouseDown={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold truncate ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>{item.label}</span>
                            {item.badge && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${badgeColors[item.badge] || 'bg-gray-100 text-gray-500'}`}>{item.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{item.sublabel}</p>
                        </div>
                        <ArrowUpRight className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> open</span>
                <span><kbd className="font-mono">Esc</kbd> close</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
import { useWorkflow } from '@/contexts/WorkflowContext';

// ... (in Navbar component)
export function Navbar() {
  const { logout, role } = useAuth();
  const { notifications, markRead } = useWorkflow();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter notifications for current user's role
  const myNotifs = notifications.filter(n => n.targetRole === 'All' || n.targetRole === role);
  const unreadCount = myNotifs.filter(n => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    myNotifs.forEach(n => markRead(n.id));
  };

  const handleNotifClick = (notif: typeof notifications[0]) => {
    markRead(notif.id);
    setShowNotifs(false);
    // If it's a workflow notification, maybe navigate somewhere. For now just go to activity log
    navigate('/activity');
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <GlobalSearch />

      <div className="flex items-center gap-2 ml-4">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
            className="relative h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-150"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-surface-900 flex items-center justify-center text-[9px] font-bold text-white leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
                {myNotifs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                ) : (
                  myNotifs.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`w-full flex gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${n.isRead ? 'opacity-55' : ''}`}
                    >
                      <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-gray-800 dark:text-gray-200' : 'font-medium text-gray-500 dark:text-gray-400'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => { setShowNotifs(false); navigate('/activity'); }}
                  className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                >
                  View all activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">Admin User</p>
              <p className="text-xs text-gray-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 hidden sm:block transition-transform duration-150 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  AD
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-400 mt-0.5">admin@vendorbridge.com</p>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setShowProfile(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-colors"
                >
                  <User className="h-4 w-4" /> My Profile
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-colors"
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                >
                  <X className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
