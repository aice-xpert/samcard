"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Badge } from '@/components/dashboard/ui/badge';
import { Input } from '@/components/dashboard/ui/input';
import { Switch } from '@/components/dashboard/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select';
import {
  Search, Sparkles, Edit, Eye, Share2, BarChart3,
  Copy, MoreVertical, QrCode, Users, Trash2, Plus, X, Check, SlidersHorizontal, Download,
} from 'lucide-react';
import {
  getCards,
  createCard as apiCreateCard,
  deleteCard as apiDeleteCard,
  duplicateCard as apiDuplicateCard,
  updateCard,
  getCardContent,
  getCardQRConfig,
  ApiCard,
  CardQRConfigPayload,
} from '@/lib/api';
import { QRWithShape, STICKER_DEFS } from '@/components/dashboard/pages/Qrrenderers';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import { LOGOS } from '@/components/dashboard/pages/constants';

const sparklineData = [
  { value: 12 }, { value: 19 }, { value: 15 },
  { value: 25 }, { value: 22 }, { value: 30 }, { value: 28 },
];

// Derive the public base URL from the backend env or fall back to samcard.vercel.app
const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://samcard.vercel.app";

type CardType = ApiCard & {
  trend?: typeof sparklineData;
  completion?: number;
  title?: string;
  views?: number;
  taps?: number;
  saves?: number;
};

type CardPreviewData = {
  name?: string;
  title?: string;
  profileImage?: string;
};

type CardTheme = {
  accent: string;
  accentLight: string;
  panel: string;
  previewBg: string;
};

const resolveCardTheme = (card: CardType): CardTheme => {
  const accent = card.accentColor || '#008001';
  const accentLight = card.accentLight || '#49B618';
  const panel = card.cardColor || '#1E1E1E';
  const wallpaperType = String(card.phoneBgType || '').toLowerCase();
  const bg1 = card.phoneBgColor1 || card.backgroundColor || panel;
  const bg2 = card.phoneBgColor2 || card.backgroundColor || '#000000';
  const angle = typeof card.phoneBgAngle === 'number' ? card.phoneBgAngle : 135;
  const previewBg =
    wallpaperType === 'gradient'
      ? `linear-gradient(${angle}deg, ${bg1}, ${bg2})`
      : bg1;

  return { accent, accentLight, panel, previewBg };
};

