(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/dashboard/pages/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── THEME ────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "COLORS",
    ()=>COLORS,
    "COLOR_PALETTE",
    ()=>COLOR_PALETTE,
    "FRAME_COLORS",
    ()=>FRAME_COLORS,
    "FRAME_STICKERS",
    ()=>FRAME_STICKERS,
    "ICONS",
    ()=>ICONS,
    "LOGOS",
    ()=>LOGOS,
    "PRE_DESIGNS",
    ()=>PRE_DESIGNS,
    "QR_SHAPES",
    ()=>QR_SHAPES,
    "T",
    ()=>T,
    "dashedCircle",
    ()=>dashedCircle,
    "isFinderCell",
    ()=>isFinderCell,
    "scallop",
    ()=>scallop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const T = {
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
    badge: "#14532d"
};
const QR_SHAPES = [
    {
        id: "square",
        label: "Square",
        path: "M 1,1 H 99 V 99 H 1 Z"
    },
    {
        id: "circle",
        label: "Circle",
        path: "M 50,50 m -48,0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0"
    },
    {
        id: "heart",
        label: "Heart",
        path: "M 50,82 C 10,58 1,43 1,29 C 1,14 13,4 26,4 C 36,4 45,10 50,19 C 55,10 64,4 74,4 C 87,4 99,14 99,29 C 99,43 90,58 50,82 Z"
    },
    {
        id: "hexagon",
        label: "Hexagon",
        path: "M 50,2 L 93,26 L 93,74 L 50,98 L 7,74 L 7,26 Z"
    },
    // { id: "speech", label: "Speech Bubble", path: "M 4,4 H 96 Q 99,4 99,8 V 68 Q 99,72 96,72 H 58 L 50,88 L 42,72 H 4 Q 1,72 1,68 V 8 Q 1,4 4,4 Z" },
    {
        id: "star",
        label: "Star",
        path: "M 50,2 L 61,35 L 97,35 L 68,56 L 79,90 L 50,70 L 21,90 L 32,56 L 3,35 L 39,35 Z"
    },
    {
        id: "diamond",
        label: "Diamond",
        path: "M 50,2 L 98,50 L 50,98 L 2,50 Z"
    },
    {
        id: "teardrop",
        label: "Teardrop",
        path: "M 50,4 C 71,4 88,21 88,44 C 88,67 70,87 50,96 C 30,87 12,67 12,44 C 12,21 29,4 50,4 Z"
    },
    {
        id: "shield",
        label: "Shield",
        path: "M 50,4 L 90,19 L 90,54 C 90,74 70,89 50,97 C 30,89 10,74 10,54 L 10,19 Z"
    },
    {
        id: "rounded-square",
        label: "Rounded Square",
        path: "M 14,2 H 86 Q 98,2 98,14 V 86 Q 98,98 86,98 H 14 Q 2,98 2,86 V 14 Q 2,2 14,2 Z"
    },
    {
        id: "octagon",
        label: "Octagon",
        path: "M 34,2 L 66,2 L 98,34 L 98,66 L 66,98 L 34,98 L 2,66 L 2,34 Z"
    },
    {
        id: "cloud",
        label: "Cloud",
        path: "M 24,66 C 9,66 2,55 2,47 C 2,37 11,29 24,29 C 26,19 34,11 48,11 C 61,11 70,19 73,29 C 81,27 91,33 91,45 C 91,55 83,66 70,66 Z"
    },
    {
        id: "arrow",
        label: "Arrow",
        path: "M 2,34 H 54 V 13 L 98,50 L 54,87 V 66 H 2 Z"
    },
    // { id: "badge", label: "Badge", path: "M 50,4 L 57,19 L 75,14 L 70,32 L 87,39 L 75,54 L 80,72 L 63,71 L 57,89 L 43,77 L 27,87 L 28,69 L 10,64 L 22,49 L 11,34 L 29,31 L 25,14 L 43,21 Z" },
    {
        id: "cross",
        label: "Cross",
        path: "M 34,2 H 66 V 34 H 98 V 66 H 66 V 98 H 34 V 66 H 2 V 34 H 34 Z"
    }
];
const PRE_DESIGNS = [
    // Plain styles
    {
        id: "classic",
        label: "Classic",
        dotShape: "square",
        finderStyle: "square",
        fg: "#111111",
        bg: "#ffffff"
    },
    {
        id: "dots-blue",
        label: "Blue Dots",
        dotShape: "dot",
        finderStyle: "circle",
        fg: "#1565c0",
        bg: "#e3f2fd",
        accentFg: "#0d47a1",
        accentBg: "#1565c0"
    },
    {
        id: "dots-green",
        label: "Green Dots",
        dotShape: "dot",
        finderStyle: "circle",
        fg: "#2e7d32",
        bg: "#e8f5e9",
        accentFg: "#1b5e20",
        accentBg: "#2e7d32"
    },
    {
        id: "rounded-red",
        label: "Red Rounded",
        dotShape: "rounded",
        finderStyle: "rounded",
        fg: "#c62828",
        bg: "#fff9f9",
        accentFg: "#b71c1c",
        accentBg: "#c62828"
    },
    {
        id: "diamond-pur",
        label: "Purple Gems",
        dotShape: "diamond",
        finderStyle: "square",
        fg: "#6a1b9a",
        bg: "#f3e5f5",
        accentFg: "#4a148c",
        accentBg: "#6a1b9a"
    },
    {
        id: "cross-teal",
        label: "Teal Cross",
        dotShape: "cross",
        finderStyle: "square",
        fg: "#00695c",
        bg: "#e0f2f1",
        accentFg: "#004d40",
        accentBg: "#00695c"
    },
    {
        id: "star-amber",
        label: "Amber Stars",
        dotShape: "star",
        finderStyle: "rounded",
        fg: "#e65100",
        bg: "#fff8e1",
        accentFg: "#bf360c",
        accentBg: "#e65100"
    },
    {
        id: "dot-navy",
        label: "Navy Classic",
        dotShape: "dot",
        finderStyle: "dot-outline",
        fg: "#1a237e",
        bg: "#e8eaf6",
        accentFg: "#0d1b6e",
        accentBg: "#283593"
    },
    {
        id: "rounded-blk",
        label: "Soft Black",
        dotShape: "rounded",
        finderStyle: "rounded",
        fg: "#212121",
        bg: "#0a140a",
        accentFg: "#000000",
        accentBg: "#212121"
    },
    {
        id: "cross-rose",
        label: "Rose Cross",
        dotShape: "cross",
        finderStyle: "rounded",
        fg: "#ad1457",
        bg: "#fce4ec",
        accentFg: "#880e4f",
        accentBg: "#c2185b"
    },
    {
        id: "diamond-grn",
        label: "Forest Gems",
        dotShape: "diamond",
        finderStyle: "square",
        fg: "#1b5e20",
        bg: "#f1f8e9",
        accentFg: "#33691e",
        accentBg: "#2e7d32"
    },
    {
        id: "square-slate",
        label: "Slate",
        dotShape: "square",
        finderStyle: "square",
        fg: "#37474f",
        bg: "#eceff1",
        accentFg: "#263238",
        accentBg: "#455a64"
    },
    // Sticker styles
    {
        id: "sticker-like",
        label: "Like Us",
        dotShape: "dot",
        finderStyle: "rounded",
        fg: "#1565c0",
        bg: "#ffffff",
        accentFg: "#0d47a1",
        accentBg: "#1976d2",
        sticker: {
            text: "Like Us",
            icon: "thumbsUp",
            color: "#1565c0",
            outline: "#1565c0",
            pos: "top-left"
        }
    },
    {
        id: "sticker-scan",
        label: "Scan Me",
        dotShape: "dot",
        finderStyle: "rounded",
        fg: "#e53935",
        bg: "#fff5f5",
        accentFg: "#b71c1c",
        accentBg: "#e53935",
        sticker: {
            text: "Scan Me",
            icon: "qrScan",
            color: "#e53935",
            outline: "#e53935",
            pos: "top-right"
        }
    },
    {
        id: "sticker-watch",
        label: "Watch Video",
        dotShape: "rounded",
        finderStyle: "rounded",
        fg: "#d32f2f",
        bg: "#ffffff",
        accentFg: "#b71c1c",
        accentBg: "#d32f2f",
        sticker: {
            text: "Watch Video",
            icon: "play",
            color: "#d32f2f",
            outline: "#d32f2f",
            pos: "top-left"
        }
    },
    {
        id: "sticker-shop",
        label: "Shop Now",
        dotShape: "rounded",
        finderStyle: "circle",
        fg: "#6a1b9a",
        bg: "#fdf5ff",
        accentFg: "#4a148c",
        accentBg: "#7b1fa2",
        sticker: {
            text: "Shop Now",
            icon: "cart",
            color: "#6a1b9a",
            outline: "#7b1fa2",
            pos: "top-center"
        }
    },
    {
        id: "sticker-wifi",
        label: "Free WiFi",
        dotShape: "dot",
        finderStyle: "circle",
        fg: "#00838f",
        bg: "#e0f7fa",
        accentFg: "#006064",
        accentBg: "#00838f",
        sticker: {
            text: "Free WiFi",
            icon: "wifi",
            color: "#00838f",
            outline: "#00838f",
            pos: "top-left"
        }
    },
    {
        id: "sticker-fav",
        label: "Follow Us",
        dotShape: "star",
        finderStyle: "rounded",
        fg: "#f57c00",
        bg: "#fff8e1",
        accentFg: "#e65100",
        accentBg: "#f57c00",
        sticker: {
            text: "Follow Us",
            icon: "star",
            color: "#f57c00",
            outline: "#f57c00",
            pos: "top-right"
        }
    },
    {
        id: "sticker-love",
        label: "Save & Share",
        dotShape: "rounded",
        finderStyle: "rounded",
        fg: "#e91e63",
        bg: "#fce4ec",
        accentFg: "#880e4f",
        accentBg: "#e91e63",
        sticker: {
            text: "Save & Share",
            icon: "heart",
            color: "#e91e63",
            outline: "#e91e63",
            pos: "top-center"
        }
    },
    {
        id: "sticker-phone",
        label: "Call Us",
        dotShape: "dot",
        finderStyle: "square",
        fg: "#37474f",
        bg: "#eceff1",
        accentFg: "#263238",
        accentBg: "#455a64",
        sticker: {
            text: "Call Us",
            icon: "phone",
            color: "#37474f",
            outline: "#455a64",
            pos: "top-left"
        }
    }
];
const COLORS = [
    {
        id: "black",
        fg: "#111111",
        bg: "#FFFFFF",
        label: "Classic"
    },
    {
        id: "navy",
        fg: "#1a237e",
        bg: "#e8eaf6",
        label: "Navy"
    },
    {
        id: "forest",
        fg: "#1b5e20",
        bg: "#e8f5e9",
        label: "Forest"
    },
    {
        id: "crimson",
        fg: "#b71c1c",
        bg: "#ffebee",
        label: "Crimson"
    },
    {
        id: "purple",
        fg: "#4a148c",
        bg: "#f3e5f5",
        label: "Purple"
    },
    {
        id: "teal",
        fg: "#004d40",
        bg: "#e0f2f1",
        label: "Teal"
    },
    {
        id: "amber",
        fg: "#e65100",
        bg: "#fff3e0",
        label: "Amber"
    },
    {
        id: "slate",
        fg: "#37474f",
        bg: "#eceff1",
        label: "Slate"
    }
];
const FRAME_COLORS = [
    "#e53935",
    "#1565c0",
    "#2e7d32",
    "#6a1b9a",
    "#e65100",
    "#ad1457",
    "#00695c",
    "#37474f",
    "#f57c00",
    "#111111"
];
const ICONS = {
    thumbsUp: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 20h2a1 1 0 0 0 1-1v-7H2v8zm18.83-7.46A2 2 0 0 0 19 10h-5V6a3 3 0 0 0-3-3 1 1 0 0 0-1 1v.5L7.5 10H5v9h13.5a2 2 0 0 0 1.96-1.6l1.5-6a2 2 0 0 0-.13-1.86z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 140,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 139,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    phone: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 19H7V5h10v14zm0-16H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-5 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 145,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 144,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    play: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 5v14l11-7z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 150,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 149,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    wifi: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 155,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 154,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    star: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 160,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 159,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    cart: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.83 6H19l-1.5 7H7.5L5.83 6zM4.5 3H2v2h2l3.6 7.59L6.25 15c-.16.28-.25.61-.25.96C6 17.1 6.9 18 8 18h12v-2H8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H17c.75 0 1.41-.41 1.75-1.03l3-5.47A1 1 0 0 0 21 6H5.21L4.5 3z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 165,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 164,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    heart: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 170,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 169,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)),
    qrScan: (color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: color,
            style: {
                display: "block"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zM17 13h1.5v1.5H17V13zm-3 3h1.5v1.5H14V16zm1.5 1.5H17V19h-1.5v-1.5zM17 16h1.5v1.5H17V16zm1.5-1.5H20V16h-1.5v-1.5zm0 3H20V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 175,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 174,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
};
function isFinderCell(r, c) {
    const inF = (row, col, or, oc)=>{
        const dr = row - or, dc = col - oc;
        return dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
    };
    return inF(r, c, 0, 0) || inF(r, c, 0, 14) || inF(r, c, 14, 0);
}
function scallop(cx, cy, r, bumps, bumpH) {
    const pts = [];
    for(let i = 0; i <= bumps * 4; i++){
        const a = Math.PI * 2 * i / (bumps * 4);
        const bumpPhase = i % 4 / 4;
        const rad = r + Math.sin(bumpPhase * Math.PI) * bumpH;
        pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
    }
    return `M ${pts.join(" L ")} Z`;
}
function dashedCircle(cx, cy, r, color, sw) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
        cx: cx,
        cy: cy,
        r: r,
        fill: "none",
        stroke: color,
        strokeWidth: sw,
        strokeDasharray: "4 3"
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/pages/constants.js",
        lineNumber: 201,
        columnNumber: 12
    }, this);
}
const FRAME_STICKERS = [
    {
        id: "ring-simple",
        label: "Circle Ring",
        color: "#e53935",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 50,
                cy: 50,
                r: 56,
                fill: "none",
                stroke: c,
                strokeWidth: 5
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 208,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "ring-double",
        label: "Double Ring",
        color: "#1565c0",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 50,
                        cy: 50,
                        r: 58,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 3
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 213,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 50,
                        cy: 50,
                        r: 52,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 1.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 214,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 212,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "ring-dashed",
        label: "Dashed Ring",
        color: "#6a1b9a",
        render: (c)=>dashedCircle(50, 50, 55, c, 4)
    },
    {
        id: "scallop",
        label: "Scalloped",
        color: "#ad1457",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: scallop(50, 50, 52, 20, 4),
                fill: "none",
                stroke: c,
                strokeWidth: 3,
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 223,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "scallop-fill",
        label: "Scallop Fill",
        color: "#7b1fa2",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: scallop(50, 50, 58, 18, 5),
                        fill: c,
                        opacity: 0.18
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 228,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: scallop(50, 50, 58, 18, 5),
                        fill: "none",
                        stroke: c,
                        strokeWidth: 3
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 229,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 227,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-rounded",
        label: "Rounded Frame",
        color: "#1565c0",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -8,
                y: -8,
                width: 116,
                height: 116,
                rx: 18,
                ry: 18,
                fill: "none",
                stroke: c,
                strokeWidth: 5
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 234,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0)),
        frameLabel: {
            text: "Scan Me",
            pos: "bottom",
            bg: "#1565c0",
            fg: "#fff"
        }
    },
    {
        id: "frame-corners",
        label: "Corner Frame",
        color: "#2e7d32",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M -8,10 L -8,-8 L 10,-8`,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 5,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 240,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M 90,-8 L 108,-8 L 108,10`,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 5,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 241,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M -8,90 L -8,108 L 10,108`,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 5,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 242,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M 90,108 L 108,108 L 108,90`,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 5,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 243,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 239,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-solid",
        label: "Bold Frame",
        color: "#111",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -10,
                y: -10,
                width: 120,
                height: 120,
                rx: 14,
                ry: 14,
                fill: "none",
                stroke: c,
                strokeWidth: 7
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 248,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0)),
        frameLabel: {
            text: "Visit Us",
            pos: "bottom",
            bg: "#111",
            fg: "#fff"
        }
    },
    {
        id: "frame-phone",
        label: "Scan To Save",
        color: "#1565c0",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: -8,
                        width: 116,
                        height: 116,
                        rx: 16,
                        ry: 16,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 254,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -2,
                        y: -2,
                        width: 104,
                        height: 104,
                        rx: 10,
                        ry: 10,
                        fill: "#0d1a0d"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 255,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 90,
                        width: 116,
                        height: 26,
                        rx: 0,
                        ry: 0,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 256,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 104,
                        width: 116,
                        height: 12,
                        rx: 0,
                        ry: 16,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 257,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 50,
                        y: 113,
                        textAnchor: "middle",
                        fill: "#0d1a0d",
                        fontSize: 9,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        children: "Scan To Save"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 258,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 253,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-phone-red",
        label: "Scan Me",
        color: "#e53935",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: -8,
                        width: 116,
                        height: 116,
                        rx: 16,
                        ry: 16,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 264,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -2,
                        y: -2,
                        width: 104,
                        height: 104,
                        rx: 10,
                        ry: 10,
                        fill: "#0d1a0d"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 265,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 90,
                        width: 116,
                        height: 26,
                        rx: 0,
                        ry: 0,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 266,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 104,
                        width: 116,
                        height: 12,
                        rx: 0,
                        ry: 16,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 267,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 50,
                        y: 113,
                        textAnchor: "middle",
                        fill: "#0d1a0d",
                        fontSize: 9,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        children: "Scan Me"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 268,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 263,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-arrow",
        label: "Scan To Order",
        color: "#f57c00",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -6,
                        y: -6,
                        width: 112,
                        height: 112,
                        rx: 10,
                        ry: 10,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 4
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 274,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -6,
                        y: 92,
                        width: 112,
                        height: 22,
                        rx: 0,
                        ry: 0,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 275,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -6,
                        y: 104,
                        width: 112,
                        height: 10,
                        rx: 0,
                        ry: 10,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 276,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "35,92 65,92 50,106",
                        fill: "#0d1a0d"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 277,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 50,
                        y: 111,
                        textAnchor: "middle",
                        fill: "#0d1a0d",
                        fontSize: 8,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        children: "Scan To Order"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 278,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 273,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "wreath",
        label: "Wreath",
        color: "#2e7d32",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    Array.from({
                        length: 24
                    }, (_, i)=>{
                        const a = Math.PI * 2 * i / 24;
                        const r = 54, leaf = 6;
                        const lx = 50 + r * Math.cos(a), ly = 50 + r * Math.sin(a);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                            cx: lx,
                            cy: ly,
                            rx: leaf,
                            ry: leaf * 0.5,
                            fill: c,
                            opacity: 0.7,
                            transform: `rotate(${a * 180 / Math.PI + 90},${lx},${ly})`
                        }, i, false, {
                            fileName: "[project]/src/components/dashboard/pages/constants.js",
                            lineNumber: 288,
                            columnNumber: 24
                        }, ("TURBOPACK compile-time value", void 0));
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 50,
                        cy: 50,
                        r: 48,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 1.5,
                        opacity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 290,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 283,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "ring-thick-orange",
        label: "Bold Orange",
        color: "#e65100",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 50,
                        cy: 50,
                        r: 57,
                        fill: c,
                        opacity: 0.12
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 296,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 50,
                        cy: 50,
                        r: 57,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 297,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 295,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "ring-dotted",
        label: "Dotted Ring",
        color: "#00695c",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 50,
                cy: 50,
                r: 55,
                fill: "none",
                stroke: c,
                strokeWidth: 4,
                strokeDasharray: "2 5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 302,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-diamond",
        label: "Diamond Frame",
        color: "#4a148c",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -8,
                y: -8,
                width: 116,
                height: 116,
                rx: 0,
                ry: 0,
                fill: "none",
                stroke: c,
                strokeWidth: 4,
                transform: "rotate(45,50,50)",
                style: {
                    transformOrigin: "50px 50px"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 306,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "frame-visit",
        label: "Visit Us",
        color: "#37474f",
        render: (c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: -8,
                        width: 116,
                        height: 116,
                        rx: 12,
                        ry: 12,
                        fill: "none",
                        stroke: c,
                        strokeWidth: 5
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 311,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 88,
                        width: 116,
                        height: 20,
                        rx: 0,
                        ry: 0,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 312,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: -8,
                        y: 100,
                        width: 116,
                        height: 8,
                        rx: 0,
                        ry: 12,
                        fill: c
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 313,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 50,
                        y: 103,
                        textAnchor: "middle",
                        fill: "#0d1a0d",
                        fontSize: 9,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        children: "Visit Us"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/constants.js",
                        lineNumber: 314,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 310,
                columnNumber: 24
            }, ("TURBOPACK compile-time value", void 0))
    }
];
const LOGOS = [
    {
        id: "facebook",
        label: "Facebook",
        bg: "#1877f2",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
            fill: "#0d1a0d",
            strokeWidth: "0"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 321,
            columnNumber: 63
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "instagram",
        label: "Instagram",
        bg: "#e1306c",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "2",
                    width: "20",
                    height: "20",
                    rx: "5",
                    ry: "5",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 322,
                    columnNumber: 67
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 322,
                    columnNumber: 167
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "17.5",
                    y1: "6.5",
                    x2: "17.51",
                    y2: "6.5",
                    stroke: "white",
                    strokeWidth: "2.5",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 322,
                    columnNumber: 270
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "twitter",
        label: "X / Twitter",
        bg: "#000000",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z",
            fill: "#0d1a0d"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 323,
            columnNumber: 65
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        bg: "#0077b5",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 324,
                    columnNumber: 65
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "9",
                    width: "4",
                    height: "12",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 324,
                    columnNumber: 171
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "4",
                    cy: "4",
                    r: "2",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 324,
                    columnNumber: 228
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "youtube",
        label: "YouTube",
        bg: "#ff0000",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 325,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                    points: "9.75,15.02 15.5,12 9.75,8.98 9.75,15.02",
                    fill: "#ff0000"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 325,
                    columnNumber: 354
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "whatsapp",
        label: "WhatsApp",
        bg: "#25d366",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
            fill: "none",
            stroke: "white",
            strokeWidth: "2"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 326,
            columnNumber: 63
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "telegram",
        label: "Telegram",
        bg: "#2ca5e0",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m22 2-7 20-4-9-9-4zm0 0L11 13",
            fill: "none",
            stroke: "white",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 327,
            columnNumber: 63
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "tiktok",
        label: "TikTok",
        bg: "#010101",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
            fill: "none",
            stroke: "white",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 328,
            columnNumber: 59
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "spotify",
        label: "Spotify",
        bg: "#1db954",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "10",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 329,
                    columnNumber: 63
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 13.5c2.5-1 5.5-1 8 0M7.5 11c3-1 6.5-1 9 0M8.5 16c2-0.7 5-0.7 7 0",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "1.8",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 329,
                    columnNumber: 139
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "discord",
        label: "Discord",
        bg: "#5865f2",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z",
            fill: "#0d1a0d"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 330,
            columnNumber: 61
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "github",
        label: "GitHub",
        bg: "#24292e",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
            fill: "none",
            stroke: "white",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 331,
            columnNumber: 59
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "slack",
        label: "Slack",
        bg: "#4a154b",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z",
                    fill: "#e01e5a"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 59
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
                    fill: "#e01e5a"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 182
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z",
                    fill: "#36c5f0"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 278
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z",
                    fill: "#36c5f0"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 398
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z",
                    fill: "#2eb67d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 492
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 20.5c0-.83.67-1.5 1.5-1.5.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H14v-1.5z",
                    fill: "#2eb67d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 616
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z",
                    fill: "#ecb22e"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 719
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 3.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V5h1.5c.83 0 1.5-.67 1.5-1.5S11.33 2 10.5 2 10 2.67 10 3.5z",
                    fill: "#ecb22e"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 332,
                    columnNumber: 838
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "zoom",
        label: "Zoom",
        bg: "#2d8cff",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "2",
                    y: "7",
                    width: "15",
                    height: "10",
                    rx: "2",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 333,
                    columnNumber: 57
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 10l5-3v10l-5-3V10z",
                    fill: "#0d1a0d"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 333,
                    columnNumber: 122
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "paypal",
        label: "PayPal",
        bg: "#003087",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.249-8.993 6.249H9.39l-1.272 8.067h2.96l.893-5.662a.641.641 0 0 1 .633-.54h1.123c4.297 0 7.664-1.748 8.647-6.797.358-1.843.089-3.21-.952-4.03z",
            fill: "#0d1a0d"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 334,
            columnNumber: 59
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "googlemaps",
        label: "Maps",
        bg: "#4285f4",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fill: "#0d1a0d"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 335,
            columnNumber: 61
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: "twitch",
        label: "Twitch",
        bg: "#9147ff",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",
                fill: "none",
                stroke: "white",
                strokeWidth: "2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/constants.js",
                lineNumber: 336,
                columnNumber: 61
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false)
    },
    {
        id: "reddit",
        label: "Reddit",
        bg: "#ff4500",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "10",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 337,
                    columnNumber: 61
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2a1.5 1.5 0 0 1 0 3M20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.4.6A9 9 0 0 0 12 9a9 9 0 0 0-4.6 1.6A2 2 0 0 0 6 10a2 2 0 0 0-2 2 2 2 0 0 0 1 1.7A4 4 0 0 0 8 18a4 4 0 0 0 4 1 4 4 0 0 0 4-1 4 4 0 0 0 3-4.3A2 2 0 0 0 20 12z",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 337,
                    columnNumber: 137
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "calendar",
        label: "Calendar",
        bg: "#f7b731",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "3",
                    y: "4",
                    width: "18",
                    height: "18",
                    rx: "2",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 338,
                    columnNumber: 65
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "16",
                    y1: "2",
                    x2: "16",
                    y2: "6",
                    stroke: "white",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 338,
                    columnNumber: 158
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8",
                    y1: "2",
                    x2: "8",
                    y2: "6",
                    stroke: "white",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 338,
                    columnNumber: 249
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "3",
                    y1: "10",
                    x2: "21",
                    y2: "10",
                    stroke: "white",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/constants.js",
                    lineNumber: 338,
                    columnNumber: 338
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true)
    },
    {
        id: "vimeo",
        label: "Vimeo",
        bg: "#1ab7ea",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M22 7.1c-.1 2.2-1.6 5.2-4.6 9-3.1 3.9-5.7 5.9-7.9 5.9-1.3 0-2.4-1.2-3.3-3.7L5 12.5C4.3 10 3.6 8.8 2.8 8.8c-.2 0-.8.4-1.9 1.1L0 8.6c1.2-1.1 2.4-2.1 3.5-3.2 1.6-1.4 2.8-2.1 3.6-2.2 1.9-.2 3.1 1.1 3.5 3.9.5 3 .8 4.9.9 5.7.5 2.3 1.1 3.4 1.7 3.4.5 0 1.2-.7 2.2-2.2 1-1.5 1.5-2.6 1.6-3.4.1-1.3-.4-2-1.6-2-.6 0-1.1.1-1.7.4 1.1-3.7 3.3-5.5 6.5-5.4 2.3.1 3.4 1.6 3.2 4.4z",
            fill: "#0d1a0d"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/constants.js",
            lineNumber: 339,
            columnNumber: 57
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const COLOR_PALETTE = [
    {
        fg: "#111111",
        bg: "#ffffff"
    },
    {
        fg: "#444444",
        bg: "#ffffff"
    },
    {
        fg: "#b71c1c",
        bg: "#ffffff"
    },
    {
        fg: "#3949ab",
        bg: "#4caf50"
    },
    {
        fg: "#1565c0",
        bg: "#ffffff"
    },
    {
        fg: "#e91e63",
        bg: "#9c27b0"
    },
    {
        fg: "#1a237e",
        bg: "#e8eaf6"
    },
    {
        fg: "#546e7a",
        bg: "#78909c"
    },
    {
        fg: "#b71c1c",
        bg: "#ffcdd2"
    },
    {
        fg: "#880e4f",
        bg: "#e040fb"
    },
    {
        fg: "#1b5e20",
        bg: "#a5d6a7"
    },
    {
        fg: "#4a148c",
        bg: "#ce93d8"
    },
    {
        fg: "#004d40",
        bg: "#80cbc4"
    },
    {
        fg: "#37474f",
        bg: "#b0bec5"
    },
    {
        fg: "#bf360c",
        bg: "#ff8a65"
    },
    {
        fg: "#0d47a1",
        bg: "#90caf9"
    },
    {
        fg: "#4e342e",
        bg: "#bcaaa4"
    },
    {
        fg: "#00695c",
        bg: "#80cbc4"
    },
    {
        fg: "#e65100",
        bg: "#ffe0b2"
    },
    {
        fg: "#006064",
        bg: "#80deea"
    },
    {
        fg: "#37474f",
        bg: "#eceff1"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/pages/qr-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LEGACY_QR_GRID",
    ()=>LEGACY_QR_GRID,
    "getFinderOrigins",
    ()=>getFinderOrigins,
    "isFinderCell",
    ()=>isFinderCell,
    "isFinderCell21",
    ()=>isFinderCell21,
    "makeQRMatrix",
    ()=>makeQRMatrix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2d$generator$2f$dist$2f$qrcode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qrcode-generator/dist/qrcode.mjs [app-client] (ecmascript)");
;
function makeQRMatrix(url) {
    // Type-0 = auto-select minimum version
    const qr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2d$generator$2f$dist$2f$qrcode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(0, "H");
    qr.addData(url);
    qr.make();
    const N = qr.getModuleCount();
    const matrix = [];
    for(let r = 0; r < N; r++){
        const row = [];
        for(let c = 0; c < N; c++){
            row.push(qr.isDark(r, c));
        }
        matrix.push(row);
    }
    return {
        matrix,
        N
    };
}
function isFinderCell(r, c, N) {
    // Core 7×7 finder zones + 1-module separator band
    const inTL = r <= 7 && c <= 7;
    const inTR = r <= 7 && c >= N - 8;
    const inBL = r >= N - 8 && c <= 7;
    return inTL || inTR || inBL;
}
function getFinderOrigins(N) {
    return [
        {
            r: 0,
            c: 0
        },
        {
            r: 0,
            c: N - 7
        },
        {
            r: N - 7,
            c: 0
        }
    ];
}
// ─── Backward-compat shim for code that still imports QR_GRID / isFinderCell
// from constants.tsx.  Replace those imports with this module gradually.
// ─────────────────────────────────────────────────────────────────────────────
// Legacy 21×21 fake grid — used only by QRStyled (pre-designed thumbnails).
// Thumbnails don't need to be scannable so the fake grid is acceptable there.
function makeFakeGrid() {
    return Array.from({
        length: 21
    }, (_, row)=>Array.from({
            length: 21
        }, (_, col)=>{
            const inFinder = (r, c, or, oc)=>{
                const dr = r - or, dc = c - oc;
                return dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 && (dr === 0 || dr === 6 || dc === 0 || dc === 6 || dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
            };
            if (inFinder(row, col, 0, 0)) return true;
            if (inFinder(row, col, 0, 14)) return true;
            if (inFinder(row, col, 14, 0)) return true;
            if (row === 6 && col > 7 && col < 13) return col % 2 === 0;
            if (col === 6 && row > 7 && row < 13) return row % 2 === 0;
            return (row * 31 + col * 17 + row * col) % 7 < 3;
        }));
}
const LEGACY_QR_GRID = makeFakeGrid();
function isFinderCell21(r, c) {
    return isFinderCell(r, c, 21);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/pages/qr-shape-geometry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// src/components/pages/qr-shape-geometry.ts  (v2 — verified per-shape geometry)
//
// Every pointInShape formula is derived directly from the SVG pathIn100
// coordinates by converting each vertex/control point from [0,100] space
// to [0,1] normalised space (dx = nx-0.5, dy = ny-0.5).
//
// The computeFinderSafeScale solver has NO minimum floor — it binary-searches
// freely down to 0.25.  The per-shape minimums in v1 were causing the solver
// to return scales where finders were still outside the shape.
// ─────────────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// POINT-IN-SHAPE
// All coordinates: nx,ny ∈ [0,1].  Canvas centre = (0.5,0.5).
// dx = nx-0.5,  dy = ny-0.5  →  both ∈ [-0.5, +0.5]
// ═══════════════════════════════════════════════════════════════════════════
__turbopack_context__.s([
    "computeFinderSafeScale",
    ()=>computeFinderSafeScale,
    "moduleCentreNorm",
    ()=>moduleCentreNorm,
    "pointInShape",
    ()=>pointInShape
]);
function pointInShape(nx, ny, shapeId) {
    const dx = nx - 0.5;
    const dy = ny - 0.5;
    switch(shapeId){
        // ─── square ──────────────────────────────────────────────────────────
        // path: M0,0 H100 V100 H0 Z  →  full [0,1] canvas
        case "square":
            return true;
        // ─── rounded-square ──────────────────────────────────────────────────
        // path: M12,0 H88 Q100,0 100,12 V88 Q100,100 88,100 H12 Q0,100 0,88 V12 Q0,0 12,0
        // corner radius = 12 units → 0.12 in [0,1]
        case "rounded-square":
            {
                const R = 0.12, ax = Math.abs(dx), ay = Math.abs(dy), H = 0.5;
                if (ax > H || ay > H) return false;
                if (ax > H - R && ay > H - R) {
                    const cx = ax - (H - R), cy = ay - (H - R);
                    return cx * cx + cy * cy <= R * R;
                }
                return true;
            }
        // ─── circle ──────────────────────────────────────────────────────────
        // path: M50,0 A50,50 → radius = 50/100 = 0.5 in [0,1]
        // 0.50 = full radius; clipPath on the SVG trims the visual edge cleanly
        case "circle":
            return dx * dx + dy * dy <= 0.50 * 0.50;
        // ─── heart ───────────────────────────────────────────────────────────
        // path: M50,85 C50,85 5,58 5,32 C5,15 17,8 30,8 C39,8 46,13 50,19
        //        C54,13 61,8 70,8 C83,8 95,15 95,32 C95,58 50,85 50,85
        //
        // Key measurements from path (in [0,1]):
        //   left/right edges: x=5/100=0.05, x=95/100=0.95  →  half-width=0.45
        //   top of lobes:     y=8/100=0.08  →  dy=-0.42
        //   bottom tip:       y=85/100=0.85 →  dy=+0.35
        //   widest point:     ~y=50/100     →  dy=0.00
        //   lobe centres:     x=30/100=0.30 and x=70/100=0.70
        //                     y≈(8+32)/2/100=0.20  →  dy=-0.30
        //   lobe radius:      ~(50-5)/100*0.7 ≈ 0.21
        //
        // Strategy: union of two circles (the lobes) + a downward triangle for body
        case "heart":
            {
                // Lobe radius and centres
                const lobeR = 0.225;
                const lobeCy = -0.285; // dy of lobe centres
                const lobeCxL = -0.195; // dx of left lobe centre
                const lobeCxR = 0.195; // dx of right lobe centre
                if ((dx - lobeCxL) ** 2 + (dy - lobeCy) ** 2 <= lobeR * lobeR) return true;
                if ((dx - lobeCxR) ** 2 + (dy - lobeCy) ** 2 <= lobeR * lobeR) return true;
                // Body: trapezoid from the lobe tops down to the tip
                // Top of body: dy = lobeCy + lobeR ≈ -0.06
                // Bottom tip:  dy = +0.35
                // Width tapers from full (0.45) at top to 0 at bottom
                const bodyTop = lobeCy + lobeR;
                const bodyBot = 0.35;
                if (dy < bodyTop || dy > bodyBot) return false;
                const t = (dy - bodyTop) / (bodyBot - bodyTop); // 0 at top, 1 at tip
                const halfW = 0.45 * (1 - t);
                return Math.abs(dx) <= halfW;
            }
        // ─── hexagon ─────────────────────────────────────────────────────────
        // path: M50,2 L95,26 L95,74 L50,98 L5,74 L5,26
        // Pointy-left/right hexagon (flat top/bottom).
        // Vertices in dx,dy:
        //   (0,−0.48), (+0.45,−0.24), (+0.45,+0.24), (0,+0.48), (−0.45,+0.24), (−0.45,−0.24)
        // 3 conditions (by symmetry):
        //   1) |dy| ≤ 0.48                      (top/bottom flat sides)
        //   2) |dx| ≤ 0.45                      (left/right vertical sides)
        //   3) slant sides: derived from edge (0,−0.48)→(0.45,−0.24):
        //      direction = (0.45, 0.24), normal pointing inward = (−0.24, 0.45) (rotated 90°)
        //      Line: −0.24*(dx−0) + 0.45*(dy−(−0.48)) = 0
        //      −0.24*dx + 0.45*dy + 0.216 = 0
        //      Inside: −0.24*dx + 0.45*dy + 0.216 ≥ 0  (right side, positive-x half)
        //      By symmetry for |dx|: 0.24*|dx| − 0.45*|dy| ≤ 0.216
        //      Equivalently: 0.24*|dx| + 0.45*(0.48 − |dy|) ≥ 0  ... use simpler form:
        case "hexagon":
            {
                const ax = Math.abs(dx), ay = Math.abs(dy);
                // The slant-edge condition: for the top-right edge from (0,−0.48) to (0.45,−0.24)
                // a point (ax, −ay) is inside if:  0.24*ax − 0.45*(−ay + 0.48) ≤ 0
                // i.e.  0.24*ax + 0.45*ay ≤ 0.45*0.48 = 0.216
                // But that would exclude the centre — let me re-check:
                // At centre dx=0,dy=0: 0.24*0 + 0.45*0 = 0 ≤ 0.216 ✓
                // At top vertex dy=-0.48: 0.24*0 + 0.45*0.48 = 0.216 ≤ 0.216 ✓ (on boundary)
                // At right vertex dx=0.45: 0.24*0.45 + 0.45*0 = 0.108 ≤ 0.216 ✓
                // At top-right corner (would be outside): dx=0.45,dy=-0.48: 0.108+0.216=0.324 > 0.216 ✓ excluded
                return ay <= 0.478 && ax <= 0.448 && 0.24 * ax + 0.45 * ay <= 0.2165;
            }
        // ─── speech-bubble ───────────────────────────────────────────────────
        // path: M5,4 Q5,1 9,1 L91,1 Q95,1 95,5 L95,68 Q95,72 91,72
        //        L58,72 L50,92 L42,72 L9,72 Q5,72 5,68 Z
        // Body: x=[5,95]/100, y=[1,72]/100  →  dx∈[-0.45,0.45], dy∈[-0.49,0.22]
        // Tail: triangle from y=72 to y=92 (dy=0.22 to 0.42), x=[42,58]/100
        case "speech-bubble":
            {
                const ax = Math.abs(dx);
                if (ax <= 0.445 && dy >= -0.49 && dy <= 0.22) return true;
                if (dy > 0.22 && dy <= 0.42) {
                    const t = (dy - 0.22) / 0.20;
                    return ax <= 0.08 * (1 - t);
                }
                return false;
            }
        // ─── star ────────────────────────────────────────────────────────────
        // path: M50,4 L61,36 L96,36 L68,56 L79,90 L50,70 L21,90 L32,56 L4,36 L39,36
        // 5-pointed star, tip pointing UP.
        // Outer vertices (tips) in dx,dy:
        //   Top:         (0, -0.46)
        //   Right:       (+0.46, -0.14)   [96/100-0.5=0.46, 36/100-0.5=-0.14]
        //   Lower-right: (+0.29, +0.40)   [79/100-0.5=0.29, 90/100-0.5=0.40]
        //   Lower-left:  (-0.29, +0.40)
        //   Left:        (-0.46, -0.14)
        // Inner vertices (notches) in dx,dy:
        //   Top-right:   (+0.11, -0.14)   [61/100-0.5=0.11, 36/100-0.5=-0.14]
        //   Right:       (+0.18, +0.06)   [68/100-0.5=0.18, 56/100-0.5=0.06]
        //   Bottom:      (0,     +0.20)   [50/100-0.5=0, 70/100-0.5=0.20]
        //   Left:        (-0.18, +0.06)
        //   Top-left:    (-0.11, -0.14)
        // Strategy: point-in-polygon test using the actual 10 vertices
        case "star":
            {
                // 10 vertices of the star in (dx, dy) order:
                const vx = [
                    0,
                    0.11,
                    0.46,
                    0.18,
                    0.29,
                    0,
                    -0.29,
                    -0.18,
                    -0.46,
                    -0.11
                ];
                const vy = [
                    -0.46,
                    -0.14,
                    -0.14,
                    0.06,
                    0.40,
                    0.20,
                    0.40,
                    0.06,
                    -0.14,
                    -0.14
                ];
                return polyContains(vx, vy, dx, dy);
            }
        // ─── diamond ─────────────────────────────────────────────────────────
        // path: M50,3 L97,50 L50,97 L3,50
        // Rhombus. Half-diagonals: horizontal=(97-3)/2/100=0.47, vertical=(97-3)/2/100=0.47
        // But offset: centre is at (50/100, 50/100)=(0.5,0.5) ✓
        // Condition: |dx|/0.47 + |dy|/0.47 ≤ 1
        case "diamond":
            return (Math.abs(dx) + Math.abs(dy)) / 0.47 <= 1;
        // ─── shield ──────────────────────────────────────────────────────────
        // path: M50,3 L93,16 L93,46 Q93,78 50,97 Q7,78 7,46 L7,16
        // Top: rectangle x=[7,93]/100, y=[3,46]/100
        //      dx∈[-0.43,0.43], dy∈[-0.47,-0.04]
        // Bottom: curved, tapers from full width at dy=-0.04 to tip at dy=+0.47
        case "shield":
            {
                const ax = Math.abs(dx);
                if (dy < -0.47) return false;
                if (dy <= -0.04) return ax <= 0.43;
                const t = (dy + 0.04) / 0.51; // 0 at top of curve, 1 at tip
                return ax <= 0.43 * (1 - t * t);
            }
        // ─── octagon ─────────────────────────────────────────────────────────
        // path: M29,3 H71 L97,29 L97,71 L71,97 H29 L3,71 L3,29
        // Regular octagon. Cut corners at 45°.
        // Half-width = (97-3)/2/100 = 0.47 (but actual = 0.44 from centre to flat side)
        // The diagonal cut: from (0.29-0.5, 0.03-0.5)=(-0.21,-0.47) to (0.5-0.5, 0.03-0.5... 
        // Vertices: (±0.21,±0.47), (±0.47,±0.21)
        // Conditions: |dx|≤0.44 AND |dy|≤0.44 AND |dx|+|dy|≤0.65
        case "octagon":
            {
                const ax = Math.abs(dx), ay = Math.abs(dy);
                return ax <= 0.44 && ay <= 0.44 && ax + ay <= 0.64;
            }
        // ─── arrow ───────────────────────────────────────────────────────────
        // path: M50,3 L95,48 L68,48 L68,97 L32,97 L32,48 L5,48
        // Arrow pointing UP.
        // Head: triangle, tip at (0.5,0.03)=(dx=0,dy=-0.47), base at y=48/100 (dy=-0.02)
        //   Left base: (5/100,48/100)=(dx=-0.45,dy=-0.02)
        //   Right base:(95/100,48/100)=(dx=+0.45,dy=-0.02)
        // Shaft: rectangle x=[32,68]/100=(dx∈[-0.18,+0.18]), y=[48,97]/100=(dy∈[-0.02,+0.47])
        case "arrow":
            {
                const ax = Math.abs(dx);
                if (dy < -0.47) return false;
                if (dy <= -0.02) {
                    // Inside triangle head: linear taper from tip (ax=0) to base (ax=0.45)
                    const t = (dy + 0.47) / 0.45; // 0 at tip, 1 at base
                    return ax <= 0.45 * t;
                }
                // Shaft
                return ax <= 0.18 && dy <= 0.47;
            }
        // ─── cross ───────────────────────────────────────────────────────────
        // path: M33,3 H67 V33 H97 V67 H67 V97 H33 V67 H3 V33 H33
        // Two overlapping bars:
        //   Vertical:   x=[33,67]/100=(dx∈[-0.17,+0.17]), y=[3,97]/100=(dy∈[-0.47,+0.47])
        //   Horizontal: x=[3,97]/100=(dx∈[-0.47,+0.47]),  y=[33,67]/100=(dy∈[-0.17,+0.17])
        case "cross":
            {
                const ax = Math.abs(dx), ay = Math.abs(dy);
                return ax <= 0.17 && ay <= 0.47 || ax <= 0.47 && ay <= 0.17;
            }
        case "droplet":
            {
                const botCy = 0.22; // dy of bottom circle centre
                const botR = 0.28;
                if (dx * dx + (dy - botCy) ** 2 <= botR * botR) return true;
                // Upper taper: from dy=botCy-botR up to tip
                if (dy >= -0.47 && dy < botCy - botR) {
                    const t = (botCy - botR - dy) / (botCy - botR + 0.47); // 0 at base, 1 at tip
                    return Math.abs(dx) <= botR * (1 - t);
                }
                return false;
            }
        case "leaf":
            return (dx / 0.43) ** 2 + (dy / 0.47) ** 2 <= 1;
        case "pentagon":
            {
                const vx = [
                    0,
                    0.47,
                    0.29,
                    -0.29,
                    -0.47
                ];
                const vy = [
                    -0.47,
                    -0.14,
                    0.43,
                    0.43,
                    -0.14
                ];
                return polyContains(vx, vy, dx, dy);
            }
        case "cloud":
            {
                const lobes = [
                    [
                        -0.30,
                        -0.20,
                        0.175
                    ],
                    [
                        0.00,
                        -0.27,
                        0.155
                    ],
                    [
                        +0.23,
                        -0.20,
                        0.175
                    ],
                    [
                        0.00,
                        +0.10,
                        0.240
                    ],
                    [
                        -0.24,
                        +0.08,
                        0.145
                    ],
                    [
                        +0.20,
                        +0.08,
                        0.145
                    ]
                ];
                return lobes.some(([lx, ly, lr])=>(dx - lx) ** 2 + (dy - ly) ** 2 <= lr * lr);
            }
        // ─── location ────────────────────────────────────────────────────────
        // path: M50,3 Q82,3 82,35 Q82,63 50,97 Q18,63 18,35 Q18,3 50,3
        // Circle top + V-shaped bottom.
        // Circle: x=[18,82]/100, top y=3, passes through y=35 on sides
        //   Centre approximately: (50/100, 35/100) → (dx=0, dy=-0.15), radius≈0.32
        //   But actually it's a full circle top that narrows to a point.
        //   The "circle" part: centre (50,35)/100 → (dx=0, dy=-0.15), r=(82-18)/2/100=0.32
        case "location":
            {
                const cirCy = -0.15;
                const cirR = 0.32;
                if (dx * dx + (dy - cirCy) ** 2 <= cirR * cirR) return true;
                // V-taper from circle bottom to tip
                const cirBase = cirCy + cirR; // ≈ +0.17
                if (dy > cirBase && dy <= 0.47) {
                    const t = (dy - cirBase) / (0.47 - cirBase);
                    return Math.abs(dx) <= cirR * (1 - t);
                }
                return false;
            }
        default:
            return true;
    }
}
// ═══════════════════════════════════════════════════════════════════════════
// POLYGON POINT-IN-TEST (ray casting)
// ═══════════════════════════════════════════════════════════════════════════
function polyContains(vx, vy, px, py) {
    const n = vx.length;
    let inside = false;
    for(let i = 0, j = n - 1; i < n; j = i++){
        const xi = vx[i], yi = vy[i], xj = vx[j], yj = vy[j];
        const intersect = yi > py !== yj > py && px < (xj - xi) * (py - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
function moduleCentreNorm(col, row, s, N) {
    const origin = (1 - s) / 2;
    const cs = s / N;
    return [
        origin + (col + 0.5) * cs,
        origin + (row + 0.5) * cs
    ];
}
function computeFinderSafeScale(shapeId, N) {
    if (shapeId === "square") return 1.0;
    // Build list of (col, row) for all modules in the 3 finder blocks
    const finderModules = [];
    for(let r = 0; r < 7; r++){
        for(let c = 0; c < 7; c++){
            finderModules.push([
                c,
                r
            ]); // TL finder
            finderModules.push([
                N - 7 + c,
                r
            ]); // TR finder
            finderModules.push([
                c,
                N - 7 + r
            ]); // BL finder
        }
    }
    function allInside(s) {
        for (const [col, row] of finderModules){
            const [nx, ny] = moduleCentreNorm(col, row, s, N);
            if (!pointInShape(nx, ny, shapeId)) return false;
        }
        return true;
    }
    if (allInside(1.0)) return 1.0;
    let lo = 0.25, hi = 1.0;
    for(let i = 0; i < 40; i++){
        const mid = (lo + hi) / 2;
        if (allInside(mid)) lo = mid;
        else hi = mid;
    }
    return Math.max(0.25, lo - 0.002);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/pages/QRCanvasRenderer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRCanvasRenderer",
    ()=>QRCanvasRenderer,
    "downloadQRCode",
    ()=>downloadQRCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// QRCanvasRenderer.tsx - Canvas-based QR with proper shape handling
// ✅ Implements: fade effect, functional zone protection, smart dithering
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const QRCanvasRenderer = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = _s(({ url, size = 260, dotColor = "#000000", bgColor = "#ffffff", dotType = "square", cornerType = "square", shapeId, shapeConfig }, ref)=>{
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isLibraryLoaded, setIsLibraryLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load qr-code-styling library from CDN on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QRCanvasRenderer.useEffect": ()=>{
            if (window.QRCodeStyling) {
                setTimeout({
                    "QRCanvasRenderer.useEffect": ()=>setIsLibraryLoaded(true)
                }["QRCanvasRenderer.useEffect"], 0);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qr-code-styling/1.6.0/qr-code-styling.min.js";
            script.async = true;
            script.onload = ({
                "QRCanvasRenderer.useEffect": ()=>{
                    setTimeout({
                        "QRCanvasRenderer.useEffect": ()=>setIsLibraryLoaded(true)
                    }["QRCanvasRenderer.useEffect"], 0);
                }
            })["QRCanvasRenderer.useEffect"];
            script.onerror = ({
                "QRCanvasRenderer.useEffect": ()=>{
                    console.error("Failed to load qr-code-styling library");
                }
            })["QRCanvasRenderer.useEffect"];
            document.head.appendChild(script);
            return ({
                "QRCanvasRenderer.useEffect": ()=>{
                    if (document.head.contains(script)) {
                        document.head.removeChild(script);
                    }
                }
            })["QRCanvasRenderer.useEffect"];
        }
    }["QRCanvasRenderer.useEffect"], []);
    /**
     * ✅ Apply intelligent shape processing with:
     * - Fade effect (opacity: 30) instead of deletion
     * - Functional zone protection (finder patterns, timing lines)
     * - Smart dithering (~50% data preservation)
     * - Thicker cross to preserve more data
     */ const applyShapeProcessing = (container, width)=>{
        if (!container) return;
        const canvas = container.querySelector("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, width, width);
        const data = imageData.data;
        const height = width;
        // ✅ STEP 1: Define protected functional zones
        const margin = width * 0.18; // Safe zone around finder patterns
        const timingMargin = 6; // Protect timing lines
        const isProtected = (x, y)=>{
            // Finder patterns (top-left, top-right, bottom-left)
            if (x < margin && y < margin || x > width - margin && y < margin || x < margin && y > height - margin) {
                return true;
            }
            // Timing lines (both horizontal and vertical)
            if (Math.abs(x - width / 2) < timingMargin || Math.abs(y - height / 2) < timingMargin) {
                return true;
            }
            return false;
        };
        // ✅ STEP 2: Define shape boundary (thicker cross - 0.28)
        const thickness = (shapeConfig?.crossThickness ?? 0.28) * width;
        const halfThick = thickness / 2;
        const centerX = shapeConfig?.centerX ?? width / 2;
        const centerY = shapeConfig?.centerY ?? width / 2;
        const inCross = (x, y)=>{
            const distX = Math.abs(x - centerX);
            const distY = Math.abs(y - centerY);
            return distX < halfThick || distY < halfThick;
        };
        // ✅ STEP 3: Apply fade + dithering outside cross
        for(let i = 0; i < data.length; i += 4){
            const pixelIndex = i / 4;
            const x = pixelIndex % width;
            const y = Math.floor(pixelIndex / width);
            // Check if pixel is in cross (keep it)
            if (inCross(x, y)) {
                continue; // Keep full opacity α=255
            }
            // Check if pixel is protected (must keep)
            if (isProtected(x, y)) {
                continue; // Keep functional zones untouched
            }
            // ✅ Outside cross: apply fade + smart dithering
            // Keep ~50% of pixels with dithering pattern
            if ((x + y) % 2 === 0) {
                // ✅ GOOD: Fade to 30 opacity instead of full delete
                data[i + 3] = 30; // Alpha channel: faint but preserves signal
            }
        // Else: keep original (50% dither pattern)
        }
        // ✅ STEP 4: Write modified image data back
        ctx.putImageData(imageData, 0, 0);
    };
    // Render QR code when library is loaded and props change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QRCanvasRenderer.useEffect": ()=>{
            if (!isLibraryLoaded || !containerRef.current || !window.QRCodeStyling) return;
            // Clear previous content
            containerRef.current.innerHTML = "";
            const QRCodeStyling = window.QRCodeStyling;
            try {
                const qr = new QRCodeStyling({
                    width: size,
                    height: size,
                    data: url,
                    image: undefined,
                    margin: 0,
                    dotsOptions: {
                        color: dotColor,
                        type: dotType
                    },
                    backgroundOptions: {
                        color: bgColor
                    },
                    cornersSquareOptions: {
                        type: cornerType,
                        color: dotColor
                    },
                    cornersDotOptions: {
                        type: "dot",
                        color: dotColor
                    },
                    qrOptions: {
                        errorCorrectionLevel: "H",
                        typeNumber: 10
                    }
                });
                // Append to DOM
                qr.append(containerRef.current);
                // ✅ Apply shape-aware post-processing after render
                setTimeout({
                    "QRCanvasRenderer.useEffect": ()=>{
                        applyShapeProcessing(containerRef.current, size);
                    }
                }["QRCanvasRenderer.useEffect"], 100);
            } catch (error) {
                console.error("Error rendering QR code:", error);
            }
        }
    }["QRCanvasRenderer.useEffect"], [
        isLibraryLoaded,
        url,
        size,
        dotColor,
        bgColor,
        dotType,
        cornerType
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: (node)=>{
            containerRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        style: {
            display: "inline-block",
            borderRadius: 8,
            overflow: "hidden"
        }
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/pages/QRCanvasRenderer.tsx",
        lineNumber: 227,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "rhdQnjbE+C/6bIJzuey8Gqk0kvc=")), "rhdQnjbE+C/6bIJzuey8Gqk0kvc=");
_c1 = QRCanvasRenderer;
QRCanvasRenderer.displayName = "QRCanvasRenderer";
async function downloadQRCode(url, filename, options) {
    if (!window.QRCodeStyling) {
        console.error("QRCodeStyling library not available");
        return;
    }
    const QRCodeStyling = window.QRCodeStyling;
    const qr = new QRCodeStyling({
        width: options?.size || 500,
        height: options?.size || 500,
        data: url,
        dotsOptions: {
            color: options?.dotColor || "#000000",
            type: options?.dotType || "square"
        },
        backgroundOptions: {
            color: options?.bgColor || "#ffffff"
        },
        cornersSquareOptions: {
            type: options?.cornerType || "square",
            color: options?.dotColor || "#000000"
        },
        cornersDotOptions: {
            type: "dot",
            color: options?.dotColor || "#000000"
        },
        qrOptions: {
            errorCorrectionLevel: "H",
            typeNumber: 10
        }
    });
    await qr.download({
        name: filename,
        extension: "png"
    });
}
var _c, _c1;
__turbopack_context__.k.register(_c, "QRCanvasRenderer$React.forwardRef");
__turbopack_context__.k.register(_c1, "QRCanvasRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/pages/QRWithShapeCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRWithShapeCanvas",
    ()=>QRWithShapeCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// QRWithShapeCanvas.tsx - Wrapper integrating canvas-based QR into existing system
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$QRCanvasRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/QRCanvasRenderer.tsx [app-client] (ecmascript)");
;
;
;
const QRWithShapeCanvas = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ url: propUrl, size = 260, dotColor = "#000000", bgColor = "#ffffff", dotShape = "square", finderStyle = "square" }, ref)=>{
    // Map dot shape names to qr-code-styling dot types
    const dotTypeMap = {
        square: "square",
        dot: "dots",
        circle: "dots",
        "tiny-dot": "dots",
        rounded: "rounded",
        "rounded-tag": "rounded",
        diamond: "rounded",
        hexagon: "rounded",
        star: "rounded",
        classy: "classy",
        "classy-rounded": "classy-rounded",
        cross: "square",
        plus: "square",
        wave: "rounded",
        dna: "dots",
        leaf: "rounded"
    };
    // Map finder styles to corner types
    const cornerTypeMap = {
        square: "square",
        circle: "extra-rounded",
        rounded: "extra-rounded",
        "dot-outline": "dot",
        "round-outer": "extra-rounded",
        thick: "square",
        dashed: "square",
        double: "square",
        octagon: "square",
        gap: "extra-rounded"
    };
    const effectiveDotType = dotTypeMap[dotShape] || "square";
    const effectiveCornerType = cornerTypeMap[finderStyle] || "square";
    // Use provided URL or fall back to default
    const url = propUrl || "https://samcard.app";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$QRCanvasRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QRCanvasRenderer"], {
        ref: ref,
        url: url,
        size: size,
        dotColor: dotColor,
        bgColor: bgColor,
        dotType: effectiveDotType,
        cornerType: effectiveCornerType
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/pages/QRWithShapeCanvas.tsx",
        lineNumber: 83,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = QRWithShapeCanvas;
QRWithShapeCanvas.displayName = "QRWithShapeCanvas";
var _c, _c1;
__turbopack_context__.k.register(_c, "QRWithShapeCanvas$React.forwardRef");
__turbopack_context__.k.register(_c1, "QRWithShapeCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/pages/Qrrenderers.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRShapeThumbnail",
    ()=>QRShapeThumbnail,
    "QRStyled",
    ()=>QRStyled,
    "QRThumbnail",
    ()=>QRThumbnail,
    "QRWithShape",
    ()=>QRWithShape,
    "QR_SHAPE_DEFS",
    ()=>QR_SHAPE_DEFS,
    "STICKER_DEFS",
    ()=>STICKER_DEFS,
    "StickerBadge",
    ()=>StickerBadge,
    "renderDot",
    ()=>renderDot,
    "renderFinder",
    ()=>renderFinder,
    "renderLogoCenter",
    ()=>renderLogoCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// src/components/pages/Qrrenderers.tsx  (v5 — exact geometry, no scale floors)
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/qr-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$shape$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/qr-shape-geometry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$QRCanvasRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/QRCanvasRenderer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$QRWithShapeCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/QRWithShapeCanvas.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
const QR_SHAPE_DEFS = {
    square: {
        pathIn100: "M0,0 H100 V100 H0 Z",
        insetFrac: 0
    },
    "rounded-square": {
        pathIn100: "M12,0 H88 Q100,0 100,12 V88 Q100,100 88,100 H12 Q0,100 0,88 V12 Q0,0 12,0 Z",
        insetFrac: 0.02
    },
    circle: {
        pathIn100: "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z",
        insetFrac: 0.09
    },
    heart: {
        pathIn100: "M50,85 C50,85 5,58 5,32 C5,15 17,8 30,8 C39,8 46,13 50,19 C54,13 61,8 70,8 C83,8 95,15 95,32 C95,58 50,85 50,85 Z",
        insetFrac: 0.11
    },
    hexagon: {
        pathIn100: "M50,2 L95,26 L95,74 L50,98 L5,74 L5,26 Z",
        insetFrac: 0.08
    },
    "speech-bubble": {
        pathIn100: "M5,4 Q5,1 9,1 L91,1 Q95,1 95,5 L95,68 Q95,72 91,72 L58,72 L50,92 L42,72 L9,72 Q5,72 5,68 Z",
        insetFrac: 0.09
    },
    star: {
        pathIn100: "M50,4 L61,36 L96,36 L68,56 L79,90 L50,70 L21,90 L32,56 L4,36 L39,36 Z",
        insetFrac: 0.11
    },
    diamond: {
        pathIn100: "M50,3 L97,50 L50,97 L3,50 Z",
        insetFrac: 0.11
    },
    shield: {
        pathIn100: "M50,3 L93,16 L93,46 Q93,78 50,97 Q7,78 7,46 L7,16 Z",
        insetFrac: 0.11
    },
    octagon: {
        pathIn100: "M29,3 H71 L97,29 L97,71 L71,97 H29 L3,71 L3,29 Z",
        insetFrac: 0.07
    },
    arrow: {
        pathIn100: "M50,3 L95,48 L68,48 L68,97 L32,97 L32,48 L5,48 Z",
        insetFrac: 0.09
    },
    cross: {
        pathIn100: "M33,3 H67 V33 H97 V67 H67 V97 H33 V67 H3 V33 H33 Z",
        insetFrac: 0.04
    },
    droplet: {
        pathIn100: "M50,3 Q80,30 80,58 Q80,87 50,97 Q20,87 20,58 Q20,30 50,3 Z",
        insetFrac: 0.11
    },
    leaf: {
        pathIn100: "M50,97 Q6,78 6,34 Q6,3 50,3 Q94,3 94,34 Q94,78 50,97 Z",
        insetFrac: 0.09
    },
    pentagon: {
        pathIn100: "M50,3 L97,36 L79,93 L21,93 L3,36 Z",
        insetFrac: 0.10
    },
    cloud: {
        pathIn100: "M17,82 Q4,82 4,62 Q4,46 17,42 Q17,18 34,18 Q45,18 51,27 Q57,22 65,22 Q82,22 82,38 Q94,42 92,60 Q92,82 76,82 Z",
        insetFrac: 0.10
    },
    location: {
        pathIn100: "M50,3 Q82,3 82,35 Q82,63 50,97 Q18,63 18,35 Q18,3 50,3 Z",
        insetFrac: 0.12
    }
};
// Sin-based hash — visually indistinguishable from real QR noise, ~45 % density,
// zero periodicity. Safe only outside the real QR matrix boundary.
function fakeDark(r, c) {
    const v = Math.sin(r * 127.1 + c * 311.7 + r * c * 74.3) * 43758.5453;
    return v - Math.floor(v) < 0.45;
}
// Faint 28 % texture for light cells inside the real QR grid.
function buildGhostDots(gridOriginX, gridOriginY, cs, matrix, N, shapeId, size) {
    const dots = [];
    for(let r = 0; r < N; r++){
        for(let c = 0; c < N; c++){
            if (matrix[r][c] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFinderCell"])(r, c, N)) continue;
            const nx = (gridOriginX + (c + 0.5) * cs) / size;
            const ny = (gridOriginY + (r + 0.5) * cs) / size;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$shape$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInShape"])(nx, ny, shapeId)) dots.push({
                x: gridOriginX + c * cs,
                y: gridOriginY + r * cs,
                cs
            });
        }
    }
    return dots;
}
// Full-opacity fake QR fill for the padding zone between the inset QR grid
// and the shape edge. Uses fakeDark() so it looks like genuine QR data.
function buildPaddingDots(gridOriginX, gridOriginY, cs, N, shapeId, size) {
    if (gridOriginX < cs * 0.5) return [];
    const dots = [];
    const pad = Math.ceil(gridOriginX / cs) + 2;
    for(let r = -pad; r < N + pad; r++){
        for(let c = -pad; c < N + pad; c++){
            if (r >= 0 && r < N && c >= 0 && c < N) continue; // leave real QR untouched
            if (!fakeDark(r, c)) continue;
            const nx = (gridOriginX + (c + 0.5) * cs) / size;
            const ny = (gridOriginY + (r + 0.5) * cs) / size;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$shape$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInShape"])(nx, ny, shapeId)) dots.push({
                x: gridOriginX + c * cs,
                y: gridOriginY + r * cs,
                cs
            });
        }
    }
    return dots;
}
function renderDot(x, y, size, shape, color, key, scale = 1.0) {
    const s = size * scale * 0.88, cx = x + size / 2, cy = y + size / 2, r = s / 2;
    const ox = cx - s / 2, oy = cy - s / 2;
    if (shape === "square") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
        x: ox,
        y: oy,
        width: s,
        height: s,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 110,
        columnNumber: 34
    }, this);
    if (shape === "dot" || shape === "circle") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
        cx: cx,
        cy: cy,
        r: r * 0.85,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 111,
        columnNumber: 53
    }, this);
    if (shape === "tiny-dot") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
        cx: cx,
        cy: cy,
        r: r * 0.55,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 112,
        columnNumber: 36
    }, this);
    if (shape === "rounded") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
        x: ox,
        y: oy,
        width: s,
        height: s,
        rx: s * 0.3,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 113,
        columnNumber: 35
    }, this);
    if (shape === "rounded-tag") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
        x: ox,
        y: oy,
        width: s,
        height: s,
        rx: s * 0.18,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 114,
        columnNumber: 39
    }, this);
    if (shape === "diamond") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
        points: `${cx},${oy} ${ox + s},${cy} ${cx},${oy + s} ${ox},${cy}`,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 115,
        columnNumber: 35
    }, this);
    if (shape === "kite") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
        points: `${cx},${oy - r * 0.1} ${ox + s + r * 0.1},${cy} ${cx},${oy + s} ${ox},${cy}`,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 116,
        columnNumber: 32
    }, this);
    if (shape === "leaf") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
        cx: cx,
        cy: cy,
        rx: r * 0.7,
        ry: r,
        fill: color,
        transform: `rotate(-30,${cx},${cy})`
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 117,
        columnNumber: 32
    }, this);
    if (shape === "hexagon") {
        const pts = Array.from({
            length: 6
        }, (_, i)=>{
            const a = Math.PI / 3 * i - Math.PI / 6;
            return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        }).join(" ");
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: pts,
            fill: color
        }, key, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 120,
            columnNumber: 12
        }, this);
    }
    if (shape === "cross") {
        const t = s * 0.32;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: cx - t / 2,
                    y: oy,
                    width: t,
                    height: s,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 124,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox,
                    y: cy - t / 2,
                    width: s,
                    height: t,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 124,
                    columnNumber: 89
                }, this)
            ]
        }, key, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 124,
            columnNumber: 12
        }, this);
    }
    if (shape === "plus") {
        const t = s * 0.26, g2 = s * 0.12;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: cx - t / 2,
                    y: oy + g2,
                    width: t,
                    height: s - 2 * g2,
                    rx: t * 0.4,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 128,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox + g2,
                    y: cy - t / 2,
                    width: s - 2 * g2,
                    height: t,
                    rx: t * 0.4,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 128,
                    columnNumber: 116
                }, this)
            ]
        }, key, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 128,
            columnNumber: 12
        }, this);
    }
    if (shape === "bars-h") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: s,
                height: s * 0.42,
                rx: s * 0.1,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 130,
                columnNumber: 47
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy + s * 0.58,
                width: s,
                height: s * 0.42,
                rx: s * 0.1,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 130,
                columnNumber: 123
            }, this)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 130,
        columnNumber: 34
    }, this);
    if (shape === "bars-v") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: s * 0.42,
                height: s,
                rx: s * 0.1,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 131,
                columnNumber: 47
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + s * 0.58,
                y: oy,
                width: s * 0.42,
                height: s,
                rx: s * 0.1,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 131,
                columnNumber: 123
            }, this)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 131,
        columnNumber: 34
    }, this);
    if (shape === "mosaic") {
        const h = s / 2 * 0.88;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox,
                    y: oy,
                    width: h,
                    height: h,
                    rx: h * 0.15,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 134,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox + s - h,
                    y: oy + s - h,
                    width: h,
                    height: h,
                    rx: h * 0.15,
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 134,
                    columnNumber: 95
                }, this)
            ]
        }, key, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 134,
            columnNumber: 12
        }, this);
    }
    if (shape === "arrow-r") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
        points: `${ox},${oy} ${ox + s * 0.65},${oy} ${ox + s},${cy} ${ox + s * 0.65},${oy + s} ${ox},${oy + s}`,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 136,
        columnNumber: 35
    }, this);
    if (shape === "arrow-l") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
        points: `${ox + s},${oy} ${ox + s * 0.35},${oy} ${ox},${cy} ${ox + s * 0.35},${oy + s} ${ox + s},${oy + s}`,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 137,
        columnNumber: 35
    }, this);
    if (shape === "wave") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
        x: ox,
        y: oy,
        width: s,
        height: s,
        rx: s * 0.5,
        ry: s * 0.2,
        fill: color
    }, key, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 138,
        columnNumber: 32
    }, this);
    if (shape === "dna") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx - r * 0.25,
                cy: cy,
                r: r * 0.72,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 139,
                columnNumber: 44
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx + r * 0.25,
                cy: cy,
                r: r * 0.72,
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 139,
                columnNumber: 107
            }, this)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 139,
        columnNumber: 31
    }, this);
    if (shape === "star") {
        const pts = Array.from({
            length: 10
        }, (_, i)=>{
            const a = Math.PI / 5 * i - Math.PI / 2, rad = i % 2 === 0 ? r * 0.95 : r * 0.42;
            return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
        }).join(" ");
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: pts,
            fill: color
        }, key, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 142,
            columnNumber: 12
        }, this);
    }
    return null;
}
function renderFinder(oR, oC, cs, style, fg, accentFg, accentBg, key, eyeBall, bgColor) {
    const bg = bgColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].surface;
    const ox = oC * cs, oy = oR * cs;
    const os = 7 * cs, is = 3 * cs, io = 2 * cs;
    const outer = accentBg || fg, inner = accentFg || fg;
    const fcx = ox + os / 2, fcy = oy + os / 2;
    const ball = (c)=>{
        const bt = eyeBall || "square";
        const r = is / 2, bx = ox + io, by = oy + io;
        if (bt === "circle") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: fcx,
            cy: fcy,
            r: r,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 165,
            columnNumber: 33
        }, this);
        if (bt === "rounded") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: bx,
            y: by,
            width: is,
            height: is,
            rx: is * 0.3,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 166,
            columnNumber: 34
        }, this);
        if (bt === "diamond") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: `${fcx},${by} ${bx + is},${fcy} ${fcx},${by + is} ${bx},${fcy}`,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 167,
            columnNumber: 34
        }, this);
        if (bt === "hexagon") {
            const pts = Array.from({
                length: 6
            }, (_, i)=>{
                const a = Math.PI / 3 * i - Math.PI / 6;
                return `${fcx + r * Math.cos(a)},${fcy + r * Math.sin(a)}`;
            }).join(" ");
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: pts,
                fill: c
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 168,
                columnNumber: 203
            }, this);
        }
        if (bt === "star") {
            const pts = Array.from({
                length: 10
            }, (_, i)=>{
                const a = Math.PI / 5 * i - Math.PI / 2, rd = i % 2 === 0 ? r * 0.95 : r * 0.42;
                return `${fcx + rd * Math.cos(a)},${fcy + rd * Math.sin(a)}`;
            }).join(" ");
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: pts,
                fill: c
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 169,
                columnNumber: 243
            }, this);
        }
        if (bt === "leaf") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
            cx: fcx,
            cy: fcy,
            rx: r * 0.7,
            ry: r,
            fill: c,
            transform: `rotate(-30,${fcx},${fcy})`
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 170,
            columnNumber: 31
        }, this);
        if (bt === "cross") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: fcx - r * 0.18,
                    y: by,
                    width: r * 0.36,
                    height: is,
                    fill: c
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 171,
                    columnNumber: 35
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: bx,
                    y: fcy - r * 0.18,
                    width: is,
                    height: r * 0.36,
                    fill: c
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 171,
                    columnNumber: 107
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 171,
            columnNumber: 32
        }, this);
        if (bt === "ring") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: fcx,
            cy: fcy,
            r: r,
            fill: "none",
            stroke: c,
            strokeWidth: cs * 0.8
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 172,
            columnNumber: 31
        }, this);
        if (bt === "dot-sq") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: bx,
                    y: by,
                    width: is,
                    height: is,
                    fill: "none",
                    stroke: c,
                    strokeWidth: cs * 0.5
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 173,
                    columnNumber: 36
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: fcx,
                    cy: fcy,
                    r: r * 0.5,
                    fill: c
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 173,
                    columnNumber: 127
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 173,
            columnNumber: 33
        }, this);
        if (bt === "squircle") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: bx,
            y: by,
            width: is,
            height: is,
            rx: is * 0.5,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 174,
            columnNumber: 35
        }, this);
        if (bt === "kite") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: `${fcx},${by - r * 0.1} ${bx + is + r * 0.1},${fcy} ${fcx},${by + is} ${bx},${fcy}`,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 175,
            columnNumber: 31
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: bx,
            y: by,
            width: is,
            height: is,
            fill: c
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 176,
            columnNumber: 12
        }, this);
    };
    if (style === "circle") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: fcx,
                cy: fcy,
                r: os / 2,
                fill: outer
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 179,
                columnNumber: 47
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: fcx,
                cy: fcy,
                r: os / 2 - cs,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 179,
                columnNumber: 99
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 179,
        columnNumber: 34
    }, this);
    if (style === "rounded") {
        const r1 = os * 0.22;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox,
                    y: oy,
                    width: os,
                    height: os,
                    rx: r1,
                    fill: outer
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 180,
                    columnNumber: 72
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: ox + cs,
                    y: oy + cs,
                    width: os - 2 * cs,
                    height: os - 2 * cs,
                    rx: r1 * 0.4,
                    fill: bg
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 180,
                    columnNumber: 138
                }, this),
                ball(inner)
            ]
        }, key, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 180,
            columnNumber: 59
        }, this);
    }
    if (style === "dot-outline") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: fcx,
                cy: fcy,
                r: os / 2,
                fill: "none",
                stroke: outer,
                strokeWidth: cs
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 181,
                columnNumber: 52
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 181,
        columnNumber: 39
    }, this);
    if (style === "round-outer") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                rx: os * 0.35,
                fill: outer
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 182,
                columnNumber: 52
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + cs,
                y: oy + cs,
                width: os - 2 * cs,
                height: os - 2 * cs,
                rx: 1.5,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 182,
                columnNumber: 125
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 182,
        columnNumber: 39
    }, this);
    if (style === "thick") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                rx: os * 0.15,
                fill: outer
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 183,
                columnNumber: 46
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + cs * 1.5,
                y: oy + cs * 1.5,
                width: os - 3 * cs,
                height: os - 3 * cs,
                rx: 1.5,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 183,
                columnNumber: 119
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 183,
        columnNumber: 33
    }, this);
    if (style === "dashed") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                rx: os * 0.1,
                fill: "none",
                stroke: outer,
                strokeWidth: cs,
                strokeDasharray: `${cs * 1.5} ${cs * 0.8}`
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 184,
                columnNumber: 47
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 184,
        columnNumber: 34
    }, this);
    if (style === "double") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                rx: os * 0.1,
                fill: "none",
                stroke: outer,
                strokeWidth: cs * 0.6
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 185,
                columnNumber: 47
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + cs * 0.9,
                y: oy + cs * 0.9,
                width: os - 1.8 * cs,
                height: os - 1.8 * cs,
                rx: os * 0.08,
                fill: "none",
                stroke: outer,
                strokeWidth: cs * 0.4
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 185,
                columnNumber: 156
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 185,
        columnNumber: 34
    }, this);
    if (style === "octagon") {
        const f = os * 0.22;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                    points: `${ox + f},${oy} ${ox + os - f},${oy} ${ox + os},${oy + f} ${ox + os},${oy + os - f} ${ox + os - f},${oy + os} ${ox + f},${oy + os} ${ox},${oy + os - f} ${ox},${oy + f}`,
                    fill: outer
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 189,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                    points: `${ox + f + cs},${oy + cs} ${ox + os - f - cs},${oy + cs} ${ox + os - cs},${oy + f + cs} ${ox + os - cs},${oy + os - f - cs} ${ox + os - f - cs},${oy + os - cs} ${ox + f + cs},${oy + os - cs} ${ox + cs},${oy + os - f - cs} ${ox + cs},${oy + f + cs}`,
                    fill: bg
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 190,
                    columnNumber: 7
                }, this),
                ball(inner)
            ]
        }, key, true, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 188,
            columnNumber: 12
        }, this);
    }
    if (style === "gap") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                rx: os * 0.1,
                fill: outer
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 194,
                columnNumber: 44
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + cs * 1.2,
                y: oy + cs * 1.2,
                width: os - 2.4 * cs,
                height: os - 2.4 * cs,
                rx: 2,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 194,
                columnNumber: 116
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 194,
        columnNumber: 31
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox,
                y: oy,
                width: os,
                height: os,
                fill: outer
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 195,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: ox + cs,
                y: oy + cs,
                width: os - 2 * cs,
                height: os - 2 * cs,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 195,
                columnNumber: 81
            }, this),
            ball(inner)
        ]
    }, key, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 195,
        columnNumber: 10
    }, this);
}
function QRStyled({ dotShape, finderStyle, fg, bg, accentFg, accentBg, size = 100, scale = 1.0, eyeBall }) {
    const cs = size / 21;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: 0,
                y: 0,
                width: size,
                height: size,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEGACY_QR_GRID"].map((row, r)=>row.map((on, c)=>{
                    if (!on || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFinderCell21"])(r, c)) return null;
                    return renderDot(c * cs, r * cs, cs, dotShape, fg, `d-${r}-${c}`, scale);
                })),
            renderFinder(0, 0, cs, finderStyle, fg, accentFg, accentBg, "f1", eyeBall, bg),
            renderFinder(0, 14, cs, finderStyle, fg, accentFg, accentBg, "f2", eyeBall, bg),
            renderFinder(14, 0, cs, finderStyle, fg, accentFg, accentBg, "f3", eyeBall, bg)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
