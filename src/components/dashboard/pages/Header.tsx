"use client";

import { Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
import { Button } from '@/components/dashboard/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { getUserProfile, BACKEND_URL, getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { useState, useCallback, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
}

interface EnhancedHeaderProps {
  title: string;
  subtitle?: string;
  showDateFilter?: boolean;
  dateRange?: string;
  onDateRangeChange?: (value: string) => void;
  onNavigate?: (page: string) => void;
}

function formatNotifTime(isoDate: string): string {
  // Supabase returns TIMESTAMP columns without the trailing 'Z'.
  // Without it, browsers parse the string as local time instead of UTC,
  // causing the "5h ago" offset bug on UTC+5 systems.
  const normalized = isoDate.endsWith('Z') || isoDate.includes('+') ? isoDate : isoDate + 'Z';
  const diff = Math.floor((Date.now() - new Date(normalized).getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function EnhancedHeader({
  title,
  subtitle = 'Dashboard / Home',
  showDateFilter = false,
  dateRange = '7',
  onDateRangeChange,
  onNavigate
}: EnhancedHeaderProps) {
  const { profile } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [membershipLabel, setMembershipLabel] = useState('Free');
  const [loggingOut, setLoggingOut] = useState(false);
  const initials = profile.name.split(" ").map(n => n[0]).join("").toUpperCase();
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback((isMounted: { current: boolean }) => {
    getNotifications()
      .then((res) => {
        if (!isMounted.current) return;
        setNotifications(
          res.notifications.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: formatNotifTime(n.createdAt),
            read: n.read,
            type: n.type,
          }))
        );
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const isMounted = { current: true };

    getUserProfile()
      .then((user) => {
        if (!isMounted.current) return;
        const normalized = (user?.planTier ?? '').trim().toUpperCase();
        if (!normalized) {
          setMembershipLabel('Free');
          return;
        }
        const pretty = `${normalized.charAt(0)}${normalized.slice(1).toLowerCase()}`;
        setMembershipLabel(pretty);
      })
      .catch(() => {
        if (!isMounted.current) return;
        setMembershipLabel('Free');
      });

    fetchNotifications(isMounted);

    const handleRefresh = () => fetchNotifications(isMounted);
    window.addEventListener('notifications:refresh', handleRefresh);

    const interval = setInterval(() => fetchNotifications(isMounted), 30_000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
      window.removeEventListener('notifications:refresh', handleRefresh);
    };
  }, [fetchNotifications]);


  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      try {
        const logoutUrl = BACKEND_URL ? `${BACKEND_URL}/api/auth/logout` : '/api/auth/logout';
        await fetch(logoutUrl, { method: 'POST', credentials: 'include' });
      } catch {
        // ignore backend errors — Firebase sign-out already happened
      }
      // Clear all client-side auth state so the middleware fallback cookie
      // (sessionToken) doesn't keep the session alive and redirect back to /dashboard.
      localStorage.removeItem('sessionToken');
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      document.cookie = "sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      // Full page navigation so the browser sends no stale cookies to the middleware.
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
      setLoggingOut(false);
    }
  }, []);

  const handleNavigate = useCallback((page: string) => {
    onNavigate?.(page);
  }, [onNavigate]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    markAllNotificationsRead().catch(() => { });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    markNotificationRead(id).catch(() => { });
  }, []);

  return (
    <header className="h-16 border-b border-[#008001]/30 bg-[#000000]/95 backdrop-blur-xl px-8 flex items-center justify-between shadow-sm">
      {/* Left side - Search and Breadcrumb */}
      <div className="flex items-center gap-6 flex-1">
        {/* <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
          <Input
            type="search"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-[#1E1E1E] border-[#008001]/30 text-sm text-white placeholder:text-[#A0A0A0] focus:border-[#49B618] focus:ring-[#49B618]/20"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] hover:text-white transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div> */}
        <div>
          <p className="text-xs text-[#A0A0A0]">{subtitle}</p>
          <h2 className="text-base bg-gradient-to-r from-[#49B618] to-[#009200] bg-clip-text text-transparent font-semibold">{title}</h2>
        </div>
      </div>

      {/* Right side - Date filter, Notifications, User */}
      <div className="flex items-center gap-4">
        {showDateFilter && (
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-32 bg-[#1E1E1E] border-[#008001]/30 text-sm text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#000000] border-[#008001]/30">
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative bg-[#1E1E1E] hover:bg-[#008001]/20">
              <Bell className="w-5 h-5 text-[#49B618]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#49B618] to-[#009200] rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#000000] border-[#008001]/30 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#008001]/30">
              <DropdownMenuLabel className="text-white p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                  className="text-xs text-[#49B618] hover:text-[#009200] transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-[#008001] [&::-webkit-scrollbar]:w-1.5">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-[#A0A0A0] text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className="flex flex-col items-start gap-1 px-4 py-3 cursor-pointer focus:bg-[#008001]/10"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[#49B618] flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${notification.read ? 'text-[#A0A0A0]' : 'text-white'}`}>
                        {notification.title}
                      </span>
                      <span className="ml-auto text-xs text-[#A0A0A0] flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-xs pl-4 ${notification.read ? 'text-[#666666]' : 'text-[#A0A0A0]'}`}>
                      {notification.message}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 bg-[#1E1E1E] hover:bg-[#008001]/20 px-3 text-white">
              <Avatar className="w-8 h-8 ring-2 ring-[#008001]/30">
                {profile.avatar && <AvatarImage src={profile.avatar} />}
                <AvatarFallback className="bg-[#008001]/30 text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm text-white font-medium">{profile.name}</p>
                <p className="text-xs text-[#A0A0A0]">{membershipLabel} Member</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#000000] border-[#008001]/30">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#008001]/30" />
            <DropdownMenuItem
              onClick={() => handleNavigate('settings')}
              className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20 cursor-pointer"
            >
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate('billing')}
              className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20 cursor-pointer"
            >
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate('settings')}
              className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20 cursor-pointer"
            >
              Team
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#008001]/30" />
            <DropdownMenuItem
              onClick={() => handleNavigate('my-cards')}
              className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20 cursor-pointer"
            >
              My Cards
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate('orders')}
              className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20 cursor-pointer"
            >
              Order History
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#008001]/30" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Logging out…
                </span>
              ) : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