function Sparkline({ data, color }: { data: Array<{ value: number }>; color: string }) {
  if (!data?.length) return null;

  const w = 120;
  const h = 28;
  const min = Math.min(...data.map(d => d.value));
  const max = Math.max(...data.map(d => d.value));
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * w;
      const y = h - ((d.value - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

const normalizeHexForQrApi = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  const cleaned = value.trim().replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return cleaned.toLowerCase();
  return fallback;
};

const ensureSvgNamespaces = (svgText: string): string => {
  let normalized = svgText;
  if (!/xmlns=/.test(normalized)) {
    normalized = normalized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!/xmlns:xlink=/.test(normalized)) {
    normalized = normalized.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  return normalized;
};

const sanitizeHiddenSvgRootStyles = (styleValue: string): string => {
  const hiddenKeys = new Set([
    'position',
    'width',
    'height',
    'opacity',
    'pointer-events',
    'display',
    'visibility',
    'left',
    'top',
  ]);

  return styleValue
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
    .filter((rule) => {
      const separatorIndex = rule.indexOf(':');
      if (separatorIndex === -1) return true;
      const key = rule.slice(0, separatorIndex).trim().toLowerCase();
      return !hiddenKeys.has(key);
    })
    .join('; ');
};

const sanitizeExportSvg = (svgText: string): string => {
  try {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(svgText, 'image/svg+xml');
    if (documentNode.querySelector('parsererror')) {
      return svgText;
    }

    const svgRoot = documentNode.documentElement;
    if (svgRoot.tagName.toLowerCase() !== 'svg') {
      return svgText;
    }

    svgRoot.removeAttribute('aria-hidden');
    svgRoot.removeAttribute('focusable');

    const rootStyle = svgRoot.getAttribute('style');
    if (rootStyle) {
      const cleanedStyle = sanitizeHiddenSvgRootStyles(rootStyle);
      if (cleanedStyle) {
        svgRoot.setAttribute('style', cleanedStyle);
      } else {
        svgRoot.removeAttribute('style');
      }
    }

    const width = svgRoot.getAttribute('width');
    if (!width || width === '0' || width === '0px') {
      svgRoot.setAttribute('width', '360');
    }

    const height = svgRoot.getAttribute('height');
    if (!height || height === '0' || height === '0px') {
      svgRoot.setAttribute('height', '360');
    }

    if (!svgRoot.getAttribute('preserveAspectRatio')) {
      svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    return new XMLSerializer().serializeToString(svgRoot);
  } catch {
    return svgText;
  }
};

const stripExternalSvgImages = (svgText: string): string => {
  try {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(svgText, 'image/svg+xml');
    if (documentNode.querySelector('parsererror')) {
      return svgText;
    }

    documentNode.querySelectorAll('image').forEach((node) => {
      const href = node.getAttribute('href') || node.getAttribute('xlink:href') || '';
      const normalizedHref = href.trim().toLowerCase();

      if (!normalizedHref) {
        node.remove();
        return;
      }

      if (
        normalizedHref.startsWith('http://') ||
        normalizedHref.startsWith('https://') ||
        normalizedHref.startsWith('//')
      ) {
        node.remove();
      }
    });

    return new XMLSerializer().serializeToString(documentNode.documentElement);
  } catch {
    return svgText;
  }
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Failed to encode image blob'));
    };
    reader.onerror = () => reject(new Error('Failed to read image blob'));
    reader.readAsDataURL(blob);
  });

const inlineExternalSvgImages = async (svgText: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(svgText, 'image/svg+xml');
    if (documentNode.querySelector('parsererror')) {
      return svgText;
    }

    const imageNodes = Array.from(documentNode.querySelectorAll('image'));
    if (!imageNodes.length) {
      return svgText;
    }

    await Promise.all(
      imageNodes.map(async (node) => {
        const href = node.getAttribute('href') || node.getAttribute('xlink:href') || '';
        const normalizedHref = href.trim().toLowerCase();

        if (!normalizedHref) return;
        if (normalizedHref.startsWith('data:')) return;
        if (
          !normalizedHref.startsWith('http://') &&
          !normalizedHref.startsWith('https://') &&
          !normalizedHref.startsWith('//')
        ) {
          return;
        }

        try {
          const response = await fetch(href);
          if (!response.ok) return;
          const imageBlob = await response.blob();
          const dataUrl = await blobToDataUrl(imageBlob);
          node.setAttribute('href', dataUrl);
          node.setAttribute('xlink:href', dataUrl);
        } catch {
          // keep original href if we cannot inline
        }
      }),
    );

    return new XMLSerializer().serializeToString(documentNode.documentElement);
  } catch {
    return svgText;
  }
};

const triggerBlobDownload = (blob: Blob, fileName: string): void => {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
};

const imageUrlToJpegBlob = async (imageUrl: string, size = 1400): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const instance = new Image();
    instance.onload = () => resolve(instance);
    instance.onerror = () => reject(new Error('Failed to load QR image for JPG conversion'));
    instance.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to initialize canvas context');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to export JPG file'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.96);
  });
};