_c = QRStyled;
function renderLogoCenter(size, logoNode, logoBg, fg, bg) {
    const cx = size / 2, cy = size / 2, radius = size * 0.07;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: radius * 1.25,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: radius,
                fill: logoBg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: radius,
                fill: "none",
                stroke: fg,
                strokeWidth: 1,
                opacity: 0.2
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: `translate(${cx - radius * 0.65},${cy - radius * 0.65}) scale(${radius * 1.3 / 24})`,
                children: logoNode
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
function QRWithShape({ shapeId = "square", dotShape, finderStyle, fg, bg, accentFg, accentBg, scale = 1.0, eyeBall, size = 260, strokeEnabled, strokeColor, selectedLogo, customLogoUrl, clipId, logoNode, logoBg, qrMatrix: externalMatrix, qrN: externalN }) {
    _s();
    const shapeDef = QR_SHAPE_DEFS[shapeId] ?? QR_SHAPE_DEFS.square;
    const matrix = externalMatrix ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEGACY_QR_GRID"];
    const N = externalN ?? 21;
    // Inset the QR grid so ALL finder modules sit inside the shape boundary.
    const finderScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QRWithShape.useMemo[finderScale]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$shape$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeFinderSafeScale"])(shapeId, N)
    }["QRWithShape.useMemo[finderScale]"], [
        shapeId,
        N
    ]);
    const gridSize = size * finderScale;
    const gridOriginX = (size - gridSize) / 2;
    const gridOriginY = (size - gridSize) / 2;
    const cs = gridSize / N;
    const pathScale = size / 100;
    const ghostDots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QRWithShape.useMemo[ghostDots]": ()=>buildGhostDots(gridOriginX, gridOriginY, cs, matrix, N, shapeId, size)
    }["QRWithShape.useMemo[ghostDots]"], [
        gridOriginX,
        gridOriginY,
        cs,
        matrix,
        N,
        shapeId,
        size
    ]);
    const padDots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QRWithShape.useMemo[padDots]": ()=>buildPaddingDots(gridOriginX, gridOriginY, cs, N, shapeId, size)
    }["QRWithShape.useMemo[padDots]"], [
        gridOriginX,
        gridOriginY,
        cs,
        N,
        shapeId,
        size
    ]);
    const realDots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QRWithShape.useMemo[realDots]": ()=>{
            const out = [];
            matrix.forEach({
                "QRWithShape.useMemo[realDots]": (row, r)=>{
                    row.forEach({
                        "QRWithShape.useMemo[realDots]": (on, c)=>{
                            if (!on || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFinderCell"])(r, c, N)) return;
                            const nx = (gridOriginX + (c + 0.5) * cs) / size;
                            const ny = (gridOriginY + (r + 0.5) * cs) / size;
                            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$shape$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInShape"])(nx, ny, shapeId)) return;
                            out.push(renderDot(gridOriginX + c * cs, gridOriginY + r * cs, cs, dotShape, fg, `d-${r}-${c}`, scale));
                        }
                    }["QRWithShape.useMemo[realDots]"]);
                }
            }["QRWithShape.useMemo[realDots]"]);
            return out;
        }
    }["QRWithShape.useMemo[realDots]"], [
        matrix,
        N,
        gridOriginX,
        gridOriginY,
        cs,
        size,
        shapeId,
        dotShape,
        fg,
        scale
    ]);
    // Finders rendered outside the clip — always fully visible, never cropped.
    const finderOrigins = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFinderOrigins"])(N);
    const finders = finderOrigins.map(({ r, c }, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            transform: `translate(${gridOriginX},${gridOriginY})`,
            children: renderFinder(r, c, cs, finderStyle, fg, accentFg, accentBg, `f${i}`, eyeBall, bg)
        }, `f${i}`, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 302,
            columnNumber: 5
        }, this));
    const logoCx = size / 2, logoCy = size / 2;
    const logoRadius = size * 0.115, haloRadius = logoRadius * 1.25;
    const customClipId = `${clipId}-logo`;
    const shapeClipId = `${clipId}-shape`;
    const outlineColor = strokeEnabled ? strokeColor : fg;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                        id: shapeClipId,
                        clipPathUnits: "userSpaceOnUse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: shapeDef.pathIn100,
                            transform: `scale(${pathScale})`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 317,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    selectedLogo === "custom" && customLogoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                        id: customClipId,
                        clipPathUnits: "userSpaceOnUse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: logoCx,
                            cy: logoCy,
                            r: logoRadius
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 321,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: shapeDef.pathIn100,
                transform: `scale(${pathScale})`,
                fill: bg
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                clipPath: `url(#${shapeClipId})`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        opacity: 0.28,
                        children: ghostDots.map((d, i)=>renderDot(d.x, d.y, d.cs, dotShape, fg, `ghost-${i}`, 0.65))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    padDots.map((d, i)=>renderDot(d.x, d.y, d.cs, dotShape, fg, `pad-${i}`, scale)),
                    realDots
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            finders,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: shapeDef.pathIn100,
                transform: `scale(${pathScale})`,
                fill: "none",
                stroke: outlineColor,
                strokeWidth: 3.5 / pathScale,
                strokeLinejoin: "round",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 345,
                columnNumber: 7
            }, this),
            selectedLogo && selectedLogo !== "custom" && logoNode && logoBg && renderLogoCenter(size, logoNode, logoBg, fg, bg),
            selectedLogo === "custom" && customLogoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: logoCx,
                        cy: logoCy,
                        r: haloRadius,
                        fill: bg
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                        href: customLogoUrl,
                        x: logoCx - logoRadius,
                        y: logoCy - logoRadius,
                        width: logoRadius * 2,
                        height: logoRadius * 2,
                        preserveAspectRatio: "xMidYMid slice",
                        clipPath: `url(#${customClipId})`
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: logoCx,
                        cy: logoCy,
                        r: logoRadius,
                        fill: "none",
                        stroke: fg,
                        strokeWidth: 1,
                        opacity: 0.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 360,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
