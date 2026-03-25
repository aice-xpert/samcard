
// ─── THEME ────────────────────────────────────────────────────────────────────
export const T = {
    bg: "#080f08",
    surface: "#0d1a0d",
    surface2: "#0a140a",
    surfaceHover: "#112211",
    border: "#1a3320",
    borderHi: "#22c55e44",
    accent: "#22c55e",
    accentDark: "#16a34a",
    accentGrad: "linear-gradient(135deg,#22c55e,#16a34a)",
    accentGlow: "0 0 18px rgba(34,197,94,0.25)",
    text: "#f0fdf4",
    textMuted: "#86efac",
    textDim: "#4d7a5a",
    selected: "#052e16",
    selectedBorder: "#22c55e",
    tabActive: "#22c55e",
    inputBg: "#071007",
    danger: "#f87171",
    badge: "#14532d",
};

// ─── QR OUTLINE SHAPES ────────────────────────────────────────────────────────
export const QR_SHAPES = [
    { id: "square", label: "Square", path: "M 1,1 H 99 V 99 H 1 Z" },
    { id: "circle", label: "Circle", path: "M 50,50 m -48,0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0" },
    { id: "heart", label: "Heart", path: "M 50,82 C 10,58 1,43 1,29 C 1,14 13,4 26,4 C 36,4 45,10 50,19 C 55,10 64,4 74,4 C 87,4 99,14 99,29 C 99,43 90,58 50,82 Z" },
    { id: "hexagon", label: "Hexagon", path: "M 50,2 L 93,26 L 93,74 L 50,98 L 7,74 L 7,26 Z" },
    { id: "speech", label: "Speech Bubble", path: "M 4,4 H 96 Q 99,4 99,8 V 68 Q 99,72 96,72 H 58 L 50,88 L 42,72 H 4 Q 1,72 1,68 V 8 Q 1,4 4,4 Z" },
    { id: "star", label: "Star", path: "M 50,2 L 61,35 L 97,35 L 68,56 L 79,90 L 50,70 L 21,90 L 32,56 L 3,35 L 39,35 Z" },
    { id: "diamond", label: "Diamond", path: "M 50,2 L 98,50 L 50,98 L 2,50 Z" },
    { id: "teardrop", label: "Teardrop", path: "M 50,4 C 71,4 88,21 88,44 C 88,67 70,87 50,96 C 30,87 12,67 12,44 C 12,21 29,4 50,4 Z" },
    { id: "shield", label: "Shield", path: "M 50,4 L 90,19 L 90,54 C 90,74 70,89 50,97 C 30,89 10,74 10,54 L 10,19 Z" },
    { id: "rounded-square", label: "Rounded Square", path: "M 14,2 H 86 Q 98,2 98,14 V 86 Q 98,98 86,98 H 14 Q 2,98 2,86 V 14 Q 2,2 14,2 Z" },
    { id: "octagon", label: "Octagon", path: "M 34,2 L 66,2 L 98,34 L 98,66 L 66,98 L 34,98 L 2,66 L 2,34 Z" },
    { id: "cloud", label: "Cloud", path: "M 24,66 C 9,66 2,55 2,47 C 2,37 11,29 24,29 C 26,19 34,11 48,11 C 61,11 70,19 73,29 C 81,27 91,33 91,45 C 91,55 83,66 70,66 Z" },
    { id: "arrow", label: "Arrow", path: "M 2,34 H 54 V 13 L 98,50 L 54,87 V 66 H 2 Z" },
    { id: "badge", label: "Badge", path: "M 50,4 L 57,19 L 75,14 L 70,32 L 87,39 L 75,54 L 80,72 L 63,71 L 57,89 L 43,77 L 27,87 L 28,69 L 10,64 L 22,49 L 11,34 L 29,31 L 25,14 L 43,21 Z" },
    { id: "cross", label: "Cross", path: "M 34,2 H 66 V 34 H 98 V 66 H 66 V 98 H 34 V 66 H 2 V 34 H 34 Z" },
];