const svgTextToJpegBlob = async (svgText: string, size = 1400): Promise<Blob> => {
  const exportSvgAsJpeg = async (inputSvgText: string): Promise<Blob> => {
    const sanitizedSvg = sanitizeExportSvg(inputSvgText);
    const normalizedSvg = ensureSvgNamespaces(sanitizedSvg);
    const svgBlob = new Blob([normalizedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      return await imageUrlToJpegBlob(svgUrl, size);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  try {
    const inlinedSvg = await inlineExternalSvgImages(svgText);
    return await exportSvgAsJpeg(inlinedSvg);
  } catch {
    const strippedSvg = stripExternalSvgImages(svgText);
    return await exportSvgAsJpeg(strippedSvg);
  }
};

interface MyCardsNewProps {
  onEditCard?: (cardId: string) => void;
  onCreateBusinessCard?: () => void;
  onNavigate?: (page: string) => void;
  onViewAnalytics?: (cardId: string, cardTitle: string) => void;
}

export function MyCardsNew({ onEditCard, onCreateBusinessCard, onNavigate, onViewAnalytics }: MyCardsNewProps = {}) {
  const [cards, setCards]                   = useState<CardType[]>([]);
  const [, setLoading]                      = useState(true);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('all');
  const [sort, setSort]                     = useState('recent');
  const [openMenu, setOpenMenu]             = useState<string | null>(null);
  const [shareCard, setShareCard]           = useState<CardType | null>(null);
  const [statsCard, setStatsCard]           = useState<CardType | null>(null);
  const [editCard, setEditCard]             = useState<CardType | null>(null);
  const [editTitle, setEditTitle]           = useState('');
  const [toast, setToast]                   = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null);
  const [showCreate, setShowCreate]         = useState(false);
  const [newTitle, setNewTitle]             = useState('');
  const [newCardType, setNewCardType]       = useState<'QR' | 'NFC' | 'HYBRID' | 'LINK'>('QR');
  const [showFilters, setShowFilters]       = useState(false);
  const [cardPreviewById, setCardPreviewById] = useState<Record<string, CardPreviewData>>({});
  const [cardQrById, setCardQrById] = useState<Record<string, CardQRConfigPayload | null>>({});
  const [downloadingQrId, setDownloadingQrId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const qrSvgRefs = useRef<Record<string, SVGSVGElement | null>>({});

  const setQrSvgRef = useCallback((cardId: string, element: SVGSVGElement | null) => {
    qrSvgRefs.current[cardId] = element;
  }, []);

  const loadCardAssets = useCallback(async (cardIds: string[]) => {
    if (!cardIds.length) return;

    const settled = await Promise.all(
      cardIds.map(async (id) => {
        const [content, qrConfig] = await Promise.all([
          getCardContent(id).catch(() => null),
          getCardQRConfig(id).catch(() => null),
        ]);

        return { id, content, qrConfig };
      }),
    );

    setCardPreviewById((prev) => {
      const next = { ...prev };
      settled.forEach(({ id, content }) => {
        if (!content) return;
        next[id] = {
          name: content.formData?.name || '',
          title: content.formData?.title || '',
          profileImage: content.profileImage || '',
        };
      });
      return next;
    });

    setCardQrById((prev) => {
      const next = { ...prev };
      settled.forEach(({ id, qrConfig }) => {
        next[id] = qrConfig;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getCards()
      .then((data) => {
        if (!active) return;
        const mapped = data.map((c, i) => ({
          ...c,
          title: c.name,
          views: c.totalViews,
          taps: c.totalTaps,
          saves: c.totalSaves,
          trend: sparklineData,
          completion: c.completionScore || 0,
        }));
        setCards(mapped);
        void loadCardAssets(mapped.map((card) => card.id));
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));

    return () => {
      active = false;
    };
  }, [loadCardAssets]);

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
    // BUG-21: Prevent multiple simultaneous toggles on the same card
    if (togglingIds.has(card.id)) return;

    const newStatus = card.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';

    setTogglingIds(prev => new Set(prev).add(card.id));

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
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await apiDeleteCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      setCardPreviewById(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setCardQrById(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      delete qrSvgRefs.current[id];
      setConfirmDelete(null);
      showToast('Card deleted');
    } catch (error) {
      showToast(`Error deleting card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const duplicateCard = async (card: CardType) => {
    setDuplicatingId(card.id);
    try {
      const duplicated = await apiDuplicateCard(card.id);
      const mapped: CardType = {
        ...duplicated,
        title: duplicated.name,
        views: duplicated.totalViews,
        taps: duplicated.totalTaps,
        saves: duplicated.totalSaves,
        completion: duplicated.completionScore,
        trend: sparklineData,
      };
      setCards(prev => [mapped, ...prev]);
      void loadCardAssets([mapped.id]);
      showToast('Card duplicated!');
    } catch (error) {
      showToast(`Error duplicating card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDuplicatingId(null);
      setOpenMenu(null);
    }
  };

  const saveEdit = async () => {
    if (!editCard || !editTitle.trim()) return;
    // BUG-20: Prevent renaming to an existing card's name
    const duplicate = cards.find(
      c => c.id !== editCard.id && c.name.toLowerCase() === editTitle.trim().toLowerCase()
    );
    if (duplicate) {
      showToast('A card with this name already exists. Please choose a unique name.');
      return;
    }
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
    // BUG-20: Prevent creating a card with a duplicate name
    const duplicate = cards.find(
      c => c.name.toLowerCase() === newTitle.trim().toLowerCase()
    );
    if (duplicate) {
      showToast('A card with this name already exists. Please choose a unique name.');
      return;
    }
    try {
      const response = await apiCreateCard({ name: newTitle, cardType: newCardType });
      const newCard: CardType = {
        ...response,
        title: response.name,
        views: response.totalViews,
        taps: response.totalTaps,
        saves: response.totalSaves,
        completion: response.completionScore,
        trend: sparklineData,
      };
      setCards(prev => [...prev, newCard]);
      void loadCardAssets([newCard.id]);
      setShowCreate(false);
      setNewTitle('');
      setNewCardType('QR');
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

  const downloadVariantQr = useCallback(async (card: CardType) => {
    setDownloadingQrId(card.id);

    try {
      const svgElement = qrSvgRefs.current[card.id];

      if (svgElement) {
        const svgText = new XMLSerializer().serializeToString(svgElement);
        const jpgBlob = await svgTextToJpegBlob(svgText);
        triggerBlobDownload(jpgBlob, `${card.slug}-qr.jpg`);
        showToast('Custom QR downloaded (.jpg)');
        return;
      }

      const qrConfig = cardQrById[card.id];
      const fg = normalizeHexForQrApi(qrConfig?.fg, '000000');
      const bg = normalizeHexForQrApi(qrConfig?.bg, 'ffffff');
      const safeFg = fg === bg ? '000000' : fg;
      const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&margin=40&data=${encodeURIComponent(cardPublicUrl(card))}&color=${safeFg}&bgcolor=${bg}`;

      const response = await fetch(fallbackUrl);
      if (!response.ok) {
        throw new Error(`QR generation failed (${response.status})`);
      }

      const pngBlob = await response.blob();
      const pngUrl = URL.createObjectURL(pngBlob);

      try {
        const jpgBlob = await imageUrlToJpegBlob(pngUrl);
        triggerBlobDownload(jpgBlob, `${card.slug}-qr.jpg`);
      } finally {
        URL.revokeObjectURL(pngUrl);
      }

      showToast('QR downloaded (.jpg)');
    } catch (error) {
      showToast(`Failed to download QR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloadingQrId(null);
    }
  }, [cardQrById]);

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
              onClick={() => (onCreateBusinessCard ? onCreateBusinessCard() : setShowCreate(true))}
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
        {visible.map((card) => {
          const theme = resolveCardTheme(card);
          const preview = cardPreviewById[card.id];
          const previewName = preview?.name?.trim() || card.title || card.name;
          const previewTitle = preview?.title?.trim() || '';
          const previewImage = preview?.profileImage?.trim() || '';

          const qrConfig = cardQrById[card.id] || null;
          const qrMatrixData = makeQRMatrix(cardPublicUrl(card));
          const qrGradientId = `mycards-qr-grad-${card.id}`;
          const gradientStops = qrConfig?.gradStops ?? [];
          const qrBg = qrConfig?.bg || '#ffffff';
          const qrSolidFg = qrConfig?.fg || '#000000';
          const safeQrSolidFg =
            qrSolidFg.toLowerCase() === qrBg.toLowerCase() ? '#000000' : qrSolidFg;
          const qrFill = qrConfig?.gradEnabled && gradientStops.length >= 2
            ? `url(#${qrGradientId})`
            : safeQrSolidFg;
          const gradAngle = typeof qrConfig?.gradAngle === 'number' ? qrConfig.gradAngle : 135;
          const selectedSticker = qrConfig?.stickerId
            ? STICKER_DEFS.find((sticker) => sticker.id === qrConfig.stickerId) ?? null
            : null;
          const qrRenderSize = selectedSticker ? 260 : 320;
          const qrRenderOffset = (320 - qrRenderSize) / 2;

          const logoIndex = qrConfig?.selectedLogo?.startsWith('logo-')
            ? Number.parseInt(qrConfig.selectedLogo.replace('logo-', ''), 10)
            : -1;
          const logoPreset = Number.isInteger(logoIndex) && logoIndex >= 0 && logoIndex < LOGOS.length
            ? LOGOS[logoIndex]
            : null;

          return (
          <Card
            key={card.id}
            className="bg-[#000000] rounded-2xl border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{
              borderColor: `${theme.accent}4d`,
              boxShadow: `0 8px 24px ${theme.accent}1a`,
            }}
          >
            <CardHeader className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{card.title}</h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge className={`rounded-full px-2 sm:px-3 text-xs font-bold ${
                    card.status === 'ACTIVE'
                      ? 'hover:opacity-95'
                      : 'bg-[#A0A0A0]/15 text-[#A0A0A0] hover:bg-[#A0A0A0]/15'
                  }`}
                  style={card.status === 'ACTIVE'
                    ? {
                        backgroundColor: `${theme.accent}26`,
                        color: theme.accentLight,
                      }
                    : undefined
                  }>
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
                        <button onClick={() => duplicateCard(card)} disabled={duplicatingId === card.id}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#008001]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                          <Copy className="w-3 h-3" /> {duplicatingId === card.id ? 'Duplicating…' : 'Duplicate'}
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
              <div className="relative rounded-xl overflow-hidden aspect-[16/9]"
                style={{ background: theme.previewBg }}>
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: `radial-gradient(circle, ${theme.accentLight} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                    {previewImage ? (
                      <img src={previewImage} alt={previewName} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm font-semibold text-white truncate max-w-[170px]">{previewName}</p>
                  {previewTitle && (
                    <p className="text-[10px] sm:text-xs text-white/80 truncate max-w-[170px] mt-0.5">{previewTitle}</p>
                  )}
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
                  { label: 'Taps',  value: (card.taps ?? 0).toLocaleString(), onClick: undefined },
                  { label: 'Views', value: (card.views ?? 0).toLocaleString(), onClick: undefined },
                  { label: 'Leads', value: String(card.saves ?? 0), onClick: undefined },
                ].map(({ label, value, onClick }) => (
                  <div
                    key={label}
                    onClick={onClick}
                    className={`rounded-xl p-2 sm:p-3 text-center${onClick ? ' cursor-pointer hover:ring-1 hover:ring-[#008001]/40 transition-all' : ''}`}
                    style={{ backgroundColor: theme.panel }}
                  >
                    <p className="text-sm sm:text-lg font-bold text-white">{value}</p>
                    <p className="text-[10px] sm:text-xs text-[#A0A0A0]">{label}</p>
                  </div>
                ))}
                <div className="rounded-xl p-2 sm:p-3 min-w-0" style={{ backgroundColor: theme.panel }}>
                  <Sparkline data={card.trend ?? sparklineData} color={theme.accentLight} />
                  <p className="text-[10px] sm:text-xs text-[#A0A0A0] text-center mt-1">7-day</p>
                </div>
              </div>

              {/* Completion bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Profile Completion</span>
                  <span className="text-xs font-bold" style={{ color: theme.accentLight }}>{card.completion}%</span>
                </div>
                <div className="relative h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#49B618] to-[#008001] rounded-full transition-all"
                    style={{
                      width: `${card.completion}%`,
                      backgroundImage: `linear-gradient(to right, ${theme.accentLight}, ${theme.accent})`,
                    }} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {[
                  {
                    icon: Edit,
                    label: 'Edit',
                    onClick: () => {
                      if (onEditCard) {
                        onEditCard(card.id);
                        return;
                      }
                      setEditCard(card);
                      setEditTitle(card.title || '');
                    },
                  },
                  { icon: Eye,       label: 'Preview', onClick: () => openPreview(card) },
                  { icon: Share2,    label: 'Share',   onClick: () => setShareCard(card)   },
                  { icon: BarChart3, label: 'Stats',   onClick: () => setStatsCard(card)   },
                  {
                    icon: Download,
                    label: downloadingQrId === card.id ? 'Downloading...' : 'Download QR',
                    onClick: () => { void downloadVariantQr(card); },
                    disabled: downloadingQrId === card.id,
                  },
                  {
                    icon: Users,
                    label: 'Leads',
                    onClick: () => {
                      onViewAnalytics?.(card.id, card.title ?? card.id);
                    },
                  },
                ].map(({ icon: Icon, label, onClick, disabled }) => (
                  <Button key={label} onClick={onClick}
                    disabled={Boolean(disabled)}
                    variant="outline"
                    className="border-[#008001]/30 text-white hover:bg-[#008001] hover:text-white h-8 sm:h-9 text-xs gap-1">
                    <Icon className="w-3 h-3" /> {label}
                  </Button>
                ))}
              </div>

              {/* Hidden SVG used for per-variant custom QR downloads */}
              <svg
                ref={(element) => setQrSvgRef(card.id, element)}
                viewBox="0 0 360 360"
                width="360"
                height="360"
                aria-hidden="true"
                style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
              >
                {qrConfig?.gradEnabled && gradientStops.length >= 2 && (
                  <defs>
                    <linearGradient
                      id={qrGradientId}
                      x1={`${50 - 50 * Math.cos((gradAngle * Math.PI) / 180)}%`}
                      y1={`${50 - 50 * Math.sin((gradAngle * Math.PI) / 180)}%`}
                      x2={`${50 + 50 * Math.cos((gradAngle * Math.PI) / 180)}%`}
                      y2={`${50 + 50 * Math.sin((gradAngle * Math.PI) / 180)}%`}
                    >
                      {gradientStops.map((stop, index) => (
                        <stop key={`${card.id}-grad-${index}`} offset={`${Math.max(0, Math.min(1, stop.offset)) * 100}%`} stopColor={stop.color} />
                      ))}
                    </linearGradient>
                  </defs>
                )}
                <rect width="360" height="360" fill={qrBg} rx="20" />
                <g transform="translate(20,20)">
                  <g transform={`translate(${qrRenderOffset},${qrRenderOffset})`}>
                    <QRWithShape
                      shapeId={qrConfig?.shapeId || 'square'}
                      dotShape={qrConfig?.dotShape || 'square'}
                      finderStyle={qrConfig?.finderStyle || 'square'}
                      eyeBall={qrConfig?.eyeBall || 'square'}
                      fg={qrFill}
                      bg={qrBg}
                      accentFg={qrConfig?.accentFg || safeQrSolidFg}
                      accentBg={qrConfig?.accentBg || qrBg}
                      scale={typeof qrConfig?.bodyScale === 'number' ? qrConfig.bodyScale : 1}
                      strokeEnabled={Boolean(qrConfig?.strokeEnabled)}
                      strokeColor={qrConfig?.strokeColor || '#000000'}
                      selectedLogo={qrConfig?.selectedLogo || null}
                      customLogoUrl={qrConfig?.customLogoUrl || null}
                      logoNode={logoPreset?.icon ?? null}
                      logoBg={logoPreset?.bg ?? qrConfig?.logoBg ?? '#ffffff'}
                      size={qrRenderSize}
                      clipId={`mycards-qr-clip-${card.id}`}
                      qrMatrix={qrMatrixData.matrix}
                      qrN={qrMatrixData.N}
                    />
                  </g>
                  {selectedSticker && selectedSticker.render(320, qrRenderSize)}
                </g>
              </svg>

              {/* Bottom row: Publish toggle */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#1E1E1E]">
                <button onClick={() => duplicateCard(card)} disabled={duplicatingId === card.id}
                  className="text-xs text-[#A0A0A0] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: duplicatingId === card.id ? '#A0A0A0' : undefined }}
                  onMouseEnter={(e) => { if (duplicatingId !== card.id) e.currentTarget.style.color = theme.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#A0A0A0'; }}>
                  <Copy className="w-3 h-3" /> {duplicatingId === card.id ? 'Duplicating…' : 'Duplicate'}
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-white">
                    {card.status === 'ACTIVE' ? 'Published' : 'Draft'}
                  </span>
                  <Switch
                    checked={card.status === 'ACTIVE'}
                    onCheckedChange={() => toggleStatus(card)}
                    disabled={togglingIds.has(card.id)}
                    className="scale-90 sm:scale-100"
                    style={card.status === 'ACTIVE' ? { backgroundColor: theme.accentLight } : undefined}
                  />
                </div>

                <button onClick={() => setConfirmDelete(card.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </CardContent>
          </Card>
        );})}

        {/* Create new tile */}
        <Card
          onClick={() => (onCreateBusinessCard ? onCreateBusinessCard() : setShowCreate(true))}
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
        <Modal onClose={() => setEditCard(null)} title="Edit Card">
          <p className="text-[#A0A0A0] text-sm mb-2">Card name</p>
          <Input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            className="bg-[#1E1E1E] border-[#008001]/30 text-white mb-4"
            autoFocus
          />
          <div className="mb-4">
            <p className="text-[#A0A0A0] text-xs mb-2">Card links</p>
            <div className="space-y-2">
              <Input
                readOnly
                value={cardPublicUrl(editCard)}
                className="bg-[#1E1E1E] border-[#008001]/30 text-white text-xs"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => navigator.clipboard.writeText(cardPublicUrl(editCard))}
                  variant="outline"
                  className="flex-1 border-[#008001]/30 text-white hover:bg-[#1E1E1E]"
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy Public Link
                </Button>
                <Button
                  onClick={() => openPreview(editCard)}
                  variant="outline"
                  className="flex-1 border-[#008001]/30 text-white hover:bg-[#1E1E1E]"
                >
                  <Eye className="w-4 h-4 mr-1" /> Preview
                </Button>
              </div>
            </div>
          </div>
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
          <p className="text-[#A0A0A0] text-sm mb-2">Card type</p>
          <Select value={newCardType} onValueChange={(value) => setNewCardType(value as 'QR' | 'NFC' | 'HYBRID' | 'LINK')}>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-[#008001]/30 text-white mb-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#000000] border-[#008001]/30">
              <SelectItem value="QR">QR</SelectItem>
              <SelectItem value="NFC">NFC</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
              <SelectItem value="LINK">Link</SelectItem>
            </SelectContent>
          </Select>
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
