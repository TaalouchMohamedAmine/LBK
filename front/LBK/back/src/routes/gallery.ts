import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
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

// GET all gallery items
router.get("/", async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la galerie" });
  }
});

// POST add a new gallery item (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, label } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "L'image est requise" });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const newItem = await prisma.galleryItem.create({
      data: {
        title: title || "Sans titre",
        label: label || "",
        imageUrl,
      },
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'image" });
  }
});

// DELETE a gallery item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.galleryItem.findUnique({ where: { id: Number(id) } });
    
    if (!item) {
      return res.status(404).json({ error: "Image introuvable" });
    }
    
    // Optionally delete the file from the filesystem here
    if (item.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), item.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await prisma.galleryItem.delete({ where: { id: Number(id) } });
    
    res.status(200).json({ message: "Image supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'image" });
  }
});

export default router;
