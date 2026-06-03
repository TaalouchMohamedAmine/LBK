const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create category
router.post("/", async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        name: req.body.name,
        image: req.body.image,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        image: req.body.image,
      },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