// ─── PRE-DESIGNS ──────────────────────────────────────────────────────────────
export const PRE_DESIGNS = [
    // Plain styles
    { id: "classic", label: "Classic", dotShape: "square", finderStyle: "square", fg: "#111111", bg: "#ffffff" },
    { id: "dots-blue", label: "Blue Dots", dotShape: "dot", finderStyle: "circle", fg: "#1565c0", bg: "#e3f2fd", accentFg: "#0d47a1", accentBg: "#1565c0" },
    { id: "dots-green", label: "Green Dots", dotShape: "dot", finderStyle: "circle", fg: "#2e7d32", bg: "#e8f5e9", accentFg: "#1b5e20", accentBg: "#2e7d32" },
    { id: "rounded-red", label: "Red Rounded", dotShape: "rounded", finderStyle: "rounded", fg: "#c62828", bg: "#fff9f9", accentFg: "#b71c1c", accentBg: "#c62828" },
    { id: "diamond-pur", label: "Purple Gems", dotShape: "diamond", finderStyle: "square", fg: "#6a1b9a", bg: "#f3e5f5", accentFg: "#4a148c", accentBg: "#6a1b9a" },
    { id: "cross-teal", label: "Teal Cross", dotShape: "cross", finderStyle: "square", fg: "#00695c", bg: "#e0f2f1", accentFg: "#004d40", accentBg: "#00695c" },
    { id: "star-amber", label: "Amber Stars", dotShape: "star", finderStyle: "rounded", fg: "#e65100", bg: "#fff8e1", accentFg: "#bf360c", accentBg: "#e65100" },
    { id: "dot-navy", label: "Navy Classic", dotShape: "dot", finderStyle: "dot-outline", fg: "#1a237e", bg: "#e8eaf6", accentFg: "#0d1b6e", accentBg: "#283593" },
    { id: "rounded-blk", label: "Soft Black", dotShape: "rounded", finderStyle: "rounded", fg: "#212121", bg: "#0a140a", accentFg: "#000000", accentBg: "#212121" },
    { id: "cross-rose", label: "Rose Cross", dotShape: "cross", finderStyle: "rounded", fg: "#ad1457", bg: "#fce4ec", accentFg: "#880e4f", accentBg: "#c2185b" },
    { id: "diamond-grn", label: "Forest Gems", dotShape: "diamond", finderStyle: "square", fg: "#1b5e20", bg: "#f1f8e9", accentFg: "#33691e", accentBg: "#2e7d32" },
    { id: "square-slate", label: "Slate", dotShape: "square", finderStyle: "square", fg: "#37474f", bg: "#eceff1", accentFg: "#263238", accentBg: "#455a64" },
    // Sticker styles
    {
        id: "sticker-like", label: "Like Us",
        dotShape: "dot", finderStyle: "rounded",
        fg: "#1565c0", bg: "#ffffff",
        accentFg: "#0d47a1", accentBg: "#1976d2",
        sticker: { text: "Like Us", icon: "thumbsUp", color: "#1565c0", outline: "#1565c0", pos: "top-left" },
    },
    {
        id: "sticker-scan", label: "Scan Me",
        dotShape: "dot", finderStyle: "rounded",
        fg: "#e53935", bg: "#fff5f5",
        accentFg: "#b71c1c", accentBg: "#e53935",
        sticker: { text: "Scan Me", icon: "qrScan", color: "#e53935", outline: "#e53935", pos: "top-right" },
    },
    {
        id: "sticker-watch", label: "Watch Video",
        dotShape: "rounded", finderStyle: "rounded",
        fg: "#d32f2f", bg: "#ffffff",
        accentFg: "#b71c1c", accentBg: "#d32f2f",
        sticker: { text: "Watch Video", icon: "play", color: "#d32f2f", outline: "#d32f2f", pos: "top-left" },
    },
    {
        id: "sticker-shop", label: "Shop Now",
        dotShape: "rounded", finderStyle: "circle",
        fg: "#6a1b9a", bg: "#fdf5ff",
        accentFg: "#4a148c", accentBg: "#7b1fa2",
        sticker: { text: "Shop Now", icon: "cart", color: "#6a1b9a", outline: "#7b1fa2", pos: "top-center" },
    },
    {
        id: "sticker-wifi", label: "Free WiFi",
        dotShape: "dot", finderStyle: "circle",
        fg: "#00838f", bg: "#e0f7fa",
        accentFg: "#006064", accentBg: "#00838f",
        sticker: { text: "Free WiFi", icon: "wifi", color: "#00838f", outline: "#00838f", pos: "top-left" },
    },
    {
        id: "sticker-fav", label: "Follow Us",
        dotShape: "star", finderStyle: "rounded",
        fg: "#f57c00", bg: "#fff8e1",
        accentFg: "#e65100", accentBg: "#f57c00",
        sticker: { text: "Follow Us", icon: "star", color: "#f57c00", outline: "#f57c00", pos: "top-right" },
    },
    {
        id: "sticker-love", label: "Save & Share",
        dotShape: "rounded", finderStyle: "rounded",
        fg: "#e91e63", bg: "#fce4ec",
        accentFg: "#880e4f", accentBg: "#e91e63",
        sticker: { text: "Save & Share", icon: "heart", color: "#e91e63", outline: "#e91e63", pos: "top-center" },
    },
    {
        id: "sticker-phone", label: "Call Us",
        dotShape: "dot", finderStyle: "square",
        fg: "#37474f", bg: "#eceff1",
        accentFg: "#263238", accentBg: "#455a64",
        sticker: { text: "Call Us", icon: "phone", color: "#37474f", outline: "#455a64", pos: "top-left" },
    },
];