_s(QRWithShape, "ALE1tvM0pPxG6SLUQWGKB1YQV+Y=");
_c1 = QRWithShape;
function QRShapeThumbnail({ shapeId = "square", fg = "#111111", bg = "#ffffff", size = 76, clipId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${size} ${size}`,
        style: {
            display: "block"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QRWithShape, {
            shapeId: shapeId,
            dotShape: "square",
            finderStyle: "square",
            fg: fg,
            bg: bg,
            scale: 1.0,
            eyeBall: "square",
            size: size,
            clipId: clipId
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
            lineNumber: 376,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 375,
        columnNumber: 5
    }, this);
}
_c2 = QRShapeThumbnail;
const ringPad = (o, q)=>(o - q) / 2;
const STICKER_DEFS = [
    {
        id: "circle-ring-pink",
        label: "Circle Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const p = ringPad(o, q), cx = o / 2, cy = o / 2, r = cx - p * 0.3;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: r,
                fill: "none",
                stroke: "#e91e8c",
                strokeWidth: p * 0.55
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 394,
                columnNumber: 171
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "double-ring",
        label: "Double Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const p = ringPad(o, q), cx = o / 2, cy = o / 2;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: cx - p * 0.2,
                        fill: "none",
                        stroke: "#e91e8c",
                        strokeWidth: p * 0.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 395,
                        columnNumber: 151
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: cx - p * 0.55,
                        fill: "none",
                        stroke: "#e91e8c",
                        strokeWidth: p * 0.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 395,
                        columnNumber: 245
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 395,
                columnNumber: 148
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "dashed-ring",
        label: "Dashed Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const p = ringPad(o, q), cx = o / 2, cy = o / 2, r = cx - p * 0.35, circ = 2 * Math.PI * r;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: r,
                fill: "none",
                stroke: "#e91e8c",
                strokeWidth: p * 0.45,
                strokeDasharray: `${circ / 16} ${circ / 32}`
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 396,
                columnNumber: 191
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scalloped",
        label: "Scalloped",
        category: "Simple Rings",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), scR = p > 0 ? p * 0.22 : q * 0.05, r = p > 0 ? cx - p * 0.35 : q / 2 * 1.05;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: Array.from({
                    length: 24
                }, (_, i)=>{
                    const a = 2 * Math.PI / 24 * i;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx + r * Math.cos(a),
                        cy: cy + r * Math.sin(a),
                        r: scR,
                        fill: "#e91e8c"
                    }, i, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 397,
                        columnNumber: 305
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 397,
                columnNumber: 221
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scallop-fill",
        label: "Scallop Fill",
        category: "Simple Rings",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), scR = p > 0 ? p * 0.22 : q * 0.05, r = p > 0 ? cx - p * 0.35 : q / 2 * 1.05;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    Array.from({
                        length: 24
                    }, (_, i)=>{
                        const a = 2 * Math.PI / 24 * i;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: cx + r * Math.cos(a),
                            cy: cy + r * Math.sin(a),
                            r: scR,
                            fill: "#ad1457"
                        }, i, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 398,
                            columnNumber: 311
                        }, ("TURBOPACK compile-time value", void 0));
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "rgba(173,20,87,0.08)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 398,
                        columnNumber: 409
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 398,
                columnNumber: 227
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "rounded-frame",
        label: "Rounded Frame",
        category: "Simple Frames",
        render: (o, q)=>{
            const p = ringPad(o, q), m = p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: m,
                y: m,
                width: o - 2 * m,
                height: o - 2 * m,
                rx: p * 0.7,
                fill: "none",
                stroke: "#e91e8c",
                strokeWidth: p * 0.5
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 399,
                columnNumber: 143
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "corner-frame",
        label: "Corner Frame",
        category: "Simple Frames",
        render: (o, q)=>{
            const p = ringPad(o, q), m = p * 0.2, arm = p * 1.1, sw = p * 0.45;
            const corners = [
                [
                    m,
                    m + arm,
                    m,
                    m,
                    m + arm,
                    m
                ],
                [
                    o - m - arm,
                    m,
                    o - m,
                    m,
                    o - m,
                    m + arm
                ],
                [
                    m,
                    o - m - arm,
                    m,
                    o - m,
                    m + arm,
                    o - m
                ],
                [
                    o - m - arm,
                    o - m,
                    o - m,
                    o - m,
                    o - m,
                    o - m - arm
                ]
            ];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: corners.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                        points: `${c[0]},${c[1]} ${c[2]},${c[3]} ${c[4]},${c[5]}`,
                        fill: "none",
                        stroke: "#e91e8c",
                        strokeWidth: sw,
                        strokeLinecap: "round"
                    }, i, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 400,
                        columnNumber: 390
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 400,
                columnNumber: 364
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "bold-frame",
        label: "Bold Frame",
        category: "Simple Frames",
        render: (o, q)=>{
            const p = ringPad(o, q), m = p * 0.15;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: m,
                y: m,
                width: o - 2 * m,
                height: o - 2 * m,
                rx: p * 0.3,
                fill: "none",
                stroke: "#e91e8c",
                strokeWidth: p * 0.8
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 401,
                columnNumber: 137
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-teal",
        label: "Scan Me Teal",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#00bcd4",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 402,
                        columnNumber: 167
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-teal-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 402,
                            columnNumber: 256
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 402,
                        columnNumber: 250
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-teal-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 402,
                            columnNumber: 428
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 402,
                        columnNumber: 349
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 402,
                columnNumber: 164
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-red",
        label: "Scan Me Red",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#f44336",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 403,
                        columnNumber: 165
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-red-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 403,
                            columnNumber: 254
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 403,
                        columnNumber: 248
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-red-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 403,
                            columnNumber: 425
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 403,
                        columnNumber: 346
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 403,
                columnNumber: 162
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-navy",
        label: "Scan Me Navy",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#1a237e",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 404,
                        columnNumber: 167
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-navy-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 404,
                            columnNumber: 256
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 404,
                        columnNumber: 250
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-navy-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 404,
                            columnNumber: 428
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 404,
                        columnNumber: 349
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 404,
                columnNumber: 164
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-gold",
        label: "Scan Me Gold",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#ffc107",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 405,
                        columnNumber: 167
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-gold-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 405,
                            columnNumber: 256
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 405,
                        columnNumber: 250
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "#333",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-gold-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 405,
                            columnNumber: 427
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 405,
                        columnNumber: 349
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 405,
                columnNumber: 164
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-purple",
        label: "Scan Me Purple",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#7b1fa2",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 406,
                        columnNumber: 171
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-purple-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 406,
                            columnNumber: 260
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 406,
                        columnNumber: 254
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-purple-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 406,
                            columnNumber: 434
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 406,
                        columnNumber: 355
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 406,
                columnNumber: 168
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-green",
        label: "Scan Me Green",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#2e7d32",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 407,
                        columnNumber: 169
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-green-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 407,
                            columnNumber: 258
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 407,
                        columnNumber: 252
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-green-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 407,
                            columnNumber: 431
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 407,
                        columnNumber: 352
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 407,
                columnNumber: 166
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-orange",
        label: "Scan Me Orange",
        category: "Scan Me",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#e65100",
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 408,
                        columnNumber: 171
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            id: `sp-orange-${o}`,
                            d: `M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 408,
                            columnNumber: 260
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 408,
                        columnNumber: 254
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.12em",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                            href: `#sp-orange-${o}`,
                            startOffset: "20%",
                            children: "SCAN ME • SCAN ME •"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 408,
                            columnNumber: 434
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 408,
                        columnNumber: 355
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 408,
                columnNumber: 168
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "christmas-wreath",
        label: "Christmas Wreath",
        category: "Holiday",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.35;
            const leaves = Array.from({
                length: 28
            }, (_, i)=>{
                const a = 2 * Math.PI / 28 * i, lx = cx + r * Math.cos(a), ly = cy + r * Math.sin(a);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: lx,
                    cy: ly,
                    rx: p * 0.28,
                    ry: p * 0.16,
                    fill: "#2e7d32",
                    transform: `rotate(${a * 180 / Math.PI + 90},${lx},${ly})`
                }, i, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 409,
                    columnNumber: 314
                }, ("TURBOPACK compile-time value", void 0));
            });
            const berries = Array.from({
                length: 8
            }, (_, i)=>{
                const a = 2 * Math.PI / 8 * i;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: cx + r * Math.cos(a),
                    cy: cy + r * Math.sin(a),
                    r: p * 0.12,
                    fill: "#c62828"
                }, i, false, {
                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                    lineNumber: 409,
                    columnNumber: 554
                }, ("TURBOPACK compile-time value", void 0));
            });
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    leaves,
                    berries
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 409,
                columnNumber: 665
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "snowflake-ring",
        label: "Snowflake Border",
        category: "Holiday",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#90caf9",
                        strokeWidth: p * 0.18
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 410,
                        columnNumber: 172
                    }, ("TURBOPACK compile-time value", void 0)),
                    Array.from({
                        length: 12
                    }, (_, i)=>{
                        const a = 2 * Math.PI / 12 * i, sx = cx + r * Math.cos(a), sy = cy + r * Math.sin(a);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: `translate(${sx},${sy}) rotate(${a * 180 / Math.PI})`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: 0,
                                    y1: -p * 0.25,
                                    x2: 0,
                                    y2: p * 0.25,
                                    stroke: "#90caf9",
                                    strokeWidth: p * 0.1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 410,
                                    columnNumber: 468
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: -p * 0.15,
                                    y1: -p * 0.08,
                                    x2: p * 0.15,
                                    y2: p * 0.08,
                                    stroke: "#90caf9",
                                    strokeWidth: p * 0.07
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 410,
                                    columnNumber: 558
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: -p * 0.15,
                                    y1: p * 0.08,
                                    x2: p * 0.15,
                                    y2: -p * 0.08,
                                    stroke: "#90caf9",
                                    strokeWidth: p * 0.07
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 410,
                                    columnNumber: 664
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 410,
                            columnNumber: 391
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 410,
                columnNumber: 169
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "gold-ring",
        label: "Gold Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r + p * 0.1,
                        fill: "none",
                        stroke: "#b8860b",
                        strokeWidth: p * 0.65
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 411,
                        columnNumber: 165
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: "#ffd700",
                        strokeWidth: p * 0.35
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 411,
                        columnNumber: 259
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 411,
                columnNumber: 162
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "lavender-ring",
        label: "Lavender Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: r,
                fill: "none",
                stroke: "#9c27b0",
                strokeWidth: p * 0.55
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 412,
                columnNumber: 170
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "coral-ring",
        label: "Coral Ring",
        category: "Simple Rings",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: r,
                fill: "none",
                stroke: "#ff5722",
                strokeWidth: p * 0.55
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 413,
                columnNumber: 164
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "rainbow-ring",
        label: "Rainbow Ring",
        category: "Special",
        render: (o, q)=>{
            const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3, gradId = `rainbow-grad-${o}`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: gradId,
                            x1: "0%",
                            y1: "0%",
                            x2: "100%",
                            y2: "100%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#f44336"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 266
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "16%",
                                    stopColor: "#ff9800"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 306
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "33%",
                                    stopColor: "#ffeb3b"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 347
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "50%",
                                    stopColor: "#4caf50"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 388
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "67%",
                                    stopColor: "#2196f3"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 429
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "83%",
                                    stopColor: "#9c27b0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 470
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#f44336"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                    lineNumber: 414,
                                    columnNumber: 511
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 414,
                            columnNumber: 202
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 414,
                        columnNumber: 196
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: "none",
                        stroke: `url(#${gradId})`,
                        strokeWidth: p * 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 414,
                        columnNumber: 577
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 414,
                columnNumber: 193
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "scan-me-banner-bottom",
        label: "Scan Me Banner",
        category: "Banners",
        render: (o, q)=>{
            const p = ringPad(o, q), bh = p * 1.1;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 0,
                        y: o - bh,
                        width: o,
                        height: bh,
                        fill: "#222"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 415,
                        columnNumber: 149
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: o / 2,
                        y: o - bh / 2 + p * 0.2,
                        textAnchor: "middle",
                        fill: "white",
                        fontSize: p * 0.55,
                        fontWeight: "800",
                        letterSpacing: "0.1em",
                        children: "SCAN ME"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 415,
                        columnNumber: 208
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 415,
                columnNumber: 146
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "like-us-banner",
        label: "Like Us Banner",
        category: "Banners",
        render: (o, q)=>{
            const p = ringPad(o, q), bh = p * 1.1;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 0,
                        y: 0,
                        width: o,
                        height: bh,
                        fill: "#1877F2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 416,
                        columnNumber: 142
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: o / 2,
                        y: bh / 2 + p * 0.2,
                        textAnchor: "middle",
                        fill: "white",
                        fontSize: p * 0.5,
                        fontWeight: "800",
                        children: "👍 Like Us!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 416,
                        columnNumber: 199
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 416,
                columnNumber: 139
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        id: "watch-video-banner",
        label: "Watch Video",
        category: "Banners",
        render: (o, q)=>{
            const p = ringPad(o, q), bh = p * 1.1;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 0,
                        y: o - bh,
                        width: o,
                        height: bh,
                        fill: "#FF0000"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 417,
                        columnNumber: 143
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: o / 2,
                        y: o - bh / 2 + p * 0.2,
                        textAnchor: "middle",
                        fill: "white",
                        fontSize: p * 0.5,
                        fontWeight: "800",
                        children: "▶ Watch Video"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 417,
                        columnNumber: 205
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 417,
                columnNumber: 140
            }, ("TURBOPACK compile-time value", void 0));
        }
    }
];
function StickerBadge({ sticker }) {
    const iconEl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ICONS"][sticker.icon]?.(sticker.color);
    const posStyle = sticker.pos === "top-left" ? {
        top: -14,
        left: 8
    } : sticker.pos === "top-right" ? {
        top: -14,
        right: 8
    } : {
        top: -14,
        left: "50%",
        transform: "translateX(-50%)"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            ...posStyle,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].surface,
            border: `2.5px solid ${sticker.outline}`,
            borderRadius: 20,
            padding: "4px 10px 4px 7px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.13)",
            whiteSpace: "nowrap",
            zIndex: 10
        },
        children: [
            iconEl,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontFamily: "'Sora','DM Sans',system-ui,sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    color: sticker.color
                },
                children: sticker.text
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 435,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 433,
        columnNumber: 5
    }, this);
}
_c3 = StickerBadge;
function QRThumbnail({ design, selected, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClick,
                style: {
                    width: "100%",
                    aspectRatio: "1",
                    border: selected ? `2px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].accent}` : "2px solid #1e3328",
                    borderRadius: 10,
                    background: design.bg,
                    cursor: "pointer",
                    padding: 4,
                    transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: selected ? "0 0 0 3px rgba(34,197,94,0.2)" : "none",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    position: "relative",
                    overflow: "hidden"
                },
                children: [
                    selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            top: 3,
                            right: 3,
                            zIndex: 3,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "9",
                            height: "7",
                            viewBox: "0 0 9 7",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M1 3l2.5 2.5L8 1",
                                stroke: "white",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                                lineNumber: 463,
                                columnNumber: 69
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 463,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 462,
                        columnNumber: 11
                    }, this),
                    design.sticker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            top: 2,
                            left: 2,
                            zIndex: 2,
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].surface,
                            border: `1.5px solid ${design.sticker.outline}`,
                            borderRadius: 8,
                            padding: "1px 5px",
                            fontSize: 8,
                            fontWeight: 700,
                            color: design.sticker.color
                        },
                        children: design.sticker.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 467,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "100%",
                        height: "100%",
                        viewBox: "0 0 100 100",
                        style: {
                            display: "block"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QRStyled, {
                            dotShape: design.dotShape,
                            finderStyle: design.finderStyle,
                            fg: design.fg,
                            bg: design.bg,
                            accentFg: design.accentFg,
                            accentBg: design.accentBg,
                            size: 100,
                            eyeBall: "square"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                        lineNumber: 469,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    fontSize: 10,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"].textDim,
                    fontWeight: 500,
                    lineHeight: 1.2
                },
                children: design.label
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
                lineNumber: 473,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/pages/Qrrenderers.tsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_c4 = QRThumbnail;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "QRStyled");
