import express from "express";

declare module "express-session" {
  interface SessionData {
    userId?: string; // Customize with your session properties if needed
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}
