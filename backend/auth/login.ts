import express, { Request, Response } from "express";
import { CookieOptions } from "express";
import admin from "../config/firebase";
import { supabase } from "../config/supabase";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "UNAUTHORIZED REQUEST!";

router.post("/", async (req: Request, res: Response) => {
  const { idToken } = req.body; 

  if (!idToken) {
    return res.status(400).json({ error: "ID Token is required" });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || "";
    const name = decodedToken.name || "";

    const { error: supabaseError } = await supabase.from("User").upsert({
      id: uid,
      email,
      name,
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }, { onConflict: "id" });

    if (supabaseError) {
      console.error("Supabase sync error:", supabaseError);
    }

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const options: CookieOptions = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      path: "/",
      sameSite: "lax",
    };

    res.cookie("session", sessionCookie, options);
    return res.status(200).json({ success: true, uid, email, name, sessionToken: sessionCookie });
  } catch (error: unknown) {
    console.error("Session Login Error:", error);
    return res.status(401).send(getErrorMessage(error));
  }
});

export default router;