__turbopack_context__.k.register(_c1, "QRWithShape");
__turbopack_context__.k.register(_c2, "QRShapeThumbnail");
__turbopack_context__.k.register(_c3, "StickerBadge");
__turbopack_context__.k.register(_c4, "QRThumbnail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublicCardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-client] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/linkedin.js [app-client] (ecmascript) <export default as Linkedin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/instagram.js [app-client] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/youtube.js [app-client] (ecmascript) <export default as Youtube>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$Qrrenderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/Qrrenderers.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/qr-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/pages/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const BACKEND_URL = ("TURBOPACK compile-time value", "http://localhost:5001")?.replace(/\/$/, "") || "";
const PUBLIC_BASE = ("TURBOPACK compile-time value", "http://localhost:3000")?.replace(/\/$/, "") || "https://samcard.vercel.app";
const normalizePhoneBgType = (value)=>{
    if (typeof value !== "string") return "solid";
    return value.toLowerCase() === "gradient" ? "gradient" : "solid";
};
const resolveAssetUrl = (value)=>{
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Keep already-resolved URLs and inline sources unchanged.
    if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    const cleaned = trimmed.replace(/^\/+/, "");
    const base = BACKEND_URL || PUBLIC_BASE || (("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${base.replace(/\/$/, "")}/${cleaned}`;
};
// ── Helpers ────────────────────────────────────────────────────────
function getVisitorId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let id = localStorage.getItem("_sc_vid");
    if (!id) {
        id = Math.random().toString(36).slice(2);
        localStorage.setItem("_sc_vid", id);
    }
    return id;
}
function track(slug, type) {
    fetch(`${BACKEND_URL}/api/public/cards/${slug}/track`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type,
            visitorId: getVisitorId()
        })
    }).catch(()=>{});
}
function openLink(url) {
    if (!url) return;
    window.open(url.startsWith("http") ? url : `https://${url}`, "_blank", "noopener,noreferrer");
}
const SOCIAL_META = {
    linkedin: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__["Linkedin"],
        color: "#0a66c2",
        label: "LinkedIn"
    },
    instagram: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"],
        color: "#e1306c",
        label: "Instagram"
    },
    twitter: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"],
        color: "#1da1f2",
        label: "Twitter"
    },
    facebook: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"],
        color: "#1877f2",
        label: "Facebook"
    },
    youtube: {
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__["Youtube"],
        color: "#ff0000",
        label: "YouTube"
    }
};
// ── Dynamic QR ─────────────────────────────────────────────────────
function DynamicQR({ qrConfig, cardUrl, size = 160 }) {
    _s();
    const { matrix, N } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$qr$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeQRMatrix"])(cardUrl)
    }["DynamicQR.useMemo"], [
        cardUrl
    ]);
    const decoratedImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo[decoratedImageUrl]": ()=>resolveAssetUrl(qrConfig?.decorateImageUrl)
    }["DynamicQR.useMemo[decoratedImageUrl]"], [
        qrConfig?.decorateImageUrl
    ]);
    const sticker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo[sticker]": ()=>{
            if (!qrConfig?.stickerId) return null;
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$Qrrenderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STICKER_DEFS"].find({
                "DynamicQR.useMemo[sticker]": (s)=>s.id === qrConfig.stickerId
            }["DynamicQR.useMemo[sticker]"]) ?? null;
        }
    }["DynamicQR.useMemo[sticker]"], [
        qrConfig?.stickerId
    ]);
    const logoEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo[logoEntry]": ()=>{
            if (!qrConfig?.selectedLogo?.startsWith("logo-")) return null;
            const idx = parseInt(qrConfig.selectedLogo.replace("logo-", ""), 10);
            return isNaN(idx) ? null : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGOS"][idx];
        }
    }["DynamicQR.useMemo[logoEntry]"], [
        qrConfig?.selectedLogo
    ]);
    const customLogoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo[customLogoUrl]": ()=>resolveAssetUrl(qrConfig?.customLogoUrl)
    }["DynamicQR.useMemo[customLogoUrl]"], [
        qrConfig?.customLogoUrl
    ]);
    const selectedLogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicQR.useMemo[selectedLogo]": ()=>{
            const raw = qrConfig?.selectedLogo?.trim() || "";
            if (raw.startsWith("logo-")) return raw;
            if (raw === "custom" || customLogoUrl) return "custom";
            return raw || null;
        }
    }["DynamicQR.useMemo[selectedLogo]"], [
        qrConfig?.selectedLogo,
        customLogoUrl
    ]);
    const isSquareShape = !qrConfig?.shapeId || qrConfig.shapeId === 'square' || qrConfig.shapeId === 'rounded-square';
    const RING_PAD = sticker ? isSquareShape ? 60 : 32 : 0;
    const OUTER = size + RING_PAD * 2;
    const gradId = "pub-qr-grad";
    const clipId = "pub-qr-clip";
    const fg = qrConfig?.fg ?? "#000000";
    const bg = qrConfig?.bg ?? "#ffffff";
    if (decoratedImageUrl) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: decoratedImageUrl,
            alt: "QR code",
            width: size,
            height: size,
            style: {
                display: "block",
                width: size,
                height: size,
                objectFit: "contain",
                borderRadius: 10,
                background: qrConfig?.bg ?? "#ffffff"
            }
        }, void 0, false, {
            fileName: "[project]/src/app/[slug]/page.tsx",
            lineNumber: 269,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${OUTER} ${OUTER}`,
        style: {
            display: "block",
            borderRadius: 10
        },
        children: [
            qrConfig?.gradEnabled && (qrConfig.gradStops?.length ?? 0) >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: gradId,
                    x1: `${50 - 50 * Math.cos((qrConfig.gradAngle ?? 135) * Math.PI / 180)}%`,
                    y1: `${50 - 50 * Math.sin((qrConfig.gradAngle ?? 135) * Math.PI / 180)}%`,
                    x2: `${50 + 50 * Math.cos((qrConfig.gradAngle ?? 135) * Math.PI / 180)}%`,
                    y2: `${50 + 50 * Math.sin((qrConfig.gradAngle ?? 135) * Math.PI / 180)}%`,
                    children: qrConfig.gradStops.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: `${s.offset * 100}%`,
                            stopColor: s.color
                        }, i, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 303,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 295,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 294,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: OUTER,
                height: OUTER,
                fill: bg,
                rx: 10
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: sticker ? `translate(${RING_PAD},${RING_PAD})` : undefined,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$pages$2f$Qrrenderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["QRWithShape"], {
                    shapeId: qrConfig?.shapeId ?? "square",
                    dotShape: qrConfig?.dotShape ?? "square",
                    finderStyle: qrConfig?.finderStyle ?? "square",
                    fg: qrConfig?.gradEnabled ? `url(#${gradId})` : fg,
                    bg: bg,
                    accentFg: qrConfig?.accentFg,
                    accentBg: qrConfig?.accentBg,
                    scale: qrConfig?.bodyScale ?? 1.0,
                    eyeBall: qrConfig?.eyeBall ?? "square",
                    size: size,
                    strokeEnabled: qrConfig?.strokeEnabled ?? false,
                    strokeColor: qrConfig?.strokeColor ?? "#000000",
                    selectedLogo: selectedLogo,
                    customLogoUrl: customLogoUrl,
                    logoNode: logoEntry?.icon ?? null,
                    logoBg: logoEntry?.bg ?? qrConfig?.logoBg ?? "#ffffff",
                    clipId: clipId,
                    qrMatrix: matrix,
                    qrN: N
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 310,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            sticker && sticker.render(OUTER, size)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 287,
        columnNumber: 5
    }, this);
}
_s(DynamicQR, "gwWoDLxNZzwEf8IKibNe7GlKqPc=");
_c = DynamicQR;
// ── Sub-components ─────────────────────────────────────────────────
function SectionHeader({ icon, title, T }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderBottom: `1px solid ${T.cardBorder}`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `linear-gradient(135deg,${T.green},${T.greenLight})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 365,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontWeight: T.boldHeadings ? 700 : 500,
                    fontSize: T.bodyFontSize + 1,
                    color: T.textPrimary
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 356,
        columnNumber: 5
    }, this);
}
_c1 = SectionHeader;
function Divider({ color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 1,
            background: color,
            margin: "0 16px"
        }
    }, void 0, false, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 393,
        columnNumber: 10
    }, this);
}
_c2 = Divider;
function CardBlock({ children, T }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 404,
        columnNumber: 5
    }, this);
}
_c3 = CardBlock;
// ── Extra Section Block ────────────────────────────────────────────
function ExtraSectionBlock({ section, T, onLinkClick }) {
    const d = section.data;
    function str(key) {
        const v = d[key];
        return typeof v === "string" ? v : "";
    }
    switch(section.type){
        case "extra-button":
            {
                const btnLabel = str("btnLabel");
                const btnUrl = str("btnUrl");
                if (!btnLabel && !btnUrl) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onLinkClick();
                            openLink(btnUrl);
                        },
                        style: {
                            width: "100%",
                            padding: "12px",
                            fontWeight: 700,
                            color: "#fff",
                            background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                            border: "none",
                            borderRadius: T.cardRadius,
                            fontSize: T.bodyFontSize,
                            fontFamily: T.fontFamily,
                            cursor: "pointer"
                        },
                        children: btnLabel || "Click Here"
                    }, void 0, false, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 461,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 460,
                    columnNumber: 9
                }, this);
            }
        case "extra-video":
            {
                const videoUrl = str("videoUrl");
                if (!videoUrl) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onLinkClick();
                            openLink(videoUrl);
                        },
                        style: {
                            width: "100%",
                            height: 96,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                    size: 20,
                                    color: "#fff"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 520,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 509,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: T.bodyFontSize,
                                    color: T.textMuted,
                                    fontFamily: T.fontFamily
                                },
                                children: "Watch Video"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 522,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 485,
                    columnNumber: 9
                }, this);
            }
        case "extra-hours":
            {
                const days = [
                    "Monday–Friday",
                    "Saturday",
                    "Sunday"
                ];
                const hasAny = days.some((day)=>str(day));
                if (!hasAny) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 16px",
                                borderBottom: `1px solid ${T.divider}`
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        flexShrink: 0,
                                        background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 14
                                    },
                                    children: "🕐"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 552,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontWeight: T.boldHeadings ? 700 : 500,
                                        fontSize: T.bodyFontSize + 1,
                                        color: T.textPrimary,
                                        fontFamily: T.fontFamily
                                    },
                                    children: "Business Hours"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 543,
                            columnNumber: 11
                        }, this),
                        days.map((day)=>{
                            const val = str(day);
                            return val ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "8px 16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: T.bodyFontSize,
                                            color: T.textMuted,
                                            fontFamily: T.fontFamily
                                        },
                                        children: day
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: T.boldHeadings ? 500 : 400,
                                            fontSize: T.bodyFontSize,
                                            color: T.textPrimary,
                                            fontFamily: T.fontFamily
                                        },
                                        children: val
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 592,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, day, true, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 581,
                                columnNumber: 15
                            }, this) : null;
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 534,
                    columnNumber: 9
                }, this);
            }
        case "extra-products":
            {
                const productName = str("productName");
                const price = str("price");
                const buyUrl = str("buyUrl");
                if (!productName) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "12px 16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: T.boldHeadings ? 700 : 500,
                                            fontSize: T.bodyFontSize,
                                            color: T.textPrimary,
                                            fontFamily: T.fontFamily
                                        },
                                        children: productName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 632,
                                        columnNumber: 15
                                    }, this),
                                    price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 700,
                                            fontSize: T.bodyFontSize + 2,
                                            color: T.greenLight,
                                            fontFamily: T.fontFamily
                                        },
                                        children: price
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 643,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 624,
                                columnNumber: 13
                            }, this),
                            buyUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    onLinkClick();
                                    openLink(buyUrl);
                                },
                                style: {
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: 999,
                                    border: "none",
                                    background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: T.bodyFontSize,
                                    fontFamily: T.fontFamily,
                                    cursor: "pointer"
                                },
                                children: "Buy Now"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 656,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 623,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 614,
                    columnNumber: 9
                }, this);
            }
        case "extra-imagetext":
            {
                const heading = str("heading");
                const body = str("body");
                const imgUrl = str("imgUrl");
                if (!heading && !body && !imgUrl) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: [
                        imgUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "100%",
                                maxHeight: 140,
                                overflow: "hidden"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: imgUrl,
                                alt: heading || "",
                                style: {
                                    width: "100%",
                                    maxHeight: 140,
                                    objectFit: "cover",
                                    display: "block"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 695,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 694,
                            columnNumber: 13
                        }, this),
                        (heading || body) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "12px 16px"
                            },
                            children: [
                                heading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: T.boldHeadings ? 700 : 500,
                                        fontSize: T.bodyFontSize,
                                        marginBottom: 4,
                                        color: T.textPrimary,
                                        fontFamily: T.fontFamily
                                    },
                                    children: heading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 705,
                                    columnNumber: 17
                                }, this),
                                body && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: T.bodyFontSize,
                                        lineHeight: 1.5,
                                        color: T.textMuted,
                                        fontFamily: T.fontFamily
                                    },
                                    children: body
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 718,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 703,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 684,
                    columnNumber: 9
                }, this);
            }
        case "extra-team":
        case "extra-customer":
            {
                const title = str("title");
                const desc = str("desc");
                if (!title && !desc) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "12px 16px"
                        },
                        children: [
                            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontWeight: T.boldHeadings ? 700 : 500,
                                    fontSize: T.bodyFontSize,
                                    marginBottom: 4,
                                    color: T.textPrimary,
                                    fontFamily: T.fontFamily
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 751,
                                columnNumber: 15
                            }, this),
                            desc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: T.bodyFontSize,
                                    lineHeight: 1.5,
                                    color: T.textMuted,
                                    fontFamily: T.fontFamily
                                },
                                children: desc
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 764,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 749,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 740,
                    columnNumber: 9
                }, this);
            }
        case "extra-pdf":
            {
                const pdfTitle = str("pdfTitle");
                const pdfUrl = str("pdfUrl");
                if (!pdfTitle && !pdfUrl) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onLinkClick();
                            openLink(pdfUrl);
                        },
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 18
                                    },
                                    children: "📄"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 807,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    flex: 1,
                                    fontWeight: T.boldHeadings ? 700 : 500,
                                    fontSize: T.bodyFontSize,
                                    color: T.textPrimary,
                                    fontFamily: T.fontFamily
                                },
                                children: pdfTitle || "Download PDF"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 821,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                size: 18,
                                color: T.textMuted
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 832,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 793,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 784,
                    columnNumber: 9
                }, this);
            }
        default:
            {
                const title = str("title");
                const bodyText = str("content");
                if (!title && !bodyText) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        margin: "0 12px 10px",
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                        borderRadius: T.cardRadius,
                        overflow: "hidden"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "12px 16px"
                        },
                        children: [
                            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontWeight: T.boldHeadings ? 700 : 500,
                                    fontSize: T.bodyFontSize,
                                    marginBottom: 4,
                                    color: T.textPrimary,
                                    fontFamily: T.fontFamily
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 853,
                                columnNumber: 15
                            }, this),
                            bodyText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: T.bodyFontSize,
                                    lineHeight: 1.5,
                                    color: T.textMuted,
                                    fontFamily: T.fontFamily
                                },
                                children: bodyText
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 866,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 851,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 842,
                    columnNumber: 9
                }, this);
            }
    }
}
_c4 = ExtraSectionBlock;
// ── QR Modal ────────────────────────────────────────────────────────
function QRModal({ onClose, qrConfig: initialQrConfig, cardId, cardUrl, T }) {
    _s1();
    const [qrConfig, setQrConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialQrConfig);
    const fetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QRModal.useEffect": ()=>{
            if (qrConfig || !cardId || fetched.current) return;
            fetched.current = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCardQRConfig"])(cardId).then({
                "QRModal.useEffect": (data)=>{
                    if (data) setQrConfig(data);
                }
            }["QRModal.useEffect"]).catch({
                "QRModal.useEffect": ()=>{}
            }["QRModal.useEffect"]);
        }
    }["QRModal.useEffect"], [
        cardId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClose,
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: (e)=>e.stopPropagation(),
            style: {
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                borderRadius: T.cardRadius + 4,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                boxShadow: `0 0 80px ${T.green}44`,
                maxWidth: 320,
                width: "100%"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    style: {
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: T.textPrimary,
                        fontFamily: T.fontFamily
                    },
                    children: "Scan to View Card"
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 956,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 12,
                        borderRadius: 16,
                        background: qrConfig?.bg ?? "#ffffff",
                        border: `2px solid ${T.green}44`,
                        boxShadow: `0 0 24px ${T.green}33`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DynamicQR, {
                        qrConfig: qrConfig,
                        cardUrl: cardUrl,
                        size: 200
                    }, void 0, false, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 976,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 967,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        margin: 0,
                        fontSize: 11,
                        color: T.textMuted,
                        textAlign: "center",
                        wordBreak: "break-all",
                        fontFamily: T.fontFamily
                    },
                    children: cardUrl
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 978,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    style: {
                        padding: "10px 28px",
                        borderRadius: 999,
                        border: "none",
                        background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: T.fontFamily
                    },
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 990,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/[slug]/page.tsx",
            lineNumber: 940,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 926,
        columnNumber: 5
    }, this);
}
_s1(QRModal, "zQaDNzXZ6MQjr08RW9iuuNpguPI=");
_c5 = QRModal;
// ── Loading ────────────────────────────────────────────────────────
function LoadingScreen() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            inset: 0,
            background: "#0a0f0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "3px solid #008001",
                    borderTopColor: "transparent",
                    animation: "spin 0.7s linear infinite"
                }
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1025,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@keyframes spin{to{transform:rotate(360deg)}}`
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1035,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 1015,
        columnNumber: 5
    }, this);
}
_c6 = LoadingScreen;
// ── Not Found ──────────────────────────────────────────────────────
function NotFoundScreen() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            inset: 0,
            background: "#0a0f0a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 56
                },
                children: "🃏"
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1056,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    margin: 0,
                    color: "#f0f0f0",
                    fontSize: 22,
                    fontWeight: 700
                },
                children: "Card not found"
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1057,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    margin: 0,
                    color: "#7a9a7a",
                    fontSize: 14
                },
                children: "This card may have been removed or the link is incorrect."
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1062,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/",
                style: {
                    marginTop: 8,
                    color: "#49B618",
                    fontSize: 13
                },
                children: "← Go to SamCard"
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1065,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 1044,
        columnNumber: 5
    }, this);
}
_c7 = NotFoundScreen;
function PublicCardPage() {
    _s2();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const slug = params?.slug;
    const [card, setCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [notFound, setNotFound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contactSaved, setContactSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [qrModalOpen, setQrModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leadForm, setLeadForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        phone: ""
    });
    const [leadSubmitting, setLeadSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leadSubmitFeedback, setLeadSubmitFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: null,
        message: ""
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublicCardPage.useEffect": ()=>{
            if (!slug) return;
            const isPreview = ("TURBOPACK compile-time value", "object") !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "true";
            const url = `${BACKEND_URL}/api/public/cards/${slug}${isPreview ? "?preview=true" : ""}`;
            console.log("[public-card-page] fetching card", {
                slug,
                url,
                isPreview
            });
            fetch(url).then({
                "PublicCardPage.useEffect": (r)=>{
                    console.log("[public-card-page] fetch status", {
                        slug,
                        status: r.status,
                        ok: r.ok
                    });
                    if (r.status === 404) {
                        setNotFound(true);
                        return null;
                    }
                    return r.json();
                }
            }["PublicCardPage.useEffect"]).then({
                "PublicCardPage.useEffect": (data)=>{
                    if (data) {
                        console.log("[public-card-page] fetched background payload", {
                            slug,
                            design: {
                                bgColor: data?.design?.bgColor,
                                phoneBgType: data?.design?.phoneBgType,
                                phoneBgColor1: data?.design?.phoneBgColor1,
                                phoneBgColor2: data?.design?.phoneBgColor2,
                                phoneBgAngle: data?.design?.phoneBgAngle
                            }
                        });
                        setCard(data);
                        track(slug, "view");
                    }
                }
            }["PublicCardPage.useEffect"]).catch({
                "PublicCardPage.useEffect": ()=>setNotFound(true)
            }["PublicCardPage.useEffect"]).finally({
                "PublicCardPage.useEffect": ()=>setLoading(false)
            }["PublicCardPage.useEffect"]);
        }
    }["PublicCardPage.useEffect"], [
        slug
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublicCardPage.useEffect": ()=>{
            if (!card) return;
            const design = card.design;
            const phoneBgType = normalizePhoneBgType(design.phoneBgType);
            const resolvedBackground = phoneBgType === "gradient" && design.phoneBgColor1 && design.phoneBgColor2 ? `linear-gradient(${design.phoneBgAngle || 135}deg, ${design.phoneBgColor1}, ${design.phoneBgColor2})` : design.phoneBgColor1 || design.bgColor || "#0a0f0a";
            console.log("[public-card-page] resolved background", {
                slug,
                design: {
                    bgColor: design.bgColor,
                    phoneBgType,
                    phoneBgColor1: design.phoneBgColor1,
                    phoneBgColor2: design.phoneBgColor2,
                    phoneBgAngle: design.phoneBgAngle
                },
                pageBg: resolvedBackground
            });
        }
    }["PublicCardPage.useEffect"], [
        card,
        slug
    ]);
    const cardUrl = `${PUBLIC_BASE}/${slug}`;
    const copyLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicCardPage.useCallback[copyLink]": async ()=>{
            await navigator.clipboard.writeText(window.location.href).catch({
                "PublicCardPage.useCallback[copyLink]": ()=>{}
            }["PublicCardPage.useCallback[copyLink]"]);
            setCopied(true);
            track(slug, "share");
            setTimeout({
                "PublicCardPage.useCallback[copyLink]": ()=>setCopied(false)
            }["PublicCardPage.useCallback[copyLink]"], 2000);
        }
    }["PublicCardPage.useCallback[copyLink]"], [
        slug
    ]);
    // Download vCard / Add to Contacts
    const saveContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicCardPage.useCallback[saveContact]": ()=>{
            if (!card) return;
            const fd = card.content.formData;
            const bp = card.businessProfile;
            const name = fd.name || bp.name || "";
            const vcf = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `FN:${name}`,
                fd.title || bp.title ? `TITLE:${fd.title || bp.title}` : "",
                fd.company || bp.company ? `ORG:${fd.company || bp.company}` : "",
                fd.email || bp.primaryEmail ? `EMAIL:${fd.email || bp.primaryEmail}` : "",
                fd.phone || bp.primaryPhone ? `TEL:${fd.phone || bp.primaryPhone}` : "",
                fd.website || bp.website ? `URL:${(fd.website || bp.website || "").startsWith("http") ? fd.website || bp.website : `https://${fd.website || bp.website}`}` : "",
                "END:VCARD"
            ].filter(Boolean).join("\r\n");
            const blob = new Blob([
                vcf
            ], {
                type: "text/vcard"
            });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${name.replace(/\s+/g, "_") || "contact"}.vcf`;
            a.click();
            URL.revokeObjectURL(a.href);
            setContactSaved(true);
            track(slug, "save");
        }
    }["PublicCardPage.useCallback[saveContact]"], [
        card,
        slug
    ]);
    const submitLead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicCardPage.useCallback[submitLead]": async ()=>{
            if (!slug || leadSubmitting) return;
            const name = leadForm.name.trim();
            const email = leadForm.email.trim();
            const phone = leadForm.phone.trim();
            if (!name && !email && !phone) {
                setLeadSubmitFeedback({
                    type: "error",
                    message: "Please provide at least name, email, or phone."
                });
                return;
            }
            setLeadSubmitting(true);
            setLeadSubmitFeedback({
                type: null,
                message: ""
            });
            try {
                const searchParams = ("TURBOPACK compile-time truthy", 1) ? new URLSearchParams(window.location.search) : "TURBOPACK unreachable";
                const isPreview = searchParams?.get("preview") === "true";
                const leadsUrl = `${BACKEND_URL}/api/public/cards/${slug}/leads${isPreview ? "?preview=true" : ""}`;
                const response = await fetch(leadsUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email: email || null,
                        phone: phone || null,
                        source: "DIRECT",
                        utmSource: searchParams?.get("utm_source") || null,
                        utmCampaign: searchParams?.get("utm_campaign") || null
                    })
                });
                const payload = await response.json().catch({
                    "PublicCardPage.useCallback[submitLead]": ()=>({})
                }["PublicCardPage.useCallback[submitLead]"]);
                if (!response.ok) {
                    if (response.status === 409) {
                        setLeadSubmitFeedback({
                            type: "success",
                            message: "This contact was already submitted."
                        });
                        track(slug, "contact_submit");
                        return;
                    }
                    throw new Error(payload?.error || `Failed to submit (${response.status})`);
                }
                setLeadForm({
                    name: "",
                    email: "",
                    phone: ""
                });
                setLeadSubmitFeedback({
                    type: "success",
                    message: "Successfully submitted!"
                });
                track(slug, "contact_submit");
            } catch (error) {
                setLeadSubmitFeedback({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to submit contact details."
                });
            } finally{
                setLeadSubmitting(false);
            }
        }
    }["PublicCardPage.useCallback[submitLead]"], [
        leadForm,
        leadSubmitting,
        slug
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingScreen, {}, void 0, false, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 1268,
        columnNumber: 23
    }, this);
    if (notFound || !card) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotFoundScreen, {}, void 0, false, {
        fileName: "[project]/src/app/[slug]/page.tsx",
        lineNumber: 1269,
        columnNumber: 33
    }, this);
    const { design: D, content, socialLinks, businessProfile } = card;
    const fd = content.formData;
    const S = content.sections;
    const T = {
        bg: D.bgColor || "#0a0f0a",
        card: D.cardColor || "#111a11",
        cardBorder: `${D.accentColor}33`,
        green: D.accentColor || "#008001",
        greenLight: D.accentLight || "#49B618",
        muted: "#3a4a3a",
        textPrimary: D.textPrimary || "#f0f0f0",
        textMuted: D.textMuted || "#7a9a7a",
        divider: `${D.accentColor}20`,
        fontFamily: D.font === "inter" ? "Inter, sans-serif" : D.font || "inherit",
        nameFontSize: D.nameFontSize ?? 22,
        bodyFontSize: D.bodyFontSize ?? 13,
        boldHeadings: D.boldHeadings ?? true,
        cardRadius: D.cardRadius ?? 16
    };
    // In [slug]/page.tsx — add this lookup before pageBg computation
    const PRESET_STYLES = {
        'aurora': 'linear-gradient(160deg, #0a0a0a 0%, #003322 25%, #006644 50%, #004422 70%, #001133 85%, #0a0a0a 100%)',
        'deep-space': 'radial-gradient(ellipse at 20% 80%, #0f2027 0%, #203a43 45%, #2c5364 100%)',
        'midnight-purple': 'radial-gradient(ellipse at 60% 10%, #2d0855 0%, #1a0533 40%, #0d0118 70%, #050010 100%)',
        'sunset-dusk': 'linear-gradient(170deg, #1a0500 0%, #3d1000 30%, #2a0a00 55%, #1a0800 75%, #000 100%)',
        'ocean-depth': 'radial-gradient(ellipse at 30% 20%, #003366 0%, #001f3f 40%, #000d1a 75%, #000510 100%)',
        'volcanic': 'radial-gradient(ellipse at 50% 90%, #3d0000 0%, #2d0000 30%, #1a0000 60%, #050000 100%)'
    };
    const pageBg = (()=>{
        // 1. If a named preset is set (and it's not 'custom'), use its CSS directly
        if (D.phoneBgPreset && D.phoneBgPreset !== 'custom' && PRESET_STYLES[D.phoneBgPreset]) {
            return PRESET_STYLES[D.phoneBgPreset];
        }
        // 2. Custom or fallback: use raw colors
        const phoneBgType = normalizePhoneBgType(D.phoneBgType);
        if (phoneBgType === 'gradient' && D.phoneBgColor1 && D.phoneBgColor2) {
            return `linear-gradient(${D.phoneBgAngle || 135}deg, ${D.phoneBgColor1}, ${D.phoneBgColor2})`;
        }
        if (D.phoneBgColor1) return D.phoneBgColor1;
        return D.bgColor || '#0a0f0a';
    })();
    const hasBrandLogo = !!content.brandLogo?.trim();
    const contactItems = [
        fd.phone && {
            label: "Call Us",
            sub: fd.phone,
            href: `tel:${fd.phone}`,
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"]
        },
        fd.email && {
            label: "Email",
            sub: fd.email,
            href: `mailto:${fd.email}`,
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"]
        },
        fd.location && {
            label: "Address",
            sub: fd.location,
            href: `https://maps.google.com/?q=${encodeURIComponent(fd.location)}`,
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"]
        },
        fd.website && {
            label: "Website",
            sub: fd.website,
            href: fd.website.startsWith("http") ? fd.website : `https://${fd.website}`,
            Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"]
        }
    ].filter(Boolean);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${T.green}66;border-radius:99px;}
        a{text-decoration:none;color:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
        .sc-card{animation:fadeUp .45s ease both;}
        .sc-row:hover{background:${T.green}12!important;}
      `
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1354,
                columnNumber: 7
            }, this),
            qrModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QRModal, {
                onClose: ()=>setQrModalOpen(false),
                qrConfig: card.qrConfig,
                cardUrl: cardUrl,
                T: T,
                cardId: card.id
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1368,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minHeight: "100dvh",
                    background: pageBg,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "0 0 80px",
                    fontFamily: T.fontFamily,
                    width: "100%"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sc-card",
                    style: {
                        width: "100%",
                        maxWidth: 480,
                        minHeight: "100vh",
                        background: "transparent",
                        overflowX: "hidden",
                        borderRadius: T.cardRadius
                    },
                    children: [
                        S.profile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "relative",
                                aspectRatio: "16/9",
                                overflow: "hidden",
                                clipPath: "inset(0)",
                                background: "#000"
                            },
                            children: [
                                content.profileImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: content.profileImage,
                                    alt: fd.name || businessProfile.name,
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1418,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        background: `linear-gradient(135deg, ${T.green}88 0%, ${T.bg} 50%, ${T.greenLight}66 100%)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 72,
                                            fontWeight: 900,
                                            color: T.green,
                                            opacity: 0.3,
                                            lineHeight: 1
                                        },
                                        children: (fd.name || businessProfile.name || "?")[0].toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1439,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1429,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.78) 100%)"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1452,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: `linear-gradient(90deg, transparent, ${T.green}, ${T.greenLight}, ${T.green}, transparent)`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1460,
                                    columnNumber: 15
                                }, this),
                                hasBrandLogo && content.logoPosition === "top-right" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        zIndex: 10
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "rgba(0,0,0,0.5)",
                                            backdropFilter: "blur(6px)",
                                            padding: 5,
                                            borderRadius: 10,
                                            lineHeight: 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: content.brandLogo,
                                            alt: "Brand",
                                            style: {
                                                maxWidth: 48,
                                                maxHeight: 48,
                                                objectFit: "contain",
                                                borderRadius: 7
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1489,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1480,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1472,
                                    columnNumber: 17
                                }, this),
                                hasBrandLogo && content.logoPosition === "top-left" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        zIndex: 10
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "rgba(0,0,0,0.5)",
                                            backdropFilter: "blur(6px)",
                                            padding: 5,
                                            borderRadius: 10,
                                            lineHeight: 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: content.brandLogo,
                                            alt: "Brand",
                                            style: {
                                                maxWidth: 48,
                                                maxHeight: 48,
                                                objectFit: "contain",
                                                borderRadius: 7
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1520,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1511,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1503,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: "12px 20px 16px",
                                        zIndex: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: {
                                                color: "#fff",
                                                fontSize: T.nameFontSize,
                                                lineHeight: 1.15,
                                                fontWeight: T.boldHeadings ? 800 : 600,
                                                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                                                wordBreak: "break-all",
                                                overflowWrap: "break-word"
                                            },
                                            children: fd.name || businessProfile.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1544,
                                            columnNumber: 17
                                        }, this),
                                        (fd.title || businessProfile.title) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: T.greenLight,
                                                fontSize: T.bodyFontSize,
                                                marginTop: 3,
                                                fontWeight: 500,
                                                wordBreak: "break-all",
                                                overflowWrap: "break-word"
                                            },
                                            children: fd.title || businessProfile.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1558,
                                            columnNumber: 19
                                        }, this),
                                        (fd.company || businessProfile.company || hasBrandLogo && content.logoPosition === "below-name") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginTop: 2
                                            },
                                            children: [
                                                hasBrandLogo && content.logoPosition === "below-name" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        background: "rgba(0,0,0,0.45)",
                                                        padding: "2px 4px",
                                                        borderRadius: 5,
                                                        lineHeight: 0,
                                                        flexShrink: 0
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: content.brandLogo,
                                                        alt: "Brand",
                                                        style: {
                                                            maxWidth: 22,
                                                            maxHeight: 22,
                                                            objectFit: "contain",
                                                            borderRadius: 3
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1590,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                                    lineNumber: 1581,
                                                    columnNumber: 23
                                                }, this),
                                                (fd.company || businessProfile.company) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "rgba(255,255,255,0.6)",
                                                        fontSize: T.bodyFontSize - 1,
                                                        wordBreak: "break-all",
                                                        overflowWrap: "break-word"
                                                    },
                                                    children: fd.company || businessProfile.company
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                                    lineNumber: 1598,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1572,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1534,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1408,
                            columnNumber: 13
                        }, this),
                        hasBrandLogo && content.logoPosition === "below-photo" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                padding: "12px 0"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: T.card,
                                    border: `1px solid ${T.cardBorder}`,
                                    borderRadius: 12,
                                    padding: "8px 14px",
                                    lineHeight: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: content.brandLogo,
                                    alt: "Brand",
                                    style: {
                                        maxWidth: 80,
                                        maxHeight: 40,
                                        objectFit: "contain"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1632,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 1623,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1616,
                            columnNumber: 13
                        }, this),
                        S.profile && (fd.tagline || businessProfile.tagline) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                padding: "10px 20px",
                                textAlign: "center",
                                color: T.textMuted,
                                fontSize: T.bodyFontSize,
                                fontStyle: "italic",
                                lineHeight: 1.6,
                                wordBreak: "break-word",
                                overflowWrap: "anywhere"
                            },
                            children: fd.tagline || businessProfile.tagline
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1642,
                            columnNumber: 13
                        }, this),
                        S.profile && contactItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                gap: 12,
                                margin: "0 12px 10px",
                                background: T.card,
                                border: `1px solid ${T.cardBorder}`,
                                borderRadius: T.cardRadius,
                                padding: "12px 16px"
                            },
                            children: contactItems.slice(0, 4).map(({ href, Icon }, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: href,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    onClick: ()=>track(slug, "link_click"),
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 4
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 44,
                                            height: 44,
                                            borderRadius: "50%",
                                            background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                            boxShadow: `0 4px 12px ${T.green}55`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 18,
                                            color: "#fff"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 1697,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1685,
                                        columnNumber: 19
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1672,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1659,
                            columnNumber: 13
                        }, this),
                        S.headingText && (card.headingText || card.headingBodyText || fd.headingText || fd.bodyText) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "12px 16px"
                                },
                                children: [
                                    (card.headingText || fd.headingText) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontWeight: T.boldHeadings ? 700 : 500,
                                            fontSize: T.bodyFontSize + 1,
                                            color: T.textPrimary,
                                            marginBottom: 4
                                        },
                                        children: card.headingText || fd.headingText
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1708,
                                        columnNumber: 19
                                    }, this),
                                    (card.headingBodyText || fd.bodyText) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: T.bodyFontSize,
                                            lineHeight: 1.6,
                                            color: T.textMuted
                                        },
                                        children: card.headingBodyText || fd.bodyText
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1720,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 1706,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1705,
                            columnNumber: 13
                        }, this),
                        S.contactUs && contactItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    T: T,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                        size: 14,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1738,
                                        columnNumber: 23
                                    }, this),
                                    title: "Contact Us"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1736,
                                    columnNumber: 15
                                }, this),
                                contactItems.map(({ label, sub, href, Icon }, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: href,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                onClick: ()=>track(slug, "link_click"),
                                                className: "sc-row",
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "10px 16px",
                                                    color: "inherit",
                                                    transition: "background .15s"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 8,
                                                            flexShrink: 0,
                                                            background: `${T.green}28`,
                                                            border: `1px solid ${T.green}44`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            size: 13,
                                                            color: T.greenLight
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                                            lineNumber: 1771,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1758,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            minWidth: 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontWeight: T.boldHeadings ? 600 : 500,
                                                                    fontSize: T.bodyFontSize,
                                                                    color: T.textPrimary
                                                                },
                                                                children: label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1774,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontSize: T.bodyFontSize - 1,
                                                                    color: T.textMuted,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap"
                                                                },
                                                                children: sub
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1783,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1773,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        size: 14,
                                                        color: T.muted
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1795,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1743,
                                                columnNumber: 19
                                            }, this),
                                            i < contactItems.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {
                                                color: T.divider
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1797,
                                                columnNumber: 51
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1742,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1735,
                            columnNumber: 13
                        }, this),
                        S.businessDetails && (fd.company || businessProfile.company || fd.industry || fd.yearFounded || fd.location) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    T: T,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                        size: 14,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1807,
                                        columnNumber: 23
                                    }, this),
                                    title: "Business Details"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1805,
                                    columnNumber: 15
                                }, this),
                                [
                                    (fd.company || businessProfile.company) && {
                                        label: "Company",
                                        val: fd.company || businessProfile.company
                                    },
                                    fd.industry && {
                                        label: "Industry",
                                        val: fd.industry
                                    },
                                    fd.yearFounded && {
                                        label: "Year Founded",
                                        val: fd.yearFounded
                                    },
                                    fd.location && {
                                        label: "Location",
                                        val: fd.location
                                    }
                                ].filter(Boolean).map((row, i, arr)=>{
                                    const { label, val } = row;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "10px 16px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: T.bodyFontSize,
                                                            color: T.textMuted
                                                        },
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1831,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: T.bodyFontSize,
                                                            fontWeight: T.boldHeadings ? 600 : 400,
                                                            color: T.textPrimary,
                                                            maxWidth: "55%",
                                                            textAlign: "right",
                                                            wordBreak: "break-word",
                                                            overflowWrap: "anywhere",
                                                            display: "inline-block"
                                                        },
                                                        children: val
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1839,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1824,
                                                columnNumber: 23
                                            }, this),
                                            i < arr.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {
                                                color: T.divider
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1854,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, label, true, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1823,
                                        columnNumber: 21
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1804,
                            columnNumber: 13
                        }, this),
                        S.socialLinks && socialLinks.filter((sl)=>sl.enabled !== false).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    T: T,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                        size: 14,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1865,
                                        columnNumber: 23
                                    }, this),
                                    title: "Social Links"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1863,
                                    columnNumber: 15
                                }, this),
                                socialLinks.filter((sl)=>sl.enabled !== false).map((sl, i, arr)=>{
                                    const meta = SOCIAL_META[sl.platform?.toLowerCase()] ?? {
                                        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"],
                                        color: T.green,
                                        label: sl.platform
                                    };
                                    const { Icon, color, label } = meta;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    track(slug, "link_click");
                                                    openLink(sl.url);
                                                },
                                                className: "sc-row",
                                                style: {
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "10px 16px",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    transition: "background .15s"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 10,
                                                            flexShrink: 0,
                                                            background: `${color}1a`,
                                                            border: `1px solid ${color}35`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            size: 16,
                                                            color: color
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                                            lineNumber: 1909,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1896,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            minWidth: 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontWeight: T.boldHeadings ? 600 : 500,
                                                                    fontSize: T.bodyFontSize,
                                                                    color: T.textPrimary
                                                                },
                                                                children: sl.label || label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1912,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontSize: T.bodyFontSize - 1,
                                                                    color: T.textMuted,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap"
                                                                },
                                                                children: sl.handle || sl.url
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1921,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1911,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        size: 14,
                                                        color: T.muted
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1933,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1877,
                                                columnNumber: 21
                                            }, this),
                                            i < arr.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {
                                                color: T.divider
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1936,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1876,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1862,
                            columnNumber: 13
                        }, this),
                        S.links && content.customLinks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    T: T,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                        size: 14,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1948,
                                        columnNumber: 23
                                    }, this),
                                    title: "Web Links"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 1946,
                                    columnNumber: 15
                                }, this),
                                content.customLinks.map((cl, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    track(slug, "link_click");
                                                    openLink(cl.url);
                                                },
                                                className: "sc-row",
                                                style: {
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "10px 16px",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    transition: "background .15s"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 10,
                                                            flexShrink: 0,
                                                            background: `${T.green}1f`,
                                                            border: `1px solid ${T.green}40`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                            size: 15,
                                                            color: T.greenLight
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                                            lineNumber: 1985,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1972,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            minWidth: 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontWeight: T.boldHeadings ? 600 : 500,
                                                                    fontSize: T.bodyFontSize,
                                                                    color: T.textPrimary
                                                                },
                                                                children: cl.label || "Link"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1988,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontSize: T.bodyFontSize - 1,
                                                                    color: T.textMuted,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap"
                                                                },
                                                                children: cl.url
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                                lineNumber: 1997,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 1987,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        size: 14,
                                                        color: T.muted
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                                        lineNumber: 2009,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 1953,
                                                columnNumber: 19
                                            }, this),
                                            i < content.customLinks.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {
                                                color: T.divider
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 2012,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 1952,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 1945,
                            columnNumber: 13
                        }, this),
                        S.appointment && fd.appointmentUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px",
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                size: 20,
                                                color: "#fff"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 2042,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2031,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontWeight: T.boldHeadings ? 700 : 500,
                                                fontSize: T.bodyFontSize + 1,
                                                color: T.textPrimary
                                            },
                                            children: "Schedule Meeting"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2044,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: T.bodyFontSize,
                                                lineHeight: 1.5,
                                                color: T.textMuted,
                                                padding: "0 8px"
                                            },
                                            children: "Book a time to discuss potential opportunities"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2053,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 2021,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "0 16px 16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8
                                    },
                                    children: [
                                        "Book on Calendly",
                                        "Add to Calendar"
                                    ].map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                track(slug, "link_click");
                                                openLink(fd.appointmentUrl);
                                            },
                                            style: {
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: 999,
                                                border: `1px solid ${T.green}59`,
                                                color: T.greenLight,
                                                background: `${T.green}1a`,
                                                fontWeight: 600,
                                                fontSize: T.bodyFontSize,
                                                cursor: "pointer",
                                                fontFamily: T.fontFamily
                                            },
                                            children: label
                                        }, label, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2073,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 2064,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2020,
                            columnNumber: 13
                        }, this),
                        content.extraSections.filter((s)=>s.enabled).map((section, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExtraSectionBlock, {
                                section: section,
                                T: T,
                                onLinkClick: ()=>track(slug, "link_click")
                            }, section.id || `extra-sec-${index}`, false, {
                                fileName: "[project]/src/app/[slug]/page.tsx",
                                lineNumber: 2102,
                                columnNumber: 15
                            }, this)),
                        S.collectContacts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardBlock, {
                            T: T,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    T: T,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 14,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[slug]/page.tsx",
                                        lineNumber: 2114,
                                        columnNumber: 23
                                    }, this),
                                    title: "Get in Touch"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 2112,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "12px 16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8
                                    },
                                    children: [
                                        [
                                            {
                                                key: "name",
                                                placeholder: "Your name",
                                                type: "text"
                                            },
                                            {
                                                key: "email",
                                                placeholder: "Email address",
                                                type: "email"
                                            },
                                            {
                                                key: "phone",
                                                placeholder: "Phone number",
                                                type: "tel"
                                            }
                                        ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: field.type,
                                                value: leadForm[field.key],
                                                placeholder: field.placeholder,
                                                onChange: (e)=>setLeadForm((prev)=>({
                                                            ...prev,
                                                            [field.key]: e.target.value
                                                        })),
                                                style: {
                                                    width: "100%",
                                                    padding: "9px 12px",
                                                    borderRadius: 10,
                                                    background: T.bg,
                                                    border: `1px solid ${T.green}33`,
                                                    color: T.textPrimary,
                                                    fontSize: T.bodyFontSize,
                                                    outline: "none",
                                                    fontFamily: T.fontFamily
                                                }
                                            }, field.key, false, {
                                                fileName: "[project]/src/app/[slug]/page.tsx",
                                                lineNumber: 2130,
                                                columnNumber: 19
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: submitLead,
                                            disabled: leadSubmitting,
                                            style: {
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: 999,
                                                border: "none",
                                                background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: T.bodyFontSize,
                                                cursor: leadSubmitting ? "not-allowed" : "pointer",
                                                opacity: leadSubmitting ? 0.8 : 1,
                                                fontFamily: T.fontFamily
                                            },
                                            children: leadSubmitting ? "Submitting..." : "Submit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2154,
                                            columnNumber: 17
                                        }, this),
                                        leadSubmitFeedback.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                marginTop: 4,
                                                fontSize: T.bodyFontSize - 1,
                                                color: leadSubmitFeedback.type === "success" ? T.greenLight : "#ff7a7a"
                                            },
                                            children: leadSubmitFeedback.message
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[slug]/page.tsx",
                                            lineNumber: 2174,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[slug]/page.tsx",
                                    lineNumber: 2117,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2111,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: 80
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 1398,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 1378,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    bottom: 16,
                    left: 16,
                    display: "flex",
                    gap: 8,
                    zIndex: 100
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setQrModalOpen(true),
                        style: {
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: `1px solid ${T.green}4d`,
                            background: "rgba(0,128,1,0.15)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                            size: 16,
                            color: T.greenLight
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2219,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 2205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: copyLink,
                        style: {
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: `1px solid ${T.green}4d`,
                            background: "rgba(0,0,0,0.25)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 16,
                            color: T.greenLight
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2237,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                            size: 16,
                            color: T.textMuted
                        }, void 0, false, {
                            fileName: "[project]/src/app/[slug]/page.tsx",
                            lineNumber: 2239,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/[slug]/page.tsx",
                        lineNumber: 2222,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 2195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 100
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: saveContact,
                    style: {
                        padding: "12px 20px",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        background: contactSaved ? T.greenLight : `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        boxShadow: `0 4px 16px ${T.green}55`
                    },
                    children: contactSaved ? "✓ Saved!" : "Add to Contact"
                }, void 0, false, {
                    fileName: "[project]/src/app/[slug]/page.tsx",
                    lineNumber: 2252,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[slug]/page.tsx",
                lineNumber: 2244,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s2(PublicCardPage, "ybGLmqSNVd+IlAUlxtaqiZxim+Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c8 = PublicCardPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DynamicQR");
__turbopack_context__.k.register(_c1, "SectionHeader");
__turbopack_context__.k.register(_c2, "Divider");
__turbopack_context__.k.register(_c3, "CardBlock");
__turbopack_context__.k.register(_c4, "ExtraSectionBlock");
__turbopack_context__.k.register(_c5, "QRModal");
__turbopack_context__.k.register(_c6, "LoadingScreen");
__turbopack_context__.k.register(_c7, "NotFoundScreen");
__turbopack_context__.k.register(_c8, "PublicCardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0wa4r.2._.js.map