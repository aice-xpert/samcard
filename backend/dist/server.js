"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const signup_1 = __importDefault(require("./auth/signup"));
const login_1 = __importDefault(require("./auth/login"));
const user_1 = __importDefault(require("./routes/user"));
const cards_1 = __importDefault(require("./routes/cards"));
const social_links_1 = __importDefault(require("./routes/social-links"));
const custom_links_1 = __importDefault(require("./routes/custom-links"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const leads_1 = __importDefault(require("./routes/leads"));
const orders_1 = __importDefault(require("./routes/orders"));
const invoices_1 = __importDefault(require("./routes/invoices"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});
app.use("/api/auth/signup", signup_1.default);
app.use("/api/auth/login", login_1.default);
// Mount specific routes BEFORE general routes to prevent interception
app.use("/api/user/cards", cards_1.default);
app.use("/api/user/social-links", social_links_1.default);
app.use("/api/user/custom-links", custom_links_1.default);
app.use("/api/user/analytics", analytics_1.default);
app.use("/api/user/leads", leads_1.default);
app.use("/api/user/orders", orders_1.default);
app.use("/api/user/invoices", invoices_1.default);
app.use("/api/user/notifications", notifications_1.default);
// Mount general user route LAST so it doesn't intercept specific routes
app.use("/api/user", user_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map