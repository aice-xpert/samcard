"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const shouldCheckRevoked = process.env.FIREBASE_CHECK_REVOKED !== "false";
const isInvalidCredentialError = (error) => {
    if (!error || typeof error !== "object")
        return false;
    const maybeError = error;
    return (maybeError.code === "app/invalid-credential" ||
        maybeError.errorInfo?.code === "app/invalid-credential" ||
        maybeError.errorInfo?.message?.includes("invalid_grant") === true ||
        maybeError.message?.includes("invalid_grant") === true);
};
const verifySessionCookieSafely = async (token) => {
    try {
        return await firebase_1.default.auth().verifySessionCookie(token, shouldCheckRevoked);
    }
    catch (error) {
        if (shouldCheckRevoked && isInvalidCredentialError(error)) {
            console.warn("Firebase credentials cannot run revocation checks; falling back to signature-only session verification.");
            return firebase_1.default.auth().verifySessionCookie(token, false);
        }
        throw error;
    }
};
const verifyIdTokenSafely = async (token) => {
    try {
        return await firebase_1.default.auth().verifyIdToken(token, shouldCheckRevoked);
    }
    catch (error) {
        if (shouldCheckRevoked && isInvalidCredentialError(error)) {
            console.warn("Firebase credentials cannot run revocation checks; falling back to signature-only ID token verification.");
            return firebase_1.default.auth().verifyIdToken(token, false);
        }
        throw error;
    }
};
const verifySession = async (req, res, next) => {
    const sessionCookie = req.cookies.session;
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined;
    if (!sessionCookie && !bearerToken) {
        return res.status(401).json({ error: "No session cookie provided" });
    }
    try {
        let decodedClaims = null;
        if (sessionCookie) {
            try {
                decodedClaims = await verifySessionCookieSafely(sessionCookie);
            }
            catch (sessionCookieError) {
                if (!bearerToken) {
                    throw sessionCookieError;
                }
            }
        }
        if (!decodedClaims && bearerToken) {
            try {
                decodedClaims = await verifySessionCookieSafely(bearerToken);
            }
            catch {
                decodedClaims = await verifyIdTokenSafely(bearerToken);
            }
        }
        if (decodedClaims) {
            req.user = {
                uid: decodedClaims.uid,
                email: decodedClaims.email,
            };
            return next();
        }
        return res.status(401).json({ error: "Invalid or expired session" });
    }
    catch (error) {
        console.error("Auth verification failed:", error);
        return res.status(401).json({ error: "Invalid or expired session" });
    }
};
exports.verifySession = verifySession;
//# sourceMappingURL=auth.js.map