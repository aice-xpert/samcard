"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Badge } from '@/components/dashboard/ui/badge';
import { Input } from '@/components/dashboard/ui/input';
import { Switch } from '@/components/dashboard/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select';
import {
  Search, Sparkles, Edit, Eye, Share2, BarChart3,
  Copy, MoreVertical, QrCode, Users, Trash2, Plus, X, Check, SlidersHorizontal,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getCards, createCard as apiCreateCard, deleteCard as apiDeleteCard, updateCard, BACKEND_URL, ApiCard } from '@/lib/api';

const sparklineData = [
  { value: 12 }, { value: 19 }, { value: 15 },
  { value: 25 }, { value: 22 }, { value: 30 }, { value: 28 },
];

const gradients = [
  'from-[#006312] to-[#000000]',
  'from-[#1E1E1E] to-[#000000]',
  'from-[#008001] to-[#000000]',
  'from-[#004d00] to-[#000000]',
];

// Derive the public base URL from the backend env or fall back to samcard.vercel.app
const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://samcard.vercel.app";

type CardType = ApiCard & {
  gradient?: string;
  trend?: typeof sparklineData;
  completion?: number;
  title?: string;
  views?: number;
  taps?: number;
  saves?: number;
};

export function MyCardsNew() {
  const [cards, setCards]                   = useState<CardType[]>([]);
  const [, setLoading]                      = useState(true);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('all');
  const [sort, setSort]                     = useState('recent');
  const [openMenu, setOpenMenu]             = useState<string | null>(null);
  const [previewCard, setPreviewCard]       = useState<CardType | null>(null);
  const [shareCard, setShareCard]           = useState<CardType | null>(null);
  const [statsCard, setStatsCard]           = useState<CardType | null>(null);
  const [editCard, setEditCard]             = useState<CardType | null>(null);
  const [editTitle, setEditTitle]           = useState('');
  const [toast, setToast]                   = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null);
  const [showCreate, setShowCreate]         = useState(false);
  const [newTitle, setNewTitle]             = useState('');
  const [showFilters, setShowFilters]       = useState(false);
  const nextId = useRef(1000);

  useEffect(() => {
    getCards()
      .then((data) => {
        const mapped = data.map((c, i) => ({
          ...c,
          title: c.name,
          views: c.totalViews,
          taps: c.totalTaps,
          saves: c.totalSaves,
          gradient: gradients[i % gradients.length],
          trend: sparklineData,
          completion: c.completionScore || 0,
        }));
        setCards(mapped);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  // ── helpers ──────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Returns the shareable public URL for a card
  const cardPublicUrl = (card: CardType) =>
    `${PUBLIC_BASE}/${card.slug}`;

  // Returns the preview URL (works for DRAFT too)
  const cardPreviewUrl = (card: CardType) =>
    `${PUBLIC_BASE}/${card.slug}?preview=true`;

  // ── derived list ─────────────────────────────────────────────────
  const visible = cards
    .filter(c => {
      const matchSearch = (c.title || '').toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'all' ||
        (filter === 'active' && c.status === 'ACTIVE') ||
        (filter === 'inactive' && c.status !== 'ACTIVE');
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sort === 'views') return (b.views ?? 0) - (a.views ?? 0);
      if (sort === 'name')  return (a.title || '').localeCompare(b.title || '');
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

  // ── actions ──────────────────────────────────────────────────────

  // Toggle ACTIVE ↔ DRAFT and persist to backend
  const toggleStatus = async (card: CardType) => {
    const newStatus = card.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';

    // Optimistic update
    setCards(prev =>
      prev.map(c => c.id === card.id ? { ...c, status: newStatus } : c)
    );

    try {
      await updateCard(card.id, { status: newStatus });
      showToast(newStatus === 'ACTIVE' ? 'Card published!' : 'Card set to draft.');
    } catch (err) {
      // Rollback on failure
      setCards(prev =>
        prev.map(c => c.id === card.id ? { ...c, status: card.status } : c)
      );
      showToast(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await apiDeleteCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      setConfirmDelete(null);
      showToast('Card deleted');
    } catch (error) {
      showToast(`Error deleting card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const duplicateCard = (card: CardType) => {
    const now = new Date().toISOString();
    const newCard: CardType = {
      ...card,
      id: String(nextId.current++),
      title: `${card.title} (Copy)`,
      name: `${card.name} (Copy)`,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      views: 0, taps: 0, saves: 0,
      gradient: gradients[card.id.charCodeAt(0) % gradients.length],
    };
    setCards(prev => [...prev, newCard]);
    showToast('Card duplicated!');
    setOpenMenu(null);
  };

  const saveEdit = async () => {
    if (!editCard || !editTitle.trim()) return;
    try {
      await updateCard(editCard.id, { name: editTitle } as any);
      setCards(prev =>
        prev.map(c => c.id === editCard.id ? { ...c, title: editTitle, name: editTitle } : c)
      );
      setEditCard(null);
      showToast('Card renamed!');
    } catch (err) {
      showToast(`Error renaming card: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createCard = async () => {
    if (!newTitle.trim()) return;
    try {
      const response = await apiCreateCard({ name: newTitle, cardType: 'QR' });
      const newCard: CardType = {
        ...response,
        title: response.name,
        views: response.totalViews,
        taps: response.totalTaps,
        saves: response.totalSaves,
        completion: response.completionScore,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
        trend: sparklineData,
      };
      setCards(prev => [...prev, newCard]);
      setShowCreate(false);
      setNewTitle('');
      showToast('New card created!');
    } catch (error) {
      showToast(`Error creating card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const copyLink = (card: CardType) => {
    navigator.clipboard.writeText(cardPublicUrl(card));
    showToast('Link copied to clipboard!');
    setShareCard(null);
  };

  const openPreview = (card: CardType) => {
    window.open(cardPreviewUrl(card), '_blank');
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-6 relative" onClick={() => setOpenMenu(null)}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 sm:top-6 right-4 sm:right-6 z-50 bg-[#008001] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 flex-shrink-0" /> {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="space-y-3 sm:space-y-0">
        {/* Row 1: title + create button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Cards</h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">
              {visible.length} of {cards.length} cards
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={e => { e.stopPropagation(); setShowFilters(f => !f); }}
              className="sm:hidden p-2 rounded-full border border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <Button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-[#49B618] to-[#008001] hover:from-[#009200] hover:to-[#006312] text-white rounded-full px-3 sm:px-6 h-9 sm:h-10 shadow-lg shadow-[#49B618]/35 text-sm"
            >
              <Sparkles className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Create New Card</span>
              <span className="sm:hidden sr-only">Create</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Search + filters */}
        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3`}>
          <div className="relative flex-1 sm:max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
            <Input
              placeholder="Search cards..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-full bg-[#000000] border-[#008001]/30 text-white rounded-full h-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-[#A0A0A0]" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="flex-1 sm:w-32 bg-[#008001] text-white border-0 rounded-full h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#000000] border-[#008001]/30">
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="flex-1 sm:w-40 bg-[#008001] text-white border-0 rounded-full h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#000000] border-[#008001]/30">
                <SelectItem value="recent">Sort: Recent</SelectItem>
                <SelectItem value="views">Sort: Most Views</SelectItem>
                <SelectItem value="name">Sort: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visible.map((card) => (
          <Card
            key={card.id}
            className="bg-[#000000] rounded-2xl border border-[#008001]/30 shadow-lg shadow-[#008001]/10 hover:border-[#49B618]/60 hover:shadow-xl hover:shadow-[#008001]/20 hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{card.title}</h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge className={`rounded-full px-2 sm:px-3 text-xs font-bold ${
                    card.status === 'ACTIVE'
                      ? 'bg-[#49B618]/15 text-[#49B618] hover:bg-[#49B618]/15'
                      : 'bg-[#A0A0A0]/15 text-[#A0A0A0] hover:bg-[#A0A0A0]/15'
                  }`}>
                    {card.status === 'ACTIVE' ? 'Active' : 'Draft'}
                  </Badge>

                  {/* 3-dot menu */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === card.id ? null : card.id)}
                      className="text-[#A0A0A0] hover:bg-[#1E1E1E] rounded-lg p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === card.id && (
                      <div className="absolute right-0 top-8 z-30 bg-[#0a0a0a] border border-[#008001]/30 rounded-xl shadow-2xl w-40 py-1">
                        <button onClick={() => { setEditCard(card); setEditTitle(card.title || ''); setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#008001]/20 flex items-center gap-2">
                          <Edit className="w-3 h-3" /> Rename
                        </button>
                        <button onClick={() => duplicateCard(card)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#008001]/20 flex items-center gap-2">
                          <Copy className="w-3 h-3" /> Duplicate
                        </button>
                        <button onClick={() => { openPreview(card); setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#008001]/20 flex items-center gap-2">
                          <Eye className="w-3 h-3" /> Preview
                        </button>
                        <button onClick={() => { setConfirmDelete(card.id); setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Card thumbnail */}
              <div className={`relative rounded-xl overflow-hidden aspect-[16/9] bg-gradient-to-br ${card.gradient}`}>
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'radial-gradient(circle, #49B618 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm font-semibold text-white truncate max-w-[140px]">{card.title}</p>
                </div>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 sm:px-3 py-1 rounded-full bg-black/35 backdrop-blur-md flex items-center gap-1">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">{(card.views ?? 0).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => copyLink(card)}
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/15 backdrop-blur-md hover:bg-white/25 flex items-center justify-center transition-colors"
                  title="Copy share link"
                >
                  <QrCode className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { label: 'Taps',  value: (card.taps ?? 0).toLocaleString() },
                  { label: 'Views', value: (card.views ?? 0).toLocaleString() },
                  { label: 'Saves', value: String(card.saves ?? 0) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#1E1E1E] rounded-xl p-2 sm:p-3 text-center">
                    <p className="text-sm sm:text-lg font-bold text-white">{value}</p>
                    <p className="text-[10px] sm:text-xs text-[#A0A0A0]">{label}</p>
                  </div>
                ))}
                <div className="bg-[#1E1E1E] rounded-xl p-2 sm:p-3 min-w-0">
                  <ResponsiveContainer width="100%" height={28} minWidth={0} minHeight={1}>
                    <LineChart data={card.trend}>
                      <Line type="monotone" dataKey="value" stroke="#49B618" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] sm:text-xs text-[#A0A0A0] text-center mt-1">7-day</p>
                </div>
              </div>

              {/* Completion bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Profile Completion</span>
                  <span className="text-xs font-bold text-[#49B618]">{card.completion}%</span>
                </div>
                <div className="relative h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#49B618] to-[#008001] rounded-full transition-all"
                    style={{ width: `${card.completion}%` }} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {[
                  { icon: Edit,      label: 'Edit',    onClick: () => { setEditCard(card); setEditTitle(card.title || ''); } },
                  { icon: Eye,       label: 'Preview', onClick: () => openPreview(card) },
                  { icon: Share2,    label: 'Share',   onClick: () => setShareCard(card)   },
                  { icon: BarChart3, label: 'Stats',   onClick: () => setStatsCard(card)   },
                ].map(({ icon: Icon, label, onClick }) => (
                  <Button key={label} onClick={onClick}
                    variant="outline"
                    className="border-[#008001]/30 text-white hover:bg-[#008001] hover:text-white h-8 sm:h-9 text-xs gap-1">
                    <Icon className="w-3 h-3" /> {label}
                  </Button>
                ))}
              </div>

              {/* Bottom row: Publish toggle */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#1E1E1E]">
                <button onClick={() => duplicateCard(card)}
                  className="text-xs text-[#A0A0A0] hover:text-[#008001] flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Duplicate
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-white">
                    {card.status === 'ACTIVE' ? 'Published' : 'Draft'}
                  </span>
                  <Switch
                    checked={card.status === 'ACTIVE'}
                    onCheckedChange={() => toggleStatus(card)}
                    className="data-[state=checked]:bg-[#49B618] scale-90 sm:scale-100"
                  />
                </div>

                <button onClick={() => setConfirmDelete(card.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create new tile */}
        <Card
          onClick={() => setShowCreate(true)}
          className="bg-[#000000] rounded-2xl border-2 border-dashed border-[#008001]/40 hover:border-[#49B618] hover:bg-[#1E1E1E] hover:shadow-lg hover:shadow-[#49B618]/10 transition-all duration-300 cursor-pointer group min-h-[200px] sm:min-h-[300px]"
        >
          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-[#008001] group-hover:border-[#49B618] flex items-center justify-center mb-3 sm:mb-4 transition-colors">
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-[#008001] group-hover:text-[#49B618] transition-colors" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">Create New Card</h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0] text-center">Design a new digital business card</p>
          </CardContent>
        </Card>
      </div>

      {/* No results */}
      {visible.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-[#A0A0A0] text-base sm:text-lg">No cards match your search.</p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); }}
            className="text-[#49B618] text-sm mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────────────────── */}

      {shareCard && (
        <Modal onClose={() => setShareCard(null)} title="Share Card">
          <p className="text-[#A0A0A0] text-sm mb-1">
            {shareCard.status !== 'ACTIVE' && (
              <span className="text-yellow-400 block mb-2">
                ⚠ This card is still a Draft. Publish it first so recipients can view it.
              </span>
            )}
            Share your card link
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              readOnly
              value={cardPublicUrl(shareCard)}
              className="bg-[#1E1E1E] border-[#008001]/30 text-white text-xs sm:text-sm"
            />
            <Button onClick={() => copyLink(shareCard)}
              className="bg-[#008001] hover:bg-[#006312] text-white flex-shrink-0">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['WhatsApp', 'Email', 'Twitter'].map(platform => (
              <button key={platform}
                onClick={() => { showToast(`Shared via ${platform}!`); setShareCard(null); }}
                className="py-2 px-2 sm:px-3 rounded-lg bg-[#1E1E1E] text-white text-xs sm:text-sm hover:bg-[#008001]/20 transition-colors">
                {platform}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {statsCard && (
        <Modal onClose={() => setStatsCard(null)} title={`Stats — ${statsCard.title}`}>
          <div className="space-y-4">
            {[
              { label: 'Total Views', value: statsCard.views ?? 0, pct: 100 },
              { label: 'NFC Taps',    value: statsCard.taps ?? 0,  pct: Math.round(((statsCard.taps ?? 0)  / Math.max(statsCard.views ?? 1, 1)) * 100) },
              { label: 'Saves',       value: statsCard.saves ?? 0, pct: Math.round(((statsCard.saves ?? 0) / Math.max(statsCard.views ?? 1, 1)) * 100) },
            ].map(({ label, value, pct }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-sm">{label}</span>
                  <span className="text-[#49B618] font-bold">{value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#49B618] to-[#008001] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-[#1E1E1E]">
              <p className="text-[#A0A0A0] text-xs">
                Profile completion: <span className="text-[#49B618] font-bold">{statsCard.completion}%</span>
              </p>
            </div>
          </div>
        </Modal>
      )}

      {editCard && (
        <Modal onClose={() => setEditCard(null)} title="Rename Card">
          <p className="text-[#A0A0A0] text-sm mb-2">Card name</p>
          <Input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            className="bg-[#1E1E1E] border-[#008001]/30 text-white mb-4"
            autoFocus
          />
          <Button onClick={saveEdit} className="w-full bg-[#008001] hover:bg-[#006312] text-white">
            Save Changes
          </Button>
        </Modal>
      )}

      {confirmDelete !== null && (
        <Modal onClose={() => setConfirmDelete(null)} title="Delete Card">
          <p className="text-[#A0A0A0] mb-6">Are you sure? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button onClick={() => setConfirmDelete(null)}
              variant="outline" className="flex-1 border-[#008001]/30 text-white hover:bg-[#1E1E1E]">
              Cancel
            </Button>
            <Button onClick={() => deleteCard(confirmDelete)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Create New Card">
          <p className="text-[#A0A0A0] text-sm mb-2">Card name</p>
          <Input
            placeholder="e.g. Conference Card"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createCard()}
            className="bg-[#1E1E1E] border-[#008001]/30 text-white mb-4"
            autoFocus
          />
          <Button onClick={createCard}
            className="w-full bg-gradient-to-r from-[#49B618] to-[#008001] hover:from-[#009200] hover:to-[#006312] text-white">
            <Sparkles className="w-4 h-4 mr-2" /> Create Card
          </Button>
        </Modal>
      )}

    </div>
  );
}

// ── Reusable Modal ────────────────────────────────────────────────
function Modal({
  onClose, title, children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-[#008001]/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="text-white font-bold text-base sm:text-lg">{title}</h3>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}