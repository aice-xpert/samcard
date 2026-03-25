

import qrcodegen from "qrcode-generator";

export interface QRMatrix {
    /** 2-D boolean grid: true = dark module */
    matrix: boolean[][];
    /** Side length in modules (version-dependent, e.g. 21, 29, 33 …) */
    N: number;
}

/**
 * Generate a real, scannable QR matrix for `url` at error-correction level H.
 *
 * - Automatically picks the smallest QR version that fits the data.
 * - Level H = 30% error recovery, mandatory for shaped QR codes where
 *   edge modules may be omitted from the final render.
 */
export function makeQRMatrix(url: string): QRMatrix {
    // Type-0 = auto-select minimum version
    const qr = qrcodegen(0, "H");
    qr.addData(url);
    qr.make();

    const N = qr.getModuleCount();
    const matrix: boolean[][] = [];

    for (let r = 0; r < N; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < N; c++) {
            row.push(qr.isDark(r, c));
        }
        matrix.push(row);
    }

    return { matrix, N };
}

/**
 * Returns true if (r, c) is inside one of the three 7×7 finder-pattern zones.
 * Works for any QR version (N is dynamic).
 *
 * Finder zones (inclusive):
 *   TL  rows 0-6,   cols 0-6
 *   TR  rows 0-6,   cols N-7 to N-1
 *   BL  rows N-7 to N-1, cols 0-6
 *
 * We also exclude the 1-module-wide separator row/col around each finder
 * (row 7, col 7, row N-8, col N-8) from the data-dot renderer because the
 * library's isDark() already encodes those as light — they just look wrong
 * if accidentally rendered as dots.
 */
export function isFinderCell(r: number, c: number, N: number): boolean {
    // Core 7×7 finder zones + 1-module separator band
    const inTL = r <= 7 && c <= 7;
    const inTR = r <= 7 && c >= N - 8;
    const inBL = r >= N - 8 && c <= 7;
    return inTL || inTR || inBL;
}

/**
 * Returns the top-left module coordinate of each finder pattern.
 * Used by renderFinder() to know where to draw each 7×7 block.
 */
export function getFinderOrigins(N: number): Array<{ r: number; c: number }> {
    return [
        { r: 0, c: 0 },   // Top-left
        { r: 0, c: N - 7 },   // Top-right
        { r: N - 7, c: 0 },   // Bottom-left
    ];
}

// ─── Backward-compat shim for code that still imports QR_GRID / isFinderCell
// from constants.tsx.  Replace those imports with this module gradually.
// ─────────────────────────────────────────────────────────────────────────────
// Legacy 21×21 fake grid — used only by QRStyled (pre-designed thumbnails).
// Thumbnails don't need to be scannable so the fake grid is acceptable there.
function makeFakeGrid(): boolean[][] {
    return Array.from({ length: 21 }, (_, row) =>
        Array.from({ length: 21 }, (_, col) => {
            const inFinder = (r: number, c: number, or: number, oc: number) => {
                const dr = r - or, dc = c - oc;
                return dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 &&
                    (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
            };
            if (inFinder(row, col, 0, 0)) return true;
            if (inFinder(row, col, 0, 14)) return true;
            if (inFinder(row, col, 14, 0)) return true;
            if (row === 6 && col > 7 && col < 13) return col % 2 === 0;
            if (col === 6 && row > 7 && row < 13) return row % 2 === 0;
            return (row * 31 + col * 17 + row * col) % 7 < 3;
        })
    );
}
export const LEGACY_QR_GRID: boolean[][] = makeFakeGrid();
export function isFinderCell21(r: number, c: number): boolean {
    return isFinderCell(r, c, 21);
}