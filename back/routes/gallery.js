const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all
router.get("/", async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { id: "desc" },
    });
    // Maps the response so that the frontend can easily read it
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const { title, label } = req.body;
    
    // In schema, galleryItem might have image, title, category, etc.
    // Let's create it. The schema is: title, category, image, featured, sortOrder
    const newItem = await prisma.galleryItem.create({
      data: {
        title: title || "Sans titre",
        category: label || "General",
        image: imageUrl,
        featured: false,
        sortOrder: 0
      },
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE photo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.galleryItem.findUnique({ where: { id: parseInt(id) } });
    
    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }
    
    if (item.image && item.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", item.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await prisma.galleryItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