// ─── COLOR PRESETS ────────────────────────────────────────────────────────────
export const COLORS = [
    { id: "black", fg: "#111111", bg: "#FFFFFF", label: "Classic" },
    { id: "navy", fg: "#1a237e", bg: "#e8eaf6", label: "Navy" },
    { id: "forest", fg: "#1b5e20", bg: "#e8f5e9", label: "Forest" },
    { id: "crimson", fg: "#b71c1c", bg: "#ffebee", label: "Crimson" },
    { id: "purple", fg: "#4a148c", bg: "#f3e5f5", label: "Purple" },
    { id: "teal", fg: "#004d40", bg: "#e0f2f1", label: "Teal" },
    { id: "amber", fg: "#e65100", bg: "#fff3e0", label: "Amber" },
    { id: "slate", fg: "#37474f", bg: "#eceff1", label: "Slate" },
];

// ─── FRAME COLORS ─────────────────────────────────────────────────────────────
export const FRAME_COLORS = [
    "#e53935", "#1565c0", "#2e7d32", "#6a1b9a",
    "#e65100", "#ad1457", "#00695c", "#37474f", "#f57c00", "#111111",
];

// ─── STICKER ICONS ────────────────────────────────────────────────────────────
export const ICONS = {
    thumbsUp: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M2 20h2a1 1 0 0 0 1-1v-7H2v8zm18.83-7.46A2 2 0 0 0 19 10h-5V6a3 3 0 0 0-3-3 1 1 0 0 0-1 1v.5L7.5 10H5v9h13.5a2 2 0 0 0 1.96-1.6l1.5-6a2 2 0 0 0-.13-1.86z" />
        </svg>
    ),
    phone: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M17 19H7V5h10v14zm0-16H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-5 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
    ),
    play: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M8 5v14l11-7z" />
        </svg>
    ),
    wifi: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
    ),
    star: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
    ),
    cart: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.83 6H19l-1.5 7H7.5L5.83 6zM4.5 3H2v2h2l3.6 7.59L6.25 15c-.16.28-.25.61-.25.96C6 17.1 6.9 18 8 18h12v-2H8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3-5.47A1 1 0 0 0 21 6H5.21L4.5 3z" />
        </svg>
    ),
    heart: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    ),
    qrScan: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} style={{ display: "block" }}>
            <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zM17 13h1.5v1.5H17V13zm-3 3h1.5v1.5H14V16zm1.5 1.5H17V19h-1.5v-1.5zM17 16h1.5v1.5H17V16zm1.5-1.5H20V16h-1.5v-1.5zm0 3H20V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z" />
        </svg>
    ),
};

export function isFinderCell(r, c) {
    const inF = (row, col, or, oc) => {
        const dr = row - or, dc = col - oc;
        return dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
    };
    return inF(r, c, 0, 0) || inF(r, c, 0, 14) || inF(r, c, 14, 0);
}

// ─── FRAME STICKER HELPERS ────────────────────────────────────────────────────
export function scallop(cx, cy, r, bumps, bumpH) {
    const pts = [];
    for (let i = 0; i <= bumps * 4; i++) {
        const a = (Math.PI * 2 * i) / (bumps * 4);
        const bumpPhase = (i % 4) / 4;
        const rad = r + Math.sin(bumpPhase * Math.PI) * bumpH;
        pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
    }
    return `M ${pts.join(" L ")} Z`;
}

export function dashedCircle(cx, cy, r, color, sw) {
    return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray="4 3" />;
}

