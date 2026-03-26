"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../config/firebase"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const { idToken } = req.body; // Client sends the Firebase ID Token
    if (!idToken) {
        return res.status(400).json({ success: false, error: "ID Token is required" });
    }
    // Set session expiration (e.g., 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    try {
        // Create the session cookie
        const sessionCookie = await firebase_1.default.auth().createSessionCookie(idToken, { expiresIn });
        // Set cookie options
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
            path: "/",
            sameSite: "strict",
        };
        res.cookie("session", sessionCookie, options);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Session Login Error:", error);
        if (error.code === "auth/invalid-id-token") {
            return res.status(401).json({ success: false, error: "Invalid ID token" });
        }
        if (error.code === "auth/id-token-expired") {
            return res.status(401).json({ success: false, error: "ID token has expired" });
        }
        return res.status(401).json({ success: false, error: "Authentication failed" });
    }
});
exports.default = router;
//# sourceMappingURL=login.js.map