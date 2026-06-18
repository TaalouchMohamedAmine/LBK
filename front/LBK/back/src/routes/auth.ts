// src/routes/auth.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Email/password registration (optional for admin creation)
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "admin" },
  });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return res.status(201).json({ token });
});

// Email/password login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
});

// Google OAuth entry point – redirects to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback – creates/updates user and returns a JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
  async (req: Request, res: Response) => {
    // @ts-ignore – passport adds user property
    const profile = req.user as any;
    // Upsert the user based on googleId
    const user = await prisma.user.upsert({
      where: { googleId: profile.id },
      update: { email: profile.email, role: "admin" },
      create: { email: profile.email, googleId: profile.id, role: "admin" },
    });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    // For simplicity, return token in query string (frontend can capture)
    res.redirect(`${process.env.CLIENT_REDIRECT_URL || "http://localhost:5173"}?token=${token}`);
  }
);

export default router;
