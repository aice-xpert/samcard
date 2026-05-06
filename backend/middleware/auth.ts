import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface User {
      uid: string;
      email?: string;
      token?: string;
    }
  }
}

export interface AuthRequest extends Request {
  user?: Express.User;
  file?: Express.Multer.File;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const verifySession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.session ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined);

  if (!token) {
    return res.status(401).json({ error: "No session provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      uid: string;
      email?: string;
    };
    (req as AuthRequest).user = { uid: decoded.uid, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
};