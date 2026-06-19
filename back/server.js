const express = require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./config/prisma");

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost on any port (5173, 5174, etc.) and production URL
      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
      ];

      const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));
      if (isAllowed || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
const path = require("path");
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
// Root route
app.get("/", (req, res) => {
  res.json({
    message: "LBK API Server",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      brands: "/api/brands",
      reviews: "/api/reviews",
      services: "/api/services",
      gallery: "/api/gallery",
      testimonials: "/api/testimonials",
      faqs: "/api/faqs",
      bookings: "/api/bookings",
      messages: "/api/messages",
      health: "/api/health",
    },
  });
});

// API Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/services", require("./routes/services"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/faqs", require("./routes/faqs"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/messages", require("./routes/messages"));

// ── Aggregated endpoints for the admin dashboard ──────────

// GET /api/stats — counts for the stats page
app.get("/api/stats", async (req, res) => {
  try {
    const [productCount, categoryCount, reservationCount, messageCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.bookingRequest.count(),
        prisma.contactMessage.count(),
      ]);
    res.json({ productCount, categoryCount, reservationCount, messageCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications — combined messages + bookings for the notifications page
app.get("/api/notifications", async (req, res) => {
  try {
    const [rawMessages, rawBookings] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const messages = rawMessages.map((m) => ({
      id: m.id,
      content: `${m.name} (${m.email})${m.subject ? " — " + m.subject : ""}: ${m.message}`,
      read: m.status !== "NEW",
      createdAt: m.createdAt,
    }));

    const reservations = rawBookings.map((b) => ({
      id: b.id,
      customer: b.name,
      date: b.preferredDate,
      status: b.status,
      createdAt: b.createdAt,
    }));

    res.json({ messages, reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/messages/:id/read — mark contact message as read
app.patch("/api/notifications/messages/:id/read", async (req, res) => {
  try {
    await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "CONTACTED" },
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notifications/messages/:id
app.delete("/api/notifications/messages/:id", async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ── /api/reservations — Admin reservation management ──────
// GET all
app.get("/api/reservations", async (req, res) => {
  try {
    const items = await prisma.bookingRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single
app.get("/api/reservations/:id", async (req, res) => {
  try {
    const item = await prisma.bookingRequest.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH status
app.patch("/api/reservations/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.bookingRequest.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    await prisma.bookingRequest.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `${req.method} ${req.path} is not defined`,
    availableEndpoints: {
      products: "/api/products",
      categories: "/api/categories",
      brands: "/api/brands",
      reviews: "/api/reviews",
      services: "/api/services",
      gallery: "/api/gallery",
      testimonials: "/api/testimonials",
      faqs: "/api/faqs",
      bookings: "/api/bookings",
      messages: "/api/messages",
      health: "/api/health",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API base: http://localhost:${PORT}/api`);
  console.log(
    `🔗 Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}\n`,
  );
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
