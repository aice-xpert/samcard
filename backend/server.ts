import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import signupRoute from "./auth/signup";
import loginRoute from "./auth/login";
import logoutRoute from "./auth/logout";
import userRoute from "./routes/user";
import cardsRoute from "./routes/cards";
import socialLinksRoute from "./routes/social-links";
import customLinksRoute from "./routes/custom-links";
import analyticsRoute from "./routes/analytics";
import leadsRoute from "./routes/leads";
import ordersRoute from "./routes/orders";
import invoicesRoute from "./routes/invoices";
import notificationsRoute from "./routes/notifications";

const app = express();
const PORT: number | string = process.env.PORT || 5001;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.use("/api/auth/signup", signupRoute);
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/logout", logoutRoute);

// Mount specific routes BEFORE general routes to prevent interception
app.use("/api/user/cards", cardsRoute);
app.use("/api/user/social-links", socialLinksRoute);
app.use("/api/user/custom-links", customLinksRoute);
app.use("/api/user/analytics", analyticsRoute);
app.use("/api/user/leads", leadsRoute);
app.use("/api/user/orders", ordersRoute);
app.use("/api/user/invoices", invoicesRoute);
app.use("/api/user/notifications", notificationsRoute);

// Mount general user route LAST so it doesn't intercept specific routes
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
