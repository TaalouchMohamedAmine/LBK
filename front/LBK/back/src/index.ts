// src/index.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import categoryRouter from "./routes/category";
import notificationRouter from "./routes/notification";
import statsRouter from "./routes/stats";
import reservationRouter from "./routes/reservation";
import bookingsRouter from "./routes/bookings";
import galleryRouter from "./routes/gallery";
import path from "path";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(passport.initialize());

// Google OAuth strategy (clientId/Secret from .env)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // For simplicity, forward profile info; in real app you would upsert a User.
      return done(null, { id: profile.id, email: profile.emails?.[0].value, name: profile.displayName });
    }
  )
);

// Attach Prisma and Socket.io to request for later use
app.set("prisma", new PrismaClient());
app.set("io", io);

// Routes
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/notifications", notificationRouter);
app.use("/stats", statsRouter);
app.use("/reservations", reservationRouter);
app.use("/bookings", bookingsRouter);
app.use("/gallery", galleryRouter);

// Socket.io connection for admin real‑time updates
io.on("connection", socket => {
  console.log("Admin socket connected", socket.id);
  socket.on("disconnect", () => console.log("Admin socket disconnected", socket.id));
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
