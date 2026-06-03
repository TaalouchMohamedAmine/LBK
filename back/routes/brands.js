const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all brands
router.get("/", async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { products: true },
    });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single brand
router.get("/:id", async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true },
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create brand
router.post("/", async (req, res) => {
  try {
    const brand = await prisma.brand.create({
      data: {
        name: req.body.name,
        logo: req.body.logo,
      },
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update brand
router.put("/:id", async (req, res) => {
  try {
    const brand = await prisma.brand.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        logo: req.body.logo,
      },
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE brand
router.delete("/:id", async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
