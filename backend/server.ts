import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import signupRoute from "./auth/signup";
import loginRoute from "./auth/login";
import logoutRoute from "./auth/logout";
import verifyRoute from "./auth/verify";
import userRoute from "./routes/user";
import cardsRoute from "./routes/cards";
import socialLinksRoute from "./routes/social-links";
import customLinksRoute from "./routes/custom-links";
import analyticsRoute from "./routes/analytics";
import leadsRoute from "./routes/leads";
import ordersRoute from "./routes/orders";
import invoicesRoute from "./routes/invoices";
import plansRoute from "./routes/plans";
import notificationsRoute from "./routes/notifications";
import cardQrRoute from "./routes/card-qr";
import cardContentRoute from "./routes/card-content";
import cardDesignRoute from "./routes/card-design";
import designPresetsRoute from "./routes/design-presets";
import publicCardRoute from "./routes/public-card";
import cardShareRoute from "./routes/card-share";
import nfcCardsRoute from "./routes/nfc-cards";
import qrTemplatesRoute from "./routes/qr-templates";
import uploadRoute from "./routes/upload";


const app = express();
const PORT: number | string = process.env.PORT || 5001;

const allowedOrigins = [
  "https://samcard.vercel.app",
"http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://samcard-6auvfjong-zk19604s-projects.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.use("/api/auth/signup", signupRoute);
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/logout", logoutRoute);
app.use("/api/auth/verify", verifyRoute);

// Mount specific routes BEFORE general routes to prevent interception
app.use("/api/public/cards", publicCardRoute);
app.use("/api/user/cards", cardsRoute);
app.use("/api/user/cards/:cardId/design", cardDesignRoute);
app.use("/api/user/cards/:cardId/qr", cardQrRoute);
app.use("/api/user/cards/:cardId/content", cardContentRoute);
app.use("/api/user/cards", cardShareRoute);
app.use("/api/user/design", designPresetsRoute);
app.use("/api/user/qr", qrTemplatesRoute);
app.use("/api/user/nfc-cards", nfcCardsRoute);
app.use("/api/user/social-links", socialLinksRoute);
app.use("/api/user/custom-links", customLinksRoute);
app.use("/api/user/analytics", analyticsRoute);
app.use("/api/user/upload", uploadRoute);
app.use("/api/user/leads", leadsRoute);
app.use("/api/user/orders", ordersRoute);
app.use("/api/user/invoices", invoicesRoute);
app.use("/api/user/notifications", notificationsRoute);
app.use("/api/plans", plansRoute);

// Mount general user route LAST so it doesn't intercept specific routes
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});