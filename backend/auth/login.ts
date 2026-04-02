import express, { Request, Response } from "express";
import admin from "../config/firebase";
import { supabase } from "../config/supabase";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "UNAUTHORIZED REQUEST!";

router.post("/", async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID Token is required, get it" });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || "";
    const name = decodedToken.name || "";

    // Sync user to Supabase
    const { error: supabaseError } = await supabase.from("User").upsert(
      {
        id: uid,
        email,
        name,
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (supabaseError) {
      console.error("Supabase sync error on login:", {
        code: supabaseError.code,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
      });
    } else {
      console.log(`[login] User ${uid} synced to Supabase`);
    }

    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
      path: "/",
    };

    res.cookie("session", sessionCookie, options);

    // Return the session token so the frontend can store it in localStorage
    // This is used by api.ts as a Bearer token for cross-origin requests in dev
    return res.status(200).json({
      success: true,
      uid,
      email,
      name,
      sessionToken: sessionCookie,
    });
  } catch (error) {
    console.error("Session Login Error:", error);
    return res.status(401).json({ error: getErrorMessage(error) });
  }
});

export default router;