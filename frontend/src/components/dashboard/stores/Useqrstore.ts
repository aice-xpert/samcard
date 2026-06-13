// src/stores/useQrStore.ts
// Shared store — NfcQr writes here on every config change.
// PhonePreview & CardPreviewModal read from here via QrPopup.

import { create } from 'zustand';
import type { QRCustomConfig } from '@/components/dashboard/pages/Qrcustomizer';

interface QrStore {
  qrConfig: QRCustomConfig | null;
  qrMatrix: boolean[][] | null;
  qrN:      number | null;
  setQr: (cfg: QRCustomConfig | null, matrix: boolean[][], N: number) => void;
}

export const useQrStore = create<QrStore>((set) => ({
  qrConfig: null,
  qrMatrix: null,
  qrN:      null,
  setQr: (cfg, matrix, N) => set({ qrConfig: cfg, qrMatrix: matrix, qrN: N }),
}));