// ─── FRAME STICKERS ───────────────────────────────────────────────────────────
export const FRAME_STICKERS = [
    {
        id: "ring-simple", label: "Circle Ring", color: "#e53935",
        render: (c) => <circle cx={50} cy={50} r={56} fill="none" stroke={c} strokeWidth={5} />,
    },
    {
        id: "ring-double", label: "Double Ring", color: "#1565c0",
        render: (c) => <g>
            <circle cx={50} cy={50} r={58} fill="none" stroke={c} strokeWidth={3} />
            <circle cx={50} cy={50} r={52} fill="none" stroke={c} strokeWidth={1.5} />
        </g>,
    },
    {
        id: "ring-dashed", label: "Dashed Ring", color: "#6a1b9a",
        render: (c) => dashedCircle(50, 50, 55, c, 4),
    },
    {
        id: "scallop", label: "Scalloped", color: "#ad1457",
        render: (c) => <path d={scallop(50, 50, 52, 20, 4)} fill="none" stroke={c} strokeWidth={3} strokeLinejoin="round" />,
    },
    {
        id: "scallop-fill", label: "Scallop Fill", color: "#7b1fa2",
        render: (c) => <g>
            <path d={scallop(50, 50, 58, 18, 5)} fill={c} opacity={0.18} />
            <path d={scallop(50, 50, 58, 18, 5)} fill="none" stroke={c} strokeWidth={3} />
        </g>,
    },
    {
        id: "frame-rounded", label: "Rounded Frame", color: "#1565c0",
        render: (c) => <rect x={-8} y={-8} width={116} height={116} rx={18} ry={18} fill="none" stroke={c} strokeWidth={5} />,
        frameLabel: { text: "Scan Me", pos: "bottom", bg: "#1565c0", fg: "#fff" },
    },
    {
        id: "frame-corners", label: "Corner Frame", color: "#2e7d32",
        render: (c) => <g>
            <path d={`M -8,10 L -8,-8 L 10,-8`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
            <path d={`M 90,-8 L 108,-8 L 108,10`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
            <path d={`M -8,90 L -8,108 L 10,108`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
            <path d={`M 90,108 L 108,108 L 108,90`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
        </g>,
    },
    {
        id: "frame-solid", label: "Bold Frame", color: "#111",
        render: (c) => <rect x={-10} y={-10} width={120} height={120} rx={14} ry={14} fill="none" stroke={c} strokeWidth={7} />,
        frameLabel: { text: "Visit Us", pos: "bottom", bg: "#111", fg: "#fff" },
    },
    {
        id: "frame-phone", label: "Scan To Save", color: "#1565c0",
        render: (c) => <g>
            <rect x={-8} y={-8} width={116} height={116} rx={16} ry={16} fill={c} />
            <rect x={-2} y={-2} width={104} height={104} rx={10} ry={10} fill="#0d1a0d" />
            <rect x={-8} y={90} width={116} height={26} rx={0} ry={0} fill={c} />
            <rect x={-8} y={104} width={116} height={12} rx={0} ry={16} fill={c} />
            <text x={50} y={113} textAnchor="middle" fill="#0d1a0d" fontSize={9} fontWeight="bold" fontFamily="sans-serif">Scan To Save</text>
        </g>,
    },
    {
        id: "frame-phone-red", label: "Scan Me", color: "#e53935",
        render: (c) => <g>
            <rect x={-8} y={-8} width={116} height={116} rx={16} ry={16} fill={c} />
            <rect x={-2} y={-2} width={104} height={104} rx={10} ry={10} fill="#0d1a0d" />
            <rect x={-8} y={90} width={116} height={26} rx={0} ry={0} fill={c} />
            <rect x={-8} y={104} width={116} height={12} rx={0} ry={16} fill={c} />
            <text x={50} y={113} textAnchor="middle" fill="#0d1a0d" fontSize={9} fontWeight="bold" fontFamily="sans-serif">Scan Me</text>
        </g>,
    },
    {
        id: "frame-arrow", label: "Scan To Order", color: "#f57c00",
        render: (c) => <g>
            <rect x={-6} y={-6} width={112} height={112} rx={10} ry={10} fill="none" stroke={c} strokeWidth={4} />
            <rect x={-6} y={92} width={112} height={22} rx={0} ry={0} fill={c} />
            <rect x={-6} y={104} width={112} height={10} rx={0} ry={10} fill={c} />
            <polygon points="35,92 65,92 50,106" fill="#0d1a0d" />
            <text x={50} y={111} textAnchor="middle" fill="#0d1a0d" fontSize={8} fontWeight="bold" fontFamily="sans-serif">Scan To Order</text>
        </g>,
    },
    {
        id: "wreath", label: "Wreath", color: "#2e7d32",
        render: (c) => <g>
            {Array.from({ length: 24 }, (_, i) => {
                const a = (Math.PI * 2 * i) / 24;
                const r = 54, leaf = 6;
                const lx = 50 + r * Math.cos(a), ly = 50 + r * Math.sin(a);
                return <ellipse key={i} cx={lx} cy={ly} rx={leaf} ry={leaf * 0.5} fill={c} opacity={0.7} transform={`rotate(${(a * 180 / Math.PI) + 90},${lx},${ly})`} />;
            })}
            <circle cx={50} cy={50} r={48} fill="none" stroke={c} strokeWidth={1.5} opacity={0.4} />
        </g>,
    },
    {
        id: "ring-thick-orange", label: "Bold Orange", color: "#e65100",
        render: (c) => <g>
            <circle cx={50} cy={50} r={57} fill={c} opacity={0.12} />
            <circle cx={50} cy={50} r={57} fill="none" stroke={c} strokeWidth={6} />
        </g>,
    },
    {
        id: "ring-dotted", label: "Dotted Ring", color: "#00695c",
        render: (c) => <circle cx={50} cy={50} r={55} fill="none" stroke={c} strokeWidth={4} strokeDasharray="2 5" strokeLinecap="round" />,
    },
    {
        id: "frame-diamond", label: "Diamond Frame", color: "#4a148c",
        render: (c) => <rect x={-8} y={-8} width={116} height={116} rx={0} ry={0} fill="none" stroke={c} strokeWidth={4} transform="rotate(45,50,50)" style={{ transformOrigin: "50px 50px" }} />,
    },
    {
        id: "frame-visit", label: "Visit Us", color: "#37474f",
        render: (c) => <g>
            <rect x={-8} y={-8} width={116} height={116} rx={12} ry={12} fill="none" stroke={c} strokeWidth={5} />
            <rect x={-8} y={88} width={116} height={20} rx={0} ry={0} fill={c} />
            <rect x={-8} y={100} width={116} height={8} rx={0} ry={12} fill={c} />
            <text x={50} y={103} textAnchor="middle" fill="#0d1a0d" fontSize={9} fontWeight="bold" fontFamily="sans-serif">Visit Us</text>
        </g>,
    },
];

// ─── LOGO DEFINITIONS ─────────────────────────────────────────────────────────
export const LOGOS = [
    { id: "facebook", label: "Facebook", bg: "#1877f2", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#0d1a0d" strokeWidth="0" /> },
    { id: "instagram", label: "Instagram", bg: "#e1306c", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></> },
    { id: "twitter", label: "X / Twitter", bg: "#000000", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#0d1a0d" /> },
    { id: "linkedin", label: "LinkedIn", bg: "#0077b5", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="#0d1a0d" /><rect x="2" y="9" width="4" height="12" fill="#0d1a0d" /><circle cx="4" cy="4" r="2" fill="#0d1a0d" /></> },
    { id: "youtube", label: "YouTube", bg: "#ff0000", icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#0d1a0d" /><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#ff0000" /></> },
    { id: "whatsapp", label: "WhatsApp", bg: "#25d366", icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="white" strokeWidth="2" /> },
    { id: "telegram", label: "Telegram", bg: "#2ca5e0", icon: <path d="m22 2-7 20-4-9-9-4zm0 0L11 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "tiktok", label: "TikTok", bg: "#010101", icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "spotify", label: "Spotify", bg: "#1db954", icon: <><circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2" /><path d="M8 13.5c2.5-1 5.5-1 8 0M7.5 11c3-1 6.5-1 9 0M8.5 16c2-0.7 5-0.7 7 0" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></> },
    { id: "discord", label: "Discord", bg: "#5865f2", icon: <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#0d1a0d" /> },
    { id: "github", label: "GitHub", bg: "#24292e", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "slack", label: "Slack", bg: "#4a154b", icon: <><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="#e01e5a" /><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#e01e5a" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" fill="#36c5f0" /><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" fill="#36c5f0" /><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" fill="#2eb67d" /><path d="M14 20.5c0-.83.67-1.5 1.5-1.5.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H14v-1.5z" fill="#2eb67d" /><path d="M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" fill="#ecb22e" /><path d="M10 3.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V5h1.5c.83 0 1.5-.67 1.5-1.5S11.33 2 10.5 2 10 2.67 10 3.5z" fill="#ecb22e" /></> },
    { id: "zoom", label: "Zoom", bg: "#2d8cff", icon: <><rect x="2" y="7" width="15" height="10" rx="2" fill="#0d1a0d" /><path d="M17 10l5-3v10l-5-3V10z" fill="#0d1a0d" /></> },
    { id: "paypal", label: "PayPal", bg: "#003087", icon: <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.249-8.993 6.249H9.39l-1.272 8.067h2.96l.893-5.662a.641.641 0 0 1 .633-.54h1.123c4.297 0 7.664-1.748 8.647-6.797.358-1.843.089-3.21-.952-4.03z" fill="#0d1a0d" /> },
    { id: "googlemaps", label: "Maps", bg: "#4285f4", icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#0d1a0d" /> },
    { id: "twitch", label: "Twitch", bg: "#9147ff", icon: <><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" /></> },
    { id: "reddit", label: "Reddit", bg: "#ff4500", icon: <><circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2" /><path d="M12 2a1.5 1.5 0 0 1 0 3M20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.4.6A9 9 0 0 0 12 9a9 9 0 0 0-4.6 1.6A2 2 0 0 0 6 10a2 2 0 0 0-2 2 2 2 0 0 0 1 1.7A4 4 0 0 0 8 18a4 4 0 0 0 4 1 4 4 0 0 0 4-1 4 4 0 0 0 3-4.3A2 2 0 0 0 20 12z" fill="none" stroke="white" strokeWidth="2" /></> },
    { id: "calendar", label: "Calendar", bg: "#f7b731", icon: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="white" strokeWidth="2" /><line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" /></> },
    { id: "vimeo", label: "Vimeo", bg: "#1ab7ea", icon: <path d="M22 7.1c-.1 2.2-1.6 5.2-4.6 9-3.1 3.9-5.7 5.9-7.9 5.9-1.3 0-2.4-1.2-3.3-3.7L5 12.5C4.3 10 3.6 8.8 2.8 8.8c-.2 0-.8.4-1.9 1.1L0 8.6c1.2-1.1 2.4-2.1 3.5-3.2 1.6-1.4 2.8-2.1 3.6-2.2 1.9-.2 3.1 1.1 3.5 3.9.5 3 .8 4.9.9 5.7.5 2.3 1.1 3.4 1.7 3.4.5 0 1.2-.7 2.2-2.2 1-1.5 1.5-2.6 1.6-3.4.1-1.3-.4-2-1.6-2-.6 0-1.1.1-1.7.4 1.1-3.7 3.3-5.5 6.5-5.4 2.3.1 3.4 1.6 3.2 4.4z" fill="#0d1a0d" /> },
];

// ─── COLOR PALETTE PRESETS (for pie swatches) ─────────────────────────────────
export const COLOR_PALETTE = [
    { fg: "#111111", bg: "#ffffff" }, { fg: "#444444", bg: "#ffffff" }, { fg: "#b71c1c", bg: "#ffffff" },
    { fg: "#3949ab", bg: "#4caf50" }, { fg: "#1565c0", bg: "#ffffff" }, { fg: "#e91e63", bg: "#9c27b0" },
    { fg: "#1a237e", bg: "#e8eaf6" }, { fg: "#546e7a", bg: "#78909c" }, { fg: "#b71c1c", bg: "#ffcdd2" },
    { fg: "#880e4f", bg: "#e040fb" }, { fg: "#1b5e20", bg: "#a5d6a7" }, { fg: "#4a148c", bg: "#ce93d8" },
    { fg: "#004d40", bg: "#80cbc4" }, { fg: "#37474f", bg: "#b0bec5" }, { fg: "#bf360c", bg: "#ff8a65" },
    { fg: "#0d47a1", bg: "#90caf9" }, { fg: "#4e342e", bg: "#bcaaa4" }, { fg: "#00695c", bg: "#80cbc4" },
    { fg: "#e65100", bg: "#ffe0b2" }, { fg: "#006064", bg: "#80deea" }, { fg: "#37474f", bg: "#eceff1" },
];

