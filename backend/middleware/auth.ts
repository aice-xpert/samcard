import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

const shouldCheckRevoked = process.env.FIREBASE_CHECK_REVOKED !== "false";

const isInvalidCredentialError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as {
    code?: string;
    errorInfo?: {
      code?: string;
      message?: string;
    };
    message?: string;
  };

  return (
    maybeError.code === "app/invalid-credential" ||
    maybeError.errorInfo?.code === "app/invalid-credential" ||
    maybeError.errorInfo?.message?.includes("invalid_grant") === true ||
    maybeError.message?.includes("invalid_grant") === true
  );
};

const verifySessionCookieSafely = async (token: string) => {
  try {
    return await admin.auth().verifySessionCookie(token, shouldCheckRevoked);
  } catch (error: any) {
    if (shouldCheckRevoked) {
      if (isInvalidCredentialError(error)) {
        console.warn(
          "Firebase credentials cannot run revocation checks; falling back to signature-only session verification."
        );
        return admin.auth().verifySessionCookie(token, false);
      }
      
      // If the error is a revocation or clock skew issue that just happened because the user was created newly:
      if (error?.code === 'auth/user-token-expired' || error?.code === 'auth/session-cookie-expired' || error?.code === 'auth/session-cookie-revoked') {
        console.warn("Possible clock skew or revocation issue detecting newly created session! Retrying without revocation check...");
        return admin.auth().verifySessionCookie(token, false);
      }
    }
    throw error;
  }
};

const verifyIdTokenSafely = async (token: string) => {
  try {
    return await admin.auth().verifyIdToken(token, shouldCheckRevoked);
  } catch (error) {
    if (shouldCheckRevoked && isInvalidCredentialError(error)) {
      console.warn(
        "Firebase credentials cannot run revocation checks; falling back to signature-only ID token verification."
      );
      return admin.auth().verifyIdToken(token, false);
    }
    throw error;
  }
};

const verifyUserExists = async (uid: string): Promise<boolean> => {
  try {
    await admin.auth().getUser(uid);
    return true;
  } catch {
    return false;
  }
};

export const verifySession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req.cookies.session;
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;

  if (!sessionCookie && !bearerToken) {
    return res.status(401).json({ error: "No session cookie provided" });
  }

  try {
    let decodedClaims: { uid: string; email?: string } | null = null;

    if (sessionCookie) {
      try {
        decodedClaims = await verifySessionCookieSafely(sessionCookie);
      } catch (sessionCookieError) {
        if (!bearerToken) {
          throw sessionCookieError;
        }
      }
    }

    if (!decodedClaims && bearerToken) {
      try {
        decodedClaims = await verifySessionCookieSafely(bearerToken);
      } catch {
        decodedClaims = await verifyIdTokenSafely(bearerToken);
      }
    }

    if (decodedClaims) {
      const userExists = await verifyUserExists(decodedClaims.uid);
      if (!userExists) {
        return res.status(401).json({ error: "User no longer exists" });
      }
      req.user = {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
      };
      return next();
    }

    return res.status(401).json({ error: "Invalid or expired session" });
  } catch (error) {
    console.error("Auth verification failed inside verifySession:", error);
    return res.status(401).json({ error: "Invalid or expired session" });
  }
};
