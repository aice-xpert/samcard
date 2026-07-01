"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/pages/Sidebar';
import { EnhancedHeader } from '@/components/dashboard/pages/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import dynamic from "next/dynamic";
import { clearNewCardDraft, newCardDraftSaved, newCardDraftHasData } from '@/lib/newCardDraft';

function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
        <div className="h-48 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      </div>
    </div>
  );
}

function CardEditorSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
      <div className="flex-1 space-y-4">
        <div className="h-12 rounded-xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
        <div className="h-64 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
        <div className="h-48 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
        <div className="h-48 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      </div>
      <div className="w-full lg:w-80">
        <div className="h-[560px] rounded-3xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-[#0d1a0d]/60 border border-[#008001]/10" />
      ))}
    </div>
  );
}

// Load every page lazily — only one is ever visible at a time so there's no
// reason to bundle or render all of them up-front.
const ComprehensiveDashboard = dynamic(
  () => import('@/components/dashboard/pages/Dashboard').then(mod => mod.ComprehensiveDashboard),
  { ssr: false, loading: () => <PageSkeleton /> }
);
const BusinessProfile = dynamic(
  () => import('@/components/dashboard/pages/BusinessProfile'),
  { ssr: false, loading: () => <CardEditorSkeleton /> }
);
const MyCardsNew = dynamic(
  () => import('@/components/dashboard/pages/MyCards').then(mod => mod.MyCardsNew),
  { ssr: false, loading: () => <ListSkeleton /> }
);
const CreateCard = dynamic(
  () => import('@/components/dashboard/pages/CreateCard').then(mod => mod.CreateCard),
  { ssr: false, loading: () => <CardEditorSkeleton /> }
);
const Analytics = dynamic(
  () => import('@/components/dashboard/pages/Analytics'),
  { ssr: false, loading: () => <PageSkeleton /> }
);
const Orders = dynamic(
  () => import('@/components/dashboard/pages/Orders').then(mod => mod.Orders),
  { ssr: false, loading: () => <ListSkeleton /> }
);
const Billing = dynamic(
  () => import('@/components/dashboard/pages/Billing').then(mod => mod.Billing),
  { ssr: false, loading: () => <ListSkeleton /> }
);
const Settings = dynamic(
  () => import('@/components/dashboard/pages/Settings').then(mod => mod.Settings),
  { ssr: false, loading: () => <ListSkeleton /> }
);

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const [editingCardId, setEditingCardId] = useState<string | undefined>(undefined);
  const [analyticsCardId, setAnalyticsCardId] = useState<string | undefined>(undefined);
  const [analyticsCardTitle, setAnalyticsCardTitle] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState('30');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  // Restore page from URL on mount (fixes refresh-to-dashboard bug)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page) setActivePage(page);
    const cardId = params.get('cardId');
    if (cardId) setAnalyticsCardId(cardId);
    const cardTitle = params.get('cardTitle');
    if (cardTitle) setAnalyticsCardTitle(decodeURIComponent(cardTitle));
    const editCardId = params.get('editCardId');
    if (editCardId) setEditingCardId(editCardId);
  }, []);

  const syncURL = (page: string, extra: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    if (page !== 'dashboard') params.set('page', page);
    Object.entries(extra).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard Overview';
      case 'my-cards': return 'My Cards';
      case 'analytics': return 'Analytics Dashboard';
      case 'create-card': return 'Create New Card';
      case 'orders': return 'Order History';
      case 'billing': return 'Billing & Subscription';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard / Home';
      case 'my-cards': return 'Dashboard / My Cards';
      case 'analytics': return 'Dashboard / Analytics';
      case 'create-card': return 'Dashboard / Digital business card';
      case 'orders': return 'Dashboard / Orders';
      case 'billing': return 'Dashboard / Billing';
      case 'settings': return 'Dashboard / Settings';
      default: return 'Dashboard / Home';
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <ComprehensiveDashboard onNavigate={handleNavigate} />;
      case 'business-profile': return <BusinessProfile />;
      case 'my-cards':
        return (
          <MyCardsNew
            onEditCard={(cardId) => {
              setEditingCardId(cardId);
              setActivePage('create-card');
              syncURL('create-card', { editCardId: cardId });
            }}
            onCreateBusinessCard={() => {
              // Explicitly creating a new card always starts from an empty state.
              clearNewCardDraft();
              setEditingCardId(undefined);
              setActivePage('create-card');
              syncURL('create-card');
            }}
            onNavigate={handleNavigate}
            onViewAnalytics={(cardId, cardTitle) => {
              setAnalyticsCardId(cardId);
              setAnalyticsCardTitle(cardTitle);
              setActivePage('analytics');
              syncURL('analytics', { cardId, cardTitle: encodeURIComponent(cardTitle ?? '') });
            }}
          />
        );
      case 'analytics': return <Analytics cardId={analyticsCardId} cardTitle={analyticsCardTitle} />;
      case 'create-card':
        return (
          <CreateCard
            cardId={editingCardId}
            onDone={() => {
              // Card finalized (Save & Finish) — discard the in-progress draft.
              clearNewCardDraft();
              setEditingCardId(undefined);
              setActivePage('my-cards');
            }}
          />
        );
      case 'orders': return <Orders />;
      case 'billing': return <Billing />;
      case 'settings': return <Settings />;
      default: return <ComprehensiveDashboard onNavigate={handleNavigate} />;
    }
  };

  /* Navigate and close drawer on mobile */
  const doNavigate = (page: string) => {
    if (page === 'analytics') {
      setAnalyticsCardId(undefined);
      setAnalyticsCardTitle(undefined);
    }
    if (page === 'create-card') {
      // Navigating to the card editor via the sidebar resumes a saved draft;
      // only the "Create New Card" button (onCreateBusinessCard) forces a blank.
      if (!newCardDraftSaved()) clearNewCardDraft();
      setEditingCardId(undefined);
    }
    if (activePage === 'create-card' && page !== 'create-card') {
      setEditingCardId(undefined);
    }
    setActivePage(page);
    setSidebarOpen(false);
    syncURL(page);
  };

  const handleNavigate = (page: string) => {
    // Guard: leaving an in-progress NEW card with unsaved data warns first via a
    // themed modal. Saved drafts (content/design Save clicked) leave freely.
    if (
      activePage === 'create-card' && page !== 'create-card' && !editingCardId &&
      !newCardDraftSaved() && newCardDraftHasData()
    ) {
      setPendingNav(page);
      return;
    }
    doNavigate(page);
  };

  const confirmLeave = () => {
    const target = pendingNav;
    setPendingNav(null);
    if (target === null) return;
    clearNewCardDraft();
    doNavigate(target);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* ── Unsaved-changes confirm modal ── */}
        {pendingNav !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="bg-popover border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-primary/10"
            >
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-full border-2 border-accent bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A1.5 1.5 0 003.11 21h17.78a1.5 1.5 0 001.3-2.44l-8.48-14.7a1.5 1.5 0 00-2.6 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-foreground">Discard unsaved changes?</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  You haven&apos;t saved this card yet. If you leave now, the information you entered will be lost.
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setPendingNav(null)}
                  className="flex-1 px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/60 transition-all"
                >
                  Keep editing
                </button>
                <button
                  onClick={confirmLeave}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Leave &amp; discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile overlay backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <div
          className={`
            fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        </div>

        {/* ── Main content ── */}
        <div className="lg:ml-60">
          {/* ── Mobile top bar ── */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#000000] border-b border-[#008001]/30 sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="#060e06" />
                  <polygon points="20,4 33,11.5 33,26.5 20,34 7,26.5 7,11.5" fill="none" stroke="#008001" strokeWidth="2" opacity="0.5" />
                  <polygon points="20,10 28,14.5 28,23.5 20,28 12,23.5 12,14.5" fill="#008001" />
                  <polygon points="20,13 25.5,21 14.5,21" fill="#060e06" />
                  <polygon points="20,22 24,27.5 16,27.5" fill="#49B618" opacity="0.9" />
                </svg>
              </div>
              <span className="text-white font-black text-base tracking-tight">
                Sam<span style={{ background: 'linear-gradient(90deg,#49B618,#008001)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Card</span>
              </span>
            </div>

            <div className="ml-auto text-sm font-semibold text-white truncate">{getPageTitle()}</div>
          </div>

          {/* Desktop header */}
          {activePage !== 'design' && (
            <div className="hidden lg:block">
              <EnhancedHeader
                title={getPageTitle()}
                subtitle={getPageSubtitle()}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onNavigate={handleNavigate}
              />
            </div>
          )}

          {/* Mobile header for non-design pages */}
          {activePage !== 'design' && (
            <div className="lg:hidden px-4 pt-4 pb-2">
              <p className="text-xs text-[#A0A0A0]">{getPageSubtitle()}</p>
            </div>
          )}

          <main className={activePage === 'design' ? '' : 'p-4 lg:p-8'}>
            {/* Wrap in Suspense-like fallback supplied by dynamic() loading prop */}
            {renderPage()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
