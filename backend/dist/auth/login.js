"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../config/firebase"));
const supabase_1 = require("../config/supabase");
const router = express_1.default.Router();
const getErrorMessage = (error) => error instanceof Error ? error.message : "UNAUTHORIZED REQUEST!";
router.post("/", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: "ID Token is required" });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    try {
        const decodedToken = await firebase_1.default.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email || "";
        const name = decodedToken.name || "";
        const { error: supabaseError } = await supabase_1.supabase.from("User").upsert({
            id: uid,
            email,
            name,
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
        }, { onConflict: "id" });
        if (supabaseError) {
            console.error("Supabase sync error:", supabaseError);
        }
        const sessionCookie = await firebase_1.default.auth().createSessionCookie(idToken, { expiresIn });
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        };
        res.cookie("session", sessionCookie, options);
        return res.status(200).json({ success: true, uid, email, name, sessionToken: sessionCookie });
    }
    catch (error) {
        console.error("Session Login Error:", error);
        return res.status(401).send(getErrorMessage(error));
    }
});
exports.default = router;
//# sourceMappingURL=login.js.map