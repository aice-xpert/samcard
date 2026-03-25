"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/pages/Sidebar';
import { EnhancedHeader } from '@/components/dashboard/pages/Header';
import { ComprehensiveDashboard } from '@/components/dashboard/pages/Dashboard';
import BusinessProfile from '@/components/dashboard/pages/BusinessProfile';
import { MyCardsNew } from '@/components/dashboard/pages/MyCards';
import { CreateCard } from '@/components/dashboard/pages/CreateCard';
import { Orders } from '@/components/dashboard/pages/Orders';
import { Billing } from '@/components/dashboard/pages/Billing';
import { Settings } from '@/components/dashboard/pages/Settings';
function ComingSoon({ page }: { page: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#008001]/20 border border-[#008001]/30 flex items-center justify-center">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-white">{page}</h2>
      <p className="text-[#A0A0A0]">This page is coming soon</p>
    </div>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const [dateRange, setDateRange] = useState('30');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case 'dashboard': return <ComprehensiveDashboard />;
      case 'business-profile': return <BusinessProfile />;
      case 'my-cards': return <MyCardsNew />;
      case 'analytics': return <ComingSoon page="Analytics" />;
      case 'create-card': return <CreateCard />;

      case 'orders': return <Orders />;
      case 'billing': return <Billing />;
      case 'settings': return <Settings />;
      default: return <ComprehensiveDashboard />;
    }
  };

  /* Navigate and close drawer on mobile */
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a]">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──
          • Desktop (lg+): always visible, fixed left
          • Mobile: slides in from left as a drawer                    */}
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
            {/* Hamburger */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mini logo */}
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

        {/* Desktop header  */}
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

        {/* ── Mobile header for non-design pages ── */}
        {activePage !== 'design' && (
          <div className="lg:hidden px-4 pt-4 pb-2">
            <p className="text-xs text-[#A0A0A0]">{getPageSubtitle()}</p>
          </div>
        )}

        <main className={activePage === 'design' ? '' : 'p-4 lg:p-8'}>
          {renderPage()}
        </main>
      </div>

    </div>
  );
